import express from 'express';
import { Reward } from '../models/Reward';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// @route   GET /api/v1/rewards/:studentId
// @desc    Get all rewards for a student
router.get('/:studentId', protect, async (req, res, next) => {
  try {
    // Ensure student can only view their own rewards unless they are a teacher/admin
    const userRole = (req as any).user.role;
    const userId = (req as any).user.id;
    
    if (userRole === 'student' && userId !== req.params.studentId) {
      return res.status(403).json({ success: false, data: null, error: 'Unauthorized' });
    }

    const rewards = await Reward.find({ studentId: req.params.studentId }).sort({ earnedAt: -1 });
    
    res.status(200).json({ success: true, data: rewards, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/rewards
// @desc    Internal only (Usually called by game session end, but available for admin overrides)
router.post('/', protect, async (req, res, next) => {
  try {
    const userRole = (req as any).user.role;
    // Only allow manual reward creation by admins
    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, data: null, error: 'Unauthorized' });
    }

    const reward = await Reward.create(req.body);
    
    res.status(201).json({ success: true, data: reward, error: null });
  } catch (error) {
    next(error);
  }
});

export default router;
