const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all spiritual leaders with optional filters
exports.getAllSpiritualLeaders = catchAsync(async (req, res) => {
  const { specialization, religion, minRating } = req.query;

  const where = {};

  if (specialization) {
    where.specialization = {
      contains: specialization,
      mode: 'insensitive'
    };
  }

  if (religion) {
    where.religion = {
      contains: religion,
      mode: 'insensitive'
    };
  }

  if (minRating) {
    where.rating = {
      gte: parseFloat(minRating)
    };
  }

  const spiritualLeaders = await prisma.spiritualLeader.findMany({
    where,
    orderBy: { rating: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: spiritualLeaders.length,
    data: { spiritualLeaders }
  });
});

// Get single spiritual leader by ID
exports.getSpiritualLeader = catchAsync(async (req, res) => {
  const { id } = req.params;

  const spiritualLeader = await prisma.spiritualLeader.findUnique({
    where: { id },
    include: {
      appointments: {
        where: {
          status: { in: ['confirmed', 'pending', 'paid'] }
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

  if (!spiritualLeader) {
    return res.status(404).json({
      status: 'error',
      message: 'Spiritual leader not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { spiritualLeader }
  });
});

// Create a new spiritual leader (admin only)
exports.createSpiritualLeader = catchAsync(async (req, res) => {
  const {
    name,
    email,
    religion,
    specialization,
    experience,
    sessionPrice,
    availability,
    bio
  } = req.body;

  const spiritualLeader = await prisma.spiritualLeader.create({
    data: {
      name,
      email,
      religion,
      specialization,
      experience: Number(experience),
      sessionPrice: Number(sessionPrice),
      availability: availability || {},
      bio,
    }
  });

  res.status(201).json({
    status: 'success',
    data: { spiritualLeader }
  });
});

// Update spiritual leader (admin only)
exports.updateSpiritualLeader = catchAsync(async (req, res) => {
  const { id } = req.params;

  const payload = { ...req.body };
  if (payload.experience !== undefined) payload.experience = Number(payload.experience);
  if (payload.sessionPrice !== undefined) payload.sessionPrice = Number(payload.sessionPrice);

  const spiritualLeader = await prisma.spiritualLeader.update({
    where: { id },
    data: payload
  });

  res.status(200).json({
    status: 'success',
    data: { spiritualLeader }
  });
});

// Delete spiritual leader (admin only)
exports.deleteSpiritualLeader = catchAsync(async (req, res) => {
  const { id } = req.params;

  await prisma.spiritualLeader.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
