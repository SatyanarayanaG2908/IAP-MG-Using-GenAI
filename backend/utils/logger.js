// FILE PATH: backend/utils/logger.js

/**
 * Simple logger utility
 */
class Logger {
    static info(message, data = null) {
        console.log(`ℹ️  [INFO] ${message}`, data || '');
    }

    static success(message, data = null) {
        console.log(`✅ [SUCCESS] ${message}`, data || '');
    }

    static error(message, error = null) {
        console.error(`❌ [ERROR] ${message}`, error || '');
    }

    static warn(message, data = null) {
        console.warn(`⚠️  [WARNING] ${message}`, data || '');
    }

    static debug(message, data = null) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 [DEBUG] ${message}`, data || '');
        }
    }
}

module.exports = Logger;
