// This is the final, robust version for server/routes/auth.js

import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Helper function to generate a JWT token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- ROUTES ---

// Signup: Create user, then generate and send OTP
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Email and a password of at least 6 characters are required' });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'You already signed up. Please proceed to login.' });
    }

    const user = await User.create({ email, password, isVerified: false });
    
    // --- Generate, Save, and Send OTP in one atomic operation ---
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Use findByIdAndUpdate and AWAIT its completion.
    await User.findByIdAndUpdate(user._id, { otp, otpExpires });
    
    // Only after the save is confirmed, send the email.
    await sendEmail({
      email: user.email,
      subject: 'Your VeggieFinder Verification Code',
      message: `Your one-time password (OTP) is: ${otp}\nThis code will expire in 10 minutes.`,
    });

    res.status(201).json({
      message: 'Signup successful. Please check your email for the verification OTP.',
      email: user.email,
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// A single function to handle verification logic
const verifyOtpAndLogin = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.otp !== otp) return res.status(400).json({ message: 'The OTP you entered is incorrect.' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'Your OTP has expired. Please request a new one.' });

    // OTP is valid, clear it from the database
    user.otp = undefined;
    user.otpExpires = undefined;
    if (!user.isVerified) user.isVerified = true;
    await user.save();

    // Send welcome email after successful verification
    await sendEmail({
      email: user.email,
      subject: 'Welcome to VeggieFinder!',
      message: `Welcome to VeggieFinder!\n\nCurated with care by Ansh Yadav, your guide to exploring nutritious and tasty vegetarian dishes.`,
    });

    res.json({ user: { id: user._id, email: user.email }, token: generateToken(user._id, user.email) });
};

router.post('/verify-otp', async (req, res) => {
    try { await verifyOtpAndLogin(req, res); } catch (err) { res.status(500).json({ message: 'Server error during OTP verification' }); }
});

router.post('/login-with-otp', async (req, res) => {
    try { await verifyOtpAndLogin(req, res); } catch (err) { res.status(500).json({ message: 'Server error during OTP login' }); }
});

// Send OTP for login or to resend verification
router.post('/send-login-otp', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with that email address.' });
        
        // --- Generate, Save, and Send OTP in one atomic operation ---
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        // AWAIT the database update before proceeding.
        await User.findByIdAndUpdate(user._id, { otp, otpExpires });

        // Only after saving, send the email.
        await sendEmail({
            email: user.email,
            subject: 'Your VeggieFinder Login Code',
            message: `Your one-time password (OTP) is: ${otp}\nThis code will expire in 10 minutes.`,
        });

        res.status(200).json({ message: 'An OTP has been sent to your email address.' });
    } catch (err) {
        console.error('Send Login OTP Error:', err);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
});

// Resend OTP for verification
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified.' });
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update user with new OTP
    await User.findByIdAndUpdate(user._id, { otp, otpExpires });
    
    // Send email
    await sendEmail({
      email: user.email,
      subject: 'Your VeggieFinder Verification Code',
      message: `Your one-time password (OTP) is: ${otp}\nThis code will expire in 10 minutes.`,
    });
    
    res.status(200).json({ message: 'A new OTP has been sent to your email address.' });
  } catch (err) {
    console.error('Resend OTP Error:', err);
    res.status(500).json({ message: 'Failed to resend OTP.' });
  }
});

// Login with Password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your account first',
        notVerified: true 
      });
    }
    
    // Verify password
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token and send response
    const token = generateToken(user._id, user.email);
    
    res.json({
      user: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
