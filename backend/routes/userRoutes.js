const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { id, _id, password, email, ...updateData } = req.body;

        // Prevent accidental email or password updates through this route if needed
        // For now, focusing on profile fields

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ created_at: -1 });
        res.json({ success: true, data: users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create user (Admin)
// @route   POST /api/users
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const { email, full_name, role, phone, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash a random password if not provided
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const autoPassword = password || Math.random().toString(36).slice(-10);
        const hashedPassword = await bcrypt.hash(autoPassword, salt);

        const user = await User.create({
            email,
            full_name,
            role: role || 'buyer',
            phone,
            password: hashedPassword
        });

        const userResponse = await User.findById(user._id).select('-password');
        res.status(201).json({ success: true, data: userResponse });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;

