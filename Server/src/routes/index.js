const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
// Later add:
// router.use('/therapists', therapistRoutes);
// router.use('/appointments', appointmentRoutes);
// router.use('/ai', aiRoutes);

module.exports = router;
