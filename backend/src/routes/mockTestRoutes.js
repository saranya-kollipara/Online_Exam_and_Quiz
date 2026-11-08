import { Router } from 'express';
import { mockTestController } from '../controllers/mockTestController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', mockTestController.generateMockTest);
router.get('/:id', mockTestController.getMockTestById);
router.post('/:id/start', mockTestController.startMockTest);
router.post('/:id/submit', mockTestController.submitMockTest);

export default router;

