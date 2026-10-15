import type { Enemy, EnemyType, PlayerStats } from '../types/game';
import { Vector2D } from './Vector2D';
import type { ProjectileManager } from './ProjectileManager';
import type { ParticleSystem } from './ParticleSystem';
import type { DropManager } from './DropManager';
import type { CyberGrid } from './CyberGrid';
import { soundManager } from '../audio/SoundManager';

export class EnemyManager {
  private enemies: Enemy[] = [];
  private wave = 1;
  private waveTimer = 0;
  private spawnTimer = 0;
  private enemiesSpawnedThisWave = 0;
  private maxEnemiesPerWave = 20;
  private isBossWave = false;
  private currentBoss: Enemy | null = null;

  public getWave(): number {
    return this.wave;
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }

  public getCurrentBoss(): Enemy | null {
    return this.currentBoss;
  }

  public isBossActive(): boolean {
    return this.currentBoss !== null && this.currentBoss.health > 0;
  }

  public startWave(waveNumber: number, particles?: ParticleSystem, width?: number, height?: number) {
    this.wave = waveNumber;
    this.waveTimer = 0;
    this.enemiesSpawnedThisWave = 0;
    this.maxEnemiesPerWave = 15 + waveNumber * 8;
    this.isBossWave = waveNumber % 5 === 0;
    this.currentBoss = null;

    if (particles && width && height) {
      particles.addFloatingText(
        this.isBossWave ? `⚠️ SECTOR ${waveNumber}: BOSS OVERLORD` : `SECTOR ${waveNumber}: ESCALATION`,
        width / 2,
        height / 2 - 80,
        this.isBossWave ? '#ff0055' : '#00f0ff',
        true
      );
    }

    if (this.isBossWave) {
      soundManager.playBossWarning();
    }
  }

