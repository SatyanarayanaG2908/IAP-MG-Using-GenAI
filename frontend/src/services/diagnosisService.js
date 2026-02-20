// FILE PATH: frontend/src/services/diagnosisService.js

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * Diagnosis Service - 100% Gemini AI powered
 */
const diagnosisService = {
    /**
     * Submit symptoms and get instant AI diagnosis (single API call)
     */
    submitAndAnalyze: async (symptoms, language = 'English') => {
        try {
            const response = await api.post(ENDPOINTS.SUBMIT_AND_ANALYZE, {
                symptoms,
                language,
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to analyze symptoms',
            };
        }
    },

    /**
     * Analyze existing session (if needed)
     */
    analyzeDiagnosis: async (sessionId, language = 'English') => {
        try {
            const response = await api.post(ENDPOINTS.ANALYZE_DIAGNOSIS, {
                sessionId,
                language,
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to analyze symptoms',
            };
        }
    },

    /**
     * Get diagnosis history
     */
    getDiagnosisSessions: async () => {
        try {
            const response = await api.get(ENDPOINTS.GET_SESSIONS);

            return {
                success: true,
                data: response.data.sessions,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch sessions',
            };
        }
    },

    /**
     * Get single diagnosis session
     */
    getSession: async (sessionId) => {
        try {
            const response = await api.get(`${ENDPOINTS.GET_SESSIONS}/${sessionId}`);

            return {
                success: true,
                data: response.data.session,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch session',
            };
        }
    },
};

export default diagnosisService;