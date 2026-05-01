import { GameSession, IGameSession } from '../models/GameSession';
import { Reward } from '../models/Reward';
import { User } from '../models/User';

import { RewardType } from '../models/Reward';

export const calculateRewards = async (session: IGameSession) => {
  const studentId = session.studentId;
  const newRewards: Array<{ type: RewardType, value: string | number, gameId?: string }> = [];

  // +50 points for completing a game
  if (session.endedAt) {
    newRewards.push({ type: 'points', value: 50, gameId: session.gameId });
  }

  // +100 points + "Perfect" badge for 100% correct answers (min 5 questions)
  if (session.questionsAttempted >= 5 && session.correctAnswers === session.questionsAttempted) {
    newRewards.push({ type: 'points', value: 100, gameId: session.gameId });
    newRewards.push({ type: 'badge', value: 'Perfect', gameId: session.gameId });
  }

  // Note: 3 sessions in a day logic or weekly streak would require querying past sessions.
  // For simplicity, we implement the core rewards here.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const sessionsToday = await GameSession.countDocuments({
    studentId,
    startedAt: { $gte: todayStart }
  });

  if (sessionsToday === 3) {
    newRewards.push({ type: 'points', value: 25, gameId: session.gameId });
    newRewards.push({ type: 'badge', value: 'On a Roll', gameId: session.gameId });
  }

  // Save rewards and update user
  let totalPointsEarned = 0;
  const badgesEarned: string[] = [];

  for (const reward of newRewards) {
    await Reward.create({ studentId, ...reward });
    if (reward.type === 'points') totalPointsEarned += (reward.value as number);
    if (reward.type === 'badge') badgesEarned.push(reward.value as string);
  }

  await User.findByIdAndUpdate(studentId, {
    $inc: { totalPoints: totalPointsEarned },
    $addToSet: { badgesEarned: { $each: badgesEarned } }
  });

  return newRewards;
};
