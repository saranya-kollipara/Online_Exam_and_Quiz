import { Router } from 'express';
import { questionController } from '../controllers/questionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { createQuestionSchema, importQuestionsSchema } from '../validators/questionValidator.js';

const router = Router();

router.use(authenticate);

router.get('/', questionController.getQuestions);
router.post('/', requireAdmin, validate(createQuestionSchema), questionController.createQuestion);
router.put('/:id', requireAdmin, questionController.updateQuestion);
router.delete('/:id', requireAdmin, questionController.deleteQuestion);
router.post('/import', requireAdmin, validate(importQuestionsSchema), questionController.importQuestions);

export default router;

