'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine, QuestionContext } from '../engine/GameEngine';
import QuestionPopup from '@/components/game/QuestionPopup';
import { ENGLISH_QUESTIONS } from '@/data/mockQuestions';

export const GameConfig = {
  id: 'knowledge-runner',
  name: 'Knowledge Runner',
  subject: 'english',
  supportedGrades: [1, 2, 3, 4, 5],
  description: 'Dodge the rocks rolling down the track. Answer to survive!',
  thumbnailColor: 'bg-indigo-600'
};

const mockQuestions = ENGLISH_QUESTIONS;

export default function KnowledgeRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  
  const [activeQuestion, setActiveQuestion] = useState<QuestionContext | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Persist refs for game loop since they are mutable state outside React cycle
    const W = 800;
    const H = 600;
    const VPX = W / 2;
    const VPY = 200; // Horizon Y
    const PLAYER_T = 0.87; // Depth of player

    // Lane definitions
    const BOT = [80, 293, 507, 720];
    const TOP = [VPX - 28, VPX - 9, VPX + 9, VPX + 28];

    const divX = (i: number, t: number) => TOP[i] + (BOT[i] - TOP[i]) * t;
    const laneCX = (lane: number, t: number) => {
      const lo = Math.max(0, Math.min(2, Math.floor(lane)));
      const hi = Math.min(2, lo + 1);
      const frac = lane - lo;
      const cLo = (divX(lo, t) + divX(lo + 1, t)) * 0.5;
      const cHi = (divX(hi, t) + divX(hi + 1, t)) * 0.5;
      return cLo + (cHi - cLo) * frac;
    };
    const laneW = (lane: number, t: number) => {
      const l = Math.max(0, Math.min(2, Math.round(lane)));
      return divX(l + 1, t) - divX(l, t);
    };
    const worldY = (t: number) => VPY + (H - VPY) * t;

    // Game State
    let laneCur = 1;
    let laneVis = 1.0;
    let scrollPos = 0;
    let speed = 1.0;
    let distance = 0;
    let invincible = 0; // ms remaining
    let spawnTimer = 0;
    let spawnInterval = 2400; // ms
    let currentStreak = 0;
    
    type Rock = { lane: number, t: number, hit: boolean, scored: boolean };
    type Particle = { x: number, y: number, vx: number, vy: number, life: number, decay: number, r: number, color: string };
    type Star = { x: number, y: number, r: number, phase: number };

    let obstacles: Rock[] = [];
    let particles: Particle[] = [];
    
    // Generate Stars
    const stars: Star[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * W,
      y: Math.random() * (VPY - 20) + 4,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2
    }));

    const drawStars = () => {
      const t = Date.now() * 0.001;
      stars.forEach(s => {
        const a = 0.35 + 0.45 * Math.abs(Math.sin(t + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      });
    };

    const LANE_COLORS = ['#c9a2d9', '#a2c9d9', '#bcb4ee'];

    const drawTrack = (scroll: number) => {
      for (let l = 0; l < 3; l++) {
        ctx.beginPath();
        ctx.moveTo(divX(l, 0), VPY);
        ctx.lineTo(divX(l+1, 0), VPY);
        ctx.lineTo(divX(l+1, 1), H + 2);
        ctx.lineTo(divX(l, 1), H + 2);
        ctx.closePath();
        ctx.fillStyle = LANE_COLORS[l];
        ctx.fill();
      }

      for (let i = 0; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(divX(i, 0), VPY);
        ctx.lineTo(divX(i, 1), H);
        ctx.strokeStyle = (i === 0 || i === 3) ? '#3a1888' : 'rgba(90,50,180,0.5)';
        ctx.lineWidth = (i === 0 || i === 3) ? 3 : 1.5;
        ctx.stroke();
      }

      const SEG = 10;
      for (let l = 0; l < 3; l++) {
        for (let d = 0; d < SEG; d++) {
          const t0 = ((d / SEG) + scroll) % 1;
          const t1 = t0 + 0.035;
          if (t1 > 1 || t0 < 0.01) continue;
          ctx.beginPath();
          ctx.moveTo(laneCX(l, t0), worldY(t0));
          ctx.lineTo(laneCX(l, t1), worldY(t1));
          ctx.strokeStyle = 'rgba(70,35,155,0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      const fog = ctx.createLinearGradient(0, VPY - 30, 0, VPY + 28);
      fog.addColorStop(0, 'rgba(12,9,38,1)');
      fog.addColorStop(1, 'rgba(12,9,38,0)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, VPY - 30, W, 58);
    };

    const drawBall = () => {
      const lv = Math.max(0, Math.min(2, laneVis));
      const cx = laneCX(lv, PLAYER_T);
      const cy = worldY(PLAYER_T);
      const r  = Math.max(4, laneW(1, PLAYER_T) * 0.33);

      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.72, r * 0.75, r * 0.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fill();

      if (invincible > 0) {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.018);
        const sr = r * (1.45 + pulse * 0.18);
        ctx.beginPath();
        ctx.arc(cx, cy, sr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,210,60,${0.13 + pulse * 0.09})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, sr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,210,60,${0.5 + pulse * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const gr = ctx.createRadialGradient(cx - r*0.32, cy - r*0.32, Math.max(0.5, r*0.04), cx, cy, r);
      gr.addColorStop(0, '#f6f2ff');
      gr.addColorStop(0.45, '#ddd4f0');
      gr.addColorStop(1, '#a89ec8');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = gr;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx - r*0.3, cy - r*0.3, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    };

    const drawRock = (obs: Rock) => {
      if (obs.t <= 0.0) return;
      const cx = laneCX(obs.lane, obs.t);
      const cy = worldY(obs.t);
      const wNow = laneW(obs.lane, obs.t);
      const wMax = laneW(1, 1);
      const scale = wNow / wMax;
      const r = Math.max(2, 26 * scale);

      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.55, r * 0.9, r * 0.26, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fill();

      const rg = ctx.createRadialGradient(cx - r * 0.22, cy - r * 0.22, r * 0.08, cx, cy, r);
      rg.addColorStop(0, '#c2c1d2');
      rg.addColorStop(0.55, '#8a8aa2');
      rg.addColorStop(1, '#505062');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(22, 1);
      ctx.bezierCurveTo(24, 13, 14, 26, 1, 26);
      ctx.bezierCurveTo(-12, 26, -26, 15, -26, 1);
      ctx.bezierCurveTo(-26, -13, -13, -26, 1, -26);
      ctx.bezierCurveTo(15, -26, 22, -11, 22, 1);
      ctx.closePath();
      ctx.restore();

      ctx.fillStyle = rg;
      ctx.fill();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.strokeStyle = 'rgba(30,30,50,0.38)';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(-3, -11); ctx.lineTo(2, 3); ctx.lineTo(-9, 13); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(7, -7); ctx.lineTo(13, 7); ctx.stroke();
      ctx.restore();
    };

    const spawnParticles = (lane: number) => {
      const cx = laneCX(lane, PLAYER_T);
      const cy = worldY(PLAYER_T);
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 2.5 + Math.random() * 4;
        particles.push({
          x: cx, y: cy, vx: Math.cos(a)*s, vy: Math.sin(a)*s - 2.5,
          life: 1, decay: 0.032 + Math.random()*0.018,
          r: 3 + Math.random()*4,
          color: Math.random() < 0.5 ? '#ff6688' : '#ffcc44'
        });
      }
    };

    const tickParticles = (dt: number) => {
      particles.forEach(p => {
        p.x += p.vx * dt * 3.3; // adjusted dt scaling
        p.y += p.vy * dt * 3.3;
        p.vy += 0.18;
        p.life -= p.decay;
      });
      particles = particles.filter(p => p.life > 0);
    };

    const drawParticles = () => {
      particles.forEach(p => {
        ctx.globalAlpha = p.life * 0.88;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.r * p.life), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    let hitLocked = false;

    const update = (dt: number) => {
      // Lerp ball
      const diff = laneCur - laneVis;
      if (Math.abs(diff) > 0.01) laneVis += diff * 12 * dt;
      else laneVis = laneCur;

      if (invincible > 0) {
        invincible -= dt * 1000;
        if (invincible < 0) invincible = 0;
      }

      // Scrolling
      const spd = speed * 0.8 * dt;
      scrollPos += spd * 1.5;
      distance += spd * 100;
      
      // Level scaling
      if (distance > 3000 * level) {
         engineRef.current?.levelUp();
         speed = Math.min(2.0, 1.0 + (level - 1) * 0.16);
         spawnInterval = Math.max(1300, 2400 - (level - 1) * 160);
      }

      // Spawn
      spawnTimer += dt * 1000;
      if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        const lane1 = Math.floor(Math.random() * 3);
        obstacles.push({ lane: lane1, t: 0.0, hit: false, scored: false });
        if (Math.random() < 0.25) {
          const others = [0, 1, 2].filter(l => l !== lane1);
          const lane2 = others[Math.floor(Math.random() * others.length)];
          obstacles.push({ lane: lane2, t: -0.15, hit: false, scored: false });
        }
      }

      // Tick obstacles
      obstacles.forEach(obs => {
        obs.t += spd * 0.8;
        
        // Collision
        if (!obs.hit && obs.t > PLAYER_T - 0.04 && obs.t < PLAYER_T + 0.04) {
          if (obs.lane === laneCur) {
            obs.hit = true;
            if (invincible <= 0 && !hitLocked) {
              hitLocked = true;
              spawnParticles(laneCur);
              currentStreak = 0;
              setStreak(0);
              
              engineRef.current?.triggerQuestion({
                reason: 'obstacle',
                questionPool: mockQuestions,
                onCorrect: () => {
                  engineRef.current?.addScore(50);
                  invincible = 2200;
                  hitLocked = false;
                },
                onWrong: () => {
                  engineRef.current?.loseLife();
                  invincible = 2200;
                  hitLocked = false;
                }
              });
            }
          }
        }

        // Score
        if (!obs.scored && !obs.hit && obs.t > PLAYER_T + 0.05) {
          obs.scored = true;
          currentStreak++;
          setStreak(currentStreak);
          engineRef.current?.addScore(10 + Math.floor(currentStreak / 5) * 5);
        }
      });

      obstacles = obstacles.filter(o => o.t < 1.2);
      tickParticles(dt);
    };

    const draw = () => {
      ctx.fillStyle = '#120f2e';
      ctx.fillRect(0, 0, W, H);
      drawStars();
      drawTrack(scrollPos);
      obstacles.forEach(o => { if (o.t < PLAYER_T) drawRock(o); });
      drawBall();
      obstacles.forEach(o => { if (o.t >= PLAYER_T) drawRock(o); });
      drawParticles();
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
      if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key) && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
      }
      if (!engineRef.current?.isGamePaused) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          laneCur = Math.max(0, laneCur - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          laneCur = Math.min(2, laneCur + 1);
        }
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
      className="relative mx-auto rounded-xl overflow-hidden shadow-2xl bg-[#120f2e] border border-cyan-900/50"
      style={{ aspectRatio: '4/3', maxHeight: '70vh', maxWidth: '100%' }}
    >
      {/* Retro HUD overlay */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between pointer-events-none z-10" style={{ fontFamily: '"Orbitron", sans-serif' }}>
        <div className="text-center">
          <div className="text-[9px] text-white/45 tracking-[3px] mb-1">SCORE</div>
          <div className="text-[22px] text-white font-black">{score}</div>
        </div>
        
        <div className="flex gap-2 items-center">
           {[...Array(3)].map((_, i) => (
             <span key={i} className={`text-[22px] transition-all duration-200 drop-shadow-[0_0_6px_#ff4466] ${i >= lives ? 'opacity-20 scale-75' : 'opacity-100'}`}>❤️</span>
           ))}
        </div>

        <div className="text-center">
          <div className="text-[9px] text-white/45 tracking-[3px] mb-1">STREAK</div>
          <div className="text-[22px] text-white font-black">{streak}</div>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full block object-contain bg-[#120f2e]"
      />

      <QuestionPopup 
        context={activeQuestion} 
        onResolve={() => {
          setActiveQuestion(null);
          engineRef.current?.resume();
        }} 
      />

      {gameOver && (
        <div className="absolute inset-0 bg-[#0a081e]/95 flex flex-col items-center justify-center text-white z-50">
          <h2 className="text-4xl font-black mb-4 text-[#ff4466] drop-shadow-[0_0_30px_#ff4466]" style={{ fontFamily: '"Orbitron", sans-serif' }}>GAME OVER</h2>
          <p className="text-white/60 mb-8" style={{ fontFamily: '"Orbitron", sans-serif' }}>
            SCORE <span className="text-[#66ddff]">{score}</span>
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#66ddff] hover:bg-[#66ddff]/80 hover:scale-105 hover:shadow-[0_0_36px_rgba(102,221,255,0.6)] text-black px-8 py-4 rounded-full font-bold text-sm tracking-widest transition-all shadow-[0_0_24px_rgba(102,221,255,0.4)]"
            style={{ fontFamily: '"Orbitron", sans-serif' }}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
