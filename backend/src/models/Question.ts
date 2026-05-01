import mongoose, { Document, Schema } from 'mongoose';

export type Subject = 'math' | 'english' | 'science' | 'history';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'fill-blank' | 'drag-drop' | 'image';

export interface IQuestion extends Document {
  subject: Subject;
  grade: number; // 1-5
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  options?: string[]; // for mcq and drag-drop
  correctAnswer: string | string[]; // Array for drag-drop multiple answers
  hint: string;
  tags: string[];
}

const QuestionSchema: Schema = new Schema({
  subject: { type: String, enum: ['math', 'english', 'science', 'history'], required: true },
  grade: { type: Number, min: 1, max: 5, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  type: { type: String, enum: ['mcq', 'fill-blank', 'drag-drop', 'image'], required: true },
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  hint: { type: String, required: true },
  tags: [{ type: String }]
});

// Index for efficient querying by subject, grade, and difficulty
QuestionSchema.index({ subject: 1, grade: 1, difficulty: 1 });

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
