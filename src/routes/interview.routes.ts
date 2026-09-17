import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { chatWithAI, generateReport, deleteSession } from '../controllers/interview.controller.js';

const router = Router();

router.post('/chat', protect, chatWithAI);

router.post('/report', protect, generateReport);

router.delete('/:id', protect, deleteSession);

export default router;