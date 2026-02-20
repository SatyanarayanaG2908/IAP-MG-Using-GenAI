// FILE PATH: backend/services/smsService.js

const twilio = require('twilio');

// Twilio client (lazy initialization)
let twilioClient = null;

/**
 * Get Twilio client
 */
const getTwilioClient = () => {
    if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }
    return twilioClient;
};

/**
 * Check if SMS service is configured
 */
const isConfigured = () => {
    return !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
    );
};

/**
 * Format phone number to E.164 format
 */
const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, remove it (Indian numbers)
    if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }

    // Add country code if not present
    if (cleaned.length === 10) {
        cleaned = '91' + cleaned; // Default to India
    }

    // Add + prefix
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }

    return cleaned;
};

/**
 * Send SMS using Twilio
 */
const sendSMS = async (to, message) => {
    try {
        if (!isConfigured()) {
            return {
                success: false,
                message: 'SMS service not configured. Add Twilio credentials to .env',
            };
        }

        const client = getTwilioClient();
        const formattedPhone = formatPhoneNumber(to);

        const result = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone,
        });

        return {
            success: true,
            messageId: result.sid,
            message: 'SMS sent successfully',
        };
    } catch (error) {
        console.error('SMS sending error:', error);
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Send test SMS
 */
exports.sendTestSMS = async ({ phone, language, userName }) => {
    const messages = {
        English: `Hello ${userName}! This is a test message from IAP-MG Using GenAI. Your SMS service is working correctly. 🏥`,
        Hindi: `नमस्ते ${userName}! यह IAP-MG Using GenAI से एक परीक्षण संदेश है। आपकी SMS सेवा सही तरीके से काम कर रही है। 🏥`,
        Telugu: `హలో ${userName}! ఇది IAP-MG Using GenAI నుండి ఒక పరీక్ష సందేశం. మీ SMS సేవ సరిగ్గా పని చేస్తోంది. 🏥`,
        Tamil: `வணக்கம் ${userName}! இது IAP-MG Using GenAI இருந்து ஒரு சோதனை செய்தி. உங்கள் SMS சேவை சரியாக செயல்படுகிறது. 🏥`,
    };

    const message = messages[language] || messages.English;
    return await sendSMS(phone, message);
};

/**
 * Send medicine reminder SMS
 */
exports.sendMedicineReminder = async ({ phone, medicineName, language }) => {
    const messages = {
        English: `💊 Medicine Reminder: Time to take your ${medicineName}. Stay healthy! - IAP-MG Using GenAI`,
        Hindi: `💊 दवा अनुस्मारक: आपकी ${medicineName} लेने का समय हो गया है। स्वस्थ रहें! - IAP-MG Using GenAI`,
        Telugu: `💊 మందు రిమైండర్: మీ ${medicineName} తీసుకోవాలిసిన సమయం. ఆరోగ్యంగా ఉండండి! - IAP-MG Using GenAI`,
        Tamil: `💊 மருந்து நினைவூட்டல்: உங்கள் ${medicineName} எடுத்துக்கொள்ள வேண்டிய நேரம். ஆரோக்கியமாக இருங்கள்! - IAP-MG Using GenAI`,
    };

    const message = messages[language] || messages.English;
    return await sendSMS(phone, message);
};

/**
 * Send follow-up reminder SMS
 */
exports.sendFollowUpReminder = async ({ phone, language }) => {
    const messages = {
        English: `🏥 Follow-up Reminder: Time for your follow-up appointment. Please consult your doctor. - IAP-MG Using GenAI`,
        Hindi: `🏥 फॉलो-अप अनुस्मारक: आपकी फॉलो-अप अपॉइंटमेंट का समय है। कृपया अपने डॉक्टर से परामर्श करें। - IAP-MG Using GenAI`,
        Telugu: `🏥 ఫాలో-అప్ రిమైండర్: మీ ఫాలో-అప్ అపాయింట్మెంట్ సమయం. దయచేసి మీ వైద్యుడిని సంప్రదించండి. - IAP-MG Using GenAI`,
        Tamil: `🏥 பின்தொடர் நினைவூட்டல்: உங்கள் பின்தொடர் சந்திப்பு நேரம். தயவுசெய்து உங்கள் மருத்துவரை அணுகவும். - IAP-MG Using GenAI`,
    };

    const message = messages[language] || messages.English;
    return await sendSMS(phone, message);
};

/**
 * Check if SMS service is available
 */
exports.isAvailable = async () => {
    return isConfigured();
};