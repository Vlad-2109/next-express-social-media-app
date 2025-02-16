import { Router } from 'express';
import { changePassword, forgetPassword, login, logout, resendOtp, resetPassword, signup, verifyAccount } from '../controllers/authController';
import { editProfile, getProfile, suggestedUser } from '../controllers/userController';
import isAuthenticated from '../middleware/isAuthenticated';
import upload from '../middleware/multer';

const router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/verify', isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', isAuthenticated, changePassword);

// User routes
router.get('/profile/:id', getProfile)
router.get('/suggested-user', isAuthenticated, suggestedUser);
router.post('/edit-profile', isAuthenticated, upload.single('profilePicture'), editProfile)

export default router;
