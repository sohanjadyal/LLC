import mongoose, { Document, Schema } from 'mongoose';
import { Subject } from './Question';

export interface IGameSession extends Document {
  studentId: mongoose.Types.ObjectId;
  gameId: string;
  subject: Subject;
  grade: number; // 1-5
  startedAt: Date;
  endedAt?: Date;
  score: number;
  livesLost: number;
  questionsAttempted: number;
  correctAnswers: number;
  levelReached: number;
}

const GameSessionSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gameId: { type: String, required: true },
  subject: { type: String, enum: ['math', 'english', 'science', 'history'], required: true },
  grade: { type: Number, min: 1, max: 5, required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  score: { type: Number, default: 0 },
  livesLost: { type: Number, default: 0 },
  questionsAttempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  levelReached: { type: Number, default: 1 }
});

export const GameSession = mongoose.model<IGameSession>('GameSession', GameSessionSchema);
