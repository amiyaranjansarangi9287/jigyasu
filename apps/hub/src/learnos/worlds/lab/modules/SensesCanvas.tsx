import { useRef, useEffect } from 'react';

interface SensesCanvasProps {
  sense: 'sight' | 'hearing' | 'smell' | 'taste' | 'touch';
}

export default function SensesCanvas({ sense }: SensesCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const senseRef = useRef(sense);
  const animRef = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; size: number }[]>([]);

  useEffect(() => { senseRef.current = sense; particlesRef.current = []; }, [sense]);

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

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      animRef.current += 0.02;
      const sense = senseRef.current;
      const centerX = w / 2;
      const centerY = h / 2;

      // Background gradient based on sense
      const bgColors: Record<string, string[]> = {
        sight: ['#dbeafe', '#bfdbfe'],
        hearing: ['#fce7f3', '#fbcfe8'],
        smell: ['#d1fae5', '#a7f3d0'],
        taste: ['#fef3c7', '#fde68a'],
        touch: ['#f3e8ff', '#e9d5ff'],
      };
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, bgColors[sense][0]);
      bg.addColorStop(1, bgColors[sense][1]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Draw head outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(w, h) * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#fcd34d';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Hair
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - Math.min(w, h) * 0.28, Math.min(w, h) * 0.32, Math.min(w, h) * 0.15, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      const headR = Math.min(w, h) * 0.3;

      if (sense === 'sight') {
        // Eyes - large and highlighted
        for (const ex of [-0.25, 0.25]) {
          const eyeX = centerX + ex * headR;
          const eyeY = centerY - headR * 0.1;
          // Eye white
          ctx.beginPath();
          ctx.ellipse(eyeX, eyeY, 25, 18, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.stroke();
          // Iris
          ctx.beginPath();
          ctx.arc(eyeX, eyeY, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#3b82f6';
          ctx.fill();
          // Pupil
          ctx.beginPath();
          ctx.arc(eyeX, eyeY, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          // Shine
          ctx.beginPath();
          ctx.arc(eyeX + 3, eyeY - 3, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
        }

        // Light rays coming to eyes
        const rayColors = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'];
        for (let i = 0; i < 6; i++) {
          const angle = -Math.PI * 0.6 + (i / 5) * Math.PI * 0.4;
          const startDist = headR + 50 + Math.sin(animRef.current + i) * 20;
          const sx = centerX + Math.cos(angle) * startDist;
          const sy = centerY + Math.sin(angle) * startDist;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(centerX, centerY - headR * 0.1);
          ctx.strokeStyle = rayColors[i] + '60';
          ctx.lineWidth = 4;
          ctx.stroke();
        }

        // Glow effect
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.beginPath();
        ctx.arc(centerX, centerY - headR * 0.1, 60, 0, Math.PI * 2);
        ctx.fill();

      } else if (sense === 'hearing') {
        // Simple eyes
        for (const ex of [-0.25, 0.25]) {
          ctx.beginPath();
          ctx.arc(centerX + ex * headR, centerY - headR * 0.1, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }

        // Ears highlighted
        for (const side of [-1, 1]) {
          const earX = centerX + side * headR * 0.95;
          const earY = centerY;
          ctx.beginPath();
          ctx.ellipse(earX, earY, 18, 25, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
          ctx.strokeStyle = '#ec4899';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Inner ear
          ctx.beginPath();
          ctx.ellipse(earX, earY, 8, 15, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#fda4af';
          ctx.fill();

          // Sound waves coming to ears
          for (let r = 1; r <= 3; r++) {
            const waveR = 30 + r * 25 + Math.sin(animRef.current * 2) * 5;
            const waveAlpha = 0.4 - r * 0.1;
            ctx.beginPath();
            ctx.arc(earX + side * 40, earY, waveR, side > 0 ? -Math.PI * 0.4 : Math.PI * 0.6, side > 0 ? Math.PI * 0.4 : Math.PI * 1.4);
            ctx.strokeStyle = `rgba(236, 72, 153, ${waveAlpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        }

      } else if (sense === 'smell') {
        // Simple eyes
        for (const ex of [-0.25, 0.25]) {
          ctx.beginPath();
          ctx.arc(centerX + ex * headR, centerY - headR * 0.1, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }

        // Nose highlighted
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - headR * 0.1);
        ctx.quadraticCurveTo(centerX + 15, centerY + headR * 0.15, centerX, centerY + headR * 0.2);
        ctx.quadraticCurveTo(centerX - 15, centerY + headR * 0.15, centerX, centerY - headR * 0.1);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Smell particles (wavy lines)
        if (Math.random() < 0.08) {
          particlesRef.current.push({
            x: centerX + (Math.random() - 0.5) * 40,
            y: centerY + headR * 0.15,
            vx: (Math.random() - 0.5) * 1,
            vy: -1 - Math.random() * 1.5,
            life: 1,
            size: 8 + Math.random() * 8,
          });
        }

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx + Math.sin(animRef.current * 3 + p.y * 0.1) * 0.5;
          p.y += p.vy;
          p.life -= 0.012;
          if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
          ctx.beginPath();
          ctx.moveTo(p.x - p.size, p.y);
          ctx.quadraticCurveTo(p.x - p.size / 2, p.y - 5, p.x, p.y);
          ctx.quadraticCurveTo(p.x + p.size / 2, p.y + 5, p.x + p.size, p.y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${p.life * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Flower source
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🌸', centerX, centerY + headR + 50);

      } else if (sense === 'taste') {
        // Simple eyes
        for (const ex of [-0.25, 0.25]) {
          ctx.beginPath();
          ctx.arc(centerX + ex * headR, centerY - headR * 0.1, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }

        // Mouth open with tongue
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + headR * 0.35, 30, 20, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();

        // Tongue
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + headR * 0.4, 22, 15, 0, 0, Math.PI);
        ctx.fillStyle = '#f87171';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Taste zones
        const zones = [
          { x: 0, y: -8, label: 'Bitter', color: '#22c55e' },
          { x: -12, y: 2, label: 'Sour', color: '#fbbf24' },
          { x: 12, y: 2, label: 'Sour', color: '#fbbf24' },
          { x: 0, y: 10, label: 'Sweet', color: '#ec4899' },
          { x: -8, y: -2, label: 'Salty', color: '#3b82f6' },
          { x: 8, y: -2, label: 'Salty', color: '#3b82f6' },
        ];
        zones.forEach(z => {
          ctx.beginPath();
          ctx.arc(centerX + z.x, centerY + headR * 0.4 + z.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = z.color;
          ctx.fill();
        });

        // Food items
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        const foods = ['🍭', '🍋', '☕', '🧂'];
        foods.forEach((f, i) => {
          const angle = -Math.PI * 0.3 + (i / 3) * Math.PI * 0.6;
          const dist = headR + 50;
          ctx.fillText(f, centerX + Math.cos(angle) * dist, centerY + headR * 0.3 + Math.sin(angle) * dist);
        });

      } else if (sense === 'touch') {
        // Simple face
        for (const ex of [-0.25, 0.25]) {
          ctx.beginPath();
          ctx.arc(centerX + ex * headR, centerY - headR * 0.1, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(centerX, centerY + headR * 0.2, 15, 0.1, Math.PI - 0.1);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hand highlighted
        const handX = centerX + headR + 50;
        const handY = centerY + 30;
        ctx.font = '60px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🤚', handX, handY);

        // Touch sensation rings
        for (let r = 1; r <= 3; r++) {
          const ringR = 15 + r * 20 + Math.sin(animRef.current * 2 + r) * 5;
          ctx.beginPath();
          ctx.arc(handX, handY - 15, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.4 - r * 0.1})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Objects to touch
        const objects = ['🧊', '🔥', '🪶', '🌵'];
        objects.forEach((o, i) => {
          const ox = 40 + (i / 3) * (w * 0.3);
          const oy = h - 50;
          ctx.font = '28px sans-serif';
          ctx.fillText(o, ox, oy);
        });
      }

      // Smile (for senses that don't draw mouth)
      if (sense !== 'taste') {
        ctx.beginPath();
        ctx.arc(centerX, centerY + headR * 0.25, 18, 0.1, Math.PI - 0.1);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Sense label
      const senseLabels: Record<string, { icon: string; name: string; organ: string }> = {
        sight: { icon: '👁️', name: 'SIGHT', organ: 'Eyes detect light and color' },
        hearing: { icon: '👂', name: 'HEARING', organ: 'Ears detect sound waves' },
        smell: { icon: '👃', name: 'SMELL', organ: 'Nose detects tiny particles in air' },
        taste: { icon: '👅', name: 'TASTE', organ: 'Tongue detects sweet, sour, bitter, salty' },
        touch: { icon: '🤚', name: 'TOUCH', organ: 'Skin detects pressure and temperature' },
      };
      const label = senseLabels[sense];
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 130, h - 45, 260, 38, 19);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${label.icon} ${label.name}`, w / 2, h - 28);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px sans-serif';
      ctx.fillText(label.organ, w / 2, h - 14);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
