const { z } = require('zod');

const createTherapistSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    specialization: z.string().min(2, 'Specialization is required'),
    experience: z.number().int().min(0, 'Experience must be a positive number'),
    sessionPrice: z.number().min(0, 'Session price must be positive'),
    isFreeSupport: z.boolean().optional(),
    availability: z.array(z.any()).optional(),
    bio: z.string().min(10, 'Bio must be at least 10 characters'),
  }),
});

module.exports = {
  createTherapistSchema,
};
