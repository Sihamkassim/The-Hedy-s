const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/contacts', chatController.getChatContacts);
router.get('/messages/:userId', chatController.getMessagesWithUser);
router.post('/messages', chatController.sendMessage);

module.exports = router;
