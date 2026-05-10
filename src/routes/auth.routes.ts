import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js'
import User from '../models/User.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// 💡 ADD THIS: The route to get user data for the Dashboard
router.get('/profile', protect, async (req: any, res) => {
  try {
    // req.user.id comes from the middleware we just wrote
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;

