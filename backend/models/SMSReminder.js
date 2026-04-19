// FILE PATH: backend/models/SMSReminder.js

const mongoose = require('mongoose');

const smsReminderSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    medicineName: {
        type: String,
        required: true,
        trim: true,
    },
    reminderTimes: [{
        type: String, // Format: "HH:MM"
        required: true,
    }],
    // ✅ NEW: Date range for reminders
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
    },
    followUpDate: {
        type: Date,
        default: null,
    },
    language: {
        type: String,
        default: 'English',
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active',
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
}, {
    timestamps: true,
});

smsReminderSchema.index({ userId: 1, status: 1, createdAt: -1 });
smsReminderSchema.index({ status: 1, startDate: 1, endDate: 1 });

// Check if reminder is active and within date range
smsReminderSchema.methods.isActiveNow = function () {
    const now = new Date();
    return (
        this.status === 'active' &&
        now >= this.startDate &&
        now <= this.endDate
    );
};

module.exports = mongoose.model('SMSReminder', smsReminderSchema);