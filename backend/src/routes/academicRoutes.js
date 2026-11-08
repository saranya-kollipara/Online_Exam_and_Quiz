import { Router } from 'express';
import { academicController } from '../controllers/academicController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = Router();

router.get('/streams', academicController.getStreams);
router.post('/streams', authenticate, requireAdmin, academicController.createStream);

router.get('/subjects', academicController.getSubjects);
router.post('/subjects', authenticate, requireAdmin, academicController.createSubject);

router.get('/topics', academicController.getTopics);

export default router;

