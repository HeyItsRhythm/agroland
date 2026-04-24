const express = require('express');
const router = express.Router();
const multer = require('multer');

const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    }
});

// @desc    Upload single file
// @route   POST /api/upload
// @access  Public (or Private)
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        // Return the Cloudinary secure URL
        res.json({
            success: true,
            url: req.file.path, // multer-storage-cloudinary puts the URL in req.file.path
            filename: req.file.filename,
            public_id: req.file.filename
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
router.post('/multiple', upload.array('files', 10), (req, res) => { // Max 10 files
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }

        const urls = req.files.map(file => file.path); // path contains the Cloudinary URL

        res.json({ success: true, urls: urls });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
