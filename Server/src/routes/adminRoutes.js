const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require auth AND admin role
router.use(protect);
router.use(restrictTo('admin'));

// Stats overview
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