  public update(
    dt: number,
    slowFactor: number,
    player: PlayerStats,
    projectiles: ProjectileManager,
    particles: ParticleSystem,
    drops: DropManager,
    grid: CyberGrid,
    width: number,
    height: number,
    onEnemyKill: (points: number, isBoss: boolean) => void
  ) {
    this.waveTimer += dt;
    this.spawnTimer += dt;

    // Spawn regular enemies or boss
    if (this.isBossWave && !this.currentBoss && this.enemiesSpawnedThisWave === 0) {
      this.spawnBoss(width, height);
      this.enemiesSpawnedThisWave++;
    } else if (
      this.enemiesSpawnedThisWave < this.maxEnemiesPerWave &&
      this.spawnTimer >= Math.max(0.35, 1.8 - this.wave * 0.08)
    ) {
      this.spawnRandomEnemy(width, height);
      this.spawnTimer = 0;
      this.enemiesSpawnedThisWave++;
    }

    // Check if wave cleared
    if (
      this.enemiesSpawnedThisWave >= this.maxEnemiesPerWave &&
      this.enemies.length === 0
    ) {
      this.startWave(this.wave + 1, particles, width, height);
    }

    // Update individual enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];

      // Check health
      if (e.health <= 0) {
        this.killEnemy(e, i, particles, drops, grid, onEnemyKill);
        continue;
      }

      // Movement & behavior with slowFactor (Chrono Matrix slowdown)
      const simDt = dt * slowFactor * 60;
      e.stateTimer += dt * slowFactor;

      switch (e.type) {
        case 'swarmer':
          this.updateSwarmer(e, player, simDt);
          break;
        case 'speeder':
          this.updateSpeeder(e, player, simDt);
          break;
        case 'sniper':
          this.updateSniper(e, player, simDt, projectiles);
          break;
        case 'brute':
          this.updateBrute(e, player, simDt);
          break;
        case 'phantom':
          this.updatePhantom(e, player, simDt, particles);
          break;
        case 'splitter':
          this.updateSwarmer(e, player, simDt);
          break;
        case 'boss_leviathan':
          this.updateBossLeviathan(e, player, simDt, projectiles, particles);
          break;
        case 'boss_nexus':
          this.updateBossNexus(e, player, simDt, projectiles);
          break;
      }

      // Keep within arena bounds with gentle bounce
      e.x = Vector2D.clamp(e.x, e.radius, width - e.radius);
      e.y = Vector2D.clamp(e.y, e.radius, height - e.radius);
    }
  }

  // AI Behaviors
  private updateSwarmer(e: Enemy, player: PlayerStats, simDt: number) {
    const angle = Vector2D.angle(e, player);
    e.angle = angle;
    e.vx = Math.cos(angle) * e.speed;
    e.vy = Math.sin(angle) * e.speed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;
  }

  private updateSpeeder(e: Enemy, player: PlayerStats, simDt: number) {
    const baseAngle = Vector2D.angle(e, player);
    const wobble = Math.sin(e.stateTimer * 6) * 0.7;
    const finalAngle = baseAngle + wobble;
    e.angle = finalAngle;
    e.vx = Math.cos(finalAngle) * e.speed;
    e.vy = Math.sin(finalAngle) * e.speed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;
  }

  private updateSniper(
    e: Enemy,
    player: PlayerStats,
    simDt: number,
    projectiles: ProjectileManager
  ) {
    const dist = Vector2D.distance(e, player);
    const angle = Vector2D.angle(e, player);
    e.angle = angle;

    // Maintain 350px distance
    const desiredDist = 320;
    if (dist < desiredDist - 40) {
      // Back off
      e.vx = -Math.cos(angle) * e.speed;
      e.vy = -Math.sin(angle) * e.speed;
    } else if (dist > desiredDist + 40) {
      // Approach
      e.vx = Math.cos(angle) * e.speed;
      e.vy = Math.sin(angle) * e.speed;
    } else {
      // Strafe
      e.vx = Math.sin(angle) * e.speed * 0.8;
      e.vy = -Math.cos(angle) * e.speed * 0.8;
    }

    e.x += e.vx * simDt;
    e.y += e.vy * simDt;

    // Shoot homing spikes
    if (e.stateTimer - e.lastShot >= e.shootCooldown) {
      e.lastShot = e.stateTimer;
      const bulletSpeed = 5.5;
      projectiles.spawnEnemyProjectile(
        e.x,
        e.y,
        Math.cos(angle) * bulletSpeed,
        Math.sin(angle) * bulletSpeed,
        e.damage,
        '#ff0055',
        5
      );
    }
  }

  private updateBrute(e: Enemy, player: PlayerStats, simDt: number) {
    const angle = Vector2D.angle(e, player);
    e.angle = angle;

    // Periodic charge burst
    const chargeCycle = e.stateTimer % 4.0;
    const isCharging = chargeCycle > 2.8;
    const currentSpeed = isCharging ? e.speed * 2.8 : e.speed;

    e.vx = Math.cos(angle) * currentSpeed;
    e.vy = Math.sin(angle) * currentSpeed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;
  }

  private updatePhantom(
    e: Enemy,
    player: PlayerStats,
    simDt: number,
    particles: ParticleSystem
  ) {
    const angle = Vector2D.angle(e, player);
    e.angle = angle;

    // Teleport every 3 seconds
    if (e.stateTimer >= 3.0) {
      e.stateTimer = 0;
      particles.createExplosion(e.x, e.y, '#bf00ff', 12, false);

      // Teleport behind player
      const pAngle = Math.random() * Math.PI * 2;
      const dist = Vector2D.randomRange(150, 250);
      e.x = player.x + Math.cos(pAngle) * dist;
      e.y = player.y + Math.sin(pAngle) * dist;

      particles.createExplosion(e.x, e.y, '#bf00ff', 12, false);
    }

    e.vx = Math.cos(angle) * e.speed;
    e.vy = Math.sin(angle) * e.speed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;
  }

  private updateBossLeviathan(
    e: Enemy,
    player: PlayerStats,
    simDt: number,
    projectiles: ProjectileManager,
    _particles: ParticleSystem
  ) {
    const angle = Vector2D.angle(e, player);
    e.angle = angle;

    // Boss movement: slow tracking towards arena center/player
    e.vx = Math.cos(angle) * e.speed;
    e.vy = Math.sin(angle) * e.speed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;

    // Determine phase based on health
    const healthPercent = e.health / e.maxHealth;
    e.bossPhase = healthPercent > 0.6 ? 1 : healthPercent > 0.3 ? 2 : 3;

    // Phase 1: Spiral Bullet Hell
    if (e.bossPhase === 1) {
      if (e.stateTimer - e.lastShot >= 0.18) {
        e.lastShot = e.stateTimer;
        const spiralAngle = e.stateTimer * 4;
        const speed = 4.0;
        for (let k = 0; k < 2; k++) {
          const a = spiralAngle + k * Math.PI;
          projectiles.spawnEnemyProjectile(
            e.x,
            e.y,
            Math.cos(a) * speed,
            Math.sin(a) * speed,
            12,
            '#ff0044',
            4.5
          );
        }
      }
    } else if (e.bossPhase === 2) {
      // Phase 2: Radial nova bursts + faster spirals
      if (e.stateTimer - e.lastShot >= 1.2) {
        e.lastShot = e.stateTimer;
        const count = 12;
        const speed = 4.8;
        for (let k = 0; k < count; k++) {
          const a = (k / count) * Math.PI * 2;
          projectiles.spawnEnemyProjectile(
            e.x,
            e.y,
            Math.cos(a) * speed,
            Math.sin(a) * speed,
            15,
            '#ff00ff',
            5
          );
        }
      }
    } else {
      // Phase 3: Enraged bullet rain
      if (e.stateTimer - e.lastShot >= 0.35) {
        e.lastShot = e.stateTimer;
        const speed = 6.0;
        for (let k = -2; k <= 2; k++) {
          const a = angle + k * 0.22;
          projectiles.spawnEnemyProjectile(
            e.x,
            e.y,
            Math.cos(a) * speed,
            Math.sin(a) * speed,
            18,
            '#ff5500',
            5
          );
        }
      }
    }
  }

  private updateBossNexus(
    e: Enemy,
    player: PlayerStats,
    simDt: number,
    projectiles: ProjectileManager
  ) {
    const angle = Vector2D.angle(e, player);
    e.angle = angle;

    e.vx = Math.cos(angle) * e.speed;
    e.vy = Math.sin(angle) * e.speed;
    e.x += e.vx * simDt;
    e.y += e.vy * simDt;

    // Periodic 360 ring
    if (e.stateTimer - e.lastShot >= 2.0) {
      e.lastShot = e.stateTimer;
      const ringCount = 16;
      for (let k = 0; k < ringCount; k++) {
        const a = (k / ringCount) * Math.PI * 2;
        projectiles.spawnEnemyProjectile(
          e.x,
          e.y,
          Math.cos(a) * 4.2,
          Math.sin(a) * 4.2,
          16,
          '#00ffff',
          4.5
        );
      }
    }
  }

  private killEnemy(
    e: Enemy,
    index: number,
    particles: ParticleSystem,
    drops: DropManager,
    grid: CyberGrid,
    onEnemyKill: (points: number, isBoss: boolean) => void
  ) {
    particles.createExplosion(e.x, e.y, e.glowColor, e.isBoss ? 60 : 25, e.isBoss);
    grid.applyForce(e.x, e.y, e.isBoss ? 160 : 70, e.isBoss ? 12 : 5);
    soundManager.playExplosion(e.isBoss);

    // Drop loot
    drops.spawnDrop(e.x, e.y, 'xp', e.xpValue);

    // Chance for health / shields / powerups
    const lootRoll = Math.random();
    if (lootRoll < 0.12) {
      drops.spawnDrop(e.x + 8, e.y, 'health', 25);
    } else if (lootRoll < 0.22) {
      drops.spawnDrop(e.x - 8, e.y, 'shield', 25);
    } else if (lootRoll < 0.28) {
      drops.spawnDrop(e.x, e.y + 8, 'chronoBattery', 30);
    } else if (lootRoll < 0.32) {
      drops.spawnDrop(e.x, e.y - 8, 'overdrive', 1);
    }

    // Splitter enemy spawns 3 small swarmers
    if (e.type === 'splitter') {
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        this.enemies.push({
          id: Math.random().toString(36).substring(2, 9),
          type: 'swarmer',
          x: e.x + Math.cos(a) * 15,
          y: e.y + Math.sin(a) * 15,
          vx: 0,
          vy: 0,
          radius: 9,
          health: 20 * (1 + this.wave * 0.15),
          maxHealth: 20 * (1 + this.wave * 0.15),
          speed: 2.6,
          damage: 10,
          color: '#ffcc00',
          glowColor: '#ffaa00',
          points: 50,
          xpValue: 10,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        });
      }
    }

    if (e.isBoss) {
      this.currentBoss = null;
    }

    this.enemies.splice(index, 1);
    onEnemyKill(e.points, Boolean(e.isBoss));
  }

  // Spawn Enemy helpers
  private spawnRandomEnemy(width: number, height: number) {
    // Pick side of screen (0: top, 1: right, 2: bottom, 3: left)
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    if (side === 0) {
      x = Math.random() * width;
      y = -20;
    } else if (side === 1) {
      x = width + 20;
      y = Math.random() * height;
    } else if (side === 2) {
      x = Math.random() * width;
      y = height + 20;
    } else {
      x = -20;
      y = Math.random() * height;
    }

    // Available types based on wave
    const types: EnemyType[] = ['swarmer'];
    if (this.wave >= 2) types.push('speeder');
    if (this.wave >= 3) types.push('sniper');
    if (this.wave >= 4) types.push('brute');
    if (this.wave >= 6) types.push('phantom');
    if (this.wave >= 7) types.push('splitter');

    const chosenType = Vector2D.randomChoice(types);
    const hpScale = 1 + this.wave * 0.18;
    const dmgScale = 1 + this.wave * 0.12;

    let enemy: Enemy;
    switch (chosenType) {
      case 'speeder':
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'speeder',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 12,
          health: 25 * hpScale,
          maxHealth: 25 * hpScale,
          speed: 3.4,
          damage: 12 * dmgScale,
          color: '#ffdd00',
          glowColor: '#ffbb00',
          points: 80,
          xpValue: 15,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        };
        break;
      case 'sniper':
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'sniper',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 14,
          health: 35 * hpScale,
          maxHealth: 35 * hpScale,
          speed: 1.8,
          damage: 20 * dmgScale,
          color: '#ff0055',
          glowColor: '#ff0033',
          points: 120,
          xpValue: 25,
          angle: 0,
          shootCooldown: 2.2,
          lastShot: 0,
          stateTimer: 0,
        };
        break;
      case 'brute':
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'brute',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 22,
          health: 120 * hpScale,
          maxHealth: 120 * hpScale,
          speed: 1.2,
          damage: 30 * dmgScale,
          color: '#ff3300',
          glowColor: '#ff1100',
          points: 250,
          xpValue: 50,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        };
        break;
      case 'phantom':
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'phantom',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 13,
          health: 45 * hpScale,
          maxHealth: 45 * hpScale,
          speed: 2.5,
          damage: 22 * dmgScale,
          color: '#bf00ff',
          glowColor: '#aa00ee',
          points: 180,
          xpValue: 35,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        };
        break;
      case 'splitter':
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'splitter',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 17,
          health: 60 * hpScale,
          maxHealth: 60 * hpScale,
          speed: 1.6,
          damage: 18 * dmgScale,
          color: '#00ff88',
          glowColor: '#00dd66',
          points: 150,
          xpValue: 30,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        };
        break;
      default: // swarmer
        enemy = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'swarmer',
          x,
          y,
          vx: 0,
          vy: 0,
          radius: 11,
          health: 20 * hpScale,
          maxHealth: 20 * hpScale,
          speed: 2.2,
          damage: 10 * dmgScale,
          color: '#ff0077',
          glowColor: '#ff0055',
          points: 50,
          xpValue: 10,
          angle: 0,
          shootCooldown: 0,
          lastShot: 0,
          stateTimer: 0,
        };
    }

    // Elite mutant mutation for higher waves
    const isElite = this.wave >= 3 && Math.random() < Math.min(0.35, 0.05 + this.wave * 0.03);
    if (isElite) {
      enemy.isElite = true;
      enemy.health *= 1.8;
      enemy.maxHealth *= 1.8;
      enemy.speed *= 1.2;
      enemy.radius *= 1.25;
      enemy.color = '#ff1155';
      enemy.glowColor = '#ff0033';
      enemy.points *= 2.5;
      enemy.xpValue *= 2;
    }

    this.enemies.push(enemy);
  }

  private spawnBoss(width: number, _height: number) {
    const isLeviathan = this.wave % 10 === 5;
    const hp = (isLeviathan ? 1200 : 2500) * (1 + this.wave * 0.25);

    const boss: Enemy = {
      id: 'boss_' + this.wave,
      type: isLeviathan ? 'boss_leviathan' : 'boss_nexus',
      x: width / 2,
      y: -60,
      vx: 0,
      vy: 1.5,
      radius: isLeviathan ? 40 : 48,
      health: hp,
      maxHealth: hp,
      speed: 0.8,
      damage: 35,
      color: isLeviathan ? '#ff0055' : '#00ffff',
      glowColor: isLeviathan ? '#ff0033' : '#00ccff',
      points: 2500,
      xpValue: 300,
      angle: 0,
      shootCooldown: 0.2,
      lastShot: 0,
      stateTimer: 0,
      isBoss: true,
      bossPhase: 1,
    };

    this.enemies.push(boss);
    this.currentBoss = boss;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    for (const e of this.enemies) {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.angle);

      // Render enemy shape
      ctx.shadowColor = e.glowColor;
      ctx.shadowBlur = e.isBoss ? 20 : 10;
      ctx.fillStyle = e.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      if (e.type === 'swarmer') {
        // Triangle bug
        ctx.moveTo(e.radius * 1.3, 0);
        ctx.lineTo(-e.radius, -e.radius * 0.8);
        ctx.lineTo(-e.radius * 0.5, 0);
        ctx.lineTo(-e.radius, e.radius * 0.8);
        ctx.closePath();
      } else if (e.type === 'speeder') {
        // Sleek dart
        ctx.moveTo(e.radius * 1.6, 0);
        ctx.lineTo(-e.radius, -e.radius * 0.6);
        ctx.lineTo(-e.radius * 0.4, 0);
        ctx.lineTo(-e.radius, e.radius * 0.6);
        ctx.closePath();
      } else if (e.type === 'sniper') {
        // Hexagon with core
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const px = Math.cos(a) * e.radius;
          const py = Math.sin(a) * e.radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (e.type === 'brute') {
        // Octagon armored tank
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2;
          const px = Math.cos(a) * e.radius;
          const py = Math.sin(a) * e.radius;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (e.isBoss) {
        // Multi-wing Boss
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const r = i % 2 === 0 ? e.radius : e.radius * 0.65;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else {
        // Diamond
        ctx.moveTo(e.radius, 0);
        ctx.lineTo(0, -e.radius);
        ctx.lineTo(-e.radius, 0);
        ctx.lineTo(0, e.radius);
        ctx.closePath();
      }

      ctx.fill();
      ctx.stroke();

      // Inner pulsating core
      ctx.beginPath();
      ctx.arc(0, 0, e.radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      // Elite Glowing Hazard Ring
      if (e.isElite) {
        ctx.beginPath();
        ctx.arc(0, 0, e.radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      // Enemy Health Bar (if damaged or boss)
      if (e.health < e.maxHealth || e.isBoss) {
        const barWidth = e.isBoss ? e.radius * 2.5 : e.radius * 2;
        const barHeight = e.isBoss ? 5 : 3;
        const barY = e.y - e.radius - 8;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(e.x - barWidth / 2, barY, barWidth, barHeight);

        const hpRatio = Math.max(0, e.health / e.maxHealth);
        ctx.fillStyle = e.isBoss ? '#ff0055' : '#00ffcc';
        ctx.fillRect(e.x - barWidth / 2, barY, barWidth * hpRatio, barHeight);
      }
    }

    ctx.restore();
  }

  public clear() {
    this.enemies = [];
    this.currentBoss = null;
    this.wave = 1;
    this.enemiesSpawnedThisWave = 0;
  }
}
