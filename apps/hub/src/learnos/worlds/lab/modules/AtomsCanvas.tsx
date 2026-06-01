import { useRef, useEffect } from 'react';

interface AtomsCanvasProps {
  element: 'hydrogen' | 'helium' | 'carbon' | 'oxygen';
  showLabels: boolean;
}

export default function AtomsCanvas({ element, showLabels }: AtomsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const elementRef = useRef(element);
  const showLabelsRef = useRef(showLabels);
  const animRef = useRef(0);

  useEffect(() => { elementRef.current = element; }, [element]);
  useEffect(() => { showLabelsRef.current = showLabels; }, [showLabels]);

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

    const elements: Record<string, { symbol: string; name: string; protons: number; neutrons: number; electrons: number[]; color: string }> = {
      hydrogen: { symbol: 'H', name: 'Hydrogen', protons: 1, neutrons: 0, electrons: [1], color: '#60a5fa' },
      helium: { symbol: 'He', name: 'Helium', protons: 2, neutrons: 2, electrons: [2], color: '#fbbf24' },
      carbon: { symbol: 'C', name: 'Carbon', protons: 6, neutrons: 6, electrons: [2, 4], color: '#4ade80' },
      oxygen: { symbol: 'O', name: 'Oxygen', protons: 8, neutrons: 8, electrons: [2, 6], color: '#f87171' },
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      animRef.current += 0.015;
      const time = animRef.current;
      const el = elements[elementRef.current];

      // Background
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const nucleusR = 20 + el.protons * 3;

      // Electron orbit paths
      el.electrons.forEach((_, shellIdx) => {
        const orbitR = nucleusR + 35 + shellIdx * 40;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label
        if (showLabelsRef.current) {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
          ctx.font = '9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Shell ${shellIdx + 1}`, cx + orbitR + 5, cy - 10);
        }
      });

      // Nucleus glow
      const nucleusGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, nucleusR * 2);
      nucleusGlow.addColorStop(0, `${el.color}30`);
      nucleusGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, nucleusR * 2, 0, Math.PI * 2);
      ctx.fillStyle = nucleusGlow;
      ctx.fill();

      // Nucleus particles
      const totalNucleons = el.protons + el.neutrons;
      for (let i = 0; i < totalNucleons; i++) {
        const angle = (i / totalNucleons) * Math.PI * 2 + Math.sin(time + i * 0.5) * 0.2;
        const dist = (i < totalNucleons / 2 ? 0.3 : 0.7) * nucleusR;
        const jitter = Math.sin(time * 3 + i * 2) * 2;
        const px = cx + Math.cos(angle) * dist + jitter;
        const py = cy + Math.sin(angle) * dist + Math.cos(time * 2 + i) * 2;
        const r = 7;

        const isProton = i < el.protons;
        const grad = ctx.createRadialGradient(px - 2, py - 2, 0, px, py, r);
        if (isProton) {
          grad.addColorStop(0, '#fca5a5');
          grad.addColorStop(1, '#ef4444');
        } else {
          grad.addColorStop(0, '#cbd5e1');
          grad.addColorStop(1, '#64748b');
        }
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // +/n label on nucleons
        ctx.fillStyle = 'white';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isProton ? '+' : 'n', px, py);
      }

      // Electrons
      el.electrons.forEach((count, shellIdx) => {
        const orbitR = nucleusR + 35 + shellIdx * 40;
        const speed = (2 - shellIdx * 0.5);

        for (let e = 0; e < count; e++) {
          const angle = (e / count) * Math.PI * 2 + time * speed + shellIdx * Math.PI * 0.3;
          const ex = cx + Math.cos(angle) * orbitR;
          const ey = cy + Math.sin(angle) * orbitR;

          // Electron trail
          for (let t = 1; t <= 6; t++) {
            const trailAngle = angle - t * 0.08;
            const tx = cx + Math.cos(trailAngle) * orbitR;
            const ty = cy + Math.sin(trailAngle) * orbitR;
            ctx.beginPath();
            ctx.arc(tx, ty, 4 - t * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${0.3 - t * 0.04})`;
            ctx.fill();
          }

          // Electron glow
          const eGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 15);
          eGlow.addColorStop(0, 'rgba(96, 165, 250, 0.5)');
          eGlow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(ex, ey, 15, 0, Math.PI * 2);
          ctx.fillStyle = eGlow;
          ctx.fill();

          // Electron body
          const eGrad = ctx.createRadialGradient(ex - 1, ey - 1, 0, ex, ey, 5);
          eGrad.addColorStop(0, '#bfdbfe');
          eGrad.addColorStop(1, '#3b82f6');
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = eGrad;
          ctx.fill();

          // − sign
          ctx.fillStyle = 'white';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('−', ex, ey);
        }
      });

      // Info panel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 160, showLabelsRef.current ? 110 : 70, 12);
      ctx.fill();

      ctx.fillStyle = el.color;
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(el.symbol, 22, 18);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(el.name, 55, 22);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`⊕ ${el.protons} protons`, 22, 50);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`◉ ${el.neutrons} neutrons`, 22, 66);

      if (showLabelsRef.current) {
        ctx.fillStyle = '#60a5fa';
        ctx.fillText(`⊖ ${el.electrons.reduce((a, b) => a + b, 0)} electrons`, 22, 82);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Shells: ${el.electrons.join(', ')}`, 22, 98);
      }

      // Legend
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.roundRect(w - 130, h - 55, 120, 45, 10);
      ctx.fill();
      ctx.fillStyle = '#ef4444'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('🔴 Proton (+)', w - 120, h - 38);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('⚪ Neutron (0)', w - 120, h - 24);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('🔵 Electron (−)', w - 120, h - 10);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
