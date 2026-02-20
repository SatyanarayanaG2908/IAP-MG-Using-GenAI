// FILE PATH: backend/services/emergencyDetection.js

const { EMERGENCY_KEYWORDS } = require('../config/constants');

/**
 * Detect emergency symptoms in text
 */
exports.detectEmergency = (symptomsText) => {
    const lowerText = symptomsText.toLowerCase();

    const detectedSymptoms = EMERGENCY_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword)
    );

    return {
        isEmergency: detectedSymptoms.length > 0,
        symptoms: detectedSymptoms,
    };
};

/**
 * Check if answer indicates emergency
 */
exports.checkEmergencyAnswer = (question, answer) => {
    if (!question.emergency) return false;

    const emergencyAnswers = ['yes', 'severe', 'extreme', 'unbearable'];
    const lowerAnswer = answer.toLowerCase();

    return emergencyAnswers.some(keyword => lowerAnswer.includes(keyword));
};

