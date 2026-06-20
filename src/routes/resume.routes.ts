import { Router, Response } from 'express';
import multer from 'multer';
import { protect, AuthRequest } from '../middleware/auth.middleware.js';
import { handleResumeAnalysis } from '../controllers/resume.controller.js';
import User from '../models/User.js';

const router = Router();

// Configure multer for memory storage (no files saved to disk)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Check for standard PDF mimetype or the .pdf extension
    const isPdfMime = file.mimetype === "application/pdf";
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');

    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      // Pass an error if it's neither
      cb(new Error("Only PDFs are allowed"));
    }
  }
});

// POST /api/resume/analyze
router.post('/analyze', protect, upload.single('resume'), handleResumeAnalysis);
router.get('/history', protect, async (req: AuthRequest, res: Response): Promise<any> => {
  try{
    const user = await User.findById(req.user?.id).select('resumes');
    res.json(user?.resumes || []);
  } catch(error){
    res.status(500).json({error: 'Failed to fetch history'});
  }
});

export default router;