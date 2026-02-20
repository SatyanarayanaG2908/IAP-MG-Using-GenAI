// FILE PATH: backend/models/DiagnosisSession.js

const mongoose = require('mongoose');

const diagnosisSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
            unique: true,  // This automatically creates an index
        },
        symptoms: {
            type: String,
            required: [true, 'Initial symptoms are required'],
        },
        language: {
            type: String,
            default: 'English',
        },
        // 🔥 REMOVED: followupQuestions and answers (not needed in AI-only system)

        isEmergency: {
            type: Boolean,
            default: false,
        },
        emergencySymptoms: [String],

        // AI-generated diagnosis
        diseases: [
            {
                name: String,
                confidence: Number,
                reasoning: [String],  // Changed back to [String] to support bullet points
            },
        ],
        finalDisease: {
            type: String,
        },

        // Treatment plan
        treatment: {
            medicines: [
                {
                    name: String,
                    dosage: String,
                    frequency: String,
                    duration: String,
                    timing: String,
                    sideEffects: String,
                },
            ],
            homeRemedies: [String],
        },

        // Diet recommendations
        diet: {
            recommended: [String],
            avoid: [String],
        },

        // Precautions
        precautions: [String],

        // Recovery information
        recovery: {
            duration: String,
            timeline: String,
            followUp: String,
        },

        // Session status
        status: {
            type: String,
            enum: ['pending', 'analyzing', 'completed', 'emergency', 'failed'],
            default: 'pending',
        },

        // PDF generation
        pdfGenerated: {
            type: Boolean,
            default: false,
        },
        pdfUrl: String,

        // SMS reminders
        smsScheduled: {
            type: Boolean,
            default: false,
        },

        // Email report
        emailSent: {
            type: Boolean,
            default: false,
        },
        emailSentAt: Date,
    },
    {
        timestamps: true,
    }
);

// 🔥 FIX: Only add custom indexes (sessionId already has index from unique: true)
diagnosisSessionSchema.index({ userId: 1, createdAt: -1 });
diagnosisSessionSchema.index({ status: 1 });

const DiagnosisSession = mongoose.model('DiagnosisSession', diagnosisSessionSchema);

module.exports = DiagnosisSession;