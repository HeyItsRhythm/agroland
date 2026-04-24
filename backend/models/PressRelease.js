const mongoose = require('mongoose');

const pressReleaseSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    image_url: { type: String },
    published_date: { type: Date },
    is_published: { type: Boolean, default: false },
    author: { type: String },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Press_Releases', pressReleaseSchema); // Collection 'press_releases'
