// FILE PATH: frontend/src/services/authService.js

import api from './api';
import { ENDPOINTS } from '../utils/constants';
import { setAuthToken, setUserData, removeAuthToken } from '../utils/helpers';

/**
 * Authentication Service
 */
const authService = {
    /**
     * Register new user
     */
    register: async (userData) => {
        try {
            const response = await api.post(ENDPOINTS.REGISTER, userData);

            // Save token and user data
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            if (response.data.user) {
                setUserData(response.data.user);
            }

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed',
            };
        }
    },

    /**
     * Login user
     */
    login: async (credentials) => {
        try {
            const response = await api.post(ENDPOINTS.LOGIN, credentials);

            // Save token and user data
            if (response.data.token) {
                setAuthToken(response.data.token);
            }
            if (response.data.user) {
                setUserData(response.data.user);
            }

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed',
            };
        }
    },

    /**
     * Logout user
     */
    logout: () => {
        removeAuthToken();
        localStorage.clear();
        window.location.href = '/login';
    },

    /**
     * Forgot password - Send OTP
     */
    forgotPassword: async (email) => {
        try {
            const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, { email });
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to send OTP',
            };
        }
    },

    /**
     * Reset password with OTP
     */
    resetPassword: async (resetData) => {
        try {
            const response = await api.post(ENDPOINTS.RESET_PASSWORD, resetData);
            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Password reset failed',
            };
        }
    },

    /**
     * Verify token validity
     */
    verifyToken: async () => {
        try {
            const response = await api.get(ENDPOINTS.VERIFY_TOKEN);
            return {
                success: true,
                user: response.data.user,
            };
        } catch (error) {
            removeAuthToken();
            return {
                success: false,
                message: 'Invalid or expired token',
            };
        }
    },

    /**
     * Get user profile
     */
    getProfile: async () => {
        try {
            const response = await api.get(ENDPOINTS.GET_PROFILE);
            if (response.data.user) {
                setUserData(response.data.user);
            }
            return {
                success: true,
                data: response.data.user,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch profile',
            };
        }
    },

    /**
     * Update user profile
     */
    updateProfile: async (updates) => {
        try {
            const response = await api.put(ENDPOINTS.UPDATE_PROFILE, updates);
            if (response.data.user) {
                setUserData(response.data.user);
            }
            return {
                success: true,
                data: response.data.user,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to update profile',
            };
        }
    },
};

export default authService;

