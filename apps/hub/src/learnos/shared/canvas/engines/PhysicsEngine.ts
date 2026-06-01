// src/shared/canvas/engines/PhysicsEngine.ts

export interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  restitution: number;  // bounciness 0-1
  friction: number;
  isStatic: boolean;
}

export const Physics = {
  applyGravity(body: PhysicsBody, gravity: number, dt: number): void {
    if (!body.isStatic) {
      body.vy += gravity * dt;
    }
  },

  updatePosition(body: PhysicsBody, dt: number): void {
    if (!body.isStatic) {
      body.x += body.vx * dt;
      body.y += body.vy * dt;
    }
  },

  bounceOffFloor(body: PhysicsBody, floorY: number): void {
    if (body.y + body.radius > floorY) {
      body.y = floorY - body.radius;
      body.vy = -body.vy * body.restitution;
      body.vx *= body.friction;
    }
  },

  bounceOffCeiling(body: PhysicsBody, ceilingY: number): void {
    if (body.y - body.radius < ceilingY) {
      body.y = ceilingY + body.radius;
      body.vy = -body.vy * body.restitution;
    }
  },

  bounceOffWalls(body: PhysicsBody, minX: number, maxX: number): void {
    if (body.x - body.radius < minX) {
      body.x = minX + body.radius;
      body.vx = -body.vx * body.restitution;
    }
    if (body.x + body.radius > maxX) {
      body.x = maxX - body.radius;
      body.vx = -body.vx * body.restitution;
    }
  },

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },

  clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  },

  normalize(x: number, y: number): { x: number; y: number } {
    const len = Math.sqrt(x * x + y * y);
    if (len === 0) return { x: 0, y: 0 };
    return { x: x / len, y: y / len };
  },

  dot(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2;
  },

  checkCircleCollision(a: PhysicsBody, b: PhysicsBody): boolean {
    const dist = Physics.distance(a.x, a.y, b.x, b.y);
    return dist < a.radius + b.radius;
  },

  resolveCircleCollision(a: PhysicsBody, b: PhysicsBody): void {
    if (a.isStatic && b.isStatic) return;

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0 || dist > a.radius + b.radius) return;

    const overlap = (a.radius + b.radius - dist) / 2;
    const nx = dx / dist;
    const ny = dy / dist;

    if (!a.isStatic) {
      a.x -= overlap * nx;
      a.y -= overlap * ny;
    }
    if (!b.isStatic) {
      b.x += overlap * nx;
      b.y += overlap * ny;
    }

    // Calculate relative velocity
    const dvx = a.vx - b.vx;
    const dvy = a.vy - b.vy;
    const dvn = dvx * nx + dvy * ny;

    // Only resolve if objects are approaching
    if (dvn > 0) return;

    const restitution = Math.min(a.restitution, b.restitution);
    const impulse = -(1 + restitution) * dvn / (1 / a.mass + 1 / b.mass);

    if (!a.isStatic) {
      a.vx += impulse / a.mass * nx;
      a.vy += impulse / a.mass * ny;
    }
    if (!b.isStatic) {
      b.vx -= impulse / b.mass * nx;
      b.vy -= impulse / b.mass * ny;
    }
  },
};
