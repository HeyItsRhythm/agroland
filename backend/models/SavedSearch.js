const mongoose = require('mongoose');

const savedSearchSchema = mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    filters: { type: Object, required: true },
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: false }
});

module.exports = mongoose.model('SavedSearch', savedSearchSchema);
