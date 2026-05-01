'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';

export const GameConfig = {
  id: 'math-siege',
  name: 'Math Siege',
  subject: 'math',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Defend your castle from incoming numbers by solving equations!',
  thumbnailColor: 'bg-rose-500'
};

import { MATH_QUESTIONS } from '@/data/mockQuestions';

const mockQuestions = MATH_QUESTIONS;

export default function MathSiegeGame() {
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

    const castle = { x: canvas.width / 2 - 50, y: canvas.height / 2 - 50, width: 100, height: 100 };
    let enemies: { x: number, y: number, radius: number, speed: number }[] = [];

    let spawnTimer = 0;

    const update = (dt: number) => {
      // Spawn enemies
      spawnTimer += dt;
      if (spawnTimer > 2) { // spawn every 2 seconds
        spawnTimer = 0;
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(canvas.width, canvas.height);
        enemies.push({
          x: canvas.width / 2 + Math.cos(angle) * distance,
          y: canvas.height / 2 + Math.sin(angle) * distance,
          radius: 20,
          speed: 50 + Math.random() * 50
        });
      }

      // Update enemies
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        
        // Move towards center
        const dx = (canvas.width / 2) - e.x;
        const dy = (canvas.height / 2) - e.y;
        const dist = Math.hypot(dx, dy);
        
        e.x += (dx / dist) * e.speed * dt;
        e.y += (dy / dist) * e.speed * dt;

        // Collision with castle
        if (
          e.x + e.radius > castle.x &&
          e.x - e.radius < castle.x + castle.width &&
          e.y + e.radius > castle.y &&
          e.y - e.radius < castle.y + castle.height
        ) {
          enemies.splice(i, 1);
          
          engineRef.current?.triggerQuestion({
            reason: 'hit',
            questionPool: mockQuestions,
            onCorrect: () => {
              // Successfully defended
              engineRef.current?.addScore(20);
            },
            onWrong: () => {
              // Castle damaged
              engineRef.current?.loseLife();
            }
          });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background pattern
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < Math.max(canvas.width, canvas.height); i += 50) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Castle
      ctx.fillStyle = '#64748b'; // slate-500
      ctx.fillRect(castle.x, castle.y, castle.width, castle.height);
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.fillRect(castle.x + 10, castle.y - 20, 20, 20);
      ctx.fillRect(castle.x + 40, castle.y - 20, 20, 20);
      ctx.fillRect(castle.x + 70, castle.y - 20, 20, 20);
      
      // Draw Enemies
      enemies.forEach(e => {
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444'; // red-500
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    const engine = new GameEngine(update, draw, 3);
    engineRef.current = engine;

    engine.on('score:update', (s: number) => setScore(s));
    engine.on('lives:update', (l: number) => setLives(l));
    engine.on('level:complete', (l: number) => setLevel(l));
    engine.on('question:trigger', (ctx: QuestionContext) => setActiveQuestion(ctx));
    engine.on('game:over', () => setGameOver(true));

    engine.start();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Click to shoot enemies (simple point and click)
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (Math.hypot(mouseX - e.x, mouseY - e.y) <= e.radius) {
          enemies.splice(i, 1);
          engine.addScore(10);
          break; // Only kill one per click
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
    };

    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      engine.stop();
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      className="relative mx-auto border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl bg-slate-900"
      style={{ aspectRatio: '4/3', maxHeight: '70vh', maxWidth: '100%' }}
    >
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between text-white font-bold pointer-events-none z-10">
        <div className="flex gap-4">
          <span className="bg-slate-800/80 px-4 py-2 rounded-xl">Score: {score}</span>
          <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-red-400">Lives: {'❤️'.repeat(lives)}</span>
        </div>
        <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-rose-400">Level: {level}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
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
            className="bg-rose-500 hover:bg-rose-600 px-8 py-4 rounded-2xl font-bold text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
