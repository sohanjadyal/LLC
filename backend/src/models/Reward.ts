import mongoose, { Document, Schema } from 'mongoose';

export type RewardType = 'badge' | 'star' | 'points';

export interface IReward extends Document {
  studentId: mongoose.Types.ObjectId;
  type: RewardType;
  value: string | number; // String for badge name ('Perfect', 'Streak Master'), Number for points
  earnedAt: Date;
  gameId?: string; // Optional if earned outside a game (e.g. daily streak)
}

const RewardSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['badge', 'star', 'points'], required: true },
  value: { type: Schema.Types.Mixed, required: true },
  earnedAt: { type: Date, default: Date.now },
  gameId: { type: String }
});

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);
