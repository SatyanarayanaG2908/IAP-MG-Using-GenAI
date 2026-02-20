// FILE PATH: backend/services/pythonService.js

const axios = require('axios');

const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5001';
const SMS_SERVICE_URL = process.env.SMS_SERVICE_URL || 'http://localhost:5002';
const TRANSLATION_SERVICE_URL = process.env.TRANSLATION_SERVICE_URL || 'http://localhost:5003';

/**
 * Generate PDF report via Python service
 */
exports.generatePDF = async (userData, symptoms, analysisResult, language = 'English') => {
    try {
        const response = await axios.post(
            `${PDF_SERVICE_URL}/generate-pdf`,
            {
                user_data: userData,
                symptoms,
                analysis_result: analysisResult,
                language,
            },
            {
                timeout: 30000, // 30 seconds
                responseType: 'blob',
            }
        );

        return {
            success: true,
            data: response.data,
            url: `${PDF_SERVICE_URL}/download/${userData.username}_${Date.now()}.pdf`,
        };
    } catch (error) {
        console.error('Python PDF Service Error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to generate PDF',
        };
    }
};

/**
 * Schedule SMS reminders via Python service
 */
exports.scheduleSMS = async (reminders) => {
    try {
        const response = await axios.post(
            `${SMS_SERVICE_URL}/schedule-reminders`,
            {
                reminders: reminders.map(r => ({
                    id: r._id.toString(),
                    phone: r.phone,
                    message: r.message,
                    type: r.type,
                    scheduled_for: r.scheduledFor,
                    language: r.language,
                })),
            },
            {
                timeout: 10000,
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Python SMS Service Error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to schedule SMS',
        };
    }
};

/**
 * Send test SMS via Python service
 */
exports.sendTestSMS = async (phone, language = 'English') => {
    try {
        const response = await axios.post(
            `${SMS_SERVICE_URL}/send-test-sms`,
            {
                phone,
                language,
            },
            {
                timeout: 10000,
            }
        );

        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        console.error('Python SMS Service Error:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send test SMS',
        };
    }
};

/**
 * Translate text via Python service
 */
exports.translateText = async (text, targetLanguage = 'English') => {
    try {
        const response = await axios.post(
            `${TRANSLATION_SERVICE_URL}/translate`,
            {
                text,
                target_language: targetLanguage,
            },
            {
                timeout: 5000,
            }
        );

        return {
            success: true,
            translatedText: response.data.translated_text,
        };
    } catch (error) {
        console.error('Python Translation Service Error:', error.message);
        return {
            success: false,
            translatedText: text, // Return original if translation fails
        };
    }
};

