import { Router } from 'express';
import { getJobs, getJobById, getCategories, getRecommendedJobs } from '../controllers/jobController';

const router = Router();

router.get('/', getJobs);
router.get('/categories', getCategories);
router.get('/recommend', getRecommendedJobs);
router.get('/:id', getJobById);

export default router;
