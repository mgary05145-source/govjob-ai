import { Router } from 'express';
import { createStudyPlan, getStudyPlans } from '../controllers/studyController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/generate-plan', createStudyPlan);
router.get('/plans', authenticateToken, getStudyPlans);

export default router;
