const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { generateOTPTemplate } = require('../utils/emailTemplate');
const crypto = require('crypto');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { email, password, full_name, role, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please populate all fields' });
        }

        // Check if user exists
        let userExists = await User.findOne({ email });

        if (userExists) {
            if (userExists.isVerified) {
                return res.status(400).json({ success: false, error: 'User already exists' });
            } else {
                // User exists but not verified, update details and resend OTP
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const otp = Math.floor(100000 + Math.random() * 900000).toString();

                userExists.password = hashedPassword;
                userExists.full_name = full_name || userExists.full_name;
                userExists.role = role || userExists.role;
                userExists.phone = phone || req.body.mobile || userExists.phone;
                userExists.signupOTP = otp;
                userExists.signupOTPExpires = Date.now() + 10 * 60 * 1000;
                await userExists.save();

                const message = `Your verify OTP is: ${otp}`;
                const html = generateOTPTemplate(userExists.full_name, otp, 'Signup Verification', 'We received a request to register your Agroland account. Please use the verification code below to verify your email address.');
                try {
                    await sendEmail({ email: userExists.email, subject: 'Verify Your Account - AgroLand Portal', message, html });
                } catch (emailErr) {
                    console.error('Email send error (resend):', emailErr.message);
                    return res.status(500).json({ success: false, error: 'Failed to send verification email. Please try again or check your email address.' });
                }
                return res.json({ success: true, message: 'OTP sent to email. Check your inbox.', requiresVerification: true, email: userExists.email });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            full_name,
            role: role || 'buyer',
            phone: phone || req.body.mobile,
            isVerified: false,
            signupOTP: otp,
            signupOTPExpires: Date.now() + 10 * 60 * 1000
        });

        if (user) {
            const message = `Your verify OTP is: ${otp}`;
            const html = generateOTPTemplate(user.full_name, otp, 'Activate Your Account', 'Welcome to Agroland! Please use the verification code below to verify your email address and activate your account.');
            try {
                await sendEmail({ email: user.email, subject: 'Verify Your Account - AgroLand Portal', message, html });
                // Always return success - user is created and OTP is sent
                res.json({ success: true, message: 'Account created! Please check your email for the OTP to verify your account.', requiresVerification: true, email: user.email });
            } catch (emailErr) {
                console.error('Email send error (signup):', emailErr.message);
                res.status(500).json({ success: false, error: 'Account created, but failed to send verification email. Please try logging in to resend the OTP.' });
            }
        } else {
            res.status(400).json({ success: false, error: 'Invalid user data' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/signin
// @access  Public
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // NOTE: Email verification check removed. Users can now login even if not verified.
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role
                    },
                    session: {
                        access_token: generateToken(user._id)
                    }
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get current user profile (Me)
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error('Auth/Me Error:', err);
        res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
});

// @desc    Google Auth (Login/Signup)
// @route   POST /api/auth/google
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { token, role } = req.body;
        const { OAuth2Client } = require('google-auth-library');
        // Retrieve Client ID from env or use a placeholder if testing (Note: Verification will fail if client ID doesn't match token's aud)
        // For development without a real ID, we might need to skip verification or assume the prompt provides a valid one.
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        let payload;
        try {
            // Try as ID Token first
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch (verifyError) {
            // If ID Token verification fails, try as Access Token
            try {
                // Using global fetch if node 18+ or install axios? existing package.json has axios? No backend is express.
                // Let's use simple fetch if available or dynamically valid.
                // Since I cannot easily install axios now without waiting, I will use fetch (Node 18+) or https module.
                // Actually 'google-auth-library' has method 'getTokenInfo' for access tokens?

                const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (userInfoResponse.ok) {
                    const userInfo = await userInfoResponse.json();
                    payload = {
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture,
                        sub: userInfo.sub
                    };
                } else {
                    throw new Error('Failed to fetch user info');
                }
            } catch (accessTokenError) {
                console.error("Google verify error:", verifyError, accessTokenError);
                return res.status(401).json({ success: false, error: 'Invalid Google Token' });
            }
        }

        const { email, name, picture, sub: googleId } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update phone if provided and currently missing
            if (req.body.phone && !user.phone) {
                user.phone = req.body.phone;
                await user.save();
            }

            // Login
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        full_name: user.full_name,
                        role: user.role,
                        avatar_url: user.avatar_url,
                        phone: user.phone
                    },
                    session: {
                        access_token: generateToken(user._id)
                    },
                    phone_missing: !user.phone
                }
            });
        } else {
            // User doesn't exist. 
            // If role is provided, create user.
            // If role is NOT provided, return response asking for role.

            if (role) {
                // Create User
                const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                user = await User.create({
                    email,
                    password: hashedPassword, // Dummy password for social login
                    full_name: name,
                    role: role,
                    avatar_url: picture,
                    phone: req.body.phone || null,
                    isVerified: true
                });

                res.json({
                    success: true,
                    data: {
                        user: {
                            id: user._id,
                            email: user.email,
                            full_name: user.full_name,
                            role: user.role,
                            avatar_url: user.avatar_url
                        },
                        session: {
                            access_token: generateToken(user._id)
                        }
                    }
                });
            } else {
                // Ask for role
                res.json({
                    success: false,
                    requiresRole: true,
                    googleData: { email, name, picture }, // Send back basic info to display
                    message: 'Please select a role to complete registration'
                });
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found with this email' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expiry (10 minutes)
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send Email
        const message = `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`;
        const html = generateOTPTemplate(user.full_name, otp, 'Password Reset Request', "We received a request to reset the password for your Agroland account. To proceed with the reset, please use the verification code below. This ensures it's really you making the request.");

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP - AgroLand Portal',
                message,
                html
            });

            res.json({ success: true, message: 'OTP sent to email' });
        } catch (err) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            console.error('Email send error:', err);
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear OTP fields
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Verify Signup OTP
// @route   POST /api/auth/verify-signup
// @access  Public
router.post('/verify-signup', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({
            email,
            signupOTP: otp,
            signupOTPExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.signupOTP = undefined;
        user.signupOTPExpires = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                },
                session: {
                    access_token: generateToken(user._id)
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;


