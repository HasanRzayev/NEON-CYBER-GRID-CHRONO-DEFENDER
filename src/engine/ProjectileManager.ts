import type { Projectile, WeaponType, Enemy } from '../types/game';
import { Vector2D } from './Vector2D';
import type { ParticleSystem } from './ParticleSystem';
import type { CyberGrid } from './CyberGrid';

export class ProjectileManager {
  private projectiles: Projectile[] = [];

  public update(
    dt: number,
    slowFactor: number,
    particles: ParticleSystem,
    grid: CyberGrid,
    enemies: Enemy[],
    arenaWidth: number,
    arenaHeight: number
  ) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];

      // Enemy projectiles slow down during Chrono Matrix; player projectiles remain at full speed
      const effectiveSlow = p.fromPlayer ? 1.0 : slowFactor;
      const simDt = dt * effectiveSlow * 60;

      p.life += dt * effectiveSlow;
      if (p.life >= p.maxLife || p.hitsLeft <= 0) {
        // Expiration puff
        if (p.weaponType === 'microMissile') {
          particles.createExplosion(p.x, p.y, p.color, 8, false);
          grid.applyForce(p.x, p.y, 40, 2);
        }
        this.projectiles.splice(i, 1);
        continue;
      }

      // Homing logic for Micro Missiles
      if (p.weaponType === 'microMissile' && p.fromPlayer) {
        if (!p.homingTarget || p.homingTarget.health <= 0) {
          // Find closest target
          let closestDist = Infinity;
          let closestEnemy: Enemy | undefined = undefined;
          for (const e of enemies) {
            const dist = Vector2D.distance(p, e);
            if (dist < closestDist) {
              closestDist = dist;
              closestEnemy = e;
            }
          }
          p.homingTarget = closestEnemy;
        }

        if (p.homingTarget) {
          const targetAngle = Vector2D.angle(p, p.homingTarget);
          const currentAngle = Math.atan2(p.vy, p.vx);
          let diff = targetAngle - currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          const turnSpeed = (p.homingStrength || 0.12) * simDt;
          const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), turnSpeed);
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          p.vx = Math.cos(newAngle) * speed;
          p.vy = Math.sin(newAngle) * speed;
        }
      }

      // Store trail points
      p.trail.unshift({ x: p.x, y: p.y });
      if (p.trail.length > 6) {
        p.trail.pop();
      }

      // Position update
      p.x += p.vx * simDt;
      p.y += p.vy * simDt;

      // Arena bounds check
      if (
        p.x < -50 ||
        p.x > arenaWidth + 50 ||
        p.y < -50 ||
        p.y > arenaHeight + 50
      ) {
        this.projectiles.splice(i, 1);
        continue;
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const p of this.projectiles) {
      // Draw neon motion trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        for (let j = 0; j < p.trail.length; j++) {
          ctx.lineTo(p.trail[j].x, p.trail[j].y);
        }
        ctx.strokeStyle = p.glowColor;
        ctx.lineWidth = p.radius * 1.5;
        ctx.globalAlpha = 0.35;
        ctx.stroke();
      }

      // Draw projectile body
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.glowColor;
      ctx.shadowBlur = p.fromPlayer ? 10 : 8;
      ctx.fill();

      // Inner white core for high intensity
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.radius * 0.45), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore();
  }

  // Spawn Player Projectile
  public spawnPlayerProjectile(
    x: number,
    y: number,
    vx: number,
    vy: number,
    type: WeaponType,
    damage: number,
    pierce: number,
    color = '#00f0ff'
  ) {
    const radius = type === 'microMissile' ? 4.5 : type === 'chronoBeam' ? 6 : 3.5;
    this.projectiles.push({
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      vx,
      vy,
      radius,
      damage,
      color,
      glowColor: color,
      fromPlayer: true,
      weaponType: type,
      pierce,
      hitsLeft: pierce + 1,
      life: 0,
      maxLife: type === 'microMissile' ? 3.0 : 1.8,
      homingStrength: type === 'microMissile' ? 0.14 : undefined,
      trail: [],
    });
  }

  // Spawn Enemy Projectile
  public spawnEnemyProjectile(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number,
    color = '#ff0055',
    radius = 4
  ) {
    this.projectiles.push({
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      vx,
      vy,
      radius,
      damage,
      color,
      glowColor: color,
      fromPlayer: false,
      weaponType: 'plasma',
      pierce: 0,
      hitsLeft: 1,
      life: 0,
      maxLife: 5.0,
      trail: [],
    });
  }

  // EMP wave that destroys all incoming enemy projectiles
  public destroyEnemyProjectilesInRadius(x: number, y: number, radius: number, particles: ParticleSystem): number {
    let count = 0;
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (!p.fromPlayer) {
        const dist = Vector2D.distance({ x, y }, p);
        if (dist <= radius) {
          particles.createExplosion(p.x, p.y, '#00ffff', 6, false);
          this.projectiles.splice(i, 1);
          count++;
        }
      }
    }
    return count;
  }

  public getProjectiles(): Projectile[] {
    return this.projectiles;
  }

  public clear() {
    this.projectiles = [];
  }
}
