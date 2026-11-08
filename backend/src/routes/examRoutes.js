import { Router } from 'express';
import { examController } from '../controllers/examController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { saveAnswersSchema } from '../validators/examValidator.js';

const router = Router();

router.use(authenticate);

// Exam discovery & details
router.get('/', examController.getAllExams);
router.post('/', examController.createExam);
router.get('/:id', examController.getExamById);
router.put('/:id', examController.updateExam);
router.post('/:id/publish', examController.publishExam);
router.delete('/:id', examController.deleteExam);

// Exam taking lifecycle
router.post('/:id/start', examController.startExam);
router.get('/attempts/:attemptId', examController.getAttempt);
router.put('/attempts/:attemptId/answers', validate(saveAnswersSchema), examController.saveAnswers);
router.post('/attempts/:attemptId/submit', examController.submitExam);

export default router;
