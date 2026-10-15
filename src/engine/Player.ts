import type { PlayerStats, WeaponStats, WeaponType, Drone, Enemy, Vector2 } from '../types/game';
import { Vector2D } from './Vector2D';
import type { ProjectileManager } from './ProjectileManager';
import type { ParticleSystem } from './ParticleSystem';
import type { CyberGrid } from './CyberGrid';
import { soundManager } from '../audio/SoundManager';

export class Player {
  public stats: PlayerStats;
  public weapons: Map<WeaponType, WeaponStats> = new Map();
  public drones: Drone[] = [];
  public aimAngle = 0;
  public aimPos: Vector2 = { x: 0, y: 0 };
  private invulnerableTimer = 0;

  constructor(startX = 400, startY = 300) {
    this.stats = {
      x: startX,
      y: startY,
      vx: 0,
      vy: 0,
      radius: 16,
      speed: 4.8,
      maxSpeed: 7.0,
      health: 100,
      maxHealth: 100,
      shield: 50,
      maxShield: 50,
      shieldRegenRate: 15,
      shieldRegenDelay: 2.5,
      lastHitTime: 0,

      // Chrono Energy (Bullet-Time)
      chronoEnergy: 100,
      maxChronoEnergy: 100,
      chronoRegenRate: 14,
      isChronoActive: false,
      chronoSlowFactor: 0.22,

      // Quantum Dash
      dashCooldown: 1.6,
      lastDashTime: -10,
      dashDuration: 0.18,
      isDashing: false,
      dashSpeedMultiplier: 3.4,

      // Progression
      level: 1,
      xp: 0,
      nextLevelXp: 40,
      score: 0,
      combo: 1,
      comboTimer: 0,
      maxCombo: 1,

      // Multipliers
      damageMultiplier: 1.0,
      fireRateMultiplier: 1.0,
      critChance: 0.08,
      critMultiplier: 1.75,
      pickupMagnetRadius: 120,

      armorPercent: 0,
      hpRegenRate: 0.5,
      overdriveTimer: 0,
    };

    this.initWeapons();
  }

  private initWeapons() {
    this.weapons.set('plasma', {
      id: 'plasma',
      name: 'Dual Plasma Blaster',
      level: 1,
      unlocked: true,
      damage: 18,
      fireRate: 5.5,
      lastFired: 0,
      projectileSpeed: 13,
      color: '#00ffff',
      range: 800,
      pierce: 0,
      spreadCount: 2,
    });

    this.weapons.set('chronoBeam', {
      id: 'chronoBeam',
      name: 'Chrono Beam',
      level: 0,
      unlocked: false,
      damage: 32,
      fireRate: 2.2,
      lastFired: 0,
      projectileSpeed: 18,
      color: '#00ffaa',
      range: 900,
      pierce: 99,
      spreadCount: 1,
    });

    this.weapons.set('arcLightning', {
      id: 'arcLightning',
      name: 'Arc Lightning Coil',
      level: 0,
      unlocked: false,
      damage: 28,
      fireRate: 1.8,
      lastFired: 0,
      projectileSpeed: 15,
      color: '#ff00ff',
      range: 450,
      pierce: 3,
      spreadCount: 1,
    });

    this.weapons.set('microMissile', {
      id: 'microMissile',
      name: 'Micro-Missile Pod',
      level: 0,
      unlocked: false,
      damage: 45,
      fireRate: 1.2,
      lastFired: 0,
      projectileSpeed: 8,
      color: '#ffaa00',
      range: 800,
      pierce: 0,
      spreadCount: 3,
    });

    this.weapons.set('empWave', {
      id: 'empWave',
      name: 'Omega EMP Wave',
      level: 0,
      unlocked: false,
      damage: 60,
      fireRate: 0.15, // once every ~7 seconds
      lastFired: 0,
      projectileSpeed: 0,
      color: '#ffffff',
      range: 300,
      pierce: 99,
      spreadCount: 1,
    });
  }

