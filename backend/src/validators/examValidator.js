import { z } from 'zod';

export const createExamSchema = z.object({
  title: z.string().min(3, 'Exam title must be at least 3 characters long'),
  description: z.string().optional(),
  streamId: z.string().min(1, 'Stream ID is required'),
  subjectId: z.string().min(1, 'Subject ID is required'),
  topicName: z.string().optional(),
  numberOfQuestions: z.coerce.number().min(1).max(100).default(20),
  durationMinutes: z.coerce.number().min(5).max(300).default(45),
  totalMarks: z.coerce.number().min(1).default(50),
  passMarks: z.coerce.number().min(1).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  questionType: z.enum(['MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'PROGRAMMING', 'MIXED']).default('MIXED'),
  negativeMarking: z.coerce.boolean().default(false),
  negativeMarks: z.coerce.number().min(0).max(10).default(0),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  maxAttempts: z.coerce.number().min(1).max(10).default(1),
  shuffleQuestions: z.coerce.boolean().default(true),
  shuffleOptions: z.coerce.boolean().default(true),
  questionIds: z.array(z.string()).optional()
});

export const updateExamSchema = createExamSchema.partial().extend({
  status: z.enum(['DRAFT', 'APPROVED', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional()
});

export const saveAnswersSchema = z.object({
  answers: z.record(z.any()), // { [questionId]: optionId | [optionIds] | codeText }
  markedForReview: z.record(z.boolean()).optional()
});

