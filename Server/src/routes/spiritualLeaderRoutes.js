const express = require('express');
const spiritualLeaderController = require('../controllers/spiritualLeaderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', spiritualLeaderController.getAllSpiritualLeaders);
router.get('/:id', spiritualLeaderController.getSpiritualLeader);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

// Admin only routes
router.post('/', authMiddleware.restrictTo('admin'), spiritualLeaderController.createSpiritualLeader);
router.patch('/:id', authMiddleware.restrictTo('admin'), spiritualLeaderController.updateSpiritualLeader);
router.delete('/:id', authMiddleware.restrictTo('admin'), spiritualLeaderController.deleteSpiritualLeader);

module.exports = router;
