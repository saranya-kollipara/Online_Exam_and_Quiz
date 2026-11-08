import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboardController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', leaderboardController.getLeaderboard);
router.get('/stream/:streamId', leaderboardController.getStreamLeaderboard);

export default router;

