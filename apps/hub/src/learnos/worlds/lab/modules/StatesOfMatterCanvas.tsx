import { useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
}

interface StatesOfMatterCanvasProps {
  temperature: number;
}

export default function StatesOfMatterCanvas({ temperature }: StatesOfMatterCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const tempRef = useRef(temperature);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const cols = 12;
    const rows = 8;
    const spacing = 26;
    const totalW = cols * spacing;
    const totalH = rows * spacing;
    const offsetX = (w - totalW) / 2;
    const offsetY = (h - totalH) / 2 + 10;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = offsetX + c * spacing + spacing / 2;
        const ty = offsetY + r * spacing + spacing / 2;
        particles.push({
          x: tx,
          y: ty,
          vx: 0,
          vy: 0,
          targetX: tx,
          targetY: ty,
        });
      }
    }
    return particles;
  }, []);

  useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    if (particlesRef.current.length === 0) {
      particlesRef.current = initParticles(w, h);
    }

    const pad = 12;

    const animate = () => {
      const t = tempRef.current;
      const energy = t / 100;

      ctx.clearRect(0, 0, w, h);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 30) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const particles = particlesRef.current;

      // Update particles
      particles.forEach((p) => {
        if (t < 33) {
          const vibrateAmount = 0.5 + (t / 33) * 5;
          p.x += (Math.random() - 0.5) * vibrateAmount * 0.4;
          p.y += (Math.random() - 0.5) * vibrateAmount * 0.4;
          p.x += (p.targetX - p.x) * 0.12;
          p.y += (p.targetY - p.y) * 0.12;
        } else if (t < 66) {
          const liquidEnergy = (t - 33) / 33;
          p.vx += (Math.random() - 0.5) * liquidEnergy * 1.2;
          p.vy += (Math.random() - 0.5) * liquidEnergy * 1.2;
          p.vy += 0.04;
          p.vx *= 0.96;
          p.vy *= 0.96;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < pad) { p.x = pad; p.vx *= -0.7; }
          if (p.x > w - pad) { p.x = w - pad; p.vx *= -0.7; }
          if (p.y > h - pad) { p.y = h - pad; p.vy *= -0.4; }
          if (p.y < pad) { p.y = pad; p.vy *= -0.7; }
        } else {
          const gasEnergy = (t - 66) / 34;
          p.vx += (Math.random() - 0.5) * gasEnergy * 5;
          p.vy += (Math.random() - 0.5) * gasEnergy * 5;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < pad) { p.x = pad; p.vx *= -1; }
          if (p.x > w - pad) { p.x = w - pad; p.vx *= -1; }
          if (p.y < pad) { p.y = pad; p.vy *= -1; }
          if (p.y > h - pad) { p.y = h - pad; p.vy *= -1; }
        }
      });

      // Particle-particle repulsion for liquid state
      if (t >= 33 && t < 66) {
        const len = particles.length;
        for (let i = 0; i < len; i++) {
          for (let j = i + 1; j < len; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 225 && distSq > 1) {
              const dist = Math.sqrt(distSq);
              const force = (15 - dist) * 0.05;
              const fx = (dx / dist) * force;
              const fy = (dy / dist) * force;
              particles[i].vx += fx;
              particles[i].vy += fy;
              particles[j].vx -= fx;
              particles[j].vy -= fy;
            }
          }
        }
      }

      // Draw bonds for solid
      if (t < 33) {
        const bondAlpha = Math.max(0, 0.25 * (1 - t / 33));
        ctx.strokeStyle = `rgba(96, 165, 250, ${bondAlpha})`;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].targetX - particles[j].targetX;
            const dy = particles[i].targetY - particles[j].targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 35) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        const radius = 4 + energy * 2.5;
        let hue: number, sat: number, light: number;

        if (t < 33) {
          hue = 215;
          sat = 70 + (t / 33) * 15;
          light = 50 + (t / 33) * 15;
        } else if (t < 66) {
          hue = 200 - ((t - 33) / 33) * 20;
          sat = 80;
          light = 55 + ((t - 33) / 33) * 10;
        } else {
          hue = 35 - ((t - 66) / 34) * 30;
          sat = 85 + ((t - 66) / 34) * 10;
          light = 55 + ((t - 66) / 34) * 15;
        }

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2.5);
        glow.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, 0.8)`);
        glow.addColorStop(0.4, `hsla(${hue}, ${sat}%, ${light}%, 0.2)`);
        glow.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, ${sat}%, ${Math.min(light + 25, 95)}%, 0.95)`;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [initParticles]);

  return <canvas ref={canvasRef} className="w-full aspect-[16/9] block" />;
}
