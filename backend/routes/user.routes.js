// FILE PATH: backend/routes/user.routes.js

const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth.middleware');

// All user routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/update', updateProfile);

module.exports = router;
