const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const mpesaService = require('../services/mpesaService');
const prisma = new PrismaClient();

// Initiate payment for an appointment
exports.initiatePayment = catchAsync(async (req, res) => {
  const { appointmentId, phoneNumber } = req.body;
  const userId = req.user.id;

  // Validate appointment
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      userId
    },
    include: {
      therapist: true,
      spiritualLeader: true
    }
  });

  if (!appointment) {
    return res.status(404).json({
      status: 'error',
      message: 'Appointment not found'
    });
  }

  // Check if already paid
  if (appointment.status === 'paid' || appointment.status === 'confirmed' || appointment.status === 'completed') {
    return res.status(400).json({
      status: 'error',
      message: 'Appointment is already paid'
    });
  }

  // Get session price
  const provider = appointment.therapist || appointment.spiritualLeader;
  const sessionPrice = provider.sessionPrice || 0;

  if (sessionPrice === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'This is a free session, no payment required'
    });
  }

  // Check if transaction already exists for this appointment
  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      appointmentId,
      status: { in: ['pending', 'completed'] }
    }
  });

  if (existingTransaction) {
    if (existingTransaction.status === 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Payment already completed for this appointment'
      });
    }

    // Return existing pending transaction
    return res.status(200).json({
      status: 'success',
      message: 'Payment already initiated',
      data: {
        transactionId: existingTransaction.id,
        checkoutRequestId: existingTransaction.mpesaCheckoutId,
        amount: existingTransaction.amount
      }
    });
  }

  // Initiate M-Pesa STK Push (MOCK)
  const stkResponse = await mpesaService.initiateSTKPush(
    phoneNumber,
    sessionPrice,
    `APT-${appointmentId.substring(0, 8)}`,
    'Payment for therapy session'
  );

  // Create transaction record
  const transaction = await prisma.transaction.create({
    data: {
      appointmentId,
      amount: sessionPrice,
      platformCommissionRate: 20, // 20% commission
      mpesaCheckoutId: stkResponse.checkoutRequestId,
      phoneNumber,
      status: 'pending'
    }
  });

  res.status(200).json({
    status: 'success',
    message: 'Payment initiated successfully. Please check your phone to complete payment.',
    data: {
      transactionId: transaction.id,
      checkoutRequestId: stkResponse.checkoutRequestId,
      amount: sessionPrice,
      customerMessage: stkResponse.customerMessage
    }
  });
});

// Simulate payment completion (MOCK - for development)
exports.simulatePayment = catchAsync(async (req, res) => {
  const { checkoutRequestId } = req.body;

  if (!checkoutRequestId) {
    return res.status(400).json({
      status: 'error',
      message: 'checkoutRequestId is required'
    });
  }

  // Simulate successful payment
  const result = await mpesaService.simulatePaymentSuccess(checkoutRequestId);

  res.status(200).json({
    status: 'success',
    message: 'Payment simulated successfully',
    data: result
  });
});

// M-Pesa callback handler (for real implementation)
exports.mpesaCallback = catchAsync(async (req, res) => {
  console.log('M-Pesa Callback received:', JSON.stringify(req.body, null, 2));

  const result = await mpesaService.processCallback(req.body);

  // Always return 200 to M-Pesa
  res.status(200).json({
    ResultCode: 0,
    ResultDesc: 'Success'
  });
});

// Get transaction status
exports.getTransactionStatus = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  const userId = req.user.id;

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      appointment: {
        userId
      }
    },
    include: {
      appointment: {
        include: {
          therapist: {
            select: {
              name: true,
              specialization: true
            }
          },
          spiritualLeader: {
            select: {
              name: true,
              specialization: true,
              religion: true
            }
          }
        }
      }
    }
  });

  if (!transaction) {
    return res.status(404).json({
      status: 'error',
      message: 'Transaction not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { transaction }
  });
});

// Get all transactions for user
exports.getMyTransactions = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const transactions = await prisma.transaction.findMany({
    where: {
      appointment: {
        userId
      }
    },
    include: {
      appointment: {
        include: {
          therapist: {
            select: {
              name: true,
              specialization: true
            }
          },
          spiritualLeader: {
            select: {
              name: true,
              specialization: true,
              religion: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: { transactions }
  });
});

// Get therapist earnings (for therapist dashboard)
exports.getMyEarnings = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const userRole = req.user.role;

  let providerId;
  let providerModel;

  if (userRole === 'doctor') {
    const therapist = await prisma.therapist.findUnique({
      where: { email: userEmail }
    });
    if (!therapist) {
      return res.status(404).json({
        status: 'error',
        message: 'Therapist profile not found'
      });
    }
    providerId = therapist.id;
    providerModel = 'therapist';
  } else if (userRole === 'spiritual_leader') {
    const spiritualLeader = await prisma.spiritualLeader.findUnique({
      where: { email: userEmail }
    });
    if (!spiritualLeader) {
      return res.status(404).json({
        status: 'error',
        message: 'Spiritual leader profile not found'
      });
    }
    providerId = spiritualLeader.id;
    providerModel = 'spiritualLeader';
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Only therapists and spiritual leaders can view earnings'
    });
  }

  // Get all completed transactions for this provider
  const whereClause = providerModel === 'therapist'
    ? { appointment: { therapistId: providerId } }
    : { appointment: { spiritualId: providerId } };

  const transactions = await prisma.transaction.findMany({
    where: {
      ...whereClause,
      status: 'completed'
    },
    include: {
      appointment: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Calculate totals
  const totalEarnings = transactions.reduce((sum, t) => sum + (t.therapistAmount || 0), 0);
  const platformCommission = transactions.reduce((sum, t) => sum + (t.platformCommission || 0), 0);
  const totalSessions = transactions.length;
  const paidOut = transactions.filter(t => t.paidToTherapist).reduce((sum, t) => sum + (t.therapistAmount || 0), 0);
  const pending = totalEarnings - paidOut;

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalEarnings,
        platformCommission,
        totalSessions,
        paidOut,
        pending
      },
      transactions
    }
  });
});

module.exports = exports;
