// FILE PATH: backend/config/constants.js

module.exports = {
    // User roles
    USER_ROLES: {
        USER: 'user',
        ADMIN: 'admin',
    },

    // Diagnosis session status
    SESSION_STATUS: {
        PENDING: 'pending',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        FAILED: 'failed',
    },

    // Question types
    QUESTION_TYPES: {
        YES_NO: 'yes_no',
        MULTIPLE_CHOICE: 'multiple_choice',
        NUMBER: 'number',
        TEXT: 'text',
    },

    // Emergency symptoms keywords
    EMERGENCY_KEYWORDS: [
        'chest pain',
        'difficulty breathing',
        'severe headache',
        'loss of consciousness',
        'severe bleeding',
        'stroke',
        'heart attack',
        'seizure',
        'cannot breathe',
        'severe pain',
        'unconscious',
    ],

    // Supported languages
    LANGUAGES: [
        'English',
        'Hindi',
        'Telugu',
        'Tamil',
        'Bengali',
        'Marathi',
        'Gujarati',
        'Kannada',
        'Malayalam',
        'Punjabi',
    ],

    // SMS reminder types
    SMS_TYPES: {
        OTP: 'otp',
        MEDICINE: 'medicine',
        FOLLOWUP: 'followup',
        TEST: 'test',
        EMERGENCY: 'emergency',
    },

    // OTP configuration
    OTP_CONFIG: {
        LENGTH: 6,
        EXPIRY_MINUTES: 10,
    },

    // Pagination
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100,
    },

    // File upload limits
    FILE_LIMITS: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
    },

    // JWT
    JWT_EXPIRY: '7d',

    // Rate limiting
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100,
    },
};
