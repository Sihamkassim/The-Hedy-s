const express = require('express');
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', supportController.getAllResources);
router.get('/:id', supportController.getResource);

// Protected routes (admin only)
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', supportController.createResource);
router.patch('/:id', supportController.updateResource);
router.delete('/:id', supportController.deleteResource);

module.exports = router;
