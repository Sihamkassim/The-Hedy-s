const express = require('express');
const challengeController = require('../controllers/challengeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', challengeController.getAllChallenges);
router.get('/:id', challengeController.getChallenge);

// Protected routes
router.use(authMiddleware.protect);

// User routes
router.post('/:id/join', challengeController.joinChallenge);
router.patch('/:id/progress', challengeController.updateProgress);
router.get('/my/progress', challengeController.getMyProgress);

// Admin routes
router.post(
  '/',
  authMiddleware.restrictTo('admin'),
  challengeController.createChallenge
);

router.patch(
  '/:id',
  authMiddleware.restrictTo('admin'),
  challengeController.updateChallenge
);

router.delete(
  '/:id',
  authMiddleware.restrictTo('admin'),
  challengeController.deleteChallenge
);

module.exports = router;
