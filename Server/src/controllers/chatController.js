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
      where: { therapistId: therapist.id },
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

  const contacts = await prisma.user.findMany({
    where: {
      role: 'doctor',
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
