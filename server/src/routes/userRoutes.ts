import { Router } from 'express';
import { resendOtp, signup, verifyAccount } from '../controllers/authController';
import isAuthenticated from '../middleware/isAuthenticated';
const router = Router();

router.post('/signup', signup);
router.post('/verify', isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resendOtp);

export default router;
