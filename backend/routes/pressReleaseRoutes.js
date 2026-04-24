const express = require('express');
const router = express.Router();
const PressRelease = require('../models/PressRelease');

// @desc    Get published press releases
// @route   GET /api/press-releases
// @access  Public
router.get('/', async (req, res) => {
    try {
        const pressReleases = await PressRelease.find({ is_published: true }).sort({ published_date: -1 });
        res.json({ success: true, data: pressReleases });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get all press releases (Admin)
// @route   GET /api/press-releases/all
// @access  Private (Admin)
router.get('/all', async (req, res) => {
    try {
        const pressReleases = await PressRelease.find({}).sort({ published_date: -1 });
        res.json({ success: true, data: pressReleases });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single press release
// @route   GET /api/press-releases/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pressRelease = await PressRelease.findById(req.params.id);
        if (!pressRelease) {
            return res.status(404).json({ success: false, error: 'Press release not found' });
        }
        res.json({ success: true, data: pressRelease });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create press release
// @route   POST /api/press-releases
// @access  Private (Admin)
router.post('/', async (req, res) => {
    try {
        const pressRelease = await PressRelease.create(req.body);
        res.status(201).json({ success: true, data: pressRelease });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update press release
// @route   PUT /api/press-releases/:id
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
    try {
        const pressRelease = await PressRelease.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!pressRelease) {
            return res.status(404).json({ success: false, error: 'Press release not found' });
        }
        res.json({ success: true, data: pressRelease });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete press release
// @route   DELETE /api/press-releases/:id
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const pressRelease = await PressRelease.findByIdAndDelete(req.params.id);
        if (!pressRelease) {
            return res.status(404).json({ success: false, error: 'Press release not found' });
        }
        res.json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
