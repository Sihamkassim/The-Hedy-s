const { PrismaClient } = require('@prisma/client');
const catchAsync = require('../utils/catchAsync');

const prisma = new PrismaClient();

exports.getChatContacts = catchAsync(async (req, res) => {
  if (req.user.role === 'doctor') {
    const therapist = await prisma.therapist.findUnique({
      where: { email: req.user.email },
      select: { id: true },
    });

    if (!therapist) {
      return res.status(200).json({
        status: 'success',
        data: { contacts: [] },
      });
    }

    const appointments = await prisma.appointment.findMany({
      where: { 
        therapistId: therapist.id,
        status: { in: ['confirmed', 'completed'] } // Show patients with confirmed or completed appointments
      },
      select: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const deduped = new Map();
    appointments.forEach((appointment) => {
      if (appointment.user?.id && !deduped.has(appointment.user.id)) {
        deduped.set(appointment.user.id, appointment.user);
      }
    });

    return res.status(200).json({
      status: 'success',
      data: { contacts: Array.from(deduped.values()) },
    });
  }

  // Find all confirmed or completed appointments for this patient
  const appointments = await prisma.appointment.findMany({
    where: {
      userId: req.user.id,
      status: { in: ['confirmed', 'completed'] }
    },
    include: {
      therapist: true,
    }
  });

  const therapistEmails = appointments
    .filter(app => app.therapist && app.therapist.email)
    .map(app => app.therapist.email);

  if (therapistEmails.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: { contacts: [] },
    });
  }

  // Find the actual User accounts for these therapists (to get their User ID for chatting)
  const contacts = await prisma.user.findMany({
    where: {
      role: 'doctor',
      email: { in: therapistEmails },
      NOT: { id: req.user.id },
    },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    data: { contacts },
  });
});

exports.getMessagesWithUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  res.status(200).json({
    status: 'success',
    data: { messages },
  });
});

exports.sendMessage = catchAsync(async (req, res) => {
  const { receiverId, message } = req.body;

  if (!receiverId || !message?.trim()) {
    return res.status(400).json({ message: 'receiverId and message are required' });
  }

  const savedMessage = await prisma.message.create({
    data: {
      senderId: req.user.id,
      receiverId,
      message: message.trim(),
    },
  });

  res.status(201).json({
    status: 'success',
    data: { message: savedMessage },
  });
});

exports.createVideoRoom = catchAsync(async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ status: 'error', message: 'receiverId is required' });
  }

  const jitsiDomain = process.env.JITSI_DOMAIN || 'meet.jit.si';

  let appointment = null;

  if (req.user.role === 'doctor') {
    const therapist = await prisma.therapist.findUnique({
      where: { email: req.user.email },
      select: { id: true },
    });

    if (!therapist) {
      return res.status(404).json({ status: 'error', message: 'Therapist profile not found' });
    }

    appointment = await prisma.appointment.findFirst({
      where: {
        therapistId: therapist.id,
        userId: receiverId,
        status: { in: ['confirmed', 'completed'] },
      },
      orderBy: { date: 'desc' },
    });
  } else {
    const receiverUser = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { email: true, role: true },
    });

    if (!receiverUser || receiverUser.role !== 'doctor') {
      return res.status(404).json({ status: 'error', message: 'Doctor account not found' });
    }

    const therapist = await prisma.therapist.findUnique({
      where: { email: receiverUser.email },
      select: { id: true },
    });

    if (!therapist) {
      return res.status(404).json({ status: 'error', message: 'Therapist profile not found' });
    }

    appointment = await prisma.appointment.findFirst({
      where: {
        therapistId: therapist.id,
        userId: req.user.id,
        status: { in: ['confirmed', 'completed'] },
      },
      orderBy: { date: 'desc' },
    });
  }

  if (!appointment) {
    return res.status(403).json({ status: 'error', message: 'No confirmed appointment for this call' });
  }

  const roomName = `repair-consult-${appointment.id}`;
  const roomUrl = `https://${jitsiDomain}/${roomName}`;

  res.status(200).json({
    status: 'success',
    data: { roomUrl, roomName },
  });
});
