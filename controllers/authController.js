import crypto from 'crypto';
import Otp from "../models/otp.js";
import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';
import User from "../models/user.js";      // ✅ Add this
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

        const normalizedEmail = email.toLowerCase();


        const otp = crypto.randomInt(100000, 1000000).toString(); // Generate 6-digit OTP
        const otpHash = hashOtp(otp);

        await Otp.deleteMany({ email: normalizedEmail }); // Delete any existing OTPs for this email

        const newOtp = new Otp({ email: normalizedEmail, otpHash });
        await newOtp.save();

        // Here you would typically send the OTP via email
        // For now, we'll just log it
        await sendEmail({
            to: normalizedEmail,
            subject: 'Your Login OTP Code',
            text: `Your OTP for login is ${otp}. Valid for 5 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Login Verification Code</h2>
            <p>Use the following OTP to log in to your account:</p>
            <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
            <p>This code is valid for <b>5 minutes</b>.</p>
        </div>
    `,
        });




        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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
            }
        });

    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

