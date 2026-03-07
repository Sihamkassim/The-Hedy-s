const { z } = require('zod');

const createAppointmentSchema = z.object({
  body: z.object({
    therapistId: z.string().uuid('Invalid therapist ID'),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    time: z.string().min(1, 'Time is required'),
  }),
});

const updateAppointmentSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  }),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
};
