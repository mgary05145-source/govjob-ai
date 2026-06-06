import { Router } from 'express';
import { getAchievements, getLeaderboard } from '../controllers/gamificationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/achievements', authenticateToken, getAchievements);
router.get('/leaderboard', getLeaderboard);

export default router;
