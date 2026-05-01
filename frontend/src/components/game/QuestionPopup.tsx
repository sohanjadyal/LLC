'use client';

import { useState, useEffect, useMemo } from 'react';
import { QuestionContext } from '@/games/engine/GameEngine';
import { Clock } from 'lucide-react';

interface QuestionPopupProps {
  context: QuestionContext | null;
  onResolve: () => void; // Tell parent to unmount popup and resume engine
}

// Keep track of used questions globally across games so they don't repeat
const usedQuestionIds = new Set<number>();

export default function QuestionPopup({ context, onResolve }: QuestionPopupProps) {
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  
  // Pick a random, non-repeating question from the pool
  const question = useMemo(() => {
    if (!context || !context.questionPool || context.questionPool.length === 0) return null;
    
    let available = context.questionPool.filter(q => !usedQuestionIds.has(q.id));
    if (available.length === 0) {
      // If all questions have been used, reset the pool
      context.questionPool.forEach(q => usedQuestionIds.delete(q.id));
      available = context.questionPool;
    }
    
    const randomIndex = Math.floor(Math.random() * available.length);
    const selected = available[randomIndex];
    usedQuestionIds.add(selected.id);
    return selected;
  }, [context]);

  useEffect(() => {
    if (!context || feedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(null); // Timeout = wrong
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [context, feedback]);

  if (!context || !question) return null;

  const handleAnswer = (answer: string | null) => {
    if (feedback) return; // Prevent multiple clicks
    
    // Simplistic check for MCQ / Fill Blank
    const isCorrect = answer !== null && 
      answer.toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();

    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Show feedback for 2 seconds, then resolve
    setTimeout(() => {
      if (isCorrect) {
        context.onCorrect();
      } else {
        context.onWrong();
      }
      setFeedback(null);
      setTimeLeft(15);
      setSelectedAnswer('');
      onResolve();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 transform scale-100 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold">
            <span className="uppercase text-xs tracking-wider">Reason:</span>
            <span className="capitalize">{context.reason}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${timeLeft <= 5 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
            <Clock className="w-5 h-5" />
            <span className="text-xl">{timeLeft}s</span>
          </div>
        </div>

        {/* Question Prompt */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center leading-snug">
          {question.prompt}
        </h2>

        {/* Types */}
        {question.type === 'mcq' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((opt: string) => (
              <button
                key={opt}
                disabled={feedback !== null}
                onClick={() => {
                  setSelectedAnswer(opt);
                  handleAnswer(opt);
                }}
                className={`p-4 rounded-2xl text-lg font-bold border-2 transition-all
                  ${selectedAnswer === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50'}
                  ${feedback !== null ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {question.type === 'fill-blank' && (
          <div className="flex flex-col items-center gap-4">
            <input 
              type="text"
              autoFocus
              disabled={feedback !== null}
              className="text-center text-2xl font-bold p-4 border-b-4 border-gray-300 focus:border-blue-500 outline-none w-full max-w-sm transition-colors text-slate-900 bg-transparent placeholder:text-gray-300"
              placeholder="Type your answer..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnswer((e.target as HTMLInputElement).value);
              }}
            />
            <p className="text-sm text-gray-400">Press Enter to submit</p>
          </div>
        )}

        {/* Feedback Overlay inside popup */}
        {feedback && (
          <div className={`mt-8 p-6 rounded-2xl ${feedback === 'correct' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'} border-2 flex flex-col items-center animate-in slide-in-from-bottom-4`}>
            <h3 className="text-2xl font-extrabold mb-2">
              {feedback === 'correct' ? '🎉 Correct!' : '❌ Incorrect!'}
            </h3>
            {feedback === 'wrong' && (
              <p className="text-lg mb-4">The correct answer was: <span className="font-bold">{question.correctAnswer}</span></p>
            )}
            <p className="text-center font-medium bg-white/50 p-4 rounded-xl w-full">
              <span className="font-bold block mb-1">
                {feedback === 'correct' ? '🎓 Fun Fact:' : '💡 Hint:'}
              </span>
              {question.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
