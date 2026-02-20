// FILE PATH: frontend/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Load user data - useCallback to avoid dependency warning
    const loadUser = useCallback(async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Load user error:', error);
            // Clear invalid token
            localStorage.removeItem('token');
            setToken(null);
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    }, []);

    // Set token in axios headers
    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token, loadUser]);

    // Register
    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            if (response.data.success) {
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    // Login
    const login = async (emailOrPhone, password) => {
        try {
            const response = await api.post('/auth/login', {
                emailOrPhone: emailOrPhone.trim(),
                password: password,
            });

            if (response.data.success && response.data.token && response.data.user) {
                const { token, user } = response.data;

                localStorage.setItem('token', token);
                setToken(token);
                setUser(user);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                return { success: true };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed'
                };
            }
        } catch (error) {
            if (error.response?.data?.message) {
                return { success: false, message: error.response.data.message };
            }
            return { success: false, message: 'Login failed. Please try again.' };
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    // Forgot Password
    const forgotPassword = async (emailOrPhone) => {
        try {
            const response = await api.post('/auth/forgot-password', { emailOrPhone });
            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send OTP'
            };
        }
    };

    // Reset Password
    const resetPassword = async (emailOrPhone, otp, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                emailOrPhone,
                otp,
                newPassword
            });
            return {
                success: response.data.success,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset password'
            };
        }
    };

    // Update profile
    const updateProfile = async (updates) => {
        try {
            const response = await api.put('/auth/profile', updates);
            if (response.data.success) {
                setUser(response.data.user);
                return { success: true };
            }
            return { success: false, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;