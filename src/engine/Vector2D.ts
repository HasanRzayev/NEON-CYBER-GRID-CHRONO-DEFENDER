import type { Vector2 } from '../types/game';

export class Vector2D {
  static create(x = 0, y = 0): Vector2 {
    return { x, y };
  }

  static distance(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSq(a: Vector2, b: Vector2): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return dx * dx + dy * dy;
  }

  static angle(from: Vector2, to: Vector2): number {
    return Math.atan2(to.y - from.y, to.x - from.x);
  }

  static length(v: Vector2): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: Vector2): Vector2 {
    const len = Vector2D.length(v);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  }

  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * Math.min(1, Math.max(0, t));
  }

  static lerpVector(a: Vector2, b: Vector2, t: number): Vector2 {
    return {
      x: Vector2D.lerp(a.x, b.x, t),
      y: Vector2D.lerp(a.y, b.y, t)
    };
  }

  static clamp(val: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, val));
  }

  static circleCollision(
    p1: Vector2,
    r1: number,
    p2: Vector2,
    r2: number
  ): boolean {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const radii = r1 + r2;
    return dx * dx + dy * dy <= radii * radii;
  }

  static randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  static randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}
