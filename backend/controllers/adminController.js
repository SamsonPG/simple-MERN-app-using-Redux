import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

const adminCred = {
    adminEmail:'admin@gmail.com',
    adminName:'Admin',
    adminPassword:'123',
    adminId: '123456'
}

const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const adminId = adminCred.adminId
    const adminEmail = adminCred.adminEmail
    const adminName = adminCred.adminName
  
    if (adminEmail === email && adminCred.adminPassword === password) {
        generateToken(res,adminCred.adminId)
        res.status(201).json({
            adminId,
            adminEmail,
            adminName
        })
    }
    else {
        res.status(400)
        throw new Error("Invaild Email or password")
    }
})
  


const logoutAdmin = (req, res) => {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };


const  adminUpdateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { userDataToEdit } = req.body;
    const name = userDataToEdit.name
    const email = userDataToEdit.email
    
    const updateUser=await User.findByIdAndUpdate(id,{name,email},{new:true})
    console.log(updateUser);

    if (updateUser) {
        res.status(200).json(updateUser)
    }else{
        res.status(200).json("not found")
    }

}
  

const adminRemoveUser = asyncHandler(async (req,res)=>{
    const id = req.params.id
    const user = await User.findByIdAndRemove(id)

    if(!user){
        res.status(404).json({message:'user not deleted'})
    }else{
        res.status(200).json({message:'user deleted successfully'})
    }
})

const getUser = asyncHandler(async (req,res)=>{
    const user = await User.find()
    res.status(200).json(user)
})


export {
  authAdmin,
  logoutAdmin,
  adminUpdateUserProfile,
  adminRemoveUser,
  getUser 
};
