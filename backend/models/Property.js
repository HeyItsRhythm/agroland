const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    property_type: { type: String, required: true }, // 'agricultural', 'residential', etc.
    status: { type: String, default: 'pending_approval', enum: ['active', 'pending_approval', 'sold', 'rejected', 'expired'] },
    location_district: { type: String },
    location_village: { type: String },
    location_taluka: { type: String },
    location_section: { type: String },
    location_state: { type: String, default: 'Gujarat' },
    address: { type: String },
    area: { type: Number },
    area_unit: { type: String }, // e.g., 'acres', 'guntha'
    images: [{ type: String }], // Array of URLs
    video_url: { type: String },
    map_url: { type: String },

    amenities: [{ type: String }], // e.g., ['Water', 'Electricity']

    seller_id: { type: mongoose.Schema.Types.Mixed }, // Support both ObjectId and legacy UUID strings
    seller_name: { type: String }, // Optional: fallback name
    seller_phone: { type: String }, // Optional: fallback phone

    views_count: { type: Number, default: 0 },
    is_featured: { type: Boolean, default: false },

    approved_by: { type: String }, // Admin ID
    approved_at: { type: Date },
    rejection_reason: { type: String },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'properties'
});

// Indexes for performance
propertySchema.index({ status: 1 });
propertySchema.index({ property_type: 1 });
propertySchema.index({ location_district: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ seller_id: 1 });
propertySchema.index({ created_at: -1 });
propertySchema.index({ title: 'text', description: 'text', location_village: 'text' });

module.exports = mongoose.model('Properties', propertySchema, 'properties');
