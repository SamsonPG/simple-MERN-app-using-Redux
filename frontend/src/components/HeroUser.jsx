import { Container, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className=' py-5'>
      <Container className='d-flex justify-content-center'>
        <Card className='p-5 d-flex flex-column align-items-center hero-card bg-light w-75'>
          <h1 className='text-center mb-4'>User Home</h1>
         <h3>Welcome back {userInfo.name} !</h3>
       
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
