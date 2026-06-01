import { useRef, useEffect } from 'react';

interface MultiplicationCanvasProps {
  rows: number;
  cols: number;
}

export default function MultiplicationCanvas({ rows, cols }: MultiplicationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rowsRef = useRef(rows);
  const colsRef = useRef(cols);
  const animRef = useRef(0);

  useEffect(() => { rowsRef.current = rows; }, [rows]);
  useEffect(() => { colsRef.current = cols; }, [cols]);

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

    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4', '#84cc16'];
    const emojis = ['🍎', '🍊', '🍋', '🫐', '🍇', '🍓', '🥝', '🍑'];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      animRef.current += 0.02;

      const g = rowsRef.current;
      const n = colsRef.current;
      const total = g * n;

      // Background
      ctx.fillStyle = '#fefce8';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // Calculate layout
      const maxCols = Math.min(g, 6);
      const rows = Math.ceil(g / maxCols);
      const groupW = Math.min(120, (w - 40) / maxCols);
      const groupH = Math.min(120, (h - 100) / rows);
      const startX = (w - maxCols * groupW) / 2;
      const startY = 40;

      // Draw groups
      for (let gi = 0; gi < g; gi++) {
        const col = gi % maxCols;
        const row = Math.floor(gi / maxCols);
        const gx = startX + col * groupW + groupW / 2;
        const gy = startY + row * groupH + groupH / 2;
        const color = colors[gi % colors.length];
        const emoji = emojis[gi % emojis.length];

        // Group circle background
        const groupRadius = Math.min(groupW, groupH) * 0.42;
        ctx.beginPath();
        ctx.arc(gx, gy, groupRadius, 0, Math.PI * 2);
        ctx.fillStyle = color + '15';
        ctx.fill();
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Items in group
        const itemSize = Math.min(22, groupRadius * 0.6);
        if (n <= 4) {
          const positions = [
            [{ x: 0, y: 0 }],
            [{ x: -0.3, y: 0 }, { x: 0.3, y: 0 }],
            [{ x: 0, y: -0.3 }, { x: -0.3, y: 0.25 }, { x: 0.3, y: 0.25 }],
            [{ x: -0.3, y: -0.3 }, { x: 0.3, y: -0.3 }, { x: -0.3, y: 0.3 }, { x: 0.3, y: 0.3 }],
          ];
          const pos = positions[n - 1] || positions[3];
          pos.forEach((p, pi) => {
            if (pi < n) {
              const ix = gx + p.x * groupRadius;
              const iy = gy + p.y * groupRadius;
              ctx.font = `${itemSize}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(emoji, ix, iy);
            }
          });
        } else {
          // Arrange in circle
          for (let ni = 0; ni < n; ni++) {
            const angle = (ni / n) * Math.PI * 2 - Math.PI / 2;
            const dist = groupRadius * 0.55;
            const ix = gx + Math.cos(angle) * dist;
            const iy = gy + Math.sin(angle) * dist;
            ctx.font = `${Math.min(itemSize, 18)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, ix, iy);
          }
        }

        // Group label
        ctx.fillStyle = color;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${n}`, gx, gy + groupRadius + 14);
      }

      // Equation at bottom
      const eqY = h - 35;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 150, eqY - 22, 300, 40, 20);
      ctx.fill();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${g} × ${n} = ${total}`, w / 2, eqY + 3);

      // Subtitle
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${g} groups of ${n}`, w / 2, eqY + 18);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
