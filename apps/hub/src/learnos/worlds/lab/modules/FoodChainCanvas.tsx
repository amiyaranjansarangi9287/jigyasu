import { useRef, useEffect } from 'react';

interface FoodChainCanvasProps {
  chain: 'pond' | 'forest' | 'ocean' | 'grassland';
}

export default function FoodChainCanvas({ chain }: FoodChainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const chainRef = useRef(chain);
  const timeRef = useRef(0);

  useEffect(() => { chainRef.current = chain; }, [chain]);

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

    const levels = [
      { name: 'Sun', emoji: '☀️', color: '#fbbf24', y: 0.12, desc: 'Energy Source', size: 45 },
      { name: 'Producers', emoji: '🌿', color: '#22c55e', y: 0.32, desc: 'Plants make food from sunlight', size: 38 },
      { name: 'Primary Consumers', emoji: '🐰', color: '#60a5fa', y: 0.52, desc: 'Herbivores eat plants', size: 35 },
      { name: 'Secondary Consumers', emoji: '🦊', color: '#f97316', y: 0.72, desc: 'Predators eat herbivores', size: 33 },
      { name: 'Apex Predator', emoji: '🦅', color: '#ef4444', y: 0.9, desc: 'Top of the chain!', size: 38 },
    ];

    // Extra organisms per level
    const extras = [
      [],
      ['🌾', '🌻', '🍀'],
      ['🐛', '🦗', '🐁'],
      ['🐍', '🐸'],
      [],
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.015;

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#fef9c3');
      bg.addColorStop(0.3, '#ecfccb');
      bg.addColorStop(0.7, '#d1fae5');
      bg.addColorStop(1, '#cffafe');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Energy pyramid shape (faint background)
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.05);
      ctx.lineTo(w * 0.1, h * 0.95);
      ctx.lineTo(w * 0.9, h * 0.95);
      ctx.closePath();
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.restore();

      // Draw arrows between levels
      for (let i = 0; i < levels.length - 1; i++) {
        const from = levels[i];
        const to = levels[i + 1];
        const fromY = h * from.y + 25;
        const toY = h * to.y - 25;

        // Energy arrow
        const arrowActive = true;
        ctx.save();
        ctx.globalAlpha = arrowActive ? 0.8 : 0.2;

        // Animated dashes
        ctx.beginPath();
        ctx.moveTo(w / 2, fromY);
        ctx.lineTo(w / 2, toY);
        ctx.strokeStyle = from.color;
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.lineDashOffset = -timeRef.current * 30;
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow head
        ctx.beginPath();
        ctx.moveTo(w / 2 - 8, toY - 10);
        ctx.lineTo(w / 2, toY);
        ctx.lineTo(w / 2 + 8, toY - 10);
        ctx.strokeStyle = from.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // "eaten by" label
        ctx.fillStyle = '#64748b';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('eaten by ↓', w / 2 + 40, (fromY + toY) / 2);
        ctx.restore();
      }

      // Draw each level
      levels.forEach((level, i) => {
        const isActive = true;
        const ly = h * level.y;
        const sway = Math.sin(timeRef.current * 2 + i) * 5;

        ctx.save();
        ctx.globalAlpha = isActive ? 1 : 0.3;

        // Level background bar
        const barWidth = w * (0.8 - i * 0.1);
        const barX = (w - barWidth) / 2;
        ctx.fillStyle = level.color + '20';
        ctx.beginPath();
        ctx.roundRect(barX, ly - 22, barWidth, 44, 22);
        ctx.fill();
        if (isActive) {
          ctx.strokeStyle = level.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Main emoji
        ctx.font = `${level.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(level.emoji, w / 2 + sway, ly + 12);

        // Extra organisms
        const ex = extras[i];
        ex.forEach((emoji, ei) => {
          const offset = (ei - (ex.length - 1) / 2) * 50;
          const exSway = Math.sin(timeRef.current * 1.5 + ei * 2) * 3;
          ctx.font = '22px sans-serif';
          ctx.fillText(emoji, w / 2 + offset + (offset > 0 ? 60 : -60) + exSway, ly + 8);
        });

        // Level name
        ctx.fillStyle = level.color;
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(level.name, w / 2, ly - 28);

        if (isActive) {
          ctx.fillStyle = '#475569';
          ctx.font = '10px sans-serif';
          ctx.fillText(level.desc, w / 2, ly + 32);
        }

        ctx.restore();
      });

      // Energy label
      ctx.save();
      ctx.translate(18, h / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('← ENERGY FLOWS UP →', 0, 0);
      ctx.restore();

      // Population label
      ctx.save();
      ctx.translate(w - 18, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('← FEWER ANIMALS →', 0, 0);
      ctx.restore();

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[3/4] sm:aspect-[4/5] block" />;
}
