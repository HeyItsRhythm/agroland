const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    user_id: { type: String, required: true, ref: 'User' },
    type: { type: String, default: 'system' }, // system, inquiry, alert
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Object }, // JSON data
    read: { type: Boolean, default: false },

    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Notification', notificationSchema);
