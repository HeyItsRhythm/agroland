const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    try {
        const message = await ContactMessage.create({
            ...req.body,
            status: 'new'
        });
        res.status(201).json({ success: true, data: message });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private (Admin)
router.get('/', async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ created_at: -1 });
        res.json({ success: true, data: messages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.json({ success: true, data: message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }
        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
