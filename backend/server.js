// FILE PATH: backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const diagnosisRoutes = require('./routes/diagnosis.routes');
const pdfRoutes = require('./routes/pdf.routes');
const smsRoutes = require('./routes/sms.routes');
const emailRoutes = require('./routes/email.routes');
const userRoutes = require('./routes/user.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler.middleware');
const apiLimiter = require('./middleware/rateLimiter.middleware');

// Import services
const geminiService = require('./services/geminiService');
const schedulerService = require('./services/schedulerService');

// Initialize express app
const app = express();


// ====================
// MIDDLEWARE
// ====================

// Security headers
app.use(helmet());

// ✅ FIXED CORS CONFIG (IMPORTANT)
const allowedOrigins = [
    "https://iap-mg-using-genai-1.onrender.com",
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
app.use('/api', apiLimiter);


// ====================
// DATABASE CONNECTION
// ====================

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB connected successfully`);
        console.log(`📍 Database: ${conn.connection.name}`);
        console.log(`🔗 Host: ${conn.connection.host}`);

        schedulerService.start();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

connectDB();


// ====================
// ROUTES
// ====================

app.get('/health', async (req, res) => {
    const geminiStatus = geminiService.isAvailable();
    const schedulerStatus = schedulerService.getStatus();

    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        features: {
            geminiAI: geminiStatus ? '✅ Active' : '❌ Not Configured',
            scheduler: schedulerStatus,
        },
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "Backend is running 🚀",
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});


// ====================
// ERROR HANDLER
// ====================

app.use(errorHandler);


// ====================
// SERVER START
// ====================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


// ====================
// ERROR HANDLING
// ====================

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});