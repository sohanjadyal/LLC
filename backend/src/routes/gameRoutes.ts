import express from 'express';
import { GameSession } from '../models/GameSession';
import { protect } from '../middlewares/authMiddleware';
import { calculateRewards } from '../services/rewardService';

const router = express.Router();

// @route   POST /api/v1/games/session/start
router.post('/session/start', protect, async (req, res, next) => {
  try {
    const { gameId, subject, grade } = req.body;
    const studentId = (req as any).user.id;

    const session = await GameSession.create({
      studentId,
      gameId,
      subject,
      grade,
      startedAt: new Date()
    });

    res.status(201).json({ success: true, data: { sessionId: session._id }, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/games/session/:id/question-result
router.post('/session/:id/question-result', protect, async (req, res, next) => {
  try {
    const { isCorrect } = req.body;
    
    const updateQuery: any = {
      $inc: { questionsAttempted: 1 }
    };
    
    if (isCorrect) {
      updateQuery.$inc.correctAnswers = 1;
      updateQuery.$inc.score = 10; // example score increment
    } else {
      updateQuery.$inc.livesLost = 1;
    }

    const session = await GameSession.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
    
    if (!session) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }

    res.status(200).json({ success: true, data: session, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/games/session/:id/end
router.post('/session/:id/end', protect, async (req, res, next) => {
  try {
    const { score, livesLost, levelReached } = req.body;
    
    const session = await GameSession.findByIdAndUpdate(req.params.id, {
      endedAt: new Date(),
      score,
      livesLost,
      levelReached
    }, { new: true });

    if (!session) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }

    const rewards = await calculateRewards(session);

    res.status(200).json({ success: true, data: { session, rewards }, error: null });
  } catch (error) {
    next(error);
  }
});

export default router;
