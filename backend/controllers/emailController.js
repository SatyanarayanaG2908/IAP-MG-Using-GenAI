// FILE PATH: backend/controllers/emailController.js

const DiagnosisSession = require('../models/DiagnosisSession');
const EmailReminder = require('../models/EmailReminder');
const emailService = require('../services/emailService');
const axios = require('axios');

/**
 * @desc    Send diagnosis report via email
 * @route   POST /api/email/send-report
 * @access  Private
 */
exports.sendReport = async (req, res, next) => {
    try {
        const { sessionId, language } = req.body;
        const userId = req.user._id;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required',
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

        // Check if diagnosis is complete
        if (!session.diseases || session.diseases.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot send report. Diagnosis is incomplete.',
            });
        }

        // Generate PDF first (if not already generated)
        let pdfBuffer = null;
        try {
            const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5001';

            const userData = {
                username: req.user.email.split('@')[0],
                first_name: req.user.firstName,
                last_name: req.user.lastName,
                email: req.user.email,
                phone: req.user.phone,
                age: req.user.age,
                gender: req.user.gender,
                blood_group: req.user.bloodGroup || 'N/A',
                medical_conditions: req.user.medicalConditions || [],
            };

            const analysisResult = {
                diseases: session.diseases,
                final_disease: session.finalDisease,
                medical_plan: {
                    medicines: session.treatment?.medicines || [],
                    diet: session.diet || {},
                    precautions: session.precautions || [],
                },
                recovery: session.recovery || {},
            };

            const pdfResponse = await axios.post(
                `${PDF_SERVICE_URL}/generate-pdf`,
                {
                    user_data: userData,
                    symptoms: session.symptoms,
                    analysis_result: analysisResult,
                    language: language || session.language || 'English',
                },
                {
                    timeout: 30000,
                    responseType: 'arraybuffer',
                }
            );

            pdfBuffer = pdfResponse.data;
        } catch (pdfError) {
            console.error('PDF generation error:', pdfError.message);
            // Continue without PDF attachment
        }

        // Send email with PDF attachment
        // Send email with PDF attachment
        const result = await emailService.sendDiagnosisReport(
            req.user.email,
            req.user.firstName,
            {
                finalDisease: session.finalDisease,
                symptoms: session.symptoms,
            },
            pdfBuffer
        );

        if (result.success) {
            // Update session
            session.emailSent = true;
            session.emailSentAt = new Date();
            await session.save();

            res.status(200).json({
                success: true,
                message: `Report sent to ${req.user.email}`,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
            });
        }
    } catch (error) {
        console.error('Email sending error:', error);
        next(error);
    }
};

/**
 * @desc    Send test email
 * @route   POST /api/email/test
 * @access  Private
 */
exports.sendTestEmail = async (req, res, next) => {
    try {
        const result = await emailService.sendTestEmail(req.user.email, req.user.firstName);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Test email sent successfully',
                details: result.messageId,
            });
        } else {
            res.status(500).json({
                success: false,
                message: result.message || 'Failed to send test email',
            });
        }
    } catch (error) {
        console.error('Test email error:', error);
        next(error);
    }
};

/**
 * @desc    Schedule email reminder
 * @route   POST /api/email/schedule-reminder
 * @access  Private
 */
exports.scheduleReminder = async (req, res, next) => {
    try {
        const { sessionId, reminderType, scheduledDate, scheduledTime, message } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!sessionId || !reminderType || !scheduledDate || !scheduledTime) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: sessionId, reminderType, scheduledDate, scheduledTime',
            });
        }

        // Verify session exists
        const session = await DiagnosisSession.findOne({
            sessionId,
            userId,
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found',
            });
        }

        // Create scheduled datetime
        const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);

        // Validate future date
        if (scheduledFor <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Scheduled time must be in the future',
            });
        }

        // Create email reminder
        const reminder = await EmailReminder.create({
            userId,
            sessionId,
            email: req.user.email,
            reminderType,
            scheduledFor,
            message: message || `Reminder: ${reminderType}`,
            status: 'scheduled',
        });

        res.status(200).json({
            success: true,
            message: 'Email reminder scheduled successfully',
            reminder: {
                id: reminder._id,
                type: reminder.reminderType,
                scheduledFor: reminder.scheduledFor,
                status: reminder.status,
            },
        });
    } catch (error) {
        console.error('Schedule reminder error:', error);
        next(error);
    }
};

/**
 * @desc    Get all scheduled email reminders
 * @route   GET /api/email/reminders
 * @access  Private
 */
exports.getReminders = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const reminders = await EmailReminder.find({
            userId,
            status: { $in: ['scheduled', 'sent'] },
        })
            .sort({ scheduledFor: 1 })
            .select('reminderType scheduledFor status lastSentAt createdAt');

        res.status(200).json({
            success: true,
            count: reminders.length,
            reminders,
        });
    } catch (error) {
        console.error('Get reminders error:', error);
        next(error);
    }
};

/**
 * @desc    Cancel scheduled email reminder
 * @route   DELETE /api/email/reminders/:reminderId
 * @access  Private
 */
exports.cancelReminder = async (req, res, next) => {
    try {
        const { reminderId } = req.params;
        const userId = req.user._id;

        const reminder = await EmailReminder.findOne({
            _id: reminderId,
            userId,
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found',
            });
        }

        // Update status to cancelled
        reminder.status = 'cancelled';
        await reminder.save();

        res.status(200).json({
            success: true,
            message: 'Email reminder cancelled successfully',
        });
    } catch (error) {
        console.error('Cancel reminder error:', error);
        next(error);
    }
};

/**
 * @desc    Check email service status
 * @route   GET /api/email/status
 * @access  Private
 */
exports.checkEmailStatus = async (req, res, next) => {
    try {
        const isConfigured = emailService.isConfigured();

        res.status(200).json({
            success: true,
            configured: isConfigured,
            message: isConfigured
                ? 'Email service is configured and ready'
                : 'Email service is not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env',
        });
    } catch (error) {
        next(error);
    }
};