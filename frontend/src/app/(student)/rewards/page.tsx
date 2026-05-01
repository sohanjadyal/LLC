'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Award, Star, Trophy, Target, Zap, Crown, Medal } from 'lucide-react';

export default function RewardsPage() {
  const { user } = useAuthStore();

  const achievements = [
    {
      id: 1,
      title: 'First Login',
      description: 'Welcome to LearnPlay!',
      icon: <Target className="w-8 h-8 text-white" />,
      color: 'bg-emerald-500',
      earned: true,
      date: 'Today',
    },
    {
      id: 2,
      title: 'Math Whiz',
      description: 'Answer 10 math questions correctly in Space Defender.',
      icon: <Zap className="w-8 h-8 text-white" />,
      color: 'bg-blue-500',
      earned: true,
      date: 'Today',
    },
    {
      id: 3,
      title: 'Science Explorer',
      description: 'Clear level 5 in Bubble Blaster.',
      icon: <Star className="w-8 h-8 text-white" />,
      color: 'bg-purple-500',
      earned: false,
    },
    {
      id: 4,
      title: 'Wordsmith',
      description: 'Build a tower 20 blocks high in Word Tower.',
      icon: <Medal className="w-8 h-8 text-white" />,
      color: 'bg-orange-500',
      earned: false,
    },
    {
      id: 5,
      title: 'History Buff',
      description: 'Find all matches in Memory Matrix without a mistake.',
      icon: <Crown className="w-8 h-8 text-white" />,
      color: 'bg-yellow-500',
      earned: false,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">My Rewards</h1>
          <p className="text-gray-500 mt-1 text-lg">Track your achievements and points!</p>
        </div>
        <div className="flex items-center gap-3 bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-200 shadow-sm">
          <Trophy className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-xs text-yellow-600 font-bold uppercase">Total Points</p>
            <p className="text-2xl font-extrabold text-yellow-700">1,250</p>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="text-blue-500 w-6 h-6" /> 
          Badges & Achievements
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all ${
                achievement.earned 
                  ? 'border-transparent shadow-md hover:shadow-lg bg-gray-50' 
                  : 'border-dashed border-gray-200 bg-white opacity-60 grayscale hover:grayscale-0 hover:opacity-100 cursor-not-allowed'
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${achievement.color} rounded-full opacity-10 -mr-8 -mt-8`}></div>
              
              <div className={`w-16 h-16 rounded-2xl ${achievement.color} flex items-center justify-center mb-4 shadow-sm`}>
                {achievement.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{achievement.description}</p>
              
              {achievement.earned ? (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Earned {achievement.date}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                  Locked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
