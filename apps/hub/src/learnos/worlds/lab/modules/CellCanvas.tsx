import { useRef, useEffect } from 'react';

interface CellCanvasProps {
  focusedOrganelle: string | null;
  isPlaying: boolean;
}

export default function CellCanvas({ focusedOrganelle, isPlaying }: CellCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const focusedRef = useRef(focusedOrganelle);
  const playingRef = useRef(isPlaying);
  const timeRef = useRef(0);

  useEffect(() => { focusedRef.current = focusedOrganelle; }, [focusedOrganelle]);
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
    const cx = w / 2;
    const cy = h / 2;
    const cellRx = w * 0.42;
    const cellRy = h * 0.38;

    const organelles = [
      { id: 'membrane', name: 'Cell Membrane', emoji: '🛡️', role: 'Protective wall', x: cx + cellRx * 0.85, y: cy, color: '#f59e0b' },
      { id: 'nucleus', name: 'Nucleus', emoji: '🧠', role: 'Control center (DNA)', x: cx, y: cy, color: '#6366f1' },
      { id: 'mitochondria', name: 'Mitochondria', emoji: '⚡', role: 'Power plant', x: cx + cellRx * 0.5, y: cy - cellRy * 0.3, color: '#ef4444' },
      { id: 'ribosome', name: 'Ribosomes', emoji: '🔧', role: 'Protein factory', x: cx - cellRx * 0.35, y: cy + cellRy * 0.4, color: '#8b5cf6' },
      { id: 'er', name: 'Endoplasmic Reticulum', emoji: '📦', role: 'Transport highway', x: cx + cellRx * 0.2, y: cy + cellRy * 0.45, color: '#22c55e' },
      { id: 'golgi', name: 'Golgi Body', emoji: '📮', role: 'Packaging & shipping', x: cx - cellRx * 0.5, y: cy - cellRy * 0.2, color: '#f97316' },
      { id: 'vacuole', name: 'Vacuole', emoji: '💧', role: 'Storage tank', x: cx - cellRx * 0.3, y: cy + cellRy * 0.1, color: '#06b6d4' },
    ];

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.01;
      const highlight = focusedRef.current;

      // Background
      ctx.fillStyle = '#fce7f3';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 20) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += 20) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      // Cell membrane (outer)
      ctx.beginPath();
      ctx.ellipse(cx, cy, cellRx + 5, cellRy + 5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = highlight === 'membrane' ? '#f59e0b' : '#d4a574';
      ctx.lineWidth = highlight === 'membrane' ? 8 : 5;
      ctx.setLineDash([8, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Cytoplasm
      const cytoGrad = ctx.createRadialGradient(cx - cellRx * 0.2, cy - cellRy * 0.2, 0, cx, cy, cellRx);
      cytoGrad.addColorStop(0, '#fef3c7');
      cytoGrad.addColorStop(0.5, '#fde68a');
      cytoGrad.addColorStop(1, '#fcd34d');
      ctx.beginPath();
      ctx.ellipse(cx, cy, cellRx, cellRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = cytoGrad;
      ctx.fill();

      // ER (wavy lines)
      const erHighlight = highlight === 'er';
      ctx.strokeStyle = erHighlight ? '#22c55e' : 'rgba(34, 197, 94, 0.4)';
      ctx.lineWidth = erHighlight ? 4 : 2;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const startY = cy + cellRy * 0.2 + i * 12;
        for (let x = cx - cellRx * 0.1; x < cx + cellRx * 0.5; x += 5) {
          const wave = Math.sin(x * 0.08 + timeRef.current * 2 + i) * 5;
          if (x === cx - cellRx * 0.1) ctx.moveTo(x, startY + wave);
          else ctx.lineTo(x, startY + wave);
        }
        ctx.stroke();
      }

      // Vacuole
      const vacHighlight = highlight === 'vacuole';
      ctx.beginPath();
      ctx.ellipse(cx - cellRx * 0.3, cy + cellRy * 0.1, 35, 25, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = vacHighlight ? 'rgba(6, 182, 212, 0.6)' : 'rgba(6, 182, 212, 0.25)';
      ctx.fill();
      ctx.strokeStyle = vacHighlight ? '#06b6d4' : 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = vacHighlight ? 3 : 1.5;
      ctx.stroke();

      // Golgi body (stacked curves)
      const golgiHighlight = highlight === 'golgi';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const gy2 = cy - cellRy * 0.2 + i * 8;
        ctx.ellipse(cx - cellRx * 0.5, gy2, 25, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = golgiHighlight ? 'rgba(249, 115, 22, 0.7)' : 'rgba(249, 115, 22, 0.25)';
        ctx.fill();
        ctx.strokeStyle = golgiHighlight ? '#f97316' : 'rgba(249, 115, 22, 0.4)';
        ctx.lineWidth = golgiHighlight ? 2 : 1;
        ctx.stroke();
      }

      // Mitochondria
      const mitoHighlight = highlight === 'mitochondria';
      const mitoPositions = [
        { x: cx + cellRx * 0.5, y: cy - cellRy * 0.3, rot: 0.3 },
        { x: cx + cellRx * 0.3, y: cy + cellRy * 0.35, rot: -0.5 },
        { x: cx - cellRx * 0.55, y: cy + cellRy * 0.4, rot: 0.8 },
      ];
      mitoPositions.forEach(mp => {
        ctx.save();
        ctx.translate(mp.x, mp.y);
        ctx.rotate(mp.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 11, 0, 0, Math.PI * 2);
        ctx.fillStyle = mitoHighlight ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.3)';
        ctx.fill();
        ctx.strokeStyle = mitoHighlight ? '#ef4444' : 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = mitoHighlight ? 2 : 1;
        ctx.stroke();
        // Inner folds (cristae)
        for (let f = -2; f <= 2; f++) {
          ctx.beginPath();
          ctx.moveTo(f * 6, -8);
          ctx.quadraticCurveTo(f * 6 + 3, 0, f * 6, 8);
          ctx.strokeStyle = mitoHighlight ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Ribosomes (small dots)
      const riboHighlight = highlight === 'ribosome';
      const riboPositions = [
        { x: cx - cellRx * 0.35, y: cy + cellRy * 0.4 },
        { x: cx - cellRx * 0.25, y: cy + cellRy * 0.5 },
        { x: cx - cellRx * 0.4, y: cy + cellRy * 0.5 },
        { x: cx + cellRx * 0.15, y: cy + cellRy * 0.3 },
        { x: cx + cellRx * 0.25, y: cy + cellRy * 0.45 },
        { x: cx - cellRx * 0.15, y: cy - cellRy * 0.45 },
        { x: cx + cellRx * 0.4, y: cy + cellRy * 0.15 },
      ];
      riboPositions.forEach(rp => {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, riboHighlight ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = riboHighlight ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)';
        ctx.fill();
      });

      // Nucleus
      const nucHighlight = highlight === 'nucleus';
      const nucR = Math.min(cellRx, cellRy) * 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, nucR, 0, Math.PI * 2);
      const nucGrad = ctx.createRadialGradient(cx - 10, cy - 10, 0, cx, cy, nucR);
      nucGrad.addColorStop(0, nucHighlight ? '#a5b4fc' : '#c7d2fe');
      nucGrad.addColorStop(1, nucHighlight ? '#6366f1' : '#a5b4fc');
      ctx.fillStyle = nucGrad;
      ctx.fill();
      ctx.strokeStyle = nucHighlight ? '#4f46e5' : '#818cf8';
      ctx.lineWidth = nucHighlight ? 4 : 2;
      ctx.stroke();

      // Nucleolus
      ctx.beginPath();
      ctx.arc(cx + 5, cy - 5, nucR * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#4338ca';
      ctx.fill();

      // DNA strands
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1.5;
      for (let d = 0; d < 2; d++) {
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 4; t += 0.2) {
          const dx = cx + Math.cos(t + timeRef.current * 2) * nucR * 0.5;
          const dy = cy - nucR * 0.6 + t * (nucR * 0.3);
          if (t === 0) ctx.moveTo(dx + (d === 0 ? 0 : 5), dy);
          else ctx.lineTo(dx + (d === 0 ? 0 : 5), dy);
        }
        ctx.stroke();
      }

      // Labels
      if (playingRef.current) {
        organelles.forEach(org => {
          const isActive = highlight === org.id;
          ctx.fillStyle = isActive ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)';
          ctx.beginPath();
          ctx.roundRect(org.x - 45, org.y - 45, 90, isActive ? 40 : 28, 8);
          ctx.fill();
          ctx.fillStyle = isActive ? org.color : 'rgba(255,255,255,0.8)';
          ctx.font = `bold ${isActive ? 11 : 9}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(`${org.emoji} ${org.name.split(' ')[0]}`, org.x, org.y - 30);
          if (isActive) {
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.font = '9px sans-serif';
            ctx.fillText(org.role, org.x, org.y - 16);
          }
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
