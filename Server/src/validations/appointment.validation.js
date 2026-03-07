const { z } = require('zod');

const createAppointmentSchema = z.object({
  body: z.object({
    therapistId: z.string().uuid('Invalid therapist ID').optional(),
    spiritualId: z.string().uuid('Invalid spiritual leader ID').optional(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    time: z.string().min(1, 'Time is required'),
  }).refine((body) => body.therapistId || body.spiritualId, {
    message: 'Either therapistId or spiritualId is required',
    path: ['therapistId'],
  }),
});

const updateAppointmentSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'paid', 'confirmed', 'completed', 'cancelled']),
  }),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
};
