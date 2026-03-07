const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const upload = require('../middleware/multer');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'degreeFile', maxCount: 1 },
  { name: 'certificateFile', maxCount: 1 }
]), validate(registerSchema), authController.register);                                                                                                   
// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.get('/me', authController.getMe);

module.exports = router;
