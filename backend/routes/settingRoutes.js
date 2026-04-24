const express = require('express');
const router = express.Router();
const SystemSetting = require('../models/SystemSetting');

// @desc    Get system settings
// @route   GET /api/settings
// @access  Public (or Private?) - usually public for frontend logic
router.get('/', async (req, res) => {
    try {
        let settings = await SystemSetting.findOne();

        // Return default settings if none found
        if (!settings) {
            settings = {
                approvalRequired: true,
                autoExpireDays: 90,
                maxImagesPerProperty: 10,
                allowedPropertyTypes: ['agricultural', 'residential', 'commercial', 'industrial'],
                featuredPropertiesLimit: 5,
                notifyAdminOnNewProperty: true,
                notifySellerOnApproval: true,
                maintenanceMode: false
            };
        }

        res.json({ success: true, data: settings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private (Admin)
router.put('/', async (req, res) => {
    try {
        let settings = await SystemSetting.findOne();

        if (settings) {
            // Update existing
            settings = await SystemSetting.findByIdAndUpdate(settings._id, req.body, { new: true });
        } else {
            // Create new
            settings = await SystemSetting.create(req.body);
        }
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
