import { Router } from 'express';
import { getCurrentAffairs, getCurrentAffairById } from '../controllers/currentAffairsController';

const router = Router();

router.get('/', getCurrentAffairs);
router.get('/:id', getCurrentAffairById);

export default router;
