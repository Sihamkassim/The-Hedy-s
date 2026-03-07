const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'therapist', 'patient', 'doctor', 'admin']).optional(),
    specialization: z.string().min(2, 'Specialization is required').optional(),
    speciality: z.string().min(2, 'Speciality is required').optional(),
    degree: z.string().min(2, 'Degree is required').optional(),
    certificate: z.string().min(2, 'Certificate is required').optional(),
    experience: z.union([z.number(), z.string()]).optional(),
    sessionPrice: z.union([z.number(), z.string()]).optional(),
    bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

module.exports = { registerSchema, loginSchema };
