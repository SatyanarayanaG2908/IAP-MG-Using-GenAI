// FILE PATH: frontend/src/utils/formatters.js

/**
 * Data formatting utility functions
 */

// Format phone number
export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, '');

    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }

    return phone;
};

// Format date
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
};

// Format confidence percentage
export const formatConfidence = (confidence) => {
    return `${Math.round(confidence)}%`;
};

// Get confidence color based on value
export const getConfidenceColor = (confidence) => {
    if (confidence >= 60) return '#10B981'; // Green
    if (confidence >= 30) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
};

// Get confidence label
export const getConfidenceLabel = (confidence) => {
    if (confidence >= 60) return 'High Confidence';
    if (confidence >= 30) return 'Medium Confidence';
    return 'Low Confidence';
};

// Capitalize first letter
export const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format symptoms list
export const formatSymptomsList = (symptoms) => {
    if (!symptoms) return '';
    return symptoms
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(capitalizeFirst)
        .join(', ');
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Format medicine schedule
export const formatMedicineSchedule = (frequency) => {
    const schedules = {
        1: 'Once daily',
        2: 'Twice daily',
        3: 'Three times daily',
    };
    return schedules[frequency] || `${frequency} times daily`;
};
