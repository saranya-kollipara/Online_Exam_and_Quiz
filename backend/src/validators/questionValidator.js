import { z } from 'zod';

export const createQuestionSchema = z.object({
  text: z.string().min(5, 'Question text must be at least 5 characters long'),
  type: z.enum(['MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'PROGRAMMING']).default('MCQ'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
  defaultMarks: z.coerce.number().min(0.5).max(100).default(2),
  negativeMarks: z.coerce.number().min(0).max(50).default(0),
  explanation: z.string().optional(),
  streamId: z.string().optional().nullable(),
  subjectId: z.string().optional().nullable(),
  topicId: z.string().optional().nullable(),
  options: z.array(z.object({
    optionKey: z.string(),
    text: z.string().min(1, 'Option text cannot be empty'),
    isCorrect: z.boolean().default(false)
  })).optional(),
  codeProblemDetails: z.object({
    timeLimit: z.string().optional(),
    memoryLimit: z.string().optional(),
    inputFormat: z.string().optional(),
    outputFormat: z.string().optional(),
    constraints: z.array(z.string()).optional(),
    sampleCases: z.array(z.any()).optional(),
    hiddenCases: z.array(z.any()).optional(),
    starterCodes: z.record(z.string()).optional()
  }).optional()
});

export const generateQuestionsAiSchema = z.object({
  streamId: z.string().optional(),
  subjectName: z.string().min(1, 'Subject name is required'),
  topicName: z.string().optional(),
  numberOfQuestions: z.coerce.number().min(1).max(100).default(5),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'MIXED']).default('MEDIUM'),
  questionType: z.enum(['MCQ', 'MULTIPLE_SELECT', 'TRUE_FALSE', 'PROGRAMMING', 'MIXED']).default('MIXED'),
  marksPerQuestion: z.coerce.number().default(2),
  negativeMarks: z.coerce.number().default(0.5)
});

export const importQuestionsSchema = z.object({
  questions: z.array(createQuestionSchema)
});

