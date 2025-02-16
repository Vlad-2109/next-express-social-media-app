import { Router } from 'express';
import { changePassword, forgetPassword, login, logout, resendOtp, resetPassword, signup, verifyAccount } from '../controllers/authController';
import isAuthenticated from '../middleware/isAuthenticated';
const router = Router();

router.post('/signup', signup);
router.post('/verify', isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', isAuthenticated, changePassword);

export default router;
