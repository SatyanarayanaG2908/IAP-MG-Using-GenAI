// FILE PATH: backend/utils/helpers.js

/**
 * Generate unique ID
 */
exports.generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format date
 */
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Sleep function
 */
exports.sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};