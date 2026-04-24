const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
router.post('/', async (req, res) => {
    try {
        // Safeguard: If seller_id is missing, try to get it from the property
        if (!req.body.seller_id && req.body.property_id) {
            try {
                const propId = req.body.property_id;
                let property = null;
                if (require('mongoose').Types.ObjectId.isValid(propId)) {
                    property = await Property.findById(propId);
                } else {
                    property = await Property.findOne({ id: propId });
                }

                if (property) {
                    req.body.seller_id = property.seller_id;
                }
            } catch (e) {
                // Ignore snapshot failure
            }
        }

        const inquiry = await Inquiry.create(req.body);

        // Notify seller
        if (inquiry.seller_id) {
            try {
                const propId = inquiry.property_id;
                let property = null;
                if (require('mongoose').Types.ObjectId.isValid(propId)) {
                    property = await Property.findById(propId);
                } else {
                    property = await Property.findOne({ id: propId });
                }

                await Notification.create({
                    user_id: inquiry.seller_id,
                    type: 'inquiry',
                    title: 'New Inquiry Received',
                    message: `You have received a new inquiry for "${property ? property.title : 'your property'}".`,
                    data: { inquiry_id: inquiry._id, property_id: inquiry.property_id }
                });
            } catch (e) { }
        }

        res.status(201).json({ success: true, data: inquiry });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Get inquiries for a seller
// @route   GET /api/inquiries/seller/:sellerId
// @access  Private
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const User = require('../models/User');
        const mongoose = require('mongoose');

        const inquiries = await Inquiry.find({ seller_id: req.params.sellerId })
            .sort({ created_at: -1 })
            .lean();

        // Batch fetch properties and senders
        const propIds = [...new Set(inquiries.map(i => i.property_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const senderIds = [...new Set(inquiries.map(i => i.sender_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];

        const [properties, senders] = await Promise.all([
            Property.find({ _id: { $in: propIds } }).select('title price location_district').lean(),
            User.find({ _id: { $in: senderIds } }).select('full_name email phone').lean()
        ]);

        const propMap = properties.reduce((acc, p) => ({ ...acc, [p._id.toString()]: p }), {});
        const senderMap = senders.reduce((acc, s) => ({ ...acc, [s._id.toString()]: s }), {});

        const formattedData = inquiries.map(inq => ({
            ...inq,
            id: inq._id,
            property: propMap[inq.property_id?.toString()] || { title: 'Unknown Property' },
            sender: senderMap[inq.sender_id?.toString()] || {
                full_name: inq.sender_name || 'Unknown Buyer',
                email: inq.sender_email || '',
                phone: inq.sender_phone || ''
            }
        }));

        res.json({ success: true, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get inquiries sent by a user
// @route   GET /api/inquiries/sender/:senderId
// @access  Private
router.get('/sender/:senderId', async (req, res) => {
    try {
        const User = require('../models/User');
        const mongoose = require('mongoose');

        const inquiries = await Inquiry.find({ sender_id: req.params.senderId })
            .sort({ created_at: -1 })
            .lean();

        // Batch fetch properties and sellers
        const propIds = [...new Set(inquiries.map(i => i.property_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const sellerIds = [...new Set(inquiries.map(i => i.seller_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];

        const [properties, sellers] = await Promise.all([
            Property.find({ _id: { $in: propIds } }).lean(),
            User.find({ _id: { $in: sellerIds } }).select('full_name email phone').lean()
        ]);

        const propMap = properties.reduce((acc, p) => ({ ...acc, [p._id.toString()]: p }), {});
        const sellerMap = sellers.reduce((acc, s) => ({ ...acc, [s._id.toString()]: s }), {});

        const formattedData = inquiries.map(inq => ({
            ...inq,
            id: inq._id,
            property: propMap[inq.property_id?.toString()] || null,
            seller: sellerMap[inq.seller_id?.toString()] || null
        }));

        res.json({ success: true, data: formattedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update inquiry (e.g. respond)
// @route   PUT /api/inquiries/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!inquiry) return res.status(404).json({ success: false, error: 'Inquiry not found' });

        // If responded, notify the sender (buyer)
        if (req.body.response && inquiry.sender_id) {
            const property = await Property.findById(inquiry.property_id).catch(() => null);
            await Notification.create({
                user_id: inquiry.sender_id,
                type: 'inquiry',
                title: 'Inquiry Responded',
                message: `A seller has responded to your inquiry for "${property ? property.title : 'the property'}".`,
                data: { inquiry_id: inquiry._id, property_id: inquiry.property_id }
            });
        }

        res.json({ success: true, data: inquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
