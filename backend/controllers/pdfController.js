// FILE PATH: backend/controllers/pdfController.js

const DiagnosisSession = require('../models/DiagnosisSession');
const axios = require('axios');

exports.generatePDF = async (req, res, next) => {
    try {
        const { sessionId, language } = req.body;
        const userId = req.user._id;

        if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID is required' });

        const session = await DiagnosisSession.findOne({ sessionId, userId });
        if (!session) return res.status(404).json({ success: false, message: 'Diagnosis session not found' });

        if (!session.diseases || session.diseases.length === 0) {
            return res.status(400).json({ success: false, message: 'Cannot generate PDF. Diagnosis is incomplete.' });
        }

        // Build user_data with safe fallbacks for ALL fields
        const emailUsername = (req.user.email || 'user').split('@')[0];
        const userData = {
            username: emailUsername,
            first_name: req.user.firstName || req.user.fullName?.split(' ')[0] || emailUsername,
            last_name: req.user.lastName || req.user.fullName?.split(' ').slice(1).join(' ') || '',
            email: req.user.email || 'N/A',
            phone: req.user.phone || 'N/A',
            age: req.user.age || 'N/A',
            gender: req.user.gender || 'N/A',
            blood_group: req.user.bloodGroup || 'N/A',
            medical_conditions: req.user.medicalConditions || [],
        };

        const analysisResult = {
            diseases: (session.diseases || []).map(d => ({
                name: d.name,
                confidence: d.confidence,
                reason: Array.isArray(d.reasoning) ? d.reasoning.join('. ') : (d.reasoning || d.reason || 'N/A'),
            })),
            final_disease: session.finalDisease || session.diseases[0]?.name || 'Unknown',
            medical_plan: {
                medicines: session.treatment?.medicines || [],
                diet: session.diet || { recommended: [], avoid: [] },
                precautions: session.precautions || [],
            },
            recovery: {
                duration: session.recovery?.duration || 'Varies',
                timeline: session.recovery?.timeline || 'Follow treatment plan for best results',
            },
        };

        const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5001';

        console.log(`📄 Requesting PDF from ${PDF_SERVICE_URL}/generate-pdf for session: ${sessionId}`);

        try {
            const pdfResponse = await axios.post(`${PDF_SERVICE_URL}/generate-pdf`, {
                user_data: userData,
                symptoms: session.symptoms || 'Not specified',
                analysis_result: analysisResult,
                language: language || session.language || 'English',
            }, {
                timeout: 60000,
                responseType: 'arraybuffer',
                headers: { 'Content-Type': 'application/json' }
            });

            session.pdfGenerated = true;
            await session.save();

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Medical_Report_${sessionId}.pdf`);
            res.send(pdfResponse.data);

        } catch (pdfError) {
            console.error('PDF service error:', pdfError.message);
            if (pdfError.response) {
                console.error('PDF service response:', pdfError.response.status, pdfError.response.data?.toString?.()?.slice(0, 200));
            }
            if (pdfError.code === 'ECONNREFUSED') {
                return res.status(503).json({ success: false, message: 'PDF service is not running. Start python pdf_service first.' });
            }
            return res.status(500).json({ success: false, message: 'PDF generation failed: ' + pdfError.message });
        }
    } catch (error) {
        console.error('pdfController error:', error);
        next(error);
    }
};

exports.getPDFUrl = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ success: false, message: 'Session ID required' });
        const session = await DiagnosisSession.findOne({ sessionId, userId: req.user._id });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
        res.status(200).json({ success: true, sessionId });
    } catch (error) { next(error); }
};

exports.checkPDFServiceStatus = async (req, res, next) => {
    try {
        const PDF_SERVICE_URL = process.env.PDF_SERVICE_URL || 'http://localhost:5001';
        const response = await axios.get(`${PDF_SERVICE_URL}/health`, { timeout: 5000 });
        res.status(200).json({ success: true, message: 'PDF service available', status: response.data });
    } catch (error) {
        res.status(503).json({ success: false, message: 'PDF service unavailable' });
    }
};