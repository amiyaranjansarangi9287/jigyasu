import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface ShapesCanvasProps {
  shape: 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'circle';
  showAngles: boolean;
}

export default function ShapesCanvas({ shape, showAngles }: ShapesCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const shapeRef = useRef(shape);
  const showAnglesRef = useRef(showAngles);
  const rotationRef = useRef(0);

  useEffect(() => { shapeRef.current = shape; }, [shape]);
  useEffect(() => { showAnglesRef.current = showAngles; }, [showAngles]);

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
    const centerX = w / 2;
    const centerY = h / 2;

    const shapeConfig: Record<string, { sides: number; color: string; name: string; angle: number }> = {
      triangle: { sides: 3, color: '#ef4444', name: 'Triangle', angle: 60 },
      square: { sides: 4, color: '#3b82f6', name: 'Square', angle: 90 },
      pentagon: { sides: 5, color: '#22c55e', name: 'Pentagon', angle: 108 },
      hexagon: { sides: 6, color: '#a855f7', name: 'Hexagon', angle: 120 },
      circle: { sides: 0, color: '#f59e0b', name: 'Circle', angle: 0 },
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Background grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 25) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += 25) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      rotationRef.current += 0.005;
      const currentShape = shapeRef.current;
      const config = shapeConfig[currentShape];
      const radius = Math.min(w, h) * 0.28;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationRef.current);

      if (currentShape === 'circle') {
        // Circle
        const circleGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius);
        circleGrad.addColorStop(0, '#fef3c7');
        circleGrad.addColorStop(0.5, '#fbbf24');
        circleGrad.addColorStop(1, '#f59e0b');

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = circleGrad;
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Radius line
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(radius - 5, 0);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

      } else {
        // Regular polygon
        const sides = config.sides;
        const points: { x: number; y: number }[] = [];

        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
          points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          });
        }

        // Fill
        ctx.beginPath();
        points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        const grad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius);
        grad.addColorStop(0, config.color + '66');
        grad.addColorStop(1, config.color + 'cc');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Vertices
        points.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.strokeStyle = config.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        // Side labels
        for (let i = 0; i < sides; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % sides];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          const sideLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);

          ctx.save();
          ctx.rotate(-rotationRef.current);
          const rotMidX = midX * Math.cos(rotationRef.current) - midY * Math.sin(rotationRef.current);
          const rotMidY = midX * Math.sin(rotationRef.current) + midY * Math.cos(rotationRef.current);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${Math.round(sideLength)}px`, rotMidX, rotMidY);
          ctx.restore();
        }

        // Angle indicators
        if (showAnglesRef.current) {
          points.forEach((p, i) => {
            const prev = points[(i - 1 + sides) % sides];
            const next = points[(i + 1) % sides];

            const angle1 = Math.atan2(prev.y - p.y, prev.x - p.x);
            const angle2 = Math.atan2(next.y - p.y, next.x - p.x);

            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, angle2, angle1);
            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Angle value
            ctx.save();
            ctx.rotate(-rotationRef.current);
            const rotPx = p.x * Math.cos(rotationRef.current) - p.y * Math.sin(rotationRef.current);
            const rotPy = p.x * Math.sin(rotationRef.current) + p.y * Math.cos(rotationRef.current);
            const nudge = radius * 0.15;
            const nudgeAngle = Math.atan2(p.y, p.x);
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
              `${config.angle}°`,
              rotPx + Math.cos(nudgeAngle) * nudge,
              rotPy + Math.sin(nudgeAngle) * nudge + 4
            );
            ctx.restore();
          });
        }
      }

      ctx.restore();

      // Info panel
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 170, currentShape === 'circle' ? 70 : 90, 12);
      ctx.fill();

      ctx.fillStyle = config.color;
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(config.name, 22, 32);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '12px sans-serif';
      if (currentShape === 'circle') {
        ctx.fillText('Sides: ∞ (curved!)', 22, 50);
        ctx.fillText('No corners', 22, 68);
      } else {
        ctx.fillText(`Sides: ${config.sides}`, 22, 50);
        ctx.fillText(`Corners: ${config.sides}`, 22, 68);
        ctx.fillText(`Each angle: ${config.angle}°`, 22, 86);
      }

      // Total angles
      if (currentShape !== 'circle') {
        const totalAngle = config.angle * config.sides;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.roundRect(w - 140, 10, 130, 45, 10);
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('All angles sum to:', w - 75, 28);
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(`${totalAngle}°`, w - 75, 48);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
