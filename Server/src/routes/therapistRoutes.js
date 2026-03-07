const express = require('express');
const therapistController = require('../controllers/therapistController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const router = express.Router();

// Public routes
router.get('/', therapistController.getAllTherapists);
router.get('/:id', therapistController.getTherapist);

// Protected routes (require authentication)
router.use(authMiddleware.protect);

router.post('/accept-terms', therapistController.acceptTerms);

// Admin only routes
router.post(
  '/',
  authMiddleware.restrictTo('admin'),
  upload.single('profileImage'),
  therapistController.createTherapist
);

router.patch(
  '/:id',
  authMiddleware.restrictTo('admin'),
  upload.single('profileImage'),
  therapistController.updateTherapist
);

router.delete(
  '/:id',
  authMiddleware.restrictTo('admin'),
  therapistController.deleteTherapist
);

module.exports = router;
