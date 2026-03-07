const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all therapists with optional filters
exports.getAllTherapists = catchAsync(async (req, res) => {
  const { specialization, isFreeSupport, minRating, status } = req.query;

  const where = {};
  
  if (status && req.user && req.user.role === 'admin') {
    where.status = status;
  } else {
    // By default, only show approved therapists to users
    where.status = 'approved';
  }
  
  if (specialization) {
    where.specialization = {
      contains: specialization,
      mode: 'insensitive'
    };
  }
  
  if (isFreeSupport !== undefined) {
    where.isFreeSupport = isFreeSupport === 'true';
  }
  
  if (minRating) {
    where.rating = {
      gte: parseFloat(minRating)
    };
  }

  const therapists = await prisma.therapist.findMany({
    where,
    orderBy: { rating: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: therapists.length,
    data: { therapists }
  });
});

// Get single therapist by ID
exports.getTherapist = catchAsync(async (req, res) => {
  const { id } = req.params;

  const therapist = await prisma.therapist.findUnique({
    where: { id },
    include: {
      appointments: {
        where: {
          status: { in: ['confirmed', 'pending'] }
        },
        select: {
          id: true,
          date: true,
          time: true,
          status: true
        }
      }
    }
  });

  if (!therapist) {
    return res.status(404).json({
      status: 'error',
      message: 'Therapist not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { therapist }
  });
});

exports.acceptTerms = catchAsync(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  
  if (user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only therapists can accept terms' });
  }

  const therapist = await prisma.therapist.update({
    where: { email: user.email },
    data: { termsAccepted: true }
  });

  res.status(200).json({ status: 'success', data: { therapist } });
});

// Create a new therapist (admin only)
exports.createTherapist = catchAsync(async (req, res) => {
  const {
    name,
    email,
    specialization,
    degree,
    certificate,
    experience,
    sessionPrice,
    isFreeSupport,
    availability,
    bio
  } = req.body;

  const therapist = await prisma.therapist.create({
    data: {
      name,
      email,
      specialization,
      degree,
      certificate,
      experience: Number(experience),
      sessionPrice: Number(sessionPrice),
      isFreeSupport: isFreeSupport === true || isFreeSupport === 'true',
      availability,
      bio,
      profileImage: req.file ? `/uploads/therapists/${req.file.filename}` : null,
    }
  });

  res.status(201).json({
    status: 'success',
    data: { therapist }
  });
});

// Update therapist
exports.updateTherapist = catchAsync(async (req, res) => {
  const { id } = req.params;

  const payload = { ...req.body };
  if (payload.experience !== undefined) payload.experience = Number(payload.experience);
  if (payload.sessionPrice !== undefined) payload.sessionPrice = Number(payload.sessionPrice);
  if (req.file) payload.profileImage = `/uploads/therapists/${req.file.filename}`;

  const therapist = await prisma.therapist.update({
    where: { id },
    data: payload
  });

  res.status(200).json({
    status: 'success',
    data: { therapist }
  });
});

// Delete therapist
exports.deleteTherapist = catchAsync(async (req, res) => {
  const { id } = req.params;

  await prisma.therapist.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
