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

// CORS configuration
const corsOptions = {
    origin: "*",
    credentials: true,
};
app.use(cors(corsOptions));

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

        // Start scheduler after DB connection
        schedulerService.start();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// ====================
// ROUTES
// ====================

// Health check endpoint
app.get('/health', async (req, res) => {
    const geminiStatus = geminiService.isAvailable();
    const schedulerStatus = schedulerService.getStatus();

    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        system: '100% Generative AI Powered (v3.0)',
        features: {
            geminiAI: geminiStatus ? '✅ Active' : '❌ Not Configured',
            instantDiagnosis: '✅ Active',
            emergencyDetection: '✅ Active',
            pdfGeneration: '✅ Active',
            smsReminders: '✅ Active',
            emailReports: process.env.EMAIL_USER ? '✅ Active' : '❌ Not Configured',
            multiLanguage: '✅ Active',
            scheduler: schedulerStatus.smsScheduler === 'running' && schedulerStatus.emailScheduler === 'running'
                ? '✅ Running'
                : '⚠️ Partially Running',
        },
        scheduler: schedulerStatus,
        aiModel: 'Google Gemini Pro',
        documentation: {
            postman: '/api/docs',
            swagger: '/api/swagger',
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
    res.status(200).json({
        success: true,
        message: 'IAP-MG Using GenAI API - 100% Generative AI Powered',
        version: '3.0.0',
        aiPowered: true,
        model: 'Google Gemini Pro',
        documentation: '/api/docs',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            diagnosis: '/api/diagnosis',
            pdf: '/api/pdf',
            sms: '/api/sms',
            email: '/api/email',
            user: '/api/user',
        },
        features: [
            'Instant AI Diagnosis',
            'Emergency Detection',
            'Multi-language Support',
            'PDF Report Generation',
            'Email Reports with Attachments',
            'SMS Reminders (Twilio)',
            'Scheduled Reminders (Backend Cron Jobs)',
            'Real-time Clock Matching',
        ],
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
        availableEndpoints: {
            health: '/health',
            api: '/api',
            docs: '/api/docs',
        },
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
    console.log('\n=================================');
    console.log('IAP-MG Using GenAI backend running on port ' + PORT);
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔗 API Base URL:', `http://localhost:${PORT}/api`);
    console.log('🤖 System: 100% Generative AI Powered');
    console.log('🧠 AI Model: Google Gemini Pro');
    console.log('✨ Features: Instant Diagnosis, Emergency Detection');
    console.log('📧 Email:', process.env.EMAIL_USER ? '✅ Configured' : '⚠️  Not Configured');
    console.log('📱 SMS:', process.env.TWILIO_ACCOUNT_SID ? '✅ Configured' : '⚠️  Not Configured');
    console.log('🔑 Gemini API:', geminiService.isAvailable() ? '✅ Active' : '⚠️  Not Configured');
    console.log('⏰ Scheduler: ✅ Running (Background Cron Jobs)');
    console.log('=================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
    console.error('Stack:', err.stack);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM signal received: closing HTTP server');

    // Stop scheduler
    schedulerService.stop();

    server.close(() => {
        console.log('💤 HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('💤 MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n👋 SIGINT signal received: closing HTTP server');

    // Stop scheduler
    schedulerService.stop();

    server.close(() => {
        console.log('💤 HTTP server closed');
        mongoose.connection.close(false, () => {
            console.log('💤 MongoDB connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;