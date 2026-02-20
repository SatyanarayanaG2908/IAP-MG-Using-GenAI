// FILE PATH: frontend/src/services/smsService.js

import api from './api';
import { ENDPOINTS } from '../utils/constants';

/**
 * SMS Service
 */
const smsService = {
    /**
     * Setup SMS reminders
     */
    setupReminders: async (reminderData) => {
        try {
            const response = await api.post(ENDPOINTS.SETUP_REMINDERS, reminderData);

            return {
                success: true,
                data: response.data,
                message: 'SMS reminders scheduled successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to setup reminders',
            };
        }
    },

    /**
     * Send test SMS
     */
    sendTestSMS: async (phone, language = 'English') => {
        try {
            const response = await api.post(ENDPOINTS.SEND_TEST_SMS, {
                phone,
                language,
            });

            return {
                success: true,
                message: response.data.message || 'Test SMS sent successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to send test SMS',
            };
        }
    },

    /**
     * Get reminder status
     */
    getReminderStatus: async (reminderId) => {
        try {
            const response = await api.get(`/sms/reminders/${reminderId}`);

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to fetch reminder status',
            };
        }
    },

    /**
     * Cancel reminder
     */
    cancelReminder: async (reminderId) => {
        try {
            const response = await api.delete(`/sms/reminders/${reminderId}`);

            return {
                success: true,
                message: 'Reminder cancelled successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Failed to cancel reminder',
            };
        }
    },
};

export default smsService;
