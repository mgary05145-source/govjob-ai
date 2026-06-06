import { Router } from 'express';
import { askMentor, recommendCareer, detectWeakness } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/ask', askMentor);
router.post('/recommendations', recommendCareer);
router.post('/weakness-detection', authenticateToken, detectWeakness);

export default router;
