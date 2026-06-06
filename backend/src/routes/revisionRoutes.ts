import { Router } from 'express';
import { generateRevisionPlan, getRevisionPlans } from '../controllers/revisionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate', authenticateToken, generateRevisionPlan);
router.get('/', authenticateToken, getRevisionPlans);

export default router;
