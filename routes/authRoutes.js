import express from 'express';
import rateLimit from 'express-rate-limit';
import { sendOtp, verifyOtp } from '../controllers/authController.js';

const authRouter = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  }
});

authRouter.use('/send-otp', otpLimiter);
authRouter.use('/verify-otp', otpLimiter);
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyOtp);

export default authRouter;