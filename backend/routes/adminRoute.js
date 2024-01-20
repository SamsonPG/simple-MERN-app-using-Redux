import express from 'express';
import {  
    getUser, 
    authAdmin,
    logoutAdmin,
    adminUpdateUserProfile,
    adminRemoveUser } from '../controllers/adminController.js'

    import { adminProtect } from '../middleware/authMiddleware.js';
    const router = express.Router();

router.get('/',getUser)

router.post('/adminLogin',authAdmin)

router.get('/adminlogout',logoutAdmin)

router.put('/updateUser/:id', adminProtect,adminUpdateUserProfile);

router.delete('/removeUser/:id',adminProtect,adminRemoveUser)

export default router