// FILE PATH: backend/routes/sms.routes.js

const express = require('express');
const router = express.Router();
const {
    setupReminders,
    sendTestSMS,
    getReminderStatus,
    cancelReminder,
} = require('../controllers/smsController');
const { protect } = require('../middleware/auth.middleware');

// All SMS routes require authentication
router.use(protect);

router.post('/setup-reminders', setupReminders);
router.post('/test', sendTestSMS);
router.get('/reminders/:reminderId', getReminderStatus);
router.delete('/reminders/:reminderId', cancelReminder);

module.exports = router;
