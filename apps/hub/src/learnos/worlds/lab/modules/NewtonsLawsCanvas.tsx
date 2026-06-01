import { useRef, useEffect } from 'react';

interface NewtonsLawsCanvasProps {
  force: number;
  mass: number;
  isPlaying: boolean;
}

export default function NewtonsLawsCanvas({ force, mass, isPlaying }: NewtonsLawsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const forceRef = useRef(force);
  const massRef = useRef(mass);
  const playingRef = useRef(isPlaying);
  const timeRef = useRef(0);
  const positionsRef = useRef({ x: 50, vx: 0, puck: 0, car: 0, truck: 0, rocket: 0 });

  useEffect(() => { forceRef.current = force; }, [force]);
  useEffect(() => { massRef.current = mass; }, [mass]);
  useEffect(() => { playingRef.current = isPlaying; }, [isPlaying]);

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
    const groundY = h * 0.78;

    const exhaustParticles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 1;
      const currentLaw = massRef.current > 5 ? 1 : 2;
      const f = forceRef.current;
      const pos = positionsRef.current;

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#e0f2fe');
      bg.addColorStop(0.75, '#bae6fd');
      bg.addColorStop(0.78, '#86efac');
      bg.addColorStop(1, '#4ade80');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Ground line
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w, groundY);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (currentLaw === 1) {
        // LAW 1: Object in motion stays in motion (ice puck)
        // Ice surface
        ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
        ctx.fillRect(0, groundY, w, h - groundY);

        // Ice texture
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
          const lx = Math.random() * w;
          const ly = groundY + Math.random() * (h - groundY);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + 20, ly + 5);
          ctx.stroke();
        }

        // Puck slides forever (no friction on ice)
        pos.puck += f * 0.03;
        if (pos.puck > w + 30) pos.puck = -30;

        const puckX = 80 + pos.puck;
        const puckY = groundY - 12;

        // Puck
        ctx.beginPath();
        ctx.ellipse(puckX, puckY, 20, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Speed lines
        if (f > 20) {
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
          ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            const ly = puckY - 5 + i * 5;
            ctx.beginPath();
            ctx.moveTo(puckX - 30, ly);
            ctx.lineTo(puckX - 50 - f * 0.3, ly);
            ctx.stroke();
          }
        }

        // Arrow showing constant velocity
        ctx.beginPath();
        ctx.moveTo(puckX + 25, puckY);
        ctx.lineTo(puckX + 55, puckY);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(puckX + 55, puckY);
        ctx.lineTo(puckX + 48, puckY - 6);
        ctx.moveTo(puckX + 55, puckY);
        ctx.lineTo(puckX + 48, puckY + 6);
        ctx.stroke();

        // Labels
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🧊 No friction on ice!', w / 2, 30);
        ctx.fillStyle = '#3b82f6';
        ctx.font = '12px sans-serif';
        ctx.fillText('Puck keeps moving at the SAME speed forever', w / 2, 50);
        ctx.fillText('(no force = no change in motion)', w / 2, 66);

        // "No friction" label
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.font = '11px sans-serif';
        ctx.fillText('Friction = 0', w / 2, groundY + 25);

      } else if (currentLaw === 2) {
        // LAW 2: F = ma (same force, different masses)

        // Car (light)
        const carAccel = f * 0.02;
        pos.car = Math.min(pos.car + carAccel, w - 120);
        const carX = 60 + pos.car;
        const carY = groundY - 25;

        // Car body
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.roundRect(carX - 30, carY - 15, 60, 25, 5);
        ctx.fill();
        ctx.fillStyle = '#60a5fa';
        ctx.beginPath();
        ctx.roundRect(carX - 15, carY - 30, 35, 18, [5, 5, 0, 0]);
        ctx.fill();
        // Windows
        ctx.fillStyle = '#bfdbfe';
        ctx.fillRect(carX - 10, carY - 27, 12, 12);
        ctx.fillRect(carX + 8, carY - 27, 12, 12);
        // Wheels
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(carX - 18, carY + 12, 8, 0, Math.PI * 2);
        ctx.arc(carX + 18, carY + 12, 8, 0, Math.PI * 2);
        ctx.fill();

        // Truck (heavy, 3x mass)
        const truckAccel = f * 0.007; // same force, 3x mass = 1/3 acceleration
        pos.truck = Math.min(pos.truck + truckAccel, w - 120);
        const truckX = 60 + pos.truck;
        const truckY = groundY - 30;

        // Truck body
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(truckX - 40, truckY - 25, 80, 45);
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(truckX + 20, truckY - 35, 25, 15);
        ctx.fillStyle = '#fecaca';
        ctx.fillRect(truckX + 25, truckY - 32, 15, 10);
        // Wheels
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(truckX - 25, truckY + 22, 10, 0, Math.PI * 2);
        ctx.arc(truckX + 10, truckY + 22, 10, 0, Math.PI * 2);
        ctx.arc(truckX + 30, truckY + 22, 10, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('🚗 Light car (mass = 1)', carX, carY - 45);
        ctx.fillText(`Acceleration: FAST! →`, carX, carY - 55);

        ctx.fillStyle = '#ef4444';
        ctx.fillText('🚛 Heavy truck (mass = 3)', truckX, truckY - 50);
        ctx.fillText(`Acceleration: SLOW →`, truckX, truckY - 60);

        // Same force arrows
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        const arrowLen = 30 + f * 0.3;
        // Car force arrow
        ctx.beginPath();
        ctx.moveTo(carX - 35, carY);
        ctx.lineTo(carX - 35 - arrowLen, carY);
        ctx.stroke();
        // Truck force arrow (same length = same force)
        ctx.beginPath();
        ctx.moveTo(truckX - 45, truckY);
        ctx.lineTo(truckX - 45 - arrowLen, truckY);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`Same Force →`, 40, h * 0.3);

        // Title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('F = m × a  (Same force, different mass)', w / 2, 25);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('More mass = less acceleration!', w / 2, 42);

      } else if (currentLaw === 3) {
        // LAW 3: Action-Reaction (rocket)
        pos.rocket = Math.min(pos.rocket + f * 0.015, h * 0.5);
        const rocketX = w / 2;
        const rocketY = groundY - 30 - pos.rocket;

        // Exhaust particles
        if (f > 10 && timeRef.current % 2 === 0) {
          for (let i = 0; i < 3; i++) {
            exhaustParticles.push({
              x: rocketX + (Math.random() - 0.5) * 15,
              y: rocketY + 30,
              vx: (Math.random() - 0.5) * 3,
              vy: 3 + Math.random() * 4,
              life: 1,
            });
          }
        }

        // Update and draw exhaust
        for (let i = exhaustParticles.length - 1; i >= 0; i--) {
          const p = exhaustParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.03;
          if (p.life <= 0 || p.y > groundY) { exhaustParticles.splice(i, 1); continue; }

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10 * p.life);
          grad.addColorStop(0, `rgba(251, 191, 36, ${p.life})`);
          grad.addColorStop(0.5, `rgba(249, 115, 22, ${p.life * 0.6})`);
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Rocket body
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY - 35);
        ctx.lineTo(rocketX - 15, rocketY + 15);
        ctx.lineTo(rocketX + 15, rocketY + 15);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rocket body rectangle
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(rocketX - 12, rocketY - 5, 24, 30);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(rocketX - 8, rocketY, 16, 10);

        // Fins
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(rocketX - 12, rocketY + 20);
        ctx.lineTo(rocketX - 22, rocketY + 30);
        ctx.lineTo(rocketX - 12, rocketY + 25);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(rocketX + 12, rocketY + 20);
        ctx.lineTo(rocketX + 22, rocketY + 30);
        ctx.lineTo(rocketX + 12, rocketY + 25);
        ctx.fill();

        // Action arrow (exhaust going down)
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY + 35);
        ctx.lineTo(rocketX, rocketY + 35 + f * 0.5);
        ctx.stroke();
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬇️ ACTION', rocketX + 50, rocketY + 50);
        ctx.fillText('Gas pushes DOWN', rocketX + 50, rocketY + 64);

        // Reaction arrow (rocket going up)
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rocketX, rocketY - 40);
        ctx.lineTo(rocketX, rocketY - 40 - f * 0.5);
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.fillText('⬆️ REACTION', rocketX - 55, rocketY - 55);
        ctx.fillText('Rocket goes UP', rocketX - 55, rocketY - 41);

        // Title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Every action has an EQUAL and OPPOSITE reaction', w / 2, 25);
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans-serif';
        ctx.fillText('Push gas down → rocket goes up!', w / 2, 42);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
