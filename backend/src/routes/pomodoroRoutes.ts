import { Router } from 'express';
import { logSession, getSessions } from '../controllers/pomodoroController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/session', authenticateToken, logSession);
router.get('/sessions', authenticateToken, getSessions);

export default router;
