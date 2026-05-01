'use client';

import Link from 'next/link';
import { Play, Shield, Navigation, Beaker, Brain, AlignJustify, Target } from 'lucide-react';

export default function GamesIndexPage() {
  const games = [
    {
      id: 'space-defender',
      title: 'Space Defender',
      subject: 'Mathematics',
      description: 'Defend your spaceship from asteroids by solving math problems!',
      color: 'bg-blue-500',
      icon: <Shield className="w-8 h-8 text-white" />
    },
    {
      id: 'knowledge-runner',
      title: 'Knowledge Runner',
      subject: 'English',
      description: 'Run, jump, and answer English questions to survive!',
      color: 'bg-orange-500',
      icon: <Navigation className="w-8 h-8 text-white" />
    },
    {
      id: 'bubble-blaster',
      title: 'Bubble Blaster',
      subject: 'Science',
      description: 'Match colors and answer science questions to clear the board!',
      color: 'bg-green-500',
      icon: <Beaker className="w-8 h-8 text-white" />
    },
    {
      id: 'memory-matrix',
      title: 'Memory Matrix',
      subject: 'History',
      description: 'Flip cards to match historical figures. Mistakes trigger history questions!',
      color: 'bg-purple-500',
      icon: <Brain className="w-8 h-8 text-white" />
    },
    {
      id: 'word-tower',
      title: 'Word Tower',
      subject: 'English',
      description: 'Stack blocks to build a tower. Answer questions to stabilize it!',
      color: 'bg-indigo-500',
      icon: <AlignJustify className="w-8 h-8 text-white" />
    },
    {
      id: 'math-siege',
      title: 'Math Siege',
      subject: 'Mathematics',
      description: 'Defend your castle from incoming numbers by solving equations!',
      color: 'bg-rose-500',
      icon: <Target className="w-8 h-8 text-white" />
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Game Library</h1>
          <p className="text-gray-500 mt-1 text-lg">Choose a game to play and learn!</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="group block">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden h-full flex flex-col">
              <div className={`absolute top-0 right-0 w-32 h-32 ${game.color} rounded-full opacity-10 -mr-10 -mt-10 group-hover:scale-110 transition-transform`}></div>
              
              <div className={`w-16 h-16 rounded-2xl ${game.color} flex items-center justify-center mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform`}>
                {game.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${game.color} w-max`}>
                {game.subject}
              </span>
              
              <p className="text-gray-500 flex-grow mb-6">
                {game.description}
              </p>
              
              <div className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-50 group-hover:bg-gray-100 text-gray-700 font-bold py-3 rounded-xl transition-colors">
                <Play className="w-4 h-4 fill-current" /> Play Now
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
