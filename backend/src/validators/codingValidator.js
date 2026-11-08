import { z } from 'zod';

export const executeCodeSchema = z.object({
  problemId: z.string().optional(),
  language: z.enum(['c', 'cpp', 'java', 'python', 'javascript']),
  sourceCode: z.string().min(1, 'Source code cannot be empty'),
  customInput: z.string().optional()
});

export const submitCodeSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  language: z.enum(['c', 'cpp', 'java', 'python', 'javascript']),
  sourceCode: z.string().min(1, 'Source code cannot be empty')
});

