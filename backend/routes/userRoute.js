import express from 'express';
import { registerUser, loginUser, getProfile, UpdateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay } from '../controller/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', authUser, upload.single('image'), UpdateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments',authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay)


export default userRouter;
