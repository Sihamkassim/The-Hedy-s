const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /admin/stats — dashboard overview counts
exports.getStats = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    totalTherapists,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalChallenges,
    totalChallengeJoins,
    totalResources,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'patient' } }),
    prisma.user.count({ where: { role: 'doctor' } }),
    prisma.therapist.count(),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'pending' } }),
    prisma.appointment.count({ where: { status: 'confirmed' } }),
    prisma.appointment.count({ where: { status: 'completed' } }),
    prisma.appointment.count({ where: { status: 'cancelled' } }),
    prisma.challenge.count(),
    prisma.challengeProgress.count(),
    prisma.supportResource.count(),
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        users: { total: totalUsers, patients: totalPatients, doctors: totalDoctors },
        therapists: totalTherapists,
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        challenges: { total: totalChallenges, totalJoins: totalChallengeJoins },
        resources: totalResources,
      },
    },
  });
});

// GET /admin/users — list all users
exports.getAllUsers = catchAsync(async (req, res) => {
  const { role, search } = req.query;

  const where = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          appointments: true,
          challengeProgress: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

// PATCH /admin/users/:id/role — update a user's role
exports.updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid role. Must be patient, doctor, or admin',
    });
  }

  // Prevent admin from demoting themselves
  if (id === req.user.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot change your own role',
    });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

// DELETE /admin/users/:id — delete a user account
exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (id === req.user.id) {
    return res.status(400).json({
      status: 'error',
      message: 'You cannot delete your own account',
    });
  }

  await prisma.user.delete({ where: { id } });

  res.status(204).json({ status: 'success', data: null });
});
