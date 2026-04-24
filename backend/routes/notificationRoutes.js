const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @desc    Get notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.params.userId })
            .sort({ created_at: -1 })
            .limit(100);
        res.json({ success: true, data: notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Internal/Admin)
router.post('/', async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json({ success: true, data: notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Mark ALL as read for user
// @route   PUT /api/notifications/user/:userId/read-all
// @access  Private
router.put('/user/:userId/read-all', async (req, res) => {
    try {
        await Notification.updateMany(
            { user_id: req.params.userId, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Clear ALL notifications for user
// @route   DELETE /api/notifications/user/:userId
// @access  Private
router.delete('/user/:userId', async (req, res) => {
    try {
        await Notification.deleteMany({ user_id: req.params.userId });
        res.json({ success: true, message: 'All notifications cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
