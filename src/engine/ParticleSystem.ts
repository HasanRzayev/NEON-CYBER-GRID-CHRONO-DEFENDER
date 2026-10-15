import type { Particle, FloatingText, Vector2 } from '../types/game';
import { Vector2D } from './Vector2D';

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  speed: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];
  private shockwaves: Shockwave[] = [];

  public update(dt: number, slowFactor = 1.0) {
    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      const simDt = dt * slowFactor;
      p.x += p.vx * simDt * 60;
      p.y += p.vy * simDt * 60;
      p.vx *= Math.pow(p.friction, simDt * 60);
      p.vy *= Math.pow(p.friction, simDt * 60);

      if (p.gravity) {
        p.vy += p.gravity * simDt * 60;
      }

      p.alpha = Math.max(0, 1 - p.life / p.maxLife);
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += dt;
      if (ft.life >= ft.maxLife) {
        this.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y += ft.vy * dt * 60;
      ft.alpha = Math.max(0, 1 - ft.life / ft.maxLife);
    }

    // Update Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed * dt * 60 * slowFactor;
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // Render Shockwaves
    for (const sw of this.shockwaves) {
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = 3 * sw.alpha;
      ctx.globalAlpha = sw.alpha * 0.8;
      ctx.stroke();
    }

    // Render Particles
    for (const p of this.particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'line' || p.shape === 'spark') {
        const angle = Math.atan2(p.vy, p.vx);
        const len = p.length || p.radius * 2.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - Math.cos(angle) * len, p.y - Math.sin(angle) * len);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.radius;
        ctx.stroke();
      } else if (p.shape === 'square') {
        const size = p.radius * 2;
        ctx.fillRect(p.x - p.radius, p.y - p.radius, size, size);
      } else if (p.shape === 'ring') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + (p.life / p.maxLife) * 2), 0, Math.PI * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Default glowing circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Render Floating Texts
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'center';
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `${ft.isCrit ? 'bold ' : ''}${ft.size}px 'Orbitron', monospace`;
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = ft.isCrit ? 12 : 6;
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.restore();
  }

  // Spawn Explosion
  public createExplosion(x: number, y: number, color = '#00f0ff', count = 25, isLarge = false) {
    const scale = isLarge ? 2.0 : 1.0;

    // Shockwave
    this.shockwaves.push({
      x,
      y,
      radius: 5,
      maxRadius: 80 * scale,
      color,
      alpha: 1,
      speed: 4.5 * scale,
    });

    // Sparks & Shrapnel
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Vector2D.randomRange(2, 9) * scale;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Vector2D.randomRange(1.5, 3.5) * scale,
        color,
        alpha: 1,
        life: 0,
        maxLife: Vector2D.randomRange(0.25, 0.6),
        decay: 1,
        friction: 0.92,
        shape: Math.random() > 0.4 ? 'spark' : 'circle',
      });
    }

    // Inner Glow Smoke
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x: x + Vector2D.randomRange(-5, 5),
        y: y + Vector2D.randomRange(-5, 5),
        vx: Vector2D.randomRange(-0.8, 0.8),
        vy: Vector2D.randomRange(-0.8, 0.8),
        radius: Vector2D.randomRange(10, 22) * scale,
        color: '#ffffff',
        alpha: 0.8,
        life: 0,
        maxLife: 0.35,
        decay: 1,
        friction: 0.9,
        shape: 'circle',
      });
    }
  }

  // Dash Ghost Trail
  public createDashTrail(x: number, y: number, radius: number, color = '#00ffff') {
    this.particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      color,
      alpha: 0.6,
      life: 0,
      maxLife: 0.2,
      decay: 1,
      friction: 1,
      shape: 'ring',
    });
  }

  // Floating Text (Damage or Level Up)
  public addFloatingText(text: string, x: number, y: number, color = '#ffffff', isCrit = false) {
    this.floatingTexts.push({
      id: Math.random().toString(36).substring(2, 9),
      text,
      x: x + Vector2D.randomRange(-10, 10),
      y: y + Vector2D.randomRange(-10, 5),
      vy: isCrit ? -2.2 : -1.4,
      color,
      alpha: 1,
      size: isCrit ? 20 : 14,
      life: 0,
      maxLife: isCrit ? 0.9 : 0.65,
      isCrit,
    });
  }

  // Muzzle Spark
  public createMuzzleSpark(pos: Vector2, dir: Vector2, color = '#00f0ff') {
    const angle = Math.atan2(dir.y, dir.x);
    for (let i = 0; i < 4; i++) {
      const spread = angle + Vector2D.randomRange(-0.4, 0.4);
      const speed = Vector2D.randomRange(3, 7);
      this.particles.push({
        x: pos.x,
        y: pos.y,
        vx: Math.cos(spread) * speed,
        vy: Math.sin(spread) * speed,
        radius: 1.5,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.12,
        decay: 1,
        friction: 0.85,
        shape: 'spark',
      });
    }
  }

  // Clear all
  public clear() {
    this.particles = [];
    this.floatingTexts = [];
    this.shockwaves = [];
  }
}
