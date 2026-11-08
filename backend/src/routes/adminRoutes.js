import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createExamSchema, updateExamSchema } from '../validators/examValidator.js';
import { generateQuestionsAiSchema } from '../validators/questionValidator.js';

const router = Router();

// Enforce admin authentication across all admin endpoints
router.use(authenticate, requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/exams', adminController.getExams);
router.post('/exams', validate(createExamSchema), adminController.createExam);
router.put('/exams/:id', validate(updateExamSchema), adminController.updateExam);
router.delete('/exams/:id', adminController.deleteExam);
router.post('/exams/:id/generate', validate(generateQuestionsAiSchema), adminController.generateExamQuestions);
router.post('/exams/:id/approve', adminController.approveExamQuestions);
router.post('/exams/:id/publish', adminController.publishExam);
router.get('/students', adminController.getStudents);

export default router;
