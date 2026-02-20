// FILE PATH: backend/controllers/smsController.js

const SMSReminder = require('../models/SMSReminder');
const DiagnosisSession = require('../models/DiagnosisSession');
const smsService = require('../services/smsService');

/**
 * @desc    Setup SMS reminders (medicine reminders)
 * @route   POST /api/sms/setup-reminders
 * @access  Private
 */
exports.setupReminders = async (req, res, next) => {
    try {
        const { sessionId, phone, medicineName, reminderTimes, followUpDate } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!sessionId || !phone || !medicineName || !reminderTimes || reminderTimes.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: sessionId, phone, medicineName, and reminderTimes are required',
            });
        }

        // Validate phone format
        if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use international format (e.g., +919876543210)',
            });
        }

        // Find session
        const session = await DiagnosisSession.findOne({
            sessionId,
            userId,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Diagnosis session not found',
            });
        }

        // Create reminder record
        const reminder = await SMSReminder.create({
            userId,
            sessionId,
            phone,
            medicineName,
            reminderTimes,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            language: session.language || 'English',
            status: 'active',
        });

        // Update session
        session.smsScheduled = true;
        await session.save();

        res.status(200).json({
            success: true,
            message: 'SMS reminders scheduled successfully',
            reminder: {
                id: reminder._id,
                medicineName: reminder.medicineName,
                reminderTimes: reminder.reminderTimes,
                status: reminder.status,
            },
        });
    } catch (error) {
        console.error('SMS setup error:', error);
        next(error);
    }
};

/**
 * @desc    Send test SMS
 * @route   POST /api/sms/test
 * @access  Private
 */
exports.sendTestSMS = async (req, res, next) => {
    try {
        const { phone, language } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required',
            });
        }

        // Validate phone format
        if (!/^\+?[1-9]\d{9,14}$/.test(phone.replace(/\s/g, ''))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use international format (e.g., +919876543210)',
            });
        }

        const result = await smsService.sendTestSMS({
            phone,
            language: language || 'English',
            userName: req.user.firstName,
        });

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Test SMS sent successfully',
                details: result.messageId,
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message || 'Failed to send test SMS',
            });
        }
    } catch (error) {
        console.error('Test SMS error:', error);
        next(error);
    }
};

/**
 * @desc    Get reminder status
 * @route   GET /api/sms/reminders/:reminderId
 * @access  Private
 */
exports.getReminderStatus = async (req, res, next) => {
    try {
        const { reminderId } = req.params;
        const userId = req.user._id;

        const reminder = await SMSReminder.findOne({
            _id: reminderId,
            userId,
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found',
            });
        }

        res.status(200).json({
            success: true,
            reminder: {
                id: reminder._id,
                medicineName: reminder.medicineName,
                phone: reminder.phone,
                reminderTimes: reminder.reminderTimes,
                followUpDate: reminder.followUpDate,
                status: reminder.status,
                sentCount: reminder.sentCount,
                lastSentAt: reminder.lastSentAt,
                createdAt: reminder.createdAt,
            },
        });
    } catch (error) {
        console.error('Get reminder status error:', error);
        next(error);
    }
};

/**
 * @desc    Get all user's SMS reminders
 * @route   GET /api/sms/reminders
 * @access  Private
 */
exports.getAllReminders = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const reminders = await SMSReminder.find({
            userId,
            status: { $in: ['active', 'completed'] },
        })
            .sort({ createdAt: -1 })
            .select('medicineName phone reminderTimes status sentCount lastSentAt createdAt');

        res.status(200).json({
            success: true,
            count: reminders.length,
            reminders,
        });
    } catch (error) {
        console.error('Get all reminders error:', error);
        next(error);
    }
};

/**
 * @desc    Cancel reminder
 * @route   DELETE /api/sms/reminders/:reminderId
 * @access  Private
 */
exports.cancelReminder = async (req, res, next) => {
    try {
        const { reminderId } = req.params;
        const userId = req.user._id;

        const reminder = await SMSReminder.findOne({
            _id: reminderId,
            userId,
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found',
            });
        }

        // Update status
        reminder.status = 'cancelled';
        await reminder.save();

        res.status(200).json({
            success: true,
            message: 'SMS reminder cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel reminder error:', error);
        next(error);
    }
};

/**
 * @desc    Check SMS service status
 * @route   GET /api/sms/status
 * @access  Private
 */
exports.checkSMSStatus = async (req, res, next) => {
    try {
        const isConfigured = !!(
            process.env.TWILIO_ACCOUNT_SID &&
            process.env.TWILIO_AUTH_TOKEN &&
            process.env.TWILIO_PHONE_NUMBER
        );

        res.status(200).json({
            success: true,
            configured: isConfigured,
            message: isConfigured
                ? 'SMS service is configured and ready'
                : 'SMS service is not configured. Add Twilio credentials to .env',
        });
    } catch (error) {
        next(error);
    }
};