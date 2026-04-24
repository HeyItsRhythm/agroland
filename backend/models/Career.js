const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        gu: { type: String, required: true }
    },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote', 'On-site'], required: true },
    salary: { type: String, required: true }, // e.g., "₹12L - ₹18L / Year"
    tags: [{ type: String }],
    description: {
        en: { type: String, required: true },
        gu: { type: String, required: true }
    },
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', careerSchema);
