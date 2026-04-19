// FILE PATH: backend/controllers/smsController.js

const SMSReminder = require('../models/SMSReminder');
const pythonService = require('../services/pythonService');
const twilio = require('twilio');

// ── Direct Twilio client (for test SMS — no Python service needed) ──────────
const getTwilioClient = () => {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) throw new Error('Twilio credentials not configured');
    return twilio(sid, token);
};

/**
 * Setup SMS reminders with start/end date range
 */
exports.setupReminders = async (req, res, next) => {
    try {
        const {
            sessionId,
            phone,
            medicineName,
            reminderTimes,
            startDate,
            endDate,
            followUpDate,
            language = 'English',
        } = req.body;

        if (!sessionId || !phone) {
            return res.status(400).json({ success: false, message: 'sessionId and phone are required' });
        }

        const createdReminders = [];

        // Medicine reminder with date range
        if (medicineName && reminderTimes?.length > 0 && startDate && endDate) {
            const reminder = await SMSReminder.create({
                userId: req.user._id,
                sessionId,
                phone,
                medicineName,
                reminderTimes,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                language,
                status: 'active',
            });
            createdReminders.push(reminder);

            // Schedule via Python service — pass ALL fields correctly
            await pythonService.scheduleSMS([{
                _id: reminder._id,
                phone,
                message: `💊 Medicine Reminder: Time to take ${medicineName}. Stay healthy! - IAP-MG`,
                type: 'medicine',
                reminderTimes,   // ✅ pass times array
                startDate,       // ✅ pass start date
                endDate,         // ✅ pass end date
                language,
            }]);
        }

        // Follow-up reminder
        if (followUpDate) {
            const followup = await SMSReminder.create({
                userId: req.user._id,
                sessionId,
                phone,
                medicineName: 'Follow-up',
                reminderTimes: ['09:00'],
                startDate: new Date(followUpDate),
                endDate: new Date(followUpDate),
                language,
                status: 'active',
            });
            createdReminders.push(followup);

            await pythonService.scheduleSMS([{
                _id: followup._id,
                phone,
                message: `🩺 Follow-up Reminder: Today is your scheduled follow-up. Please consult your doctor. - IAP-MG`,
                type: 'followup',
                reminderTimes: ['09:00'],
                startDate: followUpDate,
                endDate: followUpDate,
                language,
            }]);
        }

        res.status(200).json({
            success: true,
            message: `${createdReminders.length} reminder(s) scheduled successfully`,
            data: createdReminders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Send test SMS — direct Twilio call (no Python service)
 * Works on Render deploy where localhost:5002 is not available
 */
exports.sendTestSMS = async (req, res, next) => {
    try {
        const { phone, language = 'English' } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        const client = getTwilioClient();
        const fromPhone = process.env.TWILIO_PHONE_NUMBER;

        const message = await client.messages.create({
            body: `✅ Test SMS from IAP-MG Using GenAI. Your SMS reminders are working correctly! - IAP-MG Medical`,
            from: fromPhone,
            to: phone,
        });

        console.log(`✅ Test SMS sent to ${phone}: ${message.sid}`);

        res.status(200).json({
            success: true,
            message: 'Test SMS sent successfully',
            sid: message.sid,
        });

    } catch (error) {
        console.error('❌ Test SMS error:', error.message);

        // Give clear error messages
        let userMessage = 'Failed to send test SMS';
        if (error.code === 21608) userMessage = 'Phone number not verified in Twilio trial account. Verify it at twilio.com/console';
        else if (error.code === 20003) userMessage = 'Invalid Twilio credentials. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN';
        else if (error.code === 21211) userMessage = 'Invalid phone number format. Use +91XXXXXXXXXX';
        else if (error.message) userMessage = error.message;

        res.status(500).json({
            success: false,
            message: userMessage,
            code: error.code,
        });
    }
};

/**
 * Get reminder status
 */
exports.getReminderStatus = async (req, res, next) => {
    try {
        const { reminderId } = req.params;
        const reminder = await SMSReminder.findById(reminderId);
        if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
        res.status(200).json({ success: true, data: reminder });
    } catch (error) {
        next(error);
    }
};

/**
 * Cancel reminder
 */
exports.cancelReminder = async (req, res, next) => {
    try {
        const { reminderId } = req.params;
        const reminder = await SMSReminder.findByIdAndUpdate(
            reminderId,
            { status: 'cancelled' },
            { new: true }
        );
        if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
        res.status(200).json({ success: true, message: 'Reminder cancelled', data: reminder });
    } catch (error) {
        next(error);
    }
};