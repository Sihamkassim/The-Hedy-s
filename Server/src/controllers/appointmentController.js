const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new appointment
exports.createAppointment = catchAsync(async (req, res) => {
  const { therapistId, date, time } = req.body;
  const userId = req.user.id;

  // Check if therapist exists
  const therapist = await prisma.therapist.findUnique({
    where: { id: therapistId }
  });

  if (!therapist) {
    return res.status(404).json({
      status: 'error',
      message: 'Therapist not found'
    });
  }

  // Create appointment
  const appointment = await prisma.appointment.create({
    data: {
      userId,
      therapistId,
      date: new Date(date),
      time,
      status: 'pending'
    },
    include: {
      therapist: {
        select: {
          name: true,
          specialization: true,
          email: true
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  res.status(201).json({
    status: 'success',
    data: { appointment }
  });
});

// Get all appointments for logged-in user
exports.getMyAppointments = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const appointments = await prisma.appointment.findMany({
    where: { userId },
    include: {
      therapist: {
        select: {
          name: true,
          specialization: true,
          email: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: { appointments }
  });
});

// Get single appointment
exports.getAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      userId
    },
    include: {
      therapist: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { appointment }
  });
});

// Update appointment status
exports.updateAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid status'
    });
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status },
    include: {
      therapist: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  res.status(200).json({
    status: 'success',
    data: { appointment }
  });
});

// Get doctor's own schedule (matches by email between User and Therapist)
exports.getMySchedule = catchAsync(async (req, res) => {
  const doctorEmail = req.user.email;

  // Find the therapist record linked to this doctor account by email
  const therapist = await prisma.therapist.findUnique({
    where: { email: doctorEmail },
  });

  if (!therapist) {
    return res.status(404).json({
      status: 'error',
      message: 'No therapist profile linked to this doctor account. Ask admin to create a therapist profile with your email.',
    });
  }

  const appointments = await prisma.appointment.findMany({
    where: { therapistId: therapist.id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      therapist: {
        select: { id: true, name: true, specialization: true },
      },
    },
    orderBy: { date: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: { appointments, therapist },
  });
});

// Cancel appointment
exports.cancelAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const appointment = await prisma.appointment.findFirst({
    where: {
      id,
      userId
    }
  });

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  const updatedAppointment = await prisma.appointment.update({
    where: { id },
    data: { status: 'cancelled' }
  });

  res.status(200).json({
    status: 'success',
    data: { appointment: updatedAppointment }
  });
});

// Get all appointments (admin/therapist)
exports.getAllAppointments = catchAsync(async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    include: {
      therapist: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: appointments.length,
    data: { appointments }
  });
});
