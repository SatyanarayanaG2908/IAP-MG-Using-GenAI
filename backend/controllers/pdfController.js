const DiagnosisSession = require('../models/DiagnosisSession');
const { generatePDF } = require('../services/pdfService');

exports.generatePDF = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user._id;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID required' });
        }

        const session = await DiagnosisSession.findOne({ sessionId, userId });

        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }

        const userData = {
            username: (req.user.email || 'user').split('@')[0],
            age: req.user.age || 'N/A',
            gender: req.user.gender || 'N/A'
        };

        const analysisResult = {
            diseases: session.diseases || []
        };

        const pdfResult = await generatePDF(
            userData,
            session.symptoms || '',
            analysisResult
        );

        res.json({
            success: true,
            pdfUrl: pdfResult.url
        });

    } catch (err) {
        console.error("❌ Controller error:", err);
        next(err);
    }
};