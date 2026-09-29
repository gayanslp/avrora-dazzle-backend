import crypto from 'crypto';
import Otp from "../models/otp.js";
import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';
import User from "../models/User.js";    
import jwt from 'jsonwebtoken';
// 1. Send OTP to email

dotenv.config();

const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

export async function sendOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otp = crypto.randomInt(100000, 1000000).toString(); // Generate 6-digit OTP
        const otpHash = hashOtp(otp);

        await Otp.deleteMany({ email: normalizedEmail }); // Delete any existing OTPs for this email

        const newOtp = new Otp({ email: normalizedEmail, otpHash });
        await newOtp.save();

        console.log(`\n=========================================`);
        console.log(`🔑 [LOGIN OTP for ${normalizedEmail}]: ${otp}`);
        console.log(`=========================================\n`);

        await sendEmail({
            to: normalizedEmail,
            subject: `${otp} is your Avrora Dazzle verification code`,
            text: `Your login verification code is ${otp}. It will expire in 5 minutes.`,
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 8px;">Login Verification Code</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">Use the verification code below to sign in to your Avrora Dazzle account:</p>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0;">This code is valid for <b>5 minutes</b>. Never share this code with anyone.</p>
        </div>
    `,
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully. Please check your inbox or spam folder.'
        });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
}

// 2. Verify OTP -> Auto Register / Login -> Issue Token
export async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const normalizedEmail = email.toLowerCase();

        const otpRecord = await Otp.findOne({ email: normalizedEmail });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'OTP not found or expired' });
        }

        const otpHash = hashOtp(otp);
        if (otpHash !== otpRecord.otpHash) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = new User({ email: normalizedEmail });
            await user.save();
        }


        await Otp.deleteMany({ email: normalizedEmail });

        const token = jwt.sign(
            { userId: user._id, role: user.role }, process.env.JWT_SECRET,
            { expiresIn: '7d' });
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            }
        });

    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

