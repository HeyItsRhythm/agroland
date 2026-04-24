const mongoose = require('mongoose');

const savedPropertySchema = mongoose.Schema({
    user_id: { type: String, required: true }, // Clerk ID or Mongo User ID
    property_id: { type: mongoose.Schema.Types.Mixed, required: true }, // Support both ObjectId and legacy UUID strings
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Unique compound index to prevent duplicate saves
savedPropertySchema.index({ user_id: 1, property_id: 1 }, { unique: true });
savedPropertySchema.index({ user_id: 1 });

module.exports = mongoose.model('SavedProperty', savedPropertySchema);
