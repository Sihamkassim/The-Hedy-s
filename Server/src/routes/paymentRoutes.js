const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// M-Pesa callback (public - no auth needed)
router.post('/callback', paymentController.mpesaCallback);

// All other routes require authentication
router.use(authMiddleware.protect);

// Patient routes
router.post('/initiate', paymentController.initiatePayment);
router.get('/transactions', paymentController.getMyTransactions);
router.get('/transactions/:transactionId', paymentController.getTransactionStatus);

// MOCK route - simulate payment completion (remove in production)
router.post('/simulate', paymentController.simulatePayment);

// Therapist/Spiritual Leader routes
router.get(
  '/earnings',
  authMiddleware.restrictTo('doctor', 'spiritual_leader'),
  paymentController.getMyEarnings
);

module.exports = router;
