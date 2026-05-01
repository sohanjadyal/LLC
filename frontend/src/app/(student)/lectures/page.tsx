'use client';

import { PlayCircle, BookOpen, Clock, Lock } from 'lucide-react';
import { useState } from 'react';

const LECTURES = [
  {
    subject: 'Mathematics',
    color: 'bg-rose-500',
    chapters: [
      { id: 'm1', title: 'Chapter 1: Numbers & Operations', duration: '15m', locked: false },
      { id: 'm2', title: 'Chapter 2: Fractions Basics', duration: '18m', locked: false },
      { id: 'm3', title: 'Chapter 3: Introduction to Geometry', duration: '22m', locked: true },
    ]
  },
  {
    subject: 'Science',
    color: 'bg-emerald-500',
    chapters: [
      { id: 's1', title: 'Chapter 1: The Solar System', duration: '20m', locked: false },
      { id: 's2', title: 'Chapter 2: States of Matter', duration: '16m', locked: false },
      { id: 's3', title: 'Chapter 3: Plant Life Cycle', duration: '14m', locked: true },
    ]
  },
  {
    subject: 'English',
    color: 'bg-indigo-500',
    chapters: [
      { id: 'e1', title: 'Chapter 1: Nouns and Verbs', duration: '12m', locked: false },
      { id: 'e2', title: 'Chapter 2: Building Sentences', duration: '15m', locked: true },
    ]
  },
  {
    subject: 'History',
    color: 'bg-orange-500',
    chapters: [
      { id: 'h1', title: 'Chapter 1: Ancient Civilizations', duration: '25m', locked: false },
      { id: 'h2', title: 'Chapter 2: The Middle Ages', duration: '20m', locked: true },
    ]
  }
];

export default function LecturesPage() {
  const [activeSubject, setActiveSubject] = useState('Mathematics');

  const currentSubject = LECTURES.find(l => l.subject === activeSubject);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          Video Library
        </h1>
        <p className="text-gray-500 text-lg">Watch interactive lessons to level up your knowledge before playing!</p>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {LECTURES.map((lec) => (
          <button
            key={lec.subject}
            onClick={() => setActiveSubject(lec.subject)}
            className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              activeSubject === lec.subject
                ? `${lec.color} text-white shadow-md transform scale-105`
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {lec.subject}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSubject?.chapters.map((chapter) => (
          <div 
            key={chapter.id} 
            className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all ${
              chapter.locked ? 'opacity-75 grayscale-[50%]' : 'hover:shadow-md hover:-translate-y-1 cursor-pointer'
            }`}
          >
            {/* Video Thumbnail Placeholder */}
            <div className={`h-48 relative flex items-center justify-center ${
              chapter.locked ? 'bg-gray-200' : 'bg-slate-800'
            }`}>
              {chapter.locked ? (
                <Lock className="w-12 h-12 text-gray-400" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
              )}
              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3" /> {chapter.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                {chapter.title}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  chapter.locked ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'
                }`}>
                  {chapter.locked ? 'Locked' : 'Available'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
