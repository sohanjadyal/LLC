// frontend/src/games/engine/GameEngine.ts

type EngineEvent = 'score:update' | 'lives:update' | 'level:complete' | 'game:over' | 'question:trigger';

export interface QuestionContext {
  reason: 'hit' | 'levelup' | 'obstacle';
  questionPool: any[]; // We will type this properly with IQuestion later
  onCorrect: () => void;
  onWrong: () => void;
}

export class GameEngine {
  private isPaused: boolean = false;
  public get isGamePaused() { return this.isPaused; }
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private listeners: Map<EngineEvent, Function[]> = new Map();

  public score: number = 0;
  public lives: number = 3;
  public level: number = 1;

  constructor(
    private updateFn: (deltaTime: number) => void,
    private drawFn: () => void,
    initialLives: number = 3
  ) {
    this.lives = initialLives;
  }

  // --- Event System ---
  public on(event: EngineEvent, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: EngineEvent, callback: Function) {
    if (this.listeners.has(event)) {
      const filtered = this.listeners.get(event)!.filter(cb => cb !== callback);
      this.listeners.set(event, filtered);
    }
  }

  private emit(event: EngineEvent, payload?: any) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach(cb => cb(payload));
    }
  }

  // --- Game Loop ---
  public start() {
    if (this.animationFrameId !== null) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public pause() {
    this.isPaused = true;
    this.emit('game:pause' as EngineEvent);
  }

  public resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.emit('game:resume' as EngineEvent);
    if (this.animationFrameId === null) {
      this.loop(this.lastTime);
    }
  }

  private loop = (currentTime: number) => {
    if (this.isPaused) {
      // Loop continues but update/draw are skipped while paused
      this.animationFrameId = requestAnimationFrame(this.loop);
      return;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000; // in seconds
    this.lastTime = currentTime;

    this.updateFn(deltaTime);
    this.drawFn();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  // --- Core Mechanics ---
  public addScore(amount: number) {
    this.score += amount;
    this.emit('score:update', this.score);
  }

  public loseLife() {
    this.lives -= 1;
    this.emit('lives:update', this.lives);
    if (this.lives <= 0) {
      this.emit('game:over');
      this.stop();
    }
  }

  public levelUp() {
    this.level += 1;
    this.emit('level:complete', this.level);
  }

  public triggerQuestion(context: QuestionContext) {
    this.pause(); // Freeze game loop
    this.emit('question:trigger', context);
  }

  public getDifficulty(grade: number, currentLevel: number): 'easy' | 'medium' | 'hard' {
    if (grade <= 2) return currentLevel > 5 ? 'medium' : 'easy';
    if (grade === 3) return currentLevel > 3 ? 'hard' : 'medium';
    return currentLevel > 2 ? 'hard' : 'medium';
  }
}
