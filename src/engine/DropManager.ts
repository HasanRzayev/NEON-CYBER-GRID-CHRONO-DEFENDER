import type { DropItem, DropType, Vector2 } from '../types/game';
import { Vector2D } from './Vector2D';

export class DropManager {
  private drops: DropItem[] = [];

  public spawnDrop(x: number, y: number, type: DropType, value: number) {
    const colorMap: Record<DropType, string> = {
      xp: '#00ffcc',
      health: '#00ff66',
      shield: '#00ccff',
      chronoBattery: '#ffcc00',
      overdrive: '#ff00ff',
    };

    const angle = Math.random() * Math.PI * 2;
    const speed = Vector2D.randomRange(1, 3);

    this.drops.push({
      id: Math.random().toString(36).substring(2, 9),
      type,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: type === 'xp' ? 4 : 7,
      value,
      color: colorMap[type],
      life: 0,
      maxLife: 20.0, // Stays on field for 20s
    });
  }

  public update(dt: number, playerPos: Vector2, magnetRadius: number) {
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i];
      d.life += dt;
      if (d.life >= d.maxLife) {
        this.drops.splice(i, 1);
        continue;
      }

      // Physics damping
      d.vx *= 0.92;
      d.vy *= 0.92;

      // Magnetic attraction to player
      const dist = Vector2D.distance(d, playerPos);
      if (dist < magnetRadius) {
        const pullFactor = (1 - dist / magnetRadius) * 8.0 + 2.0;
        const angle = Vector2D.angle(d, playerPos);
        d.vx += Math.cos(angle) * pullFactor;
        d.vy += Math.sin(angle) * pullFactor;
      }

      d.x += d.vx * dt * 60;
      d.y += d.vy * dt * 60;
    }
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const now = performance.now() * 0.005;

    for (const d of this.drops) {
      const pulse = Math.sin(now + d.x * 0.1) * 1.5;
      const r = d.radius + pulse;

      ctx.beginPath();
      if (d.type === 'xp') {
        // Diamond shape
        ctx.moveTo(d.x, d.y - r * 1.3);
        ctx.lineTo(d.x + r, d.y);
        ctx.lineTo(d.x, d.y + r * 1.3);
        ctx.lineTo(d.x - r, d.y);
        ctx.closePath();
      } else {
        // Glowing Orb with ring
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      }

      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 10;
      ctx.fill();

      // Core white light
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(1, r * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    ctx.restore();
  }

  public getDrops(): DropItem[] {
    return this.drops;
  }

  public removeDrop(id: string) {
    const idx = this.drops.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.drops.splice(idx, 1);
    }
  }

  public clear() {
    this.drops = [];
  }
}
