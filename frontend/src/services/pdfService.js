import api from './api';
import { API_URL } from '../utils/constants';

const pdfService = {
    generatePDF: async (sessionId) => {
        try {
            const response = await api.post('/api/pdf/generate', {
                sessionId
            });

            if (response.data.success) {
                const pdfUrl = response.data.pdfUrl;

                const fullUrl = `${API_URL.replace('/api','')}${pdfUrl}`;

                // 🔥 OPEN PDF
                window.open(fullUrl, '_blank');

                return { success: true };
            }

        } catch (error) {
            console.error(error);
            return { success: false };
        }
    }
};

export default pdfService;