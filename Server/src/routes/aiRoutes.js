const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Protect all AI routes
router.use(authMiddleware.protect);

// Apply rate limiting to AI chat
router.post('/chat', apiLimiter, aiController.chatWithAI);

module.exports = router;
