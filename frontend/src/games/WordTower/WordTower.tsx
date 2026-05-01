'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';

export const GameConfig = {
  id: 'word-tower',
  name: 'Word Tower',
  subject: 'english',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Stack blocks to build a tower. Answer questions to stabilize it!',
  thumbnailColor: 'bg-indigo-500'
};

import { ENGLISH_QUESTIONS } from '@/data/mockQuestions';

const mockQuestions = ENGLISH_QUESTIONS;

export default function WordTowerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [activeQuestion, setActiveQuestion] = useState<QuestionContext | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let blocks: { x: number, y: number, width: number, height: number }[] = [];
    const blockWidth = 100;
    const blockHeight = 40;
    
    // Initial block at bottom
    blocks.push({ x: canvas.width / 2 - blockWidth / 2, y: canvas.height - blockHeight, width: blockWidth, height: blockHeight });

    let currentBlock = { x: 0, y: canvas.height - blockHeight * 2, width: blockWidth, height: blockHeight, speed: 200, direction: 1 };
    
    let isDropping = false;

    const update = (dt: number) => {
      if (!isDropping) {
        // Move back and forth
        currentBlock.x += currentBlock.speed * currentBlock.direction * dt;
        if (currentBlock.x <= 0 || currentBlock.x + currentBlock.width >= canvas.width) {
          currentBlock.direction *= -1;
        }
      } else {
        // Drop block
        currentBlock.y += 500 * dt;
        
        const topBlock = blocks[blocks.length - 1];
        
        if (currentBlock.y + currentBlock.height >= topBlock.y) {
          currentBlock.y = topBlock.y - currentBlock.height;
          isDropping = false;

          // Check overlap
          const overlapLeft = Math.max(currentBlock.x, topBlock.x);
          const overlapRight = Math.min(currentBlock.x + currentBlock.width, topBlock.x + topBlock.width);
          const overlap = overlapRight - overlapLeft;

          if (overlap > 0) {
            // Stack success
            blocks.push({ ...currentBlock });
            engineRef.current?.addScore(10);
            
            // Pan camera down (move all blocks down) if tower gets too high
            if (blocks.length > 5) {
              blocks.forEach(b => b.y += blockHeight);
            }

            // Spawn next
            currentBlock = { 
              x: 0, 
              y: topBlock.y - blockHeight * (blocks.length > 5 ? 1 : 2), 
              width: currentBlock.width, 
              height: blockHeight, 
              speed: currentBlock.speed + 20, 
              direction: 1 
            };

            // Every 5 blocks, trigger a question to "stabilize" the tower
            if (blocks.length % 5 === 0) {
              engineRef.current?.triggerQuestion({
                reason: 'levelup',
                questionPool: mockQuestions,
                onCorrect: () => {
                  engineRef.current?.addScore(50);
                  engineRef.current?.levelUp();
                },
                onWrong: () => {
                  engineRef.current?.loseLife();
                  // Penalize: remove top block
                  blocks.pop();
                }
              });
            }

          } else {
            // Missed!
            engineRef.current?.loseLife();
            
            // Spawn next block at same height
            currentBlock = { 
              x: 0, 
              y: topBlock.y - blockHeight, 
              width: currentBlock.width, 
              height: blockHeight, 
              speed: currentBlock.speed, 
              direction: 1 
            };
          }
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += blockHeight) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw blocks
      blocks.forEach((b, i) => {
        ctx.fillStyle = i === 0 ? '#475569' : '#6366f1'; // Indigo blocks
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y, b.width, b.height);
      });

      // Draw current block
      ctx.fillStyle = '#818cf8';
      ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
      ctx.strokeRect(currentBlock.x, currentBlock.y, currentBlock.width, currentBlock.height);
    };

    const engine = new GameEngine(update, draw, 3);
    engineRef.current = engine;

    engine.on('score:update', (s: number) => setScore(s));
    engine.on('lives:update', (l: number) => setLives(l));
    engine.on('level:complete', (l: number) => setLevel(l));
    engine.on('question:trigger', (ctx: QuestionContext) => setActiveQuestion(ctx));
    engine.on('game:over', () => setGameOver(true));

    engine.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
      if (e.key === ' ' || e.key === 'ArrowDown') {
        if (!isDropping) isDropping = true;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      engine.stop();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      className="relative mx-auto border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-900"
      style={{ aspectRatio: '2/3', maxHeight: '70vh', maxWidth: '100%' }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between text-white font-bold pointer-events-none z-10">
        <div className="flex gap-4">
          <span className="bg-slate-800/80 px-4 py-2 rounded-xl">Score: {score}</span>
          <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-red-400">Lives: {'❤️'.repeat(lives)}</span>
        </div>
        <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-indigo-400">Level: {level}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={600} 
        className="w-full h-full bg-slate-900 block object-contain"
      />

      <QuestionPopup 
        context={activeQuestion} 
        onResolve={() => {
          setActiveQuestion(null);
          engineRef.current?.resume();
        }} 
      />

      {gameOver && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-white z-50">
          <h2 className="text-5xl font-extrabold mb-4 text-red-500">GAME OVER</h2>
          <p className="text-2xl mb-8">Final Score: {score}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-2xl font-bold text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
