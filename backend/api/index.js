const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Connect to database helper
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Essential: Middleware to ensure DB is connected before any route
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Mount Routes - Mount both with and without /api prefix for flexibility on Vercel
const registerRoutes = (prefix = '') => {
    app.use(`${prefix}/auth`, require('../routes/authRoutes'));
    app.use(`${prefix}/properties`, require('../routes/propertyRoutes'));
    app.use(`${prefix}/settings`, require('../routes/settingRoutes'));
    app.use(`${prefix}/press-releases`, require('../routes/pressReleaseRoutes'));
    app.use(`${prefix}/users`, require('../routes/userRoutes'));
    app.use(`${prefix}/messages`, require('../routes/contactRoutes'));
    app.use(`${prefix}/upload`, require('../routes/uploadRoutes'));
    app.use(`${prefix}/inquiries`, require('../routes/inquiryRoutes'));
    app.use(`${prefix}/notifications`, require('../routes/notificationRoutes'));
};

registerRoutes('/api');
registerRoutes(''); // Also handle requests where /api has been stripped by a rewrite

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState });
});

module.exports = app;
