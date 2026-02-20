// FILE PATH: frontend/src/services/api.js

import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getAuthToken, removeAuthToken } from '../utils/helpers';

/**
 * Axios instance with default configuration
 */
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds
});

/**
 * Request interceptor - Add auth token to all requests
 */
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token expired
        if (error.response && error.response.status === 401) {
            removeAuthToken();
            window.location.href = '/login';
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
            });
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';

        return Promise.reject({
            status: error.response?.status,
            message: errorMessage,
            data: error.response?.data,
        });
    }
);

export default api;
