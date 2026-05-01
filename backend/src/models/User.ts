import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  grade?: number; // 1-5, students only
  totalPoints?: number; // Students only
  badgesEarned?: string[]; // Students only
  weeklyStreak?: number; // Students only
  subjectProgress?: Map<string, number>; // Students only, e.g. { 'math': 50 }
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  grade: { type: Number, min: 1, max: 5 },
  
  // Student specific fields
  totalPoints: { type: Number, default: 0 },
  badgesEarned: [{ type: String }],
  weeklyStreak: { type: Number, default: 0 },
  subjectProgress: { type: Map, of: Number, default: {} },
  
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
