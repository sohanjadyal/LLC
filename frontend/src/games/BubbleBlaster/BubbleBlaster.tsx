'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';

export const GameConfig = {
  id: 'bubble-blaster',
  name: 'Bubble Blaster',
  subject: 'science',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Match and pop, answer to clear special bubbles!',
  thumbnailColor: 'bg-green-500'
};

import { SCIENCE_QUESTIONS } from '@/data/mockQuestions';

const mockQuestions = SCIENCE_QUESTIONS;

export default function BubbleBlasterGame() {
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

    // Very simplified bubble blaster grid representation
    let bubbles: { x: number, y: number, color: string, isQuestion: boolean }[] = [];
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
    
    // Initial grid (20 cols to fill 800px)
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 20; col++) {
        bubbles.push({
          x: col * 40 + 20,
          y: row * 40 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          isQuestion: Math.random() < 0.1 // 10% chance to be a question bubble
        });
      }
    }

    let projectiles: { x: number, y: number, dx: number, dy: number, color: string }[] = [];
    let playerAngle = -Math.PI / 2;
    let nextBubbleColor = colors[Math.floor(Math.random() * colors.length)];

    const update = (dt: number) => {
      // Update projectiles
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.dx * dt;
        p.y += p.dy * dt;

        // Wall bounce
        if (p.x <= 15 || p.x >= canvas.width - 15) p.dx *= -1;

        // Collision with top or bubbles
        let hit = false;
        if (p.y <= 15) {
          hit = true;
        } else {
          for (let j = bubbles.length - 1; j >= 0; j--) {
            const b = bubbles[j];
            const dist = Math.hypot(p.x - b.x, p.y - b.y);
            if (dist < 30) {
              hit = true;
              
              if (b.isQuestion) {
                // Trigger question
                engineRef.current?.triggerQuestion({
                  reason: 'hit',
                  questionPool: mockQuestions,
                  onCorrect: () => {
                    // Correct: large clear
                    bubbles.splice(j, 1);
                    engineRef.current?.addScore(50);
                  },
                  onWrong: () => {
                    // Wrong: multiply bubbles
                    bubbles.push({ x: b.x, y: b.y + 40, color: b.color, isQuestion: false });
                  }
                });
              } else {
                // Normal hit (simplified logic: just pops if same color)
                if (b.color === p.color) {
                  bubbles.splice(j, 1);
                  engineRef.current?.addScore(10);
                } else {
                  // Attach to grid
                  bubbles.push({ x: p.x, y: p.y, color: p.color, isQuestion: false });
                }
              }
              break;
            }
          }
        }

        if (hit) {
          projectiles.splice(i, 1);
        }
      }
      
      // Check danger line (simplified)
      const bottomBubble = Math.max(...bubbles.map(b => b.y), 0);
      if (bottomBubble > canvas.height - 100) {
        engineRef.current?.loseLife();
        bubbles.forEach(b => b.y -= 40); // Push back up
      }
      
      if (bubbles.length === 0) {
        engineRef.current?.levelUp();
        // Reload grid
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Bubbles
      bubbles.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 18, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        if (b.isQuestion) {
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('?', b.x, b.y);
        }
      });

      // Projectiles
      projectiles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Next Bubble Indicator (loaded in cannon base)
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 20, 15, 0, Math.PI * 2);
      ctx.fillStyle = nextBubbleColor;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Player cannon
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height - 20);
      ctx.rotate(playerAngle);
      ctx.fillStyle = '#475569';
      // Draw cannon barrel behind the bubble
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillRect(0, -10, 60, 20);
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
      
      // Base
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height, 30, Math.PI, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();
    };

    const engine = new GameEngine(update, draw, 3);
    engineRef.current = engine;

    engine.on('score:update', (s: number) => setScore(s));
    engine.on('lives:update', (l: number) => setLives(l));
    engine.on('level:complete', (l: number) => setLevel(l));
    engine.on('question:trigger', (ctx: QuestionContext) => setActiveQuestion(ctx));
    engine.on('game:over', () => setGameOver(true));

    engine.start();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Adjust mouse coords based on canvas aspect ratio vs intrinsic size
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;
      playerAngle = Math.atan2(mouseY - (canvas.height - 20), mouseX - (canvas.width / 2));
    };

    const handleClick = () => {
      const speed = 800;
      projectiles.push({
        x: canvas.width / 2,
        y: canvas.height - 20,
        dx: Math.cos(playerAngle) * speed,
        dy: Math.sin(playerAngle) * speed,
        color: nextBubbleColor
      });
      nextBubbleColor = colors[Math.floor(Math.random() * colors.length)];
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      engine.stop();
      canvas.removeEventListener('mousemove', handleMouseMove);
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
        <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-green-400">Level: {level}</span>
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
            className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl font-bold text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
