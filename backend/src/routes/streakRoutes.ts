import { Router } from 'express';
import { getStreak, updateStreak } from '../controllers/streakController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getStreak);
router.post('/update', authenticateToken, updateStreak);

export default router;
