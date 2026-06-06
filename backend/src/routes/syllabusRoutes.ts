import { Router } from 'express';
import { getSyllabus, updateProgress } from '../controllers/syllabusController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/:exam', getSyllabus);
router.post('/progress', authenticateToken, updateProgress);

export default router;
