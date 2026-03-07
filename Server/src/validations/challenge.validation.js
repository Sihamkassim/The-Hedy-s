const { z } = require('zod');

const createChallengeSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    duration: z.number().int().min(1, 'Duration must be at least 1 day'),
    isRepetitive: z.boolean().optional(),
    dailyTasks: z.array(z.string()).optional(),
  }),
});

const updateProgressSchema = z.object({
  body: z.object({
    completedDays: z.number().int().min(0, 'Completed days must be positive'),
  }),
});

module.exports = {
  createChallengeSchema,
  updateProgressSchema,
};
