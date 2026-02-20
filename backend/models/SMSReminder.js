// FILE PATH: backend/models/SMSReminder.js
// NEW FILE: Database model for SMS reminders

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
        type: String, // Format: "HH:MM" (e.g., "09:00", "21:00")
        required: true,
    }],
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

// Index for efficient queries
smsReminderSchema.index({ userId: 1, status: 1, createdAt: -1 });

// Method to check if reminder is still active
smsReminderSchema.methods.isActive = function () {
    return this.status === 'active';
};

module.exports = mongoose.model('SMSReminder', smsReminderSchema);