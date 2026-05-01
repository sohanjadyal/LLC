'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Flame, Star, Award, Play } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const subjects = [
    { name: 'Mathematics', color: 'bg-blue-500', icon: '🔢', progress: 65, gameId: 'space-defender' },
    { name: 'English', color: 'bg-orange-500', icon: '📚', progress: 40, gameId: 'knowledge-runner' },
    { name: 'Science', color: 'bg-green-500', icon: '🔬', progress: 80, gameId: 'bubble-blaster' },
    { name: 'History', color: 'bg-purple-500', icon: '🏛️', progress: 20, gameId: 'memory-matrix' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Hi, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Ready to learn something new today?</p>
        </div>
        
        {/* Rewards Strip */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
            <Flame className="text-orange-500 w-6 h-6" />
            <div>
              <p className="text-xs text-orange-600 font-bold uppercase">Streak</p>
              <p className="font-extrabold text-orange-700">3 Days</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
            <Star className="text-yellow-500 w-6 h-6" />
            <div>
              <p className="text-xs text-yellow-600 font-bold uppercase">Points</p>
              <p className="font-extrabold text-yellow-700">1,250</p>
            </div>
          </div>
        </div>
      </header>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {subjects.map(subject => (
            <div key={subject.name} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className={`absolute top-0 right-0 w-32 h-32 ${subject.color} rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-110 transition-transform`}></div>
              
              <div className="text-4xl mb-4">{subject.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{subject.name}</h3>
              
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${subject.color} h-2.5 rounded-full`} style={{ width: `${subject.progress}%` }}></div>
                </div>
              </div>

              <Link href={`/games/${subject.gameId}`} className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                <Play className="w-4 h-4 fill-current" /> Play & Learn
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
