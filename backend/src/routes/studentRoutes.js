import { Router } from 'express';
import { studentController } from '../controllers/studentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireStudent } from '../middleware/roleMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/dashboard', studentController.getDashboard);
router.get('/exams', studentController.getExams);
router.get('/results', studentController.getResults);
router.get('/performance', studentController.getPerformance);

export default router;

