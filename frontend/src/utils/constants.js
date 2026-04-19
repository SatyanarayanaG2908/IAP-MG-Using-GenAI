// FILE PATH: frontend/src/utils/constants.js

// API Base URL
export const API_URL = "https://medical-backend-satya.onrender.com/api";
export const PDF_SERVICE_URL = process.env.REACT_APP_PDF_SERVICE_URL || '';
export const SMS_SERVICE_URL = process.env.REACT_APP_SMS_SERVICE_URL || 'http://localhost:5002';

// Supported Languages
export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
];

// Gender Options
export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Common Medical Conditions
export const COMMON_CONDITIONS = [
    'None',
    'Diabetes',
    'Hypertension (High BP)',
    'Asthma',
    'Heart Disease',
    'Kidney Disease',
    'Thyroid Disorder',
    'Arthritis',
    'Other',
];

// Confidence Levels
export const CONFIDENCE_COLORS = {
    HIGH: '#10B981', // Green
    MEDIUM: '#F59E0B', // Orange
    LOW: '#EF4444', // Red
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    LANGUAGE: 'preferred_language',
    DIAGNOSIS_SESSION: 'diagnosis_session',
};

// API Endpoints - 🔥 UPDATED FOR SIMPLIFIED FLOW
export const ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_TOKEN: '/auth/verify',

    // Diagnosis - SIMPLIFIED (No follow-up questions)
    SUBMIT_AND_ANALYZE: '/diagnosis/submit-and-analyze', // 🔥 NEW: Single endpoint
    ANALYZE_DIAGNOSIS: '/diagnosis/analyze',
    GET_SESSIONS: '/diagnosis/sessions',

    // PDF
    GENERATE_PDF: '/pdf/generate',
    GET_PDF_URL: '/pdf/url',

    // SMS
    SETUP_REMINDERS: '/sms/setup-reminders',
    SEND_TEST_SMS: '/sms/test',
    CANCEL_REMINDER: '/sms/reminders',

    // Email
    SEND_EMAIL_REPORT: '/email/send-report',

    // User
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update',
};

// Toast Messages
export const TOAST_MESSAGES = {
    SUCCESS: {
        REGISTER: 'Account created successfully! Welcome aboard!',
        LOGIN: 'Login successful! Redirecting...',
        SYMPTOMS_SAVED: 'Symptoms recorded successfully',
        ANALYSIS_COMPLETE: 'AI analysis completed successfully',
        PDF_GENERATED: 'PDF report generated successfully',
        PDF_DOWNLOADED: 'PDF report downloaded successfully',
        EMAIL_SENT: 'Report sent to your email successfully',
        SMS_SCHEDULED: 'SMS reminders scheduled successfully',
    },
    ERROR: {
        NETWORK: 'Network error. Please check your connection.',
        AUTH_FAILED: 'Authentication failed. Please try again.',
        INVALID_CREDENTIALS: 'Invalid email or password',
        SERVER_ERROR: 'Server error. Please try again later.',
        VALIDATION: 'Please fill all required fields correctly',
        AI_ERROR: 'AI analysis failed. Please try again.',
        PDF_ERROR: 'Failed to generate PDF. Please try again.',
        EMAIL_ERROR: 'Failed to send email. Please try again.',
        SMS_ERROR: 'Failed to schedule SMS reminders.',
    },
    WARNING: {
        EMERGENCY: '🚨 Emergency symptoms detected! Please seek immediate medical attention.',
        INCOMPLETE: 'Please provide more details about your symptoms',
    },
};