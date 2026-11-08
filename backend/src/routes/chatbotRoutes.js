import { Router } from 'express';
import { chatbotController } from '../controllers/chatbotController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { chatMessageSchema } from '../validators/chatValidator.js';

const router = Router();

router.use(authenticate);

router.post('/chat', validate(chatMessageSchema), chatbotController.sendMessage);
router.get('/history', chatbotController.getHistory);

export default router;

