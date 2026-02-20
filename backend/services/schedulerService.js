// FILE PATH: backend/services/schedulerService.js

const cron = require('node-cron');
const SMSReminder = require('../models/SMSReminder');
const EmailReminder = require('../models/EmailReminder');
const smsService = require('./smsService');
const emailService = require('./emailService');

/**
 * Backend Scheduler Service
 * 
 * This service runs cron jobs that check for scheduled reminders
 * every minute and sends them automatically.
 * 
 * Works even when user app is closed!
 */

class SchedulerService {
    constructor() {
        this.smsTask = null;
        this.emailTask = null;
    }

    /**
     * Start all schedulers
     */
    start() {
        console.log('🚀 Starting Scheduler Service...');
        this.startSMSScheduler();
        this.startEmailScheduler();
        console.log('✅ Scheduler Service is running!');
    }

    /**
     * SMS Scheduler - Runs every minute
     */
    startSMSScheduler() {
        // Run every minute: '* * * * *'
        this.smsTask = cron.schedule('* * * * *', async () => {
            try {
                await this.processSMSReminders();
            } catch (error) {
                console.error('SMS scheduler error:', error);
            }
        });

        console.log('📱 SMS Scheduler started (runs every minute)');
    }

    /**
     * Email Scheduler - Runs every minute
     */
    startEmailScheduler() {
        // Run every minute: '* * * * *'
        this.emailTask = cron.schedule('* * * * *', async () => {
            try {
                await this.processEmailReminders();
            } catch (error) {
                console.error('Email scheduler error:', error);
            }
        });

        console.log('📧 Email Scheduler started (runs every minute)');
    }

    /**
     * Process SMS reminders that are due
     */
    async processSMSReminders() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');

        // Find active reminders with matching time
        const reminders = await SMSReminder.find({
            status: 'active',
            reminderTimes: currentTime,
        }).populate('userId', 'firstName lastName');

        if (reminders.length > 0) {
            console.log(`📱 Processing ${reminders.length} SMS reminders for ${currentTime}...`);
        }

        for (const reminder of reminders) {
            try {
                // Send medicine reminder
                const result = await smsService.sendMedicineReminder({
                    phone: reminder.phone,
                    medicineName: reminder.medicineName,
                    language: reminder.language,
                });

                if (result.success) {
                    // Update reminder
                    reminder.lastSentAt = new Date();
                    reminder.sentCount += 1;
                    await reminder.save();

                    console.log(`✅ SMS sent to ${reminder.phone} for ${reminder.medicineName}`);
                } else {
                    console.error(`❌ SMS failed for ${reminder.phone}: ${result.message}`);
                }
            } catch (error) {
                console.error(`❌ Error processing SMS reminder ${reminder._id}:`, error);
            }
        }

        // Process follow-up reminders
        const followUpReminders = await SMSReminder.find({
            status: 'active',
            followUpDate: {
                $gte: new Date(now.setHours(0, 0, 0, 0)),
                $lt: new Date(now.setHours(23, 59, 59, 999)),
            },
        });

        for (const reminder of followUpReminders) {
            try {
                const result = await smsService.sendFollowUpReminder({
                    phone: reminder.phone,
                    language: reminder.language,
                });

                if (result.success) {
                    // Mark as completed
                    reminder.status = 'completed';
                    reminder.lastSentAt = new Date();
                    await reminder.save();

                    console.log(`✅ Follow-up SMS sent to ${reminder.phone}`);
                }
            } catch (error) {
                console.error(`❌ Error sending follow-up SMS:`, error);
            }
        }
    }

    /**
     * Process email reminders that are due
     */
    async processEmailReminders() {
        const now = new Date();

        // Find scheduled reminders that are due
        const reminders = await EmailReminder.find({
            status: 'scheduled',
            scheduledFor: { $lte: now },
        }).populate('userId', 'firstName lastName email');

        if (reminders.length > 0) {
            console.log(`📧 Processing ${reminders.length} email reminders...`);
        }

        for (const reminder of reminders) {
            try {
                // Send reminder email
                const result = await emailService.sendReminderEmail(reminder);

                if (result.success) {
                    // Mark as sent
                    await reminder.markAsSent();
                    console.log(`✅ Email sent to ${reminder.email} (${reminder.reminderType})`);
                } else {
                    // Mark as failed
                    await reminder.markAsFailed(result.message);
                    console.error(`❌ Email failed for ${reminder.email}: ${result.message}`);
                }
            } catch (error) {
                console.error(`❌ Error processing email reminder ${reminder._id}:`, error);
                await reminder.markAsFailed(error.message);
            }
        }
    }

    /**
     * Stop all schedulers
     */
    stop() {
        if (this.smsTask) {
            this.smsTask.stop();
            console.log('📱 SMS Scheduler stopped');
        }

        if (this.emailTask) {
            this.emailTask.stop();
            console.log('📧 Email Scheduler stopped');
        }

        console.log('🛑 Scheduler Service stopped');
    }

    /**
     * Get scheduler status
     */
    getStatus() {
        return {
            smsScheduler: this.smsTask ? 'running' : 'stopped',
            emailScheduler: this.emailTask ? 'running' : 'stopped',
        };
    }
}

// Create singleton instance
const schedulerService = new SchedulerService();

module.exports = schedulerService;