import { Router } from 'express';
import { codingController } from '../controllers/codingController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { executeCodeSchema, submitCodeSchema } from '../validators/codingValidator.js';

const router = Router();

router.use(authenticate);

router.post('/run', validate(executeCodeSchema), codingController.runCode);
router.post('/submit', validate(submitCodeSchema), codingController.submitCode);
router.get('/submissions/:id', codingController.getSubmission);

export default router;

