const mongoose = require('mongoose');

const contactMessageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    inquiry_type: { type: String }, // 'general', 'property', 'support'
    status: { type: String, default: 'new' }, // new, read, replied

    created_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Contact_Messages', contactMessageSchema);
