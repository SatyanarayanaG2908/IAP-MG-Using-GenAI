// FILE PATH: frontend/src/utils/helpers.js

import { STORAGE_KEYS } from './constants';

/**
 * Helper utility functions
 */

// Local Storage helpers
export const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};

// Get auth token
export const getAuthToken = () => {
    return storage.get(STORAGE_KEYS.AUTH_TOKEN);
};

// Set auth token
export const setAuthToken = (token) => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
};

// Remove auth token
export const removeAuthToken = () => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Get user data
export const getUserData = () => {
    return storage.get(STORAGE_KEYS.USER_DATA);
};

// Set user data
export const setUserData = (userData) => {
    storage.set(STORAGE_KEYS.USER_DATA, userData);
};

// Logout helper
export const logout = () => {
    removeAuthToken();
    storage.remove(STORAGE_KEYS.USER_DATA);
    storage.remove(STORAGE_KEYS.DIAGNOSIS_SESSION);
};

// Detect emergency symptoms
export const detectEmergencySymptoms = (symptoms) => {
    const emergencyKeywords = [
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
    ];

    const lowerSymptoms = symptoms.toLowerCase();
    return emergencyKeywords.some(keyword => lowerSymptoms.includes(keyword));
};

// Generate unique ID
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Sleep function for delays
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Download file helper
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};