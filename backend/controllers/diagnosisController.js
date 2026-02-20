// FILE PATH: backend/controllers/diagnosisController.js

const DiagnosisSession = require('../models/DiagnosisSession');
const geminiService = require('../services/geminiService');
const { generateId } = require('../utils/helpers');

// Helper: resolve language — request body > user profile > default English
const resolveLanguage = (bodyLang, userLang) => {
    const validLanguages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'];
    if (bodyLang && validLanguages.includes(bodyLang)) return bodyLang;
    if (userLang && validLanguages.includes(userLang)) return userLang;
    return 'English';
};

exports.submitAndAnalyze = async (req, res, next) => {
    try {
        const { symptoms, language } = req.body;
        const userId = req.user._id;

        if (!symptoms || symptoms.trim().length < 10) {
            return res.status(400).json({ success: false, message: 'Please provide detailed symptoms (at least 10 characters)' });
        }

        const selectedLanguage = resolveLanguage(language, req.user.preferredLanguage || req.user.language);
        console.log(`🌐 submitAndAnalyze — language: ${selectedLanguage}`);

        const sessionId = generateId();
        const userData = {
            age: req.user.age,
            gender: req.user.gender,
            medicalConditions: req.user.medicalConditions || [],
            language: selectedLanguage,
        };

        // Check for duplicate recent session (same symptoms within 5 min)
        const duplicateSession = await DiagnosisSession.findOne({
            userId,
            symptoms: symptoms.trim(),
            createdAt: { $gt: new Date(Date.now() - 5 * 60 * 1000) }
        });

        if (duplicateSession) {
            return res.status(200).json({
                success: true,
                sessionId: duplicateSession.sessionId,
                isEmergency: duplicateSession.isEmergency,
                message: 'Existing recent session found.',
                diagnosis: {
                    diseases: duplicateSession.diseases,
                    treatment: duplicateSession.treatment,
                    diet: duplicateSession.diet,
                    precautions: duplicateSession.precautions,
                    recovery: duplicateSession.recovery,
                },
            });
        }

        const aiResult = await geminiService.generateCompleteDiagnosis(symptoms, userData);
        const isEmergency = aiResult.emergency || false;

        const session = await DiagnosisSession.create({
            userId, sessionId, symptoms,
            language: selectedLanguage,
            isEmergency,
            emergencySymptoms: aiResult.emergencySymptoms || [],
            diseases: aiResult.diseases || [],
            finalDisease: aiResult.diseases?.[0]?.name || null,
            treatment: aiResult.treatment || null,
            diet: aiResult.diet || null,
            precautions: aiResult.precautions || [],
            recovery: aiResult.recovery || null,
            status: isEmergency ? 'emergency' : 'completed',
        });

        if (isEmergency) {
            return res.status(200).json({
                success: true, sessionId, isEmergency: true,
                emergencyData: {
                    symptoms: aiResult.emergencySymptoms,
                    message: aiResult.emergencyMessage,
                    instructions: [
                        '🚨 Call emergency services immediately (108 or 911)',
                        '🏥 Go to the nearest hospital emergency room',
                        '⚠️ Do not delay — this could be life-threatening',
                    ],
                },
            });
        }

        res.status(200).json({
            success: true, sessionId, isEmergency: false,
            diagnosis: {
                diseases: aiResult.diseases,
                treatment: aiResult.treatment,
                diet: aiResult.diet,
                precautions: aiResult.precautions,
                recovery: aiResult.recovery,
            },
        });
    } catch (error) {
        console.error('Diagnosis error:', error);
        next(error);
    }
};

exports.analyzeDiagnosis = async (req, res, next) => {
    try {
        const { sessionId, language } = req.body;
        const userId = req.user._id;

        const session = await DiagnosisSession.findOne({ sessionId, userId });
        if (!session) return res.status(404).json({ success: false, message: 'Diagnosis session not found' });

        // If already analyzed, return existing data
        if (session.diseases && session.diseases.length > 0) {
            return res.status(200).json({
                success: true,
                diagnosis: {
                    diseases: session.diseases, treatment: session.treatment,
                    diet: session.diet, precautions: session.precautions, recovery: session.recovery
                },
            });
        }

        const selectedLanguage = resolveLanguage(language, req.user.preferredLanguage || session.language);
        console.log(`🌐 analyzeDiagnosis — language: ${selectedLanguage}`);

        const userData = {
            age: req.user.age, gender: req.user.gender,
            medicalConditions: req.user.medicalConditions || [],
            language: selectedLanguage,
        };

        const aiResult = await geminiService.generateCompleteDiagnosis(session.symptoms, userData);

        session.diseases = aiResult.diseases || [];
        session.finalDisease = aiResult.diseases?.[0]?.name || null;
        session.treatment = aiResult.treatment || null;
        session.diet = aiResult.diet || null;
        session.precautions = aiResult.precautions || [];
        session.recovery = aiResult.recovery || null;
        session.language = selectedLanguage;
        session.status = 'completed';
        await session.save();

        res.status(200).json({
            success: true,
            diagnosis: {
                diseases: aiResult.diseases, treatment: aiResult.treatment,
                diet: aiResult.diet, precautions: aiResult.precautions, recovery: aiResult.recovery
            },
        });
    } catch (error) { next(error); }
};

exports.getSessions = async (req, res, next) => {
    try {
        const sessions = await DiagnosisSession.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .select('sessionId symptoms finalDisease diseases status isEmergency createdAt language');
        res.status(200).json({ success: true, count: sessions.length, sessions });
    } catch (error) { next(error); }
};

exports.getSession = async (req, res, next) => {
    try {
        const session = await DiagnosisSession.findOne({ sessionId: req.params.sessionId, userId: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Diagnosis session not found' });
        res.status(200).json({ success: true, session });
    } catch (error) { next(error); }
};

exports.getDiagnosisResult = async (req, res, next) => {
    try {
        const session = await DiagnosisSession.findOne({ sessionId: req.params.sessionId, userId: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Diagnosis result not found' });
        res.status(200).json({
            success: true, sessionId: session.sessionId, isEmergency: session.isEmergency,
            diagnosis: {
                diseases: session.diseases, treatment: session.treatment,
                diet: session.diet, precautions: session.precautions, recovery: session.recovery
            },
        });
    } catch (error) { next(error); }
};

exports.deleteSession = async (req, res, next) => {
    try {
        const session = await DiagnosisSession.findOneAndDelete({ sessionId: req.params.sessionId, userId: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found or unauthorized' });
        res.status(200).json({ success: true, message: 'Session deleted successfully', deletedSessionId: req.params.sessionId });
    } catch (error) { next(error); }
};