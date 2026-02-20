// FILE PATH: frontend/src/services/pdfService.js

import api from './api';
import { ENDPOINTS, PDF_SERVICE_URL } from '../utils/constants';

/**
 * PDF Service
 */
const pdfService = {
    /**
     * Generate PDF report
     */
    generatePDF: async (sessionId, language = 'English') => {
        try {
            const response = await api.post(ENDPOINTS.GENERATE_PDF, {
                sessionId,
                language,
            }, {
                responseType: 'blob', // Important for downloading files
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `medical-report-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            return {
                success: true,
                message: 'PDF downloaded successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to generate PDF',
            };
        }
    },

    /**
     * Get PDF download URL
     */
    getPDFUrl: async (sessionId, language = 'English') => {
        try {
            const response = await api.post(`${ENDPOINTS.GENERATE_PDF}/url`, {
                sessionId,
                language,
            });

            return {
                success: true,
                url: response.data.url,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to get PDF URL',
            };
        }
    },
};

export default pdfService;
