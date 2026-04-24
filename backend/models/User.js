const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String },
    role: { type: String, default: 'buyer' }, // buyer, seller, admin
    phone: { type: String },
    avatar_url: { type: String },
    bio: { type: String },
    location: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },

    isVerified: { type: Boolean, default: false },
    signupOTP: { type: String },
    signupOTPExpires: { type: Date },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
