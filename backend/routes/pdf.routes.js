// FILE PATH: backend/routes/pdf.routes.js

const express = require('express');
const router = express.Router();
const {
    generatePDF,
    getPDFUrl,
    checkPDFServiceStatus,
} = require('../controllers/pdfController');
const { protect } = require('../middleware/auth.middleware');

// All PDF routes require authentication
router.use(protect);

// Generate and download PDF
router.post('/generate', generatePDF);

// Get PDF URL (for viewing)
router.post('/url', getPDFUrl);

// Check PDF service status
router.get('/status', checkPDFServiceStatus);

module.exports = router;