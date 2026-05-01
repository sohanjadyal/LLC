import express from 'express';
import { GameSession } from '../models/GameSession';
import { User } from '../models/User';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// @route   GET /api/v1/analytics/student/:id
// @desc    Get full performance profile for a student (Teacher/Admin only)
router.get('/student/:id', protect, authorize('teacher', 'admin'), async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id).select('-passwordHash');
    if (!student) {
      return res.status(404).json({ success: false, data: null, error: 'Student not found' });
    }

    const sessions = await GameSession.find({ studentId: req.params.id }).sort({ startedAt: -1 });
    
    // Calculate aggregate stats
    const totalSessions = sessions.length;
    const totalQuestionsAttempted = sessions.reduce((acc, curr) => acc + curr.questionsAttempted, 0);
    const totalCorrectAnswers = sessions.reduce((acc, curr) => acc + curr.correctAnswers, 0);
    const overallAccuracy = totalQuestionsAttempted > 0 ? (totalCorrectAnswers / totalQuestionsAttempted) * 100 : 0;

    res.status(200).json({ 
      success: true, 
      data: { 
        student, 
        stats: { totalSessions, totalQuestionsAttempted, totalCorrectAnswers, overallAccuracy },
        sessions 
      }, 
      error: null 
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/analytics/class
// @desc    Get aggregated class metrics
router.get('/class', protect, authorize('teacher', 'admin'), async (req, res, next) => {
  try {
    const classMetrics = await GameSession.aggregate([
      {
        $group: {
          _id: "$subject",
          averageScore: { $avg: "$score" },
          totalSessions: { $sum: 1 },
          averageQuestionsAttempted: { $avg: "$questionsAttempted" },
          averageCorrectAnswers: { $avg: "$correctAnswers" }
        }
      }
    ]);

    res.status(200).json({ success: true, data: classMetrics, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/analytics/weak-areas
// @desc    Get questions with lowest accuracy
router.get('/weak-areas', protect, authorize('teacher', 'admin'), async (req, res, next) => {
  try {
    // In a real app, you'd aggregate question attempts. 
    // Since GameSession currently just stores correctAnswers and questionsAttempted (numbers),
    // detailed weak areas per specific question would require a new Collection `QuestionAttempt`.
    // Returning mock data to show the intended response format.
    const mockWeakAreas = [
      { subject: 'math', concept: 'multiplication', accuracy: 42, attempts: 150 },
      { subject: 'english', concept: 'synonyms', accuracy: 48, attempts: 120 }
    ];

    res.status(200).json({ success: true, data: mockWeakAreas, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/v1/analytics/reports/export
// @desc    Export CSV/PDF report
router.get('/reports/export', protect, authorize('teacher', 'admin'), async (req, res, next) => {
  try {
    const { format } = req.query;
    
    // Placeholder for CSV/PDF generation logic
    if (format === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.send('PDF data...');
    } else {
      res.setHeader('Content-Type', 'text/csv');
      res.send('studentId,score,date\n1,100,2024-01-01');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
