const mongoose = require('mongoose');

const systemSettingSchema = mongoose.Schema({
    approvalRequired: { type: Boolean, default: true },
    autoExpireDays: { type: Number, default: 90 },
    maxImagesPerProperty: { type: Number, default: 10 },
    allowedPropertyTypes: [{ type: String }],
    featuredPropertiesLimit: { type: Number, default: 5 },
    notifyAdminOnNewProperty: { type: Boolean, default: true },
    notifySellerOnApproval: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('System_Settings', systemSettingSchema); // Collection 'system_settings'
