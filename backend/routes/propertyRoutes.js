const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');
const SavedProperty = require('../models/SavedProperty');
const PropertyView = require('../models/PropertyView');
const SavedSearch = require('../models/SavedSearch');

// @desc    Get analytics for a specific buyer
// @route   GET /api/properties/buyer-analytics/:buyerId
// @access  Private
router.get('/buyer-analytics/:buyerId', async (req, res) => {
    try {
        const buyerId = req.params.buyerId;

        const [
            savedCount,
            inquiriesCount,
            viewedCount,
            searchesCount,
            priceRangeStats,
            viewTrends,
            marketTrends,
            latestSearch
        ] = await Promise.all([
            SavedProperty.countDocuments({ user_id: buyerId }),
            Inquiry.countDocuments({ sender_id: buyerId }),
            PropertyView.countDocuments({ user_id: buyerId }),
            SavedSearch.countDocuments({ user_id: buyerId }),
            Property.aggregate([
                {
                    $match: {
                        price: { $exists: true, $type: "number" },
                        status: 'active'
                    }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $lt: ['$price', 2500000] }, '₹10L-25L',
                                {
                                    $cond: [{ $lt: ['$price', 5000000] }, '₹25L-50L',
                                    { $cond: [{ $lt: ['$price', 10000000] }, '₹50L-1Cr', '₹1Cr+'] }]
                                }
                            ]
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            PropertyView.aggregate([
                { $match: { user_id: buyerId } },
                {
                    $project: {
                        viewed_at: { $toDate: "$viewed_at" }
                    }
                },
                { $match: { viewed_at: { $ne: null } } },
                {
                    $group: {
                        _id: { $month: "$viewed_at" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            Property.aggregate([
                {
                    $match: {
                        status: 'active'
                    }
                },
                {
                    $project: {
                        created_at: { $toDate: "$created_at" },
                        price: "$price"
                    }
                },
                { $match: { created_at: { $ne: null } } },
                {
                    $group: {
                        _id: { $month: "$created_at" },
                        avgPrice: { $avg: "$price" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            SavedSearch.findOne({ user_id: buyerId }).sort({ created_at: -1 })
        ]);

        // Calculate matches if there's a latest search
        let weeklyMatches = 0;
        if (latestSearch && latestSearch.filters) {
            const filters = { ...latestSearch.filters, status: 'active' };
            // Simple logic for weekly matches (created in last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filters.created_at = { $gte: weekAgo };

            // Clean up filters if they contain empty strings or nulls
            Object.keys(filters).forEach(key => {
                if (filters[key] === '' || filters[key] === null) delete filters[key];
            });

            weeklyMatches = await Property.countDocuments(filters);
        }

        // Helper to get last 6 months list
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push({
                name: monthNames[date.getMonth()],
                index: date.getMonth() + 1
            });
        }

        const searchTrends = last6Months.map(m => {
            const found = viewTrends.find(vt => vt._id === m.index);
            return {
                month: m.name,
                searches: found ? found.count : 0
            };
        });

        const marketTrendsData = last6Months.map(m => {
            const found = marketTrends.find(mt => mt._id === m.index);
            return {
                month: m.name,
                avgPrice: found ? Math.round(found.avgPrice) : 0
            };
        });

        res.json({
            success: true,
            data: {
                savedProperties: savedCount,
                activeInquiries: inquiriesCount,
                propertiesViewed: viewedCount,
                savedSearches: searchesCount,
                priceDistribution: priceRangeStats,
                trends: searchTrends,
                marketTrends: marketTrendsData,
                latestSearch,
                weeklyMatches
            }
        });
    } catch (err) {
        console.error('Buyer Analytics Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
router.get('/', async (req, res) => {
    try {
        const filters = {};

        // Basic Filtering
        if (req.query.status) {
            filters.status = req.query.status;
        }

        // Filter by seller_id
        if (req.query.seller_id) {
            filters.seller_id = req.query.seller_id;
        }

        if (req.query.property_type) {
            filters.property_type = req.query.property_type;
        }

        if (req.query.location_district) {
            filters.location_district = req.query.location_district;
        }

        if (req.query.min_price) {
            filters.price = { ...filters.price, $gte: Number(req.query.min_price) };
        }

        if (req.query.max_price) {
            filters.price = { ...filters.price, $lte: Number(req.query.max_price) };
        }

        // Search (Title, Description, Village)
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            filters.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { location_village: searchRegex }
            ];
        }

        // Sorting
        const sort = {};
        if (req.query.sort_by) {
            const order = req.query.sort_order === 'asc' ? 1 : -1;
            sort[req.query.sort_by] = order;
        } else {
            sort.created_at = -1;
        }

        const propertyQuery = Property.find(filters).sort(sort);

        if (req.query.limit) {
            propertyQuery.limit(parseInt(req.query.limit));
        } else {
            propertyQuery.limit(500); // Default limit to 500 for better client-side filtering support
        }

        const properties = await propertyQuery.lean();

        // Optimized Population: Batch fetch all unique sellers
        const sellerIds = [...new Set(properties.map(p => p.seller_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const sellers = await User.find({ _id: { $in: sellerIds } }).select('full_name phone email').lean();
        const sellerMap = sellers.reduce((acc, s) => ({ ...acc, [s._id.toString()]: s }), {});

        const formattedData = properties.map((p) => {
            const seller = sellerMap[p.seller_id?.toString()] || {
                full_name: p.seller_name || 'Seller',
                phone: p.seller_phone || 'N/A',
                email: 'N/A'
            };

            return {
                ...p,
                id: p._id,
                seller: {
                    id: p.seller_id,
                    ...seller
                }
            };
        });

        res.json({ success: true, data: formattedData });
    } catch (err) {
        console.error('Get Properties Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get analytics for a specific seller
// @route   GET /api/properties/seller-analytics/:sellerId
// @access  Private
router.get('/seller-analytics/:sellerId', async (req, res) => {
    try {
        const sellerId = req.params.sellerId;

        // Run queries in parallel
        const [properties, inquiriesCount] = await Promise.all([
            Property.find({ seller_id: sellerId }),
            Inquiry.countDocuments({ seller_id: sellerId })
        ]);

        const totalProperties = properties.length;
        const activeProperties = properties.filter(p => p.status === 'active' || p.status === 'Active').length;
        const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);

        res.json({
            success: true,
            data: {
                totalProperties,
                activeProperties,
                totalViews,
                totalInquiries: inquiriesCount
            }
        });
    } catch (err) {
        console.error('Seller Analytics Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get general statistics for public landing page
// @route   GET /api/properties/public-stats
// @access  Public
router.get('/public-stats', async (req, res) => {
    try {
        const [totalActiveProperties, totalUsers, districtCounts] = await Promise.all([
            Property.countDocuments({ status: 'active' }),
            User.countDocuments(),
            Property.distinct('location_district', { status: 'active' })
        ]);

        // Mocking some numbers for "Happy Buyers" as we don't have a transaction model yet
        // or we can count users with 'buyer' role
        const buyerCount = await User.countDocuments({ role: 'buyer' });
        const sellerCount = await User.countDocuments({ role: 'seller' });

        res.json({
            success: true,
            data: {
                propertiesCount: totalActiveProperties || 0,
                buyersCount: buyerCount || 0,
                sellersCount: sellerCount || 0,
                districtsCount: districtCounts.length || 0
            }
        });
    } catch (err) {
        console.error('Public Stats Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get system-wide analytics (Admin)
// @route   GET /api/properties/analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
    try {
        const [
            totalProperties,
            totalInquiries,
            totalUsers,
            statusCounts,
            viewStats,
            typeCounts,
            districtCounts
        ] = await Promise.all([
            Property.countDocuments(),
            Inquiry.countDocuments(),
            User.countDocuments(),
            Property.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Property.aggregate([
                { $group: { _id: null, totalViews: { $sum: '$views_count' } } }
            ]),
            Property.aggregate([
                { $group: { _id: '$property_type', count: { $sum: 1 } } }
            ]),
            Property.aggregate([
                { $group: { _id: '$location_district', count: { $sum: 1 } } }
            ])
        ]);

        const stats = {
            activeProperties: 0,
            pendingApproval: 0,
            soldProperties: 0,
            pendingProperties: 0,
            expiredProperties: 0,
            rejectedProperties: 0
        };

        statusCounts.forEach(item => {
            if (item._id === 'active') stats.activeProperties = item.count;
            else if (item._id === 'pending_approval' || item._id === 'pending') stats.pendingApproval += item.count;
            else if (item._id === 'sold') stats.soldProperties = item.count;
            else if (item._id === 'expired') stats.expiredProperties = item.count;
            else if (item._id === 'rejected') stats.rejectedProperties = item.count;
        });

        // Ensure pendingProperties is also set for any UI component that might use it
        stats.pendingProperties = stats.pendingApproval;

        // Convert aggregations to objects for frontend
        const propertiesByType = {};
        typeCounts.forEach(item => {
            if (item._id) propertiesByType[item._id] = item.count;
        });

        const propertiesByDistrict = {};
        districtCounts.forEach(item => {
            if (item._id) propertiesByDistrict[item._id] = item.count;
        });

        res.json({
            success: true,
            data: {
                totalProperties,
                totalInquiries,
                totalUsers,
                totalViews: viewStats[0]?.totalViews || 0,
                ...stats,
                propertiesByType,
                propertiesByDistrict
            }
        });
    } catch (err) {
        console.error('System Analytics Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Fallback: try by _id, then by id
        let result = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            result = await Property.findById(req.params.id);
        }

        if (!result) {
            result = await Property.findOne({ id: req.params.id });
        }

        if (!result) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Safe manual population
        let seller = result.seller_id;
        if (seller && typeof seller !== 'object') {
            try {
                if (mongoose.Types.ObjectId.isValid(seller)) {
                    const user = await User.findById(seller).select('full_name phone email').lean();
                    if (user) seller = user;
                }
            } catch (e) { }
        }

        // Return formatted result
        const data = result.toObject ? result.toObject() : result;
        data.seller = {
            id: (typeof seller === 'object' ? seller?._id || seller?.id : seller) || result.seller_id,
            full_name: (typeof seller === 'object' ? seller?.full_name : null) || result.seller_name || 'Seller',
            phone: (typeof seller === 'object' ? seller?.phone : null) || result.seller_phone || 'N/A',
            email: (typeof seller === 'object' ? seller?.email : null) || 'N/A'
        };

        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private (TODO: Auth middleware)
router.post('/', async (req, res) => {
    try {
        const propertyData = { ...req.body };

        // Attempt to snapshot seller info if not provided
        if (propertyData.seller_id && !propertyData.seller_name) {
            try {
                const user = await User.findById(propertyData.seller_id);
                if (user) {
                    propertyData.seller_name = user.full_name;
                    propertyData.seller_phone = user.phone;
                }
            } catch (e) {
                // Ignore snapshot failure
            }
        }

        const newProperty = await Property.create(propertyData);

        // Create notification for the seller
        if (newProperty.seller_id) {
            await Notification.create({
                user_id: newProperty.seller_id,
                type: 'system',
                title: 'Property Listed',
                message: `Your property "${newProperty.title}" has been submitted and is pending approval.`,
                data: { property_id: newProperty._id }
            });
        }

        res.status(201).json({ success: true, data: newProperty });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Increment property views
// @route   POST /api/properties/:id/view
// @access  Public
// --- Saved Properties ---

// @desc    Get saved properties for a user
// @desc    Get saved properties for a user
// @route   GET /api/properties/saved/:userId
router.get('/saved/:userId', async (req, res) => {
    try {
        const saved = await SavedProperty.find({ user_id: req.params.userId })
            .sort({ created_at: -1 }).lean();

        // Batch fetch properties
        const propIds = [...new Set(saved.map(item => item.property_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const properties = await Property.find({ _id: { $in: propIds } }).lean();
        const propMap = properties.reduce((acc, p) => ({ ...acc, [p._id.toString()]: p }), {});

        const formatted = saved.map(item => ({
            id: item._id,
            property_id: item.property_id,
            created_at: item.created_at,
            property: propMap[item.property_id?.toString()] || null
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Save a property
// @route   POST /api/properties/saved
router.post('/saved', async (req, res) => {
    try {
        const { user_id, property_id } = req.body;

        // Check if already saved
        const existing = await SavedProperty.findOne({ user_id, property_id });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Property already saved' });
        }

        const newSaved = await SavedProperty.create({ user_id, property_id });
        res.status(201).json({ success: true, data: newSaved });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Remove a saved property
// @route   DELETE /api/properties/saved
router.delete('/saved', async (req, res) => {
    try {
        const { user_id, property_id } = req.query;
        await SavedProperty.findOneAndDelete({ user_id, property_id });
        res.json({ success: true, message: 'Removed from saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// --- Viewed Properties ---

// @desc    Get viewed properties for a user
// @route   GET /api/properties/viewed/:userId
router.get('/viewed/:userId', async (req, res) => {
    try {
        const viewed = await PropertyView.find({ user_id: req.params.userId })
            .sort({ viewed_at: -1 })
            .limit(20).lean();

        // Batch fetch properties
        const propIds = [...new Set(viewed.map(item => item.property_id).filter(id => mongoose.Types.ObjectId.isValid(id)))];
        const properties = await Property.find({ _id: { $in: propIds } }).lean();
        const propMap = properties.reduce((acc, p) => ({ ...acc, [p._id.toString()]: p }), {});

        const formatted = viewed.map(item => ({
            id: item._id,
            property_id: item.property_id,
            viewed_at: item.viewed_at,
            property: propMap[item.property_id?.toString()] || null
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Track a property view (User History)
// @route   POST /api/properties/viewed
router.post('/viewed', async (req, res) => {
    try {
        const { user_id, property_id } = req.body;
        const newView = await PropertyView.create({ user_id, property_id });
        res.status(201).json({ success: true, data: newView });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { id: id };
        }

        const property = await Property.findOneAndUpdate(
            query,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        res.json({ success: true, data: property });
    } catch (err) {
        console.error('Update Property Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { id: id };
        }

        const property = await Property.findOneAndDelete(query);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (err) {
        console.error('Delete Property Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Increment property views (Global Count)
// @route   POST /api/properties/:id/view
router.post('/:id/view', async (req, res) => {
    try {
        const id = req.params.id;
        let query = {};
        if (mongoose.Types.ObjectId.isValid(id)) {
            query = { _id: id };
        } else {
            query = { id: id };
        }

        const property = await Property.findOneAndUpdate(
            query,
            { $inc: { views_count: 1 } },
            { new: true }
        );

        if (!property) return res.status(404).json({ success: false, error: 'Property not found' });

        res.json({ success: true, data: property.views_count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
