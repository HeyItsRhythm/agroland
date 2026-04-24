const mongoose = require('mongoose');

const inquirySchema = mongoose.Schema({
    property_id: { type: mongoose.Schema.Types.Mixed, ref: 'Properties' },
    seller_id: { type: mongoose.Schema.Types.Mixed, ref: 'User' },
    sender_id: { type: mongoose.Schema.Types.Mixed, ref: 'User' },

    sender_name: { type: String },
    sender_email: { type: String },
    sender_phone: { type: String },
    contact_email: { type: String },
    contact_mobile: { type: String },

    message: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'responded', 'rejected'] },
    response: { type: String },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

inquirySchema.index({ seller_id: 1 });
inquirySchema.index({ sender_id: 1 });
inquirySchema.index({ property_id: 1 });
inquirySchema.index({ created_at: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
