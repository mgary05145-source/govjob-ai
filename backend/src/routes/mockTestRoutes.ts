import { Router } from 'express';
import { getTests, getTestById, submitTest, getResults } from '../controllers/mockTestController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getTests);
router.get('/:id', getTestById);
router.post('/:id/submit', authenticateToken, submitTest);
router.get('/results/:resultId', authenticateToken, getResults);

export default router;
