import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  institution: z.string().min(1, 'Institution / college name is required'),
  yearOfStudy: z.string().min(1, 'Year of study is required'),
  streamId: z.string().optional(),
  rollNumber: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please provide a valid email address')
});

export const passwordResetConfirmSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  token: z.string().optional()
});

