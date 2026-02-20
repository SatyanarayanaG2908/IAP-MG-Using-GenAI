// FILE PATH: backend/models/EmailReminder.js

const mongoose = require('mongoose');

const emailReminderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        reminderType: {
            type: String,
            enum: ['followup', 'medication', 'test_results', 'appointment', 'custom'],
            required: true,
        },
        scheduledFor: {
            type: Date,
            required: true,
            index: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['scheduled', 'sent', 'failed', 'cancelled'],
            default: 'scheduled',
            index: true,
        },
        lastSentAt: {
            type: Date,
            default: null,
        },
        sentCount: {
            type: Number,
            default: 0,
        },
        lastError: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient scheduler queries
emailReminderSchema.index({
    status: 1,
    scheduledFor: 1
});

// Index for user queries
emailReminderSchema.index({
    userId: 1,
    status: 1,
    createdAt: -1
});

// Method to check if reminder should be sent
emailReminderSchema.methods.shouldSend = function () {
    return (
        this.status === 'scheduled' &&
        this.scheduledFor <= new Date()
    );
};

// Method to mark as sent
emailReminderSchema.methods.markAsSent = async function () {
    this.status = 'sent';
    this.lastSentAt = new Date();
    this.sentCount += 1;
    await this.save();
};

// Method to mark as failed
emailReminderSchema.methods.markAsFailed = async function (error) {
    this.status = 'failed';
    this.lastError = error;
    await this.save();
};

module.exports = mongoose.model('EmailReminder', emailReminderSchema);