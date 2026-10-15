interface GridPoint {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

export class CyberGrid {
  private points: GridPoint[][] = [];
  private cols = 0;
  private rows = 0;
  private spacing = 45;
  private spring = 0.08;
  private damping = 0.88;

  public resize(width: number, height: number) {
    this.cols = Math.ceil(width / this.spacing) + 1;
    this.rows = Math.ceil(height / this.spacing) + 1;

    this.points = [];
    for (let r = 0; r <= this.rows; r++) {
      this.points[r] = [];
      for (let c = 0; c <= this.cols; c++) {
        const x = c * this.spacing;
        const y = r * this.spacing;
        this.points[r][c] = {
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
        };
      }
    }
  }

  public update(dt: number) {
    const simStep = Math.min(1.5, dt * 60);

    for (let r = 0; r <= this.rows; r++) {
      if (!this.points[r]) continue;
      for (let c = 0; c <= this.cols; c++) {
        const p = this.points[r][c];
        if (!p) continue;

        // Spring force toward origin
        const fx = (p.originX - p.x) * this.spring;
        const fy = (p.originY - p.y) * this.spring;

        p.vx = (p.vx + fx) * this.damping;
        p.vy = (p.vy + fy) * this.damping;

        p.x += p.vx * simStep;
        p.y += p.vy * simStep;
      }
    }
  }

  // Push grid outward from shockwave or explosion
  public applyForce(x: number, y: number, radius: number, force: number) {
    const rSq = radius * radius;
    const minCol = Math.max(0, Math.floor((x - radius) / this.spacing));
    const maxCol = Math.min(this.cols, Math.ceil((x + radius) / this.spacing));
    const minRow = Math.max(0, Math.floor((y - radius) / this.spacing));
    const maxRow = Math.min(this.rows, Math.ceil((y + radius) / this.spacing));

    for (let r = minRow; r <= maxRow; r++) {
      if (!this.points[r]) continue;
      for (let c = minCol; c <= maxCol; c++) {
        const p = this.points[r][c];
        if (!p) continue;

        const dx = p.x - x;
        const dy = p.y - y;
        const distSq = dx * dx + dy * dy;

        if (distSq < rSq && distSq > 0.001) {
          const dist = Math.sqrt(distSq);
          const factor = (1 - dist / radius) * force;
          p.vx += (dx / dist) * factor;
          p.vy += (dy / dist) * factor;
        }
      }
    }
  }

  // Render elastic lines with glowing cyan / purple palette
  public render(ctx: CanvasRenderingContext2D, isChronoActive = false) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = isChronoActive ? 'rgba(0, 180, 255, 0.18)' : 'rgba(0, 255, 204, 0.12)';

    // Horizontal lines
    for (let r = 0; r <= this.rows; r++) {
      if (!this.points[r]) continue;
      ctx.beginPath();
      for (let c = 0; c <= this.cols; c++) {
        const p = this.points[r][c];
        if (!p) continue;
        if (c === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let c = 0; c <= this.cols; c++) {
      ctx.beginPath();
      for (let r = 0; r <= this.rows; r++) {
        if (!this.points[r] || !this.points[r][c]) continue;
        const p = this.points[r][c];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Render node intersection dots with soft glow
    ctx.fillStyle = isChronoActive ? 'rgba(0, 240, 255, 0.4)' : 'rgba(0, 255, 204, 0.25)';
    for (let r = 0; r <= this.rows; r += 2) {
      if (!this.points[r]) continue;
      for (let c = 0; c <= this.cols; c += 2) {
        const p = this.points[r][c];
        if (!p) continue;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    }

    ctx.restore();
  }
}
