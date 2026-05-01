'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';

export const GameConfig = {
  id: 'space-defender',
  name: 'Space Defender',
  subject: 'math',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Shoot alien invaders! If hit, answer correctly to survive!',
  thumbnailColor: 'bg-blue-500'
};

import { MATH_QUESTIONS } from '@/data/mockQuestions';

// Using shared MATH_QUESTIONS pool
const mockQuestions = MATH_QUESTIONS;

const ALIEN_TYPES = [
  { emoji: '👾', color: '#cc55ff', points: 30 },
  { emoji: '🤖', color: '#39ff14', points: 20 },
  { emoji: '👻', color: '#ff6600', points: 10 },
];

export default function SpaceDefenderGame() {
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

    const W = 800;
    const H = 600;

    // Game State
    let player = { x: W/2, y: H - 70, w: 44, h: 30, speed: 400 }; // speed is px/sec
    let aliens: any[] = [];
    let bullets: any[] = [];
    let alienBullets: any[] = [];
    let stars: any[] = [];
    let explosions: any[] = [];
    let alienDir = 1;
    let alienMoveTimer = 0;
    let alienShootTimer = 0;
    let keys: Record<string, boolean> = {};
    let lastShot = 0;

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 120; i++) {
        stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.5+0.3, speed: Math.random()*20+5 }); 
      }
    };

    const spawnAliens = (currentLevel: number) => {
      aliens = [];
      const cols = 9, rows = 4;
      const startX = 90, startY = 80;
      const gapX = 72, gapY = 60;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const type = r < 1 ? 0 : r < 3 ? 1 : 2;
          aliens.push({
            x: startX + c * gapX,
            y: startY + r * gapY,
            w: 40, h: 36,
            type,
            alive: true,
          });
        }
      }
    };

    initStars();
    spawnAliens(level);

    const tryShoot = (timeNow: number) => {
      if (timeNow - lastShot < 0.35) return;
      lastShot = timeNow;
      bullets.push({ x: player.x, y: player.y, isPlayer: true, dead: false });
    };

    function rectsOverlap(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
      return ax < bx+bw && ax+aw > bx && ay < by+bh && ay+ah > by;
    }

    const update = (dt: number) => {
      const timeNow = performance.now() / 1000;

      // Move player based on held keys
      if (keys['ArrowLeft'] || keys['KeyA'] || keys['a']) {
        player.x = Math.max(player.w/2, player.x - player.speed * dt);
      }
      if (keys['ArrowRight'] || keys['KeyD'] || keys['d']) {
        player.x = Math.min(W - player.w/2, player.x + player.speed * dt);
      }
      if (keys['Space'] || keys[' '] || keys['ArrowUp']) {
        tryShoot(timeNow);
      }

      // Update stars
      stars.forEach(s => {
        s.y += s.speed * dt;
        if (s.y > H) { s.y = 0; s.x = Math.random()*W; }
      });

      // Bullets
      bullets.forEach(b => { b.y -= 500 * dt; });
      alienBullets.forEach(b => { b.y += (300 + level * 20) * dt; });

      // Move Aliens
      alienMoveTimer += dt;
      const aliveCount = aliens.filter(a => a.alive).length;
      const interval = Math.max(0.18, 0.9 - aliveCount * 0.008 - level * 0.02);
      
      if (alienMoveTimer >= interval) {
        alienMoveTimer = 0;
        const alive = aliens.filter(a => a.alive);
        if (alive.length > 0) {
          let hitWall = false;
          alive.forEach(a => {
            a.x += alienDir * (5 + level * 0.8);
            if (a.x < 10 || a.x + a.w > W - 10) hitWall = true;
          });
          if (hitWall) {
            alienDir *= -1;
            alive.forEach(a => { a.y += 16; });
            if (alive.some(a => a.y + a.h >= player.y)) {
               // Aliens reached the bottom! You lose a life
               alive.forEach(a => { a.y = 80; }); // Reset alien positions temporarily
               engineRef.current?.loseLife();
            }
          }
        }
      }

      // Alien Shoot
      alienShootTimer += dt;
      const shootInterval = Math.max(1.8, 3.2 - level * 0.25);
      if (alienShootTimer >= shootInterval) {
        alienShootTimer = 0;
        const alive = aliens.filter(a => a.alive);
        if (alive.length > 0) {
          const cols: any = {};
          alive.forEach(a => {
            const col = Math.round(a.x / 72);
            if (!cols[col] || cols[col].y < a.y) cols[col] = a;
          });
          const shooters = Object.values(cols) as any[];
          const shooter = shooters[Math.floor(Math.random() * shooters.length)];
          alienBullets.push({ x: shooter.x + shooter.w/2, y: shooter.y + shooter.h, isPlayer: false, dead: false });
        }
      }

      // Collisions
      bullets.forEach(b => {
        if (!b.isPlayer || b.dead) return;
        aliens.forEach(a => {
          if (!a.alive || b.dead) return;
          if (rectsOverlap(b.x-2, b.y, 4, 14, a.x, a.y, a.w, a.h)) {
            b.dead = true;
            a.alive = false;
            explosions.push({ x: a.x+a.w/2, y: a.y+a.h/2, t: 0 });
            engineRef.current?.addScore(ALIEN_TYPES[a.type].points);
            
            if (!aliens.some(al => al.alive)) {
              engineRef.current?.levelUp();
              spawnAliens(engineRef.current!.level);
              bullets = [];
              alienBullets = [];
            }
          }
        });
      });

      alienBullets.forEach(b => {
        if (b.dead) return;
        if (rectsOverlap(b.x-2, b.y, 4, 14, player.x - player.w/2, player.y, player.w, player.h)) {
          b.dead = true;
          explosions.push({ x: player.x, y: player.y + 15, t: 0 });
          
          // Trigger Question on Hit
          engineRef.current?.triggerQuestion({
            reason: 'hit',
            questionPool: mockQuestions,
            onCorrect: () => {
              // Survived!
            },
            onWrong: () => {
              engineRef.current?.loseLife();
            }
          });
        }
      });

      // Cleanup
      bullets = bullets.filter(b => !b.dead && b.y > 0);
      alienBullets = alienBullets.filter(b => !b.dead && b.y < H);
    };

    const draw = () => {
      // Clear & Background
      ctx.fillStyle = '#080818';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random()*0.4})`;
        ctx.fill();
      });

      // Draw Player
      const { x, y, w, h } = player;
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(x - w/2, y + 10, w, h - 10);
      ctx.fillRect(x - 5, y, 10, 14);
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 12;
      ctx.fillStyle = 'rgba(0,245,255,0.15)';
      ctx.fillRect(x - w/2 - 4, y + 6, w + 8, h - 6);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255,${100+Math.random()*80},0,0.8)`;
      ctx.fillRect(x - 8, y + h + 10, 6, 6 + Math.random()*6);
      ctx.fillRect(x + 2, y + h + 10, 6, 4 + Math.random()*8);

      // Draw Aliens
      aliens.forEach(a => {
        if (!a.alive) return;
        const info = ALIEN_TYPES[a.type];
        ctx.save();
        ctx.font = `${a.w}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = info.color;
        ctx.shadowBlur = 10;
        ctx.fillText(info.emoji, a.x + a.w/2, a.y + a.h/2);
        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // Draw Bullets
      const drawB = (b: any) => {
        ctx.fillStyle = b.isPlayer ? '#00f5ff' : '#ff00aa';
        ctx.shadowColor = b.isPlayer ? '#00f5ff' : '#ff00aa';
        ctx.shadowBlur = 8;
        ctx.fillRect(b.x - 2, b.y, 4, 14);
        ctx.shadowBlur = 0;
      };
      bullets.forEach(drawB);
      alienBullets.forEach(drawB);

      // Draw Explosions
      explosions = explosions.filter(e => e.t < 1);
      explosions.forEach(e => {
        const progress = e.t;
        const alpha = 1 - progress;
        const r = progress * 40;
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,180,0,${alpha * 0.6})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e.x, e.y, r * 0.6, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.fill();
        e.t += 0.06;
      });
    };

    const engine = new GameEngine(update, draw, 3);
    engineRef.current = engine;

    // Listeners
    engine.on('score:update', (s: number) => setScore(s));
    engine.on('lives:update', (l: number) => setLives(l));
    engine.on('level:complete', (l: number) => {
       setLevel(l);
    });
    engine.on('question:trigger', (ctx: QuestionContext) => {
      setActiveQuestion(ctx);
    });
    engine.on('game:resume' as any, () => {
      // Clear keys so player doesn't keep shooting if space was held during question popup
      keys = {}; 
    });
    engine.on('game:over', () => setGameOver(true));

    engine.start();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
      keys[e.key] = true;
      keys[e.code] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
      keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      engine.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div 
      className="relative mx-auto border-4 border-cyan-800 rounded-3xl overflow-hidden shadow-2xl bg-[#080818]"
      style={{ aspectRatio: '4/3', maxHeight: '70vh', maxWidth: '100%', boxShadow: '0 0 40px #00f5ff, inset 0 0 40px rgba(0,245,255,0.03)' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');`}</style>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between text-white font-bold pointer-events-none z-10" style={{ fontFamily: '"Press Start 2P", monospace' }}>
        <div className="flex gap-8">
          <span className="text-[#00f5ff] text-xs md:text-sm drop-shadow-md">SCORE: {String(score).padStart(4, '0')}</span>
          <span className="text-[#ff00aa] text-xs md:text-sm flex items-center gap-2 drop-shadow-md">LIVES: {'❤️'.repeat(lives)}</span>
        </div>
        <span className="text-[#00f5ff] text-xs md:text-sm drop-shadow-md">LEVEL: {level}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full block object-contain"
      />

      {/* Overlays */}
      <QuestionPopup 
        context={activeQuestion} 
        onResolve={() => {
          setActiveQuestion(null);
          engineRef.current?.resume();
        }} 
      />

      {gameOver && (
        <div className="absolute inset-0 bg-[#080818]/90 flex flex-col items-center justify-center text-white z-50">
          <h2 className="text-4xl md:text-5xl mb-4 text-[#ff00aa] text-center leading-tight" style={{ fontFamily: '"Press Start 2P", monospace', textShadow: '0 0 20px #ff00aa' }}>GAME OVER</h2>
          <p className="text-xl md:text-2xl mb-8 text-[#00f5ff]" style={{ fontFamily: '"Press Start 2P", monospace' }}>FINAL SCORE: {score}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#ff00aa] hover:bg-white text-black px-8 py-4 rounded font-bold text-lg md:text-xl transition-colors"
            style={{ fontFamily: '"Press Start 2P", monospace' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
