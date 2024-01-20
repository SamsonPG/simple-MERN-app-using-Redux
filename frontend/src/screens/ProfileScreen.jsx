import { useState, useEffect } from 'react';
import { Form, Button, Card  } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const handleImageChange = (e) => {
    const file=e.target.files[0]
    if(file){
        setPhoto(file)
        setImagePreview(URL.createObjectURL(file)); // Create a temporary URL for image preview
    }
  };

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setPhoto(userInfo.photo);

     // Set image preview with existing user info photo
   setImagePreview(userInfo.photo || '');


   }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const formData = new FormData();
        formData.append('_id', userInfo._id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('photo', photo);
        const res = await updateProfile(formData).unwrap();
        
        dispatch(setCredentials({ ...userInfo, name, email, photo: res.photo}));
        toast.success('Profile updated successfully');
      } catch (err) {
        if (err?.data?.code === 11000 && err?.data?.keyPattern?.email === 1) {
          // Duplicate email error
          toast.error('Email is already registered');
        } else {
          toast.error(err?.data?.message || err.error);
        }      
      }
    }
  };
  return (
    
    <>
<Card className="text-center mt-5">
  <Card.Body>
    <Card.Title>
      <h1>User Profile</h1>
    </Card.Title>
    {(imagePreview || userInfo.photo) && (
      <img
        //src={imagePreview || userInfo.photo}

          src={imagePreview || `http://localhost:5000/uploads/${userInfo.photo}`}
        alt="Profile Picture Preview"
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
    )}
    <h3>
      <strong>Name:</strong> {userInfo.name}
    </h3>
    <h3>
      <strong>Email:</strong> {userInfo.email}
    </h3>
  </Card.Body>
</Card>

    <FormContainer>
      <h1>Update Profile</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="profilePicture">
        <Form.Label>Profile Picture</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
          required
        />
      </Form.Group>
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile Picture Preview"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      )}

       
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
     
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        
          ></Form.Control>
        </Form.Group>




        {isLoading && <Loader />}

        <Button type='submit' variant='primary' className='mt-3'>
          Update
        </Button>
      </Form>
    </FormContainer>
    </>
    );
};

export default ProfileScreen;
