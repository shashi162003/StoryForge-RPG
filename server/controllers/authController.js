import User from '../models/User.js';
import sendEmail from '../utils/email.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendToken from '../utils/jwt.js';
import colors from 'colors';

// @desc Register a new user
// @route POST /api/auth/register
// @access Public

export const registerUser = async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            username,
            email,
            password,
            otp,
            otpExpires,
        });

        console.log(colors.green(`[Auth] New user registered: ${user.email}`));

        const message = `Welcome to StoryForge! Your One-Time Password (OTP) for account verification is: ${otp}. It will expire in 10 minutes.`;

        await sendEmail({
            email: user.email,
            subject: 'StoryForge - Account Verification',
            message,
        });

        console.log(colors.green(`[Auth] Email sent to ${user.email}`));

        res.status(201).json({
            success: true,
            message: `User registered. OTP sent to ${user.email}`,
        });
    } catch(error) {
        console.error(colors.red(`[Auth] Error registering user: ${error.message}`));
        res.status(500).json({
            success: false,
            message: 'Server Error while registering user',
        });
    }
}

// @desc    Verify OTP and log in user
// @route   POST /api/auth/verify-otp
// @access  Public

export const verifyOTP = async (req, res) => {
    const {email, otp} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        console.log(colors.green(`[Auth] User verified: ${user.email}`));

        sendToken(user, 200, res);
    } catch(error){
        console.error(colors.red(`[Auth] Error verifying OTP: ${error.message}`));
        res.status(500).json({
            success: false,
            message: 'Server Error while verifying OTP',
        });
    }
}

// @desc    Login existing user
// @route   POST /api/auth/login
// @access  Public

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}).select('+password');

        if(!user || !await user.matchPassword(password)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        if(!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Account not verified.Please check your email for an OTP.',
            })
        }

        sendToken(user, 200, res);

        console.log(colors.green(`[Auth] User logged in: ${user.email}`));
    } catch(error) {
        console.error(colors.red(`[Auth] Error logging in user: ${error.message}`));
        res.status(500).json({
            success: false,
            message: 'Server Error while logging in user',
        });
    }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};