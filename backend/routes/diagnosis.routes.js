// FILE PATH: backend/routes/diagnosis.routes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/diagnosisController');
const { protect } = require('../middleware/auth.middleware');

// All routes protected
router.use(protect);

// Submit symptoms & get diagnosis
router.post('/submit-and-analyze', controller.submitAndAnalyze);

// Get all sessions for current user
router.get('/sessions', controller.getSessions);

// Get single session
router.get('/sessions/:sessionId', controller.getSession);

// ✅ DELETE session - NEW
router.delete('/sessions/:sessionId', controller.deleteSession);

// Get diagnosis result
router.get('/result/:sessionId', controller.getDiagnosisResult);

module.exports = router;