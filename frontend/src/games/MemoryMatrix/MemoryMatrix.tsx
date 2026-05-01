'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';

export const GameConfig = {
  id: 'memory-matrix',
  name: 'Memory Matrix',
  subject: 'history',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Flip cards to match historical figures. Answer questions on mismatch!',
  thumbnailColor: 'bg-purple-500'
};

import { HISTORY_QUESTIONS } from '@/data/mockQuestions';

const mockQuestions = HISTORY_QUESTIONS;

export default function MemoryMatrixGame() {
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

    // Grid 4x4
    const cols = 4;
    const rows = 4;
    const cardWidth = 100;
    const cardHeight = 100;
    const padding = 20;
    const startX = (canvas.width - (cols * cardWidth + (cols - 1) * padding)) / 2;
    const startY = 100;

    let cards: { x: number, y: number, value: number, isFlipped: boolean, isMatched: boolean }[] = [];
    
    // Generate pairs (8 pairs for 16 cards)
    const values = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    // Shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    let idx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cards.push({
          x: startX + col * (cardWidth + padding),
          y: startY + row * (cardHeight + padding),
          value: values[idx++],
          isFlipped: false,
          isMatched: false
        });
      }
    }

    let flippedCards: typeof cards = [];
    let isChecking = false;

    const update = (dt: number) => {
      // Check win condition
      if (cards.every(c => c.isMatched)) {
        engineRef.current?.levelUp();
        // Here we would normally regenerate the board for the next level
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      cards.forEach(c => {
        if (c.isMatched) {
          ctx.globalAlpha = 0.3; // fade matched cards
        } else {
          ctx.globalAlpha = 1.0;
        }

        ctx.fillStyle = c.isFlipped || c.isMatched ? '#fff' : '#64748b';
        ctx.beginPath();
        ctx.roundRect(c.x, c.y, cardWidth, cardHeight, 10);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.stroke();

        if (c.isFlipped || c.isMatched) {
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // In a real game, this would be an image of a historical figure
          ctx.fillText(c.value.toString(), c.x + cardWidth / 2, c.y + cardHeight / 2);
        }
      });
      ctx.globalAlpha = 1.0;
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
      if (isChecking) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      // Find clicked card
      const clickedCard = cards.find(c => 
        !c.isMatched && !c.isFlipped &&
        mouseX >= c.x && mouseX <= c.x + cardWidth &&
        mouseY >= c.y && mouseY <= c.y + cardHeight
      );

      if (clickedCard) {
        clickedCard.isFlipped = true;
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
          isChecking = true;
          const [card1, card2] = flippedCards;

          if (card1.value === card2.value) {
            // Match!
            setTimeout(() => {
              card1.isMatched = true;
              card2.isMatched = true;
              engine.addScore(20);
              flippedCards = [];
              isChecking = false;
            }, 500);
          } else {
            // Mismatch -> Trigger Question
            setTimeout(() => {
              engine.triggerQuestion({
                reason: 'obstacle', // representing mistake
                questionPool: mockQuestions,
                onCorrect: () => {
                  // Forgive mistake
                  card1.isFlipped = false;
                  card2.isFlipped = false;
                  flippedCards = [];
                  isChecking = false;
                },
                onWrong: () => {
                  // Punish mistake
                  engine.loseLife();
                  card1.isFlipped = false;
                  card2.isFlipped = false;
                  flippedCards = [];
                  isChecking = false;
                }
              });
            }, 500);
          }
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
        <span className="bg-slate-800/80 px-4 py-2 rounded-xl text-purple-400">Level: {level}</span>
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
            className="bg-purple-500 hover:bg-purple-600 px-8 py-4 rounded-2xl font-bold text-xl transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
