// FILE PATH: frontend/src/services/pdfService.js

import api from './api';
import { ENDPOINTS } from '../utils/constants';

const pdfService = {
    generatePDF: async (sessionId) => {
        try {
            const response = await api.post(ENDPOINTS.GENERATE_PDF, {
                sessionId
            });

            if (response.data.success) {
                const pdfUrl = response.data.pdfUrl;

                // 🔥 OPEN PDF IN NEW TAB
                const fullUrl = `${api.defaults.baseURL.replace('/api','')}${pdfUrl}`;
                window.open(fullUrl, '_blank');

                return {
                    success: true,
                    message: 'PDF opened successfully'
                };
            }

            return {
                success: false,
                message: 'Failed to generate PDF'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || 'PDF error'
            };
        }
    }
};

export default pdfService;