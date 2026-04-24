const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(compression()); // Gzip compression
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Serve static files from uploads directory with caching
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '31d',
    setHeaders: (res, path) => {
        if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
            res.setHeader('Cache-Control', 'public, max-age=2678400'); // 31 days
        }
    }
}));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/press-releases', require('./routes/pressReleaseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
