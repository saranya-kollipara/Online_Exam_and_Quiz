import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message text cannot be empty'),
  conversationId: z.string().optional(),
  language: z.enum(['en', 'te']).default('en')
});

