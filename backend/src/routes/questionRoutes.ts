import express from 'express';
import { Question } from '../models/Question';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// @route   GET /api/v1/questions
// @desc    Get questions based on query params
router.get('/', protect, async (req, res, next) => {
  try {
    const { subject, grade, difficulty, type, limit } = req.query;
    const query: any = {};

    if (subject) query.subject = subject;
    if (grade) query.grade = Number(grade);
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;

    let mongoQuery = Question.find(query);
    if (limit) {
      mongoQuery = mongoQuery.limit(Number(limit));
    }

    const questions = await mongoQuery;

    res.status(200).json({ success: true, data: questions, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/v1/questions
// @desc    Create a new question (Admin only)
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/v1/questions/:id
// @desc    Update a question (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!question) {
      return res.status(404).json({ success: false, data: null, error: 'Question not found' });
    }

    res.status(200).json({ success: true, data: question, error: null });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/v1/questions/:id
// @desc    Soft delete a question (Admin only) - Implementation details might vary
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Note: For soft delete, you'd typically add an isDeleted flag to the schema.
    // For now, we will physically delete it or just return a mock success if schema doesn't have isDeleted.
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({ success: false, data: null, error: 'Question not found' });
    }

    res.status(200).json({ success: true, data: {}, error: null });
  } catch (error) {
    next(error);
  }
});

export default router;
