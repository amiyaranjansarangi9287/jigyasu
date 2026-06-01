// src/shared/canvas/engines/ParticleEngine.ts

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;      // 0-1, starts at 1, goes to 0
  maxLife: number;   // seconds
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export interface ParticleConfig {
  count: number;
  originX: number;
  originY: number;
  color: string | string[];
  speed: number;
  spread: number;       // degrees
  size: number;
  sizeVariance: number;
  maxLife: number;
  gravity: number;
  fadeOut: boolean;
}

export class ParticleEngine {
  private particles: Particle[] = [];

  emit(config: ParticleConfig): void {
    const colors = Array.isArray(config.color)
      ? config.color
      : [config.color];

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.random() * config.spread - config.spread / 2)
        * (Math.PI / 180);
      const speed = config.speed * (0.5 + Math.random() * 0.5);
      this.particles.push({
        x: config.originX,
        y: config.originY,
        vx: Math.sin(angle) * speed,
        vy: -Math.cos(angle) * speed,
        life: 1,
        maxLife: config.maxLife,
        size: config.size + (Math.random() - 0.5) * config.sizeVariance,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  }

  update(deltaTime: number, gravity = 0): void {
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const p of this.particles) {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += gravity * deltaTime;
      p.life -= deltaTime / p.maxLife;
      p.alpha = p.life;
      p.rotation += p.rotationSpeed;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  drawCircles(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  clear(): void {
    this.particles = [];
  }

  get count(): number {
    return this.particles.length;
  }

  get all(): Particle[] {
    return this.particles;
  }
}