  public update(
    dt: number,
    inputKeys: Record<string, boolean>,
    projectiles: ProjectileManager,
    particles: ParticleSystem,
    grid: CyberGrid,
    enemies: Enemy[],
    arenaWidth: number,
    arenaHeight: number,
    onLevelUp: () => void
  ) {
    const now = performance.now() * 0.001;

    // Handle Dash / Quantum Blink
    const timeSinceDash = now - this.stats.lastDashTime;
    if (this.stats.isDashing) {
      if (timeSinceDash >= this.stats.dashDuration) {
        this.stats.isDashing = false;
      } else {
        particles.createDashTrail(this.stats.x, this.stats.y, this.stats.radius);
      }
    }

    // Chrono Energy Management
    if (this.stats.isChronoActive) {
      this.stats.chronoEnergy -= 28 * dt;
      if (this.stats.chronoEnergy <= 0) {
        this.stats.chronoEnergy = 0;
        this.stats.isChronoActive = false;
        soundManager.playChronoExit();
      }
    } else {
      if (this.stats.chronoEnergy < this.stats.maxChronoEnergy) {
        this.stats.chronoEnergy = Math.min(
          this.stats.maxChronoEnergy,
          this.stats.chronoEnergy + this.stats.chronoRegenRate * dt
        );
      }
    }

    // Shield Regeneration
    if (now - this.stats.lastHitTime >= this.stats.shieldRegenDelay) {
      if (this.stats.shield < this.stats.maxShield) {
        this.stats.shield = Math.min(
          this.stats.maxShield,
          this.stats.shield + this.stats.shieldRegenRate * dt
        );
      }
    }

    // Passive HP Regen
    if (this.stats.health < this.stats.maxHealth && this.stats.hpRegenRate > 0) {
      this.stats.health = Math.min(
        this.stats.maxHealth,
        this.stats.health + this.stats.hpRegenRate * dt
      );
    }

    // Overdrive Timer
    if (this.stats.overdriveTimer > 0) {
      this.stats.overdriveTimer -= dt;
    }

    // Combo Timer Decay
    if (this.stats.comboTimer > 0) {
      this.stats.comboTimer -= dt;
      if (this.stats.comboTimer <= 0) {
        this.stats.combo = 1;
      }
    }

    // Invulnerability timer
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }

    // Movement calculation
    let moveX = 0;
    let moveY = 0;
    if (inputKeys['KeyW'] || inputKeys['ArrowUp']) moveY -= 1;
    if (inputKeys['KeyS'] || inputKeys['ArrowDown']) moveY += 1;
    if (inputKeys['KeyA'] || inputKeys['ArrowLeft']) moveX -= 1;
    if (inputKeys['KeyD'] || inputKeys['ArrowRight']) moveX += 1;

    // Normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
      const invLen = 1 / Math.SQRT2;
      moveX *= invLen;
      moveY *= invLen;
    }

    const currentSpeed = this.stats.isDashing
      ? this.stats.speed * this.stats.dashSpeedMultiplier
      : this.stats.speed;

    this.stats.vx = Vector2D.lerp(this.stats.vx, moveX * currentSpeed, 0.22);
    this.stats.vy = Vector2D.lerp(this.stats.vy, moveY * currentSpeed, 0.22);

    this.stats.x += this.stats.vx * dt * 60;
    this.stats.y += this.stats.vy * dt * 60;

    // Grid interaction on movement
    if (Math.abs(this.stats.vx) > 1 || Math.abs(this.stats.vy) > 1) {
      grid.applyForce(this.stats.x, this.stats.y, 45, 1.2);
    }

    // Clamp to arena
    this.stats.x = Vector2D.clamp(
      this.stats.x,
      this.stats.radius,
      arenaWidth - this.stats.radius
    );
    this.stats.y = Vector2D.clamp(
      this.stats.y,
      this.stats.radius,
      arenaHeight - this.stats.radius
    );

    // Update Aim Angle
    this.aimAngle = Vector2D.angle(this.stats, this.aimPos);

    // Auto-fire weapons
    this.updateWeapons(dt, now, projectiles, particles, grid, enemies);

    // Update Drones
    this.updateDrones(dt, projectiles, enemies);

    // Check Level Up
    if (this.stats.xp >= this.stats.nextLevelXp) {
      this.stats.xp -= this.stats.nextLevelXp;
      this.stats.level++;
      this.stats.nextLevelXp = Math.floor(this.stats.nextLevelXp * 1.35 + 25);
      soundManager.playLevelUp();
      particles.createExplosion(this.stats.x, this.stats.y, '#00ffcc', 40, true);
      particles.addFloatingText('LEVEL UP!', this.stats.x, this.stats.y - 25, '#00ffcc', true);
      onLevelUp();
    }
  }

  // Weapons Firing Loop
  private updateWeapons(
    _dt: number,
    now: number,
    projectiles: ProjectileManager,
    particles: ParticleSystem,
    grid: CyberGrid,
    enemies: Enemy[]
  ) {
    const isOverdrive = this.stats.overdriveTimer > 0;
    const fireMultiplier =
      this.stats.fireRateMultiplier * (isOverdrive ? 1.6 : 1.0) * (this.stats.isChronoActive ? 1.25 : 1.0);

    // 1. Dual Plasma Blaster
    const plasma = this.weapons.get('plasma')!;
    if (plasma.unlocked && now - plasma.lastFired >= 1 / (plasma.fireRate * fireMultiplier)) {
      plasma.lastFired = now;
      soundManager.playShoot('plasma');

      const spreadOffset = 10;
      const perpAngle = this.aimAngle + Math.PI / 2;
      const px = Math.cos(perpAngle) * spreadOffset;
      const py = Math.sin(perpAngle) * spreadOffset;

      const dmg = plasma.damage * this.stats.damageMultiplier * (isOverdrive ? 1.5 : 1.0);

      // Dual shot
      projectiles.spawnPlayerProjectile(
        this.stats.x + px,
        this.stats.y + py,
        Math.cos(this.aimAngle) * plasma.projectileSpeed,
        Math.sin(this.aimAngle) * plasma.projectileSpeed,
        'plasma',
        dmg,
        plasma.pierce,
        plasma.color
      );
      projectiles.spawnPlayerProjectile(
        this.stats.x - px,
        this.stats.y - py,
        Math.cos(this.aimAngle) * plasma.projectileSpeed,
        Math.sin(this.aimAngle) * plasma.projectileSpeed,
        'plasma',
        dmg,
        plasma.pierce,
        plasma.color
      );

      particles.createMuzzleSpark(this.stats, { x: Math.cos(this.aimAngle), y: Math.sin(this.aimAngle) }, plasma.color);
    }

    // 2. Chrono Beam
    const beam = this.weapons.get('chronoBeam');
    if (beam && beam.unlocked && now - beam.lastFired >= 1 / (beam.fireRate * fireMultiplier)) {
      beam.lastFired = now;
      soundManager.playShoot('chronoBeam');

      projectiles.spawnPlayerProjectile(
        this.stats.x,
        this.stats.y,
        Math.cos(this.aimAngle) * beam.projectileSpeed,
        Math.sin(this.aimAngle) * beam.projectileSpeed,
        'chronoBeam',
        beam.damage * this.stats.damageMultiplier,
        beam.pierce,
        beam.color
      );
      grid.applyForce(this.stats.x, this.stats.y, 60, 2.5);
    }

    // 3. Arc Lightning
    const arc = this.weapons.get('arcLightning');
    if (arc && arc.unlocked && now - arc.lastFired >= 1 / (arc.fireRate * fireMultiplier)) {
      arc.lastFired = now;
      soundManager.playShoot('arcLightning');

      // Target closest enemy
      let closest: Enemy | undefined = undefined;
      let closestDist = arc.range;
      for (const e of enemies) {
        const d = Vector2D.distance(this.stats, e);
        if (d < closestDist) {
          closestDist = d;
          closest = e;
        }
      }

      if (closest) {
        const angle = Vector2D.angle(this.stats, closest);
        projectiles.spawnPlayerProjectile(
          this.stats.x,
          this.stats.y,
          Math.cos(angle) * arc.projectileSpeed,
          Math.sin(angle) * arc.projectileSpeed,
          'arcLightning',
          arc.damage * this.stats.damageMultiplier,
          arc.pierce,
          arc.color
        );
      }
    }

    // 4. Micro Missiles
    const missile = this.weapons.get('microMissile');
    if (missile && missile.unlocked && now - missile.lastFired >= 1 / (missile.fireRate * fireMultiplier)) {
      missile.lastFired = now;
      soundManager.playShoot('microMissile');

      for (let m = -1; m <= 1; m++) {
        const angle = this.aimAngle + m * 0.35;
        projectiles.spawnPlayerProjectile(
          this.stats.x,
          this.stats.y,
          Math.cos(angle) * missile.projectileSpeed,
          Math.sin(angle) * missile.projectileSpeed,
          'microMissile',
          missile.damage * this.stats.damageMultiplier,
          0,
          missile.color
        );
      }
    }

    // 5. EMP Wave
    const emp = this.weapons.get('empWave');
    if (emp && emp.unlocked && now - emp.lastFired >= 1 / emp.fireRate) {
      emp.lastFired = now;
      soundManager.playExplosion(true);
      particles.createExplosion(this.stats.x, this.stats.y, '#ffffff', 50, true);
      grid.applyForce(this.stats.x, this.stats.y, 250, 15);
      projectiles.destroyEnemyProjectilesInRadius(this.stats.x, this.stats.y, emp.range, particles);

      // Damage enemies in radius
      for (const e of enemies) {
        const d = Vector2D.distance(this.stats, e);
        if (d <= emp.range) {
          e.health -= emp.damage * this.stats.damageMultiplier;
          particles.addFloatingText(Math.round(emp.damage).toString(), e.x, e.y, '#00ffff');
        }
      }
    }
  }

  // Drones
  private updateDrones(dt: number, projectiles: ProjectileManager, enemies: Enemy[]) {
    const now = performance.now() * 0.001;

    for (let i = 0; i < this.drones.length; i++) {
      const drone = this.drones[i];
      drone.orbitAngle += drone.orbitSpeed * dt;

      const dx = this.stats.x + Math.cos(drone.orbitAngle) * drone.orbitDistance;
      const dy = this.stats.y + Math.sin(drone.orbitAngle) * drone.orbitDistance;

      if (drone.type === 'attack' && now - drone.lastFired >= drone.fireCooldown) {
        drone.lastFired = now;
        // Shoot closest enemy
        let closest: Enemy | undefined = undefined;
        let closestDist = 350;
        for (const e of enemies) {
          const d = Vector2D.distance({ x: dx, y: dy }, e);
          if (d < closestDist) {
            closestDist = d;
            closest = e;
          }
        }
        if (closest) {
          const a = Vector2D.angle({ x: dx, y: dy }, closest);
          projectiles.spawnPlayerProjectile(
            dx,
            dy,
            Math.cos(a) * 11,
            Math.sin(a) * 11,
            'plasma',
            14 * this.stats.damageMultiplier,
            0,
            '#00ffea'
          );
          soundManager.playShoot('plasma');
        }
      }
    }
  }

  // Actions
  public triggerDash(particles: ParticleSystem, grid: CyberGrid): boolean {
    const now = performance.now() * 0.001;
    if (now - this.stats.lastDashTime < this.stats.dashCooldown) {
      return false;
    }

    this.stats.lastDashTime = now;
    this.stats.isDashing = true;
    this.invulnerableTimer = this.stats.dashDuration + 0.1;
    soundManager.playDash();
    particles.createExplosion(this.stats.x, this.stats.y, '#00ffff', 15, false);
    grid.applyForce(this.stats.x, this.stats.y, 90, 4);
    return true;
  }

  public toggleChrono(): boolean {
    if (this.stats.isChronoActive) {
      this.stats.isChronoActive = false;
      soundManager.playChronoExit();
      return false;
    } else if (this.stats.chronoEnergy >= 15) {
      this.stats.isChronoActive = true;
      soundManager.playChronoEnter();
      return true;
    }
    return false;
  }

  // Damage
  public takeDamage(
    amount: number,
    particles: ParticleSystem,
    onScreenShake: (intensity: number) => void
  ): boolean {
    if (this.invulnerableTimer > 0 || this.stats.isDashing) return false;

    const actualDamage = amount * (1 - this.stats.armorPercent);
    this.stats.lastHitTime = performance.now() * 0.001;
    this.invulnerableTimer = 0.25; // Brief i-frames

    // Absorb with shield first
    if (this.stats.shield > 0) {
      if (this.stats.shield >= actualDamage) {
        this.stats.shield -= actualDamage;
        particles.createExplosion(this.stats.x, this.stats.y, '#00e5ff', 12, false);
      } else {
        const remainder = actualDamage - this.stats.shield;
        this.stats.shield = 0;
        this.stats.health -= remainder;
        particles.createExplosion(this.stats.x, this.stats.y, '#ff0055', 20, false);
      }
    } else {
      this.stats.health -= actualDamage;
      particles.createExplosion(this.stats.x, this.stats.y, '#ff0055', 20, false);
    }

    soundManager.playExplosion(false);
    onScreenShake(6.0);
    this.stats.combo = 1; // Reset combo

    return this.stats.health <= 0;
  }

  // Register Kill / Add Combo
  public addCombo(points: number) {
    this.stats.combo = Math.min(99, this.stats.combo + 1);
    this.stats.comboTimer = 2.8; // 2.8s to keep combo alive
    if (this.stats.combo > this.stats.maxCombo) {
      this.stats.maxCombo = this.stats.combo;
    }
    this.stats.score += points * this.stats.combo;
  }

  public addXp(amount: number) {
    this.stats.xp += amount;
  }

  public heal(amount: number) {
    this.stats.health = Math.min(this.stats.maxHealth, this.stats.health + amount);
  }

  public rechargeShield(amount: number) {
    this.stats.shield = Math.min(this.stats.maxShield, this.stats.shield + amount);
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.stats.x, this.stats.y);

    // Invulnerability flashing
    if (this.invulnerableTimer > 0 && Math.floor(performance.now() * 0.02) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Outer Shield Dome
    if (this.stats.shield > 0) {
      const shieldRatio = this.stats.shield / this.stats.maxShield;
      ctx.beginPath();
      ctx.arc(0, 0, this.stats.radius + 7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 229, 255, ${0.3 + shieldRatio * 0.5})`;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.stroke();
    }

    // Chrono Aura ring
    if (this.stats.isChronoActive) {
      ctx.beginPath();
      ctx.arc(0, 0, this.stats.radius + 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Player Ship Body (Hexagonal Interceptor)
    ctx.rotate(this.aimAngle);

    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#050c1e';
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(this.stats.radius * 1.5, 0); // Front nose
    ctx.lineTo(-this.stats.radius * 0.9, -this.stats.radius); // Top wing
    ctx.lineTo(-this.stats.radius * 0.4, 0); // Engine indent
    ctx.lineTo(-this.stats.radius * 0.9, this.stats.radius); // Bottom wing
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glowing Core Reactor
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.stats.isChronoActive ? '#00ffaa' : '#00ffff';
    ctx.fill();

    // Thruster flame
    if (Math.abs(this.stats.vx) > 0.5 || Math.abs(this.stats.vy) > 0.5) {
      ctx.beginPath();
      ctx.moveTo(-this.stats.radius * 0.4, -3);
      ctx.lineTo(-this.stats.radius * 1.4, 0);
      ctx.lineTo(-this.stats.radius * 0.4, 3);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    ctx.restore();

    // Render Drones
    for (const drone of this.drones) {
      const dx = this.stats.x + Math.cos(drone.orbitAngle) * drone.orbitDistance;
      const dy = this.stats.y + Math.sin(drone.orbitAngle) * drone.orbitDistance;

      ctx.save();
      ctx.translate(dx, dy);
      ctx.fillStyle = '#00ffea';
      ctx.shadowColor = '#00ffea';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      // Drone orbital ring
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 234, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }
}
