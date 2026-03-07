const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key-12345', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    specialization,
    speciality,
    degree,
    certificate,
    experience,
    sessionPrice,
    bio,
  } = req.body;

  const requestedRole = String(role || 'user').toLowerCase();
  const normalizedRole = requestedRole === 'therapist'
    ? 'doctor'
    : requestedRole === 'user'
      ? 'patient'
      : requestedRole;

  if (!['patient', 'doctor', 'admin'].includes(normalizedRole)) {
    return res.status(400).json({ message: 'Invalid role selected' });
  }

  if (normalizedRole === 'doctor') {
    const hasDegree = degree || (req.files && req.files.degreeFile);
    const hasCert = certificate || (req.files && req.files.certificateFile);
    if (!hasDegree || !hasCert || !experience || !(specialization || speciality)) {
      return res.status(400).json({
        message: 'Therapist signup requires degree, certificate, experience, and specialization',      
      });
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdData = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: normalizedRole,
      },
    });

    let therapistProfile = null;
    if (normalizedRole === 'doctor') {
      let degreePath = degree;
      let certPath = certificate;

      if (req.files) {
        if (req.files.degreeFile) degreePath = `/uploads/documents/${req.files.degreeFile[0].filename}`;
        if (req.files.certificateFile) certPath = `/uploads/documents/${req.files.certificateFile[0].filename}`;
      }

      therapistProfile = await tx.therapist.create({
        data: {
          name,
          email,
          specialization: specialization || speciality,
          degree: degreePath,
          certificate: certPath,
          experience: Number(experience),
          sessionPrice: Number(sessionPrice || 0),
          isFreeSupport: Number(sessionPrice || 0) === 0,
          profileImage: req.files && req.files.profileImage ? `/uploads/therapists/${req.files.profileImage[0].filename}` : null,
          bio: bio || 'Therapist profile created during registration.',
          availability: {},
        },
      });
    }

    return { newUser, therapistProfile };
  });

  const token = signToken(createdData.newUser.id);
  createdData.newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: createdData.newUser,
      therapistProfile: createdData.therapistProfile,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }

  createSendToken(user, 200, res);
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true }
  });

  let therapistProfile = null;
  if (user.role === 'doctor') {
    therapistProfile = await prisma.therapist.findUnique({
      where: { email: user.email }
    });
  }

  res.status(200).json({ status: 'success', data: { user, therapistProfile } });
});
