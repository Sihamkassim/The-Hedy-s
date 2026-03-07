const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware.protect);

// Patient routes
router.post('/', appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getMyAppointments);

// Doctor route — must come before /:id to avoid param collision
router.get(
  '/my-schedule',
  authMiddleware.restrictTo('doctor', 'admin'),
  appointmentController.getMySchedule
);

router.get('/:id', appointmentController.getAppointment);
router.patch('/:id/cancel', appointmentController.cancelAppointment);

// Admin/Doctor routes
router.get(
  '/',
  authMiddleware.restrictTo('admin', 'doctor'),
  appointmentController.getAllAppointments
);

router.patch(
  '/:id',
  authMiddleware.restrictTo('admin', 'doctor'),
  appointmentController.updateAppointment
);

module.exports = router;
