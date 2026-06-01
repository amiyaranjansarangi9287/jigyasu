// src/worlds/lab/components/DataGraph.tsx
import { useRef, useEffect } from 'react';
import { CanvasHelpers } from '@/shared/canvas/helpers/CanvasHelpers';

interface DataPoint { x: number; y: number; label?: string; }
interface DataGraphProps { data: DataPoint[]; xLabel: string; yLabel: string; color?: string; height?: number; showGrid?: boolean; title?: string; }

export function DataGraph({ data, xLabel, yLabel, color = '#3B82F6', height = 180, showGrid = true, title }: DataGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas || data.length < 2) return;
    const ctx = CanvasHelpers.setupHiDPI(canvas, canvas.getBoundingClientRect().width, height);
    const w = canvas.getBoundingClientRect().width, h = height;
    const p = { top: 20, right: 20, bottom: 40, left: 45 }, gw = w - p.left - p.right, gh = h - p.top - p.bottom;
    const xMin = Math.min(...data.map(d => d.x)), xMax = Math.max(...data.map(d => d.x));
    const yMax = Math.max(...data.map(d => d.y)) * 1.1 || 1;
    const toX = (x: number) => p.left + ((x - xMin) / (xMax - xMin || 1)) * gw;
    const toY = (y: number) => h - p.bottom - (y / yMax) * gh;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
    if (showGrid) {
      ctx.strokeStyle = '#F1F5F9'; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const gy = p.top + (gh / 4) * i; ctx.beginPath(); ctx.moveTo(p.left, gy); ctx.lineTo(w - p.right, gy); ctx.stroke(); }
    }
    ctx.strokeStyle = '#CBD5E1'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.left, p.top); ctx.lineTo(p.left, h - p.bottom); ctx.lineTo(w - p.right, h - p.bottom); ctx.stroke();
    ctx.fillStyle = '#64748B'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(xLabel, w / 2, h - 8);
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(yLabel, 0, 0); ctx.restore();
    if (title) { ctx.fillStyle = '#1E293B'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(title, w / 2, 14); }
    ctx.beginPath(); ctx.moveTo(toX(data[0].x), h - p.bottom);
    data.forEach(pt => ctx.lineTo(toX(pt.x), toY(pt.y)));
    ctx.lineTo(toX(data[data.length - 1].x), h - p.bottom); ctx.closePath(); ctx.fillStyle = `${color}22`; ctx.fill();
    ctx.beginPath(); data.forEach((pt, i) => { if (i === 0) ctx.moveTo(toX(pt.x), toY(pt.y)); else ctx.lineTo(toX(pt.x), toY(pt.y)); });
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
    data.forEach(pt => { ctx.beginPath(); ctx.arc(toX(pt.x), toY(pt.y), 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5; ctx.stroke(); });
  }, [data, xLabel, yLabel, color, height, showGrid, title]);
  return <canvas ref={canvasRef} className="w-full rounded-xl border border-slate-100" style={{ height }} />;
}
