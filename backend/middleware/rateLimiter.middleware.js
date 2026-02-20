// FILE PATH: backend/middleware/rateLimiter.middleware.js

const rateLimit = require('express-rate-limit');

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Strict limiter for authentication routes
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true,
});

/**
 * OTP request limiter
 */
const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 OTP requests per hour
    message: {
        success: false,
        message: 'Too many OTP requests, please try again later.',
    },
});

module.exports = apiLimiter;
module.exports.authLimiter = authLimiter;
module.exports.otpLimiter = otpLimiter;
