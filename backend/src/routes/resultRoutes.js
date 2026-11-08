import { Router } from 'express';
import { resultController } from '../controllers/resultController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/:id', resultController.getResultById);
router.get('/exam/:examId', requireAdmin, resultController.getExamResults);

export default router;

