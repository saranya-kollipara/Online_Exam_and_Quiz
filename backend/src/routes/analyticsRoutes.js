import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin, requireStudent } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', requireAdmin, analyticsController.getAdminAnalytics);
router.get('/student', requireStudent, analyticsController.getStudentAnalytics);
router.get('/ai-analysis/:resultId', analyticsController.getResultAnalysis);

export default router;

