import { Router } from 'express';
import { getCompanyPrepData } from '../controllers/company.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Or whatever your authentication middleware export name is

const router = Router();

router.post('/prep', protect, getCompanyPrepData);

export default router;