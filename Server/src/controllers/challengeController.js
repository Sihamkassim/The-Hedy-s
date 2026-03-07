const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all challenges
exports.getAllChallenges = catchAsync(async (req, res) => {
  const challenges = await prisma.challenge.findMany({
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: challenges.length,
    data: { challenges }
  });
});

// Get single challenge
exports.getChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;

  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { challenge }
  });
});

// Create challenge (admin only)
exports.createChallenge = catchAsync(async (req, res) => {
  const { title, description, duration, isRepetitive = true, dailyTasks = [] } = req.body;

  const challenge = await prisma.challenge.create({
    data: {
      title,
      description,
      duration,
      isRepetitive,
      dailyTasks
    }
  });

  res.status(201).json({
    status: 'success',
    data: { challenge }
  });
});

// Join a challenge
exports.joinChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if challenge exists
  const challenge = await prisma.challenge.findUnique({
    where: { id }
  });

  if (!challenge) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge not found'
    });
  }

  // Check if user already joined
  const existingProgress = await prisma.challengeProgress.findFirst({
    where: {
      userId,
      challengeId: id
    }
  });

  if (existingProgress) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already joined this challenge'
    });
  }

  // Create progress entry
  const progress = await prisma.challengeProgress.create({
    data: {
      userId,
      challengeId: id,
      completedDays: 0,
      progress: 0
    },
    include: {
      challenge: true
    }
  });

  res.status(201).json({
    status: 'success',
    data: { progress }
  });
});

// Update challenge progress (Log a daily task completion)
exports.updateProgress = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  // const { completedDays } = req.body; // Deprecated manual setting

  const progressRecord = await prisma.challengeProgress.findFirst({
    where: {
      challengeId: id,
      userId
    },
    include: {
      challenge: true
    }
  });

  if (!progressRecord) {
    return res.status(404).json({
      status: 'error',
      message: 'Challenge progress not found'
    });
  }

  // Check if already logged today
  const today = new Date();
  today.setHours(0,0,0,0);
  if (progressRecord.lastLogDate) {
    const lastLog = new Date(progressRecord.lastLogDate);
    lastLog.setHours(0,0,0,0);
    if (lastLog.getTime() === today.getTime()) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already completed the task for today'
      });
    }
  }

  const newCompletedDays = progressRecord.completedDays + 1;
  const progress = Math.min((newCompletedDays / progressRecord.challenge.duration) * 100, 100);

  const updatedProgress = await prisma.challengeProgress.update({
    where: { id: progressRecord.id },
    data: {
      completedDays: newCompletedDays,
      progress,
      lastLogDate: new Date(),
      completedTaskDates: {
        push: new Date()
      }
    },
    include: {
      challenge: true
    }
  });

  res.status(200).json({
    status: 'success',
    data: { progress: updatedProgress }
  });
});

// Get user's challenge progress
exports.getMyProgress = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const progress = await prisma.challengeProgress.findMany({
    where: { userId },
    include: {
      challenge: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: progress.length,
    data: { progress }
  });
});

// Update challenge (admin only)
exports.updateChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title, description, duration } = req.body;

  const challenge = await prisma.challenge.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(duration && { duration }),
    },
  });

  res.status(200).json({
    status: 'success',
    data: { challenge },
  });
});

// Delete challenge
exports.deleteChallenge = catchAsync(async (req, res) => {
  const { id } = req.params;

  await prisma.challenge.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
