const mongoose = require('mongoose');

const propertyViewSchema = mongoose.Schema({
    user_id: { type: String, required: true },
    property_id: { type: mongoose.Schema.Types.Mixed, required: true }, // Support both ObjectId and legacy UUID strings
    viewed_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'viewed_at', updatedAt: false }
});

propertyViewSchema.index({ user_id: 1 });
propertyViewSchema.index({ property_id: 1 });
propertyViewSchema.index({ viewed_at: -1 });

module.exports = mongoose.model('PropertyView', propertyViewSchema);
