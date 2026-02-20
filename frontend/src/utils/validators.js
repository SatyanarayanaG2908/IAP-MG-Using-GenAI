// FILE PATH: frontend/src/utils/validators.js

/**
 * Validation utility functions
 */

// Email validation
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Phone validation (Indian format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return phoneRegex.test(cleanPhone);
};

// Password strength validation
export const isValidPassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Age validation
export const isValidAge = (age) => {
    const ageNum = parseInt(age, 10);
    return ageNum > 0 && ageNum < 120;
};

// Name validation
export const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
};

// Form validation for registration
export const validateRegistrationForm = (formData) => {
    const errors = {};

    if (!formData.firstName || !isValidName(formData.firstName)) {
        errors.firstName = 'Please enter a valid first name';
    }

    if (!formData.lastName || !isValidName(formData.lastName)) {
        errors.lastName = 'Please enter a valid last name';
    }

    if (!formData.email || !isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || !isValidPhone(formData.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.age || !isValidAge(formData.age)) {
        errors.age = 'Please enter a valid age';
    }

    if (!formData.gender) {
        errors.gender = 'Please select your gender';
    }

    if (!formData.language) {
        errors.language = 'Please select your preferred language';
    }

    if (!formData.password || !isValidPassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Form validation for login
export const validateLoginForm = (formData) => {
    const errors = {};

    if (!formData.email) {
        errors.email = 'Email or phone is required';
    }

    if (!formData.password) {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// Symptom validation
export const validateSymptoms = (symptoms) => {
    if (!symptoms || symptoms.trim().length === 0) {
        return { isValid: false, error: 'Please enter at least one symptom' };
    }

    if (symptoms.trim().length < 3) {
        return { isValid: false, error: 'Please provide more details about your symptoms' };
    }

    return { isValid: true, error: null };
};

