const DiagnosisSession = require('../models/DiagnosisSession');
const { generatePDF } = require('../services/pdfService'); // ✅ USE LOCAL SERVICE

// ======================
// GENERATE PDF
// ======================
exports.generatePDF = async (req, res, next) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user._id;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is required' });
        }

        const session = await DiagnosisSession.findOne({ sessionId, userId });
        if (!session) {
            return res.status(404).json({ success: false, message: 'Diagnosis session not found' });
        }

        if (!session.diseases || session.diseases.length === 0) {
            return res.status(400).json({ success: false, message: 'Diagnosis not completed yet' });
        }

        // ✅ USER DATA
        const emailUsername = (req.user.email || 'user').split('@')[0];

        const userData = {
            username: emailUsername,
            age: req.user.age || 'N/A',
            gender: req.user.gender || 'N/A',
            medical_conditions: req.user.medicalConditions || [],
        };

        // ✅ ANALYSIS DATA
        const analysisResult = {
            diseases: (session.diseases || []).map(d => ({
                name: d.name,
                confidence: d.confidence,
                reasoning: Array.isArray(d.reasoning)
                    ? d.reasoning.join('. ')
                    : d.reasoning || 'N/A'
            })),
            medical_plan: {
                medicines: session.treatment?.medicines || [],
            }
        };

        // ======================
        // 🔥 GENERATE PDF LOCALLY
        // ======================
        const pdfResult = await generatePDF(
            userData,
            session.symptoms || 'Not specified',
            analysisResult,
            session.language || 'English'
        );

        // Save status
        session.pdfGenerated = true;
        await session.save();

        // ======================
        // ✅ RETURN PDF URL
        // ======================
        return res.status(200).json({
            success: true,
            message: 'PDF generated successfully',
            pdfUrl: pdfResult.url
        });

    } catch (error) {
        console.error('PDF Controller Error:', error);
        next(error);
    }
};


// ======================
// GET PDF URL
// ======================
exports.getPDFUrl = async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID required' });
        }

        res.status(200).json({
            success: true,
            pdfUrl: `/reports/${sessionId}.pdf`
        });

    } catch (error) {
        next(error);
    }
};


// ======================
// STATUS CHECK
// ======================
exports.checkPDFServiceStatus = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'PDF service is running (Node.js pdfkit)'
    });
};