import { Router } from 'express';
import { createNote, getNotes, updateNote, deleteNote, getNoteById, generateAiSummary } from '../controllers/notesController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createNote);
router.get('/', authenticateToken, getNotes);
router.get('/:id', authenticateToken, getNoteById);
router.put('/:id', authenticateToken, updateNote);
router.delete('/:id', authenticateToken, deleteNote);
router.post('/:id/ai-summary', authenticateToken, generateAiSummary);

export default router;
