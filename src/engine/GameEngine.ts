import type { GameState, GameStats, Augment, Achievement } from '../types/game';
import { Player } from './Player';
import { ProjectileManager } from './ProjectileManager';
import { EnemyManager } from './EnemyManager';
import { ParticleSystem } from './ParticleSystem';
import { DropManager } from './DropManager';
import { CyberGrid } from './CyberGrid';
import { Vector2D } from './Vector2D';
import { AUGMENTS_POOL, getRandomAugments } from '../data/upgrades';
import { loadSavedAchievements, saveAchievements } from '../data/achievements';
import { soundManager } from '../audio/SoundManager';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime = 0;

  // Subsystems
  public player: Player;
  public projectiles: ProjectileManager;
  public enemies: EnemyManager;
  public particles: ParticleSystem;
  public drops: DropManager;
  public grid: CyberGrid;

  // State
  public state: GameState = 'menu';
  public stats: GameStats;
  public currentAugmentPool: Augment[] = [];
  public achievements: Achievement[] = [];

  // Input
  private inputKeys: Record<string, boolean> = {};
  private pointerPos = { x: 0, y: 0 };
  private screenShake = 0;

  // Callbacks for UI
  public onStateChange?: (state: GameState) => void;
  public onLevelUpChoice?: (options: Augment[]) => void;
  public onStatsUpdate?: (stats: GameStats, playerStats: Player['stats']) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;

    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.projectiles = new ProjectileManager();
    this.enemies = new EnemyManager();
    this.particles = new ParticleSystem();
    this.drops = new DropManager();
    this.grid = new CyberGrid();

    const savedHighScore = parseInt(localStorage.getItem('chrono_high_score') || '0', 10);
    this.stats = {
      score: 0,
      highScore: savedHighScore,
      wave: 1,
      timeSurvived: 0,
      enemiesKilled: 0,
      bossesDefeated: 0,
      damageDealt: 0,
      damageTaken: 0,
      chronoTimeUsed: 0,
      highestCombo: 1,
    };

    this.currentAugmentPool = AUGMENTS_POOL.map((a) => ({ ...a, currentStacks: 0 }));
    this.achievements = loadSavedAchievements();

    this.setupListeners();
    this.handleResize();
  }

  private setupListeners() {
    window.addEventListener('resize', () => this.handleResize());

    window.addEventListener('keydown', (e) => {
      this.inputKeys[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'playing') {
          this.player.toggleChrono();
        }
      }

      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        if (this.state === 'playing') {
          this.player.triggerDash(this.particles, this.grid);
        }
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'playing') {
          this.setState('paused');
        } else if (this.state === 'paused') {
          this.setState('playing');
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.inputKeys[e.code] = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.pointerPos.x = e.clientX - rect.left;
      this.pointerPos.y = e.clientY - rect.top;
      this.player.aimPos = this.pointerPos;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        // Right click dash
        e.preventDefault();
        if (this.state === 'playing') {
          this.player.triggerDash(this.particles, this.grid);
        }
      }
    });

    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  public handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    this.grid.resize(width, height);
  }

  public startNewGame() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.player = new Player(width / 2, height / 2);
    this.projectiles.clear();
    this.enemies.clear();
    this.particles.clear();
    this.drops.clear();

    this.currentAugmentPool = AUGMENTS_POOL.map((a) => ({ ...a, currentStacks: 0 }));

    this.stats.score = 0;
    this.stats.wave = 1;
    this.stats.timeSurvived = 0;
    this.stats.enemiesKilled = 0;
    this.stats.bossesDefeated = 0;
    this.stats.damageDealt = 0;
    this.stats.damageTaken = 0;
    this.stats.chronoTimeUsed = 0;
    this.stats.highestCombo = 1;

    this.enemies.startWave(1);
    soundManager.startMusic();
    this.setState('playing');

    this.lastTime = performance.now();
    if (!this.animationId) {
      this.loop(this.lastTime);
    }
  }

  public setState(newState: GameState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(newState);
    }
    if (newState === 'playing') {
      soundManager.startMusic();
    } else if (newState === 'gameover' || newState === 'menu') {
      soundManager.stopMusic();
    }
  }

  public applyChosenAugment(augmentId: string) {
    const aug = this.currentAugmentPool.find((a) => a.id === augmentId);
    if (aug) {
      aug.currentStacks++;
      aug.apply(this.player.stats, this.player.weapons);

      // Add drone if it was the drone augment
      if (aug.id === 'attack_drone') {
        const droneCount = this.player.drones.length;
        this.player.drones.push({
          id: `drone_${droneCount}`,
          type: 'attack',
          orbitAngle: (droneCount * Math.PI) / 2,
          orbitDistance: 45 + droneCount * 12,
          orbitSpeed: 2.2,
          fireCooldown: 0.65,
          lastFired: 0,
          level: 1,
        });
      }
    }
    this.setState('playing');
  }

  private loop = (currentTime: number) => {
    this.animationId = requestAnimationFrame(this.loop);

    const dt = Math.min((currentTime - this.lastTime) * 0.001, 0.1);
    this.lastTime = currentTime;

    if (this.state === 'playing') {
      this.update(dt);
    }
    this.render();
  };

  private update(dt: number) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Bullet-time factor: slows enemies and enemy bullets
    const slowFactor = this.player.stats.isChronoActive
      ? this.player.stats.chronoSlowFactor
      : 1.0;

    if (this.player.stats.isChronoActive) {
      this.stats.chronoTimeUsed += dt;
    }

    this.stats.timeSurvived += dt;

    // Update Player
    this.player.update(
      dt,
      this.inputKeys,
      this.projectiles,
      this.particles,
      this.grid,
      this.enemies.getEnemies(),
      width,
      height,
      () => {
        // Trigger Level Up choice
        const options = getRandomAugments(3, this.currentAugmentPool);
        if (options.length > 0) {
          this.setState('upgrade');
          if (this.onLevelUpChoice) {
            this.onLevelUpChoice(options);
          }
        }
      }
    );

    // Update Projectiles
    this.projectiles.update(
      dt,
      slowFactor,
      this.particles,
      this.grid,
      this.enemies.getEnemies(),
      width,
      height
    );

    // Update Enemies
    this.enemies.update(
      dt,
      slowFactor,
      this.player.stats,
      this.projectiles,
      this.particles,
      this.drops,
      this.grid,
      width,
      height,
      (points, isBoss) => {
        this.player.addCombo(points);
        this.stats.enemiesKilled++;
        if (isBoss) this.stats.bossesDefeated++;
      }
    );

    // Update Drops
    this.drops.update(dt, this.player.stats, this.player.stats.pickupMagnetRadius);

    // Update Particles & CyberGrid
    this.particles.update(dt, slowFactor);
    this.grid.update(dt);

    // Screen Shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt * 25);
    }

    // Check Collisions
    this.checkCollisions();

    // Check Achievements
    this.checkAchievements();

    // Sync stats
    this.stats.score = this.player.stats.score;
    this.stats.wave = this.enemies.getWave();
    this.stats.highestCombo = Math.max(this.stats.highestCombo, this.player.stats.maxCombo);

    if (this.stats.score > this.stats.highScore) {
      this.stats.highScore = this.stats.score;
      localStorage.setItem('chrono_high_score', this.stats.highScore.toString());
    }

    if (this.onStatsUpdate) {
      this.onStatsUpdate(this.stats, this.player.stats);
    }
  }

  private checkCollisions() {
    const enemyList = this.enemies.getEnemies();
    const projectileList = this.projectiles.getProjectiles();
    const dropList = this.drops.getDrops();

    // 1. Player Projectiles vs Enemies
    for (const p of projectileList) {
      if (!p.fromPlayer || p.hitsLeft <= 0) continue;

      for (const e of enemyList) {
        if (e.health <= 0) continue;

        if (Vector2D.circleCollision(p, p.radius, e, e.radius)) {
          // Calculate Critical Hit
          const isCrit = Math.random() < this.player.stats.critChance;
          const damage = isCrit ? p.damage * this.player.stats.critMultiplier : p.damage;

          e.health -= damage;
          this.stats.damageDealt += damage;
          p.hitsLeft--;

          // Floating damage number
          this.particles.addFloatingText(
            Math.round(damage).toString(),
            e.x,
            e.y,
            isCrit ? '#ffea00' : '#00ffff',
            isCrit
          );

          // Sparks
          this.particles.createExplosion(p.x, p.y, p.color, 6, false);
          this.grid.applyForce(p.x, p.y, 45, 1.8);

          if (p.hitsLeft <= 0) break;
        }
      }
    }

    // 2. Enemy Projectiles vs Player
    for (const p of projectileList) {
      if (p.fromPlayer || p.hitsLeft <= 0) continue;

      if (Vector2D.circleCollision(p, p.radius, this.player.stats, this.player.stats.radius)) {
        p.hitsLeft = 0;
        this.stats.damageTaken += p.damage;
        const isDead = this.player.takeDamage(p.damage, this.particles, (intensity) => {
          this.screenShake = intensity;
        });

        if (isDead) {
          this.handleGameOver();
          return;
        }
      }
    }

    // 3. Enemies vs Player (Melee / Body collision)
    for (const e of enemyList) {
      if (e.health <= 0) continue;

      if (Vector2D.circleCollision(e, e.radius, this.player.stats, this.player.stats.radius)) {
        const meleeDamage = e.damage * 0.4;
        this.stats.damageTaken += meleeDamage;

        // Push enemy back
        const angle = Vector2D.angle(this.player.stats, e);
        e.x += Math.cos(angle) * 15;
        e.y += Math.sin(angle) * 15;

        const isDead = this.player.takeDamage(meleeDamage, this.particles, (intensity) => {
          this.screenShake = intensity;
        });

        if (isDead) {
          this.handleGameOver();
          return;
        }
      }
    }

    // 4. Drops vs Player (Collection)
    for (let i = dropList.length - 1; i >= 0; i--) {
      const d = dropList[i];
      if (Vector2D.circleCollision(d, d.radius, this.player.stats, this.player.stats.radius + 10)) {
        soundManager.playPickup(d.type);

        switch (d.type) {
          case 'xp':
            this.player.addXp(d.value);
            break;
          case 'health':
            this.player.heal(d.value);
            this.particles.addFloatingText(`+${d.value} HP`, this.player.stats.x, this.player.stats.y, '#00ff66');
            break;
          case 'shield':
            this.player.rechargeShield(d.value);
            this.particles.addFloatingText(`+${d.value} SHIELD`, this.player.stats.x, this.player.stats.y, '#00ccff');
            break;
          case 'chronoBattery':
            this.player.stats.chronoEnergy = Math.min(
              this.player.stats.maxChronoEnergy,
              this.player.stats.chronoEnergy + d.value
            );
            this.particles.addFloatingText(`CHRONO +${d.value}`, this.player.stats.x, this.player.stats.y, '#ffcc00');
            break;
          case 'overdrive':
            this.player.stats.overdriveTimer = 8.0; // 8 seconds of Overdrive
            this.particles.addFloatingText('OVERDRIVE!', this.player.stats.x, this.player.stats.y, '#ff00ff', true);
            break;
        }

        this.drops.removeDrop(d.id);
      }
    }
  }

  private checkAchievements() {
    let unlockedAny = false;
    for (const ach of this.achievements) {
      if (!ach.unlocked && ach.check(this.stats, this.player.stats)) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        unlockedAny = true;
        this.particles.addFloatingText(`ACHIEVEMENT: ${ach.title}`, this.player.stats.x, this.player.stats.y - 40, '#ffd700', true);
      }
    }
    if (unlockedAny) {
      saveAchievements(this.achievements);
    }
  }

  private handleGameOver() {
    this.setState('gameover');
    this.particles.createExplosion(this.player.stats.x, this.player.stats.y, '#ff0055', 80, true);
    this.grid.applyForce(this.player.stats.x, this.player.stats.y, 250, 20);
    soundManager.playExplosion(true);
  }

  public render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.ctx.save();

    // Screen Shake offset
    if (this.screenShake > 0) {
      const shakeX = (Math.random() - 0.5) * this.screenShake;
      const shakeY = (Math.random() - 0.5) * this.screenShake;
      this.ctx.translate(shakeX, shakeY);
    }

    // Clear background
    this.ctx.fillStyle = '#030712';
    this.ctx.fillRect(0, 0, width, height);

    // Render CyberGrid
    this.grid.render(this.ctx, this.player.stats.isChronoActive);

    // Render Drops
    this.drops.render(this.ctx);

    // Render Projectiles
    this.projectiles.render(this.ctx);

    // Render Enemies
    this.enemies.render(this.ctx);

    // Render Player
    if (this.state !== 'gameover') {
      this.player.render(this.ctx);
    }

    // Render Particles & Floats
    this.particles.render(this.ctx);

    // Chrono Matrix Vignette Overlay
    if (this.player.stats.isChronoActive) {
      const grad = this.ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.2,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(1, 'rgba(0, 200, 255, 0.22)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, width, height);
    }

    this.ctx.restore();
  }

  public cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    soundManager.stopMusic();
  }
}
