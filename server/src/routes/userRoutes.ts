import { Router } from 'express';
import { login, logout, resendOtp, signup, verifyAccount } from '../controllers/authController';
import isAuthenticated from '../middleware/isAuthenticated';
const router = Router();

router.post('/signup', signup);
router.post('/verify', isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOtp);
router.post('/login', login);
router.post('/logout', logout);

export default router;
