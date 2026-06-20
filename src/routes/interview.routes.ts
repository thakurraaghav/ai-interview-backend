import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { chatWithAI, generateReport, deleteSession } from '../controllers/interview.controller.js';

const router = Router();

router.post('/chat', chatWithAI);

router.post('/report', protect, generateReport);

/**
 * @route   DELETE /api/interview/:id
 * @desc    Remove a specific interview session
 */
router.delete('/:id', protect, deleteSession);

export default router;