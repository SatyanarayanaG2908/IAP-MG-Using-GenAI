// FILE PATH: backend/routes/email.routes.js

const express = require('express');
const router = express.Router();
const {
    sendReport,
    sendTestEmail,
    scheduleReminder,
    getReminders,
    cancelReminder,
    checkEmailStatus,
} = require('../controllers/emailController');
const { protect } = require('../middleware/auth.middleware');

// All email routes require authentication
router.use(protect);

// Send diagnosis report via email
router.post('/send-report', sendReport);

// Send test email
router.post('/test', sendTestEmail);

// Schedule email reminder
router.post('/schedule-reminder', scheduleReminder);

// Get all scheduled reminders
router.get('/reminders', getReminders);

// Cancel scheduled reminder
router.delete('/reminders/:reminderId', cancelReminder);

// Check email service status
router.get('/status', checkEmailStatus);

module.exports = router;