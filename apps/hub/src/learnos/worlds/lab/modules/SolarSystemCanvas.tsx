import { useRef, useEffect } from 'react';

interface SolarSystemCanvasProps {
  highlightPlanet: number; // -1 for none, 0-7 for planets
  speed: number;
}

export default function SolarSystemCanvas({ highlightPlanet, speed }: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const highlightRef = useRef(highlightPlanet);
  const speedRef = useRef(speed);
  const timeRef = useRef(0);

  useEffect(() => { highlightRef.current = highlightPlanet; }, [highlightPlanet]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

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
    const cx = w / 2;
    const cy = h / 2;

    const planets = [
      { name: 'Mercury', color: '#94a3b8', size: 4, orbit: 0.12, speed: 4.1, emoji: '⚪' },
      { name: 'Venus', color: '#fbbf24', size: 6, orbit: 0.18, speed: 1.6, emoji: '🟡' },
      { name: 'Earth', color: '#3b82f6', size: 6.5, orbit: 0.25, speed: 1, emoji: '🔵' },
      { name: 'Mars', color: '#ef4444', size: 5, orbit: 0.32, speed: 0.53, emoji: '🔴' },
      { name: 'Jupiter', color: '#f97316', size: 14, orbit: 0.45, speed: 0.084, emoji: '🟠' },
      { name: 'Saturn', color: '#fbbf24', size: 12, orbit: 0.57, speed: 0.034, emoji: '🟤' },
      { name: 'Uranus', color: '#67e8f9', size: 9, orbit: 0.7, speed: 0.012, emoji: '🔵' },
      { name: 'Neptune', color: '#6366f1', size: 8.5, orbit: 0.82, speed: 0.006, emoji: '🟣' },
    ];

    const stars: { x: number; y: number; r: number; t: number }[] = [];
    for (let i = 0; i < 80; i++) stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() + 0.3, t: Math.random() * 6.28 });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.005 * speedRef.current;
      const highlight = highlightRef.current;

      // Space background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(timeRef.current * 5 + s.t) * 0.3})`;
        ctx.fill();
      });

      const maxOrbitR = Math.min(w, h) * 0.47;

      // Draw orbit paths
      planets.forEach((planet, i) => {
        const orbitR = planet.orbit * maxOrbitR;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = highlight === i ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)';
        ctx.lineWidth = highlight === i ? 1.5 : 0.5;
        ctx.setLineDash([3, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Sun
      const sunPulse = 1 + Math.sin(timeRef.current * 8) * 0.03;
      // Sun glow
      const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
      sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
      sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
      sunGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun body
      const sunGrad = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, 20 * sunPulse);
      sunGrad.addColorStop(0, '#fef9c3');
      sunGrad.addColorStop(0.5, '#fde047');
      sunGrad.addColorStop(1, '#f59e0b');
      ctx.beginPath();
      ctx.arc(cx, cy, 20 * sunPulse, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Draw planets
      planets.forEach((planet, i) => {
        const orbitR = planet.orbit * maxOrbitR;
        const angle = timeRef.current * planet.speed * 2;
        const px = cx + Math.cos(angle) * orbitR;
        const py = cy + Math.sin(angle) * orbitR * 0.45; // Slight perspective
        const isHighlighted = highlight === i;
        const isVisible = highlight === -1 || isHighlighted;

        ctx.save();
        ctx.globalAlpha = isVisible ? 1 : 0.25;

        // Planet shadow
        if (isHighlighted) {
          ctx.beginPath();
          ctx.arc(px, py, planet.size + 8, 0, Math.PI * 2);
          ctx.fillStyle = `${planet.color}30`;
          ctx.fill();
        }

        // Planet body
        const pGrad = ctx.createRadialGradient(px - planet.size * 0.3, py - planet.size * 0.3, 0, px, py, planet.size);
        pGrad.addColorStop(0, planet.color + 'cc');
        pGrad.addColorStop(1, planet.color);
        ctx.beginPath();
        ctx.arc(px, py, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        // Saturn's rings
        if (planet.name === 'Saturn') {
          ctx.beginPath();
          ctx.ellipse(px, py, planet.size + 8, 4, 0.2, 0, Math.PI * 2);
          ctx.strokeStyle = '#d4a574';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Earth's moon
        if (planet.name === 'Earth') {
          const moonAngle = timeRef.current * 12;
          const mx = px + Math.cos(moonAngle) * 14;
          const my = py + Math.sin(moonAngle) * 14 * 0.5;
          ctx.beginPath();
          ctx.arc(mx, my, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#d4d4d4';
          ctx.fill();
        }

        // Planet name
        if (isHighlighted || highlight === -1) {
          ctx.fillStyle = 'white';
          ctx.font = isHighlighted ? 'bold 11px sans-serif' : '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(planet.name, px, py + planet.size + 15);
        }

        ctx.restore();
      });

      // Sun label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SUN', cx, cy + 30);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
