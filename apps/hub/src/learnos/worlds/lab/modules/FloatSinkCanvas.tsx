import { useRef, useEffect } from 'react';

interface FloatSinkCanvasProps {
  objects: { id: string; name: string; emoji: string; density: number; dropped: boolean }[];
}

interface FallingObject {
  id: string;
  name: string;
  emoji: string;
  density: number;
  x: number;
  y: number;
  vy: number;
  targetY: number;
  rotation: number;
  vr: number;
  settled: boolean;
}

export default function FloatSinkCanvas({ objects }: FloatSinkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const fallingObjectsRef = useRef<FallingObject[]>([]);
  const bubblesRef = useRef<{ x: number; y: number; r: number; vy: number }[]>([]);
  const prevDroppedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check for newly dropped objects
    const currentDropped = new Set(objects.filter(o => o.dropped).map(o => o.id));
    
    objects.forEach(obj => {
      if (obj.dropped && !prevDroppedRef.current.has(obj.id)) {
        // New drop!
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const waterLevel = h * 0.35;
        
        // Density determines float/sink
        // < 1 = floats, > 1 = sinks
        const floats = obj.density < 1;
        const targetY = floats 
          ? waterLevel - 10 + (obj.density * 20) // Float near surface
          : h - 40 - (1 - Math.min(obj.density, 2) / 2) * 20; // Sink to bottom
        
        fallingObjectsRef.current.push({
          id: obj.id,
          name: obj.name,
          emoji: obj.emoji,
          density: obj.density,
          x: 80 + Math.random() * (w - 160),
          y: -50,
          vy: 0,
          targetY,
          rotation: 0,
          vr: (Math.random() - 0.5) * 0.1,
          settled: false,
        });
      }
    });
    
    prevDroppedRef.current = currentDropped;
  }, [objects]);

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
    const waterLevel = h * 0.35;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Sky background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLevel);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, waterLevel);

      // Sun
      const sunGrad = ctx.createRadialGradient(w - 60, 50, 0, w - 60, 50, 40);
      sunGrad.addColorStop(0, '#fef9c3');
      sunGrad.addColorStop(0.5, '#fde047');
      sunGrad.addColorStop(1, '#fbbf24');
      ctx.beginPath();
      ctx.arc(w - 60, 50, 35, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Water
      const waterGrad = ctx.createLinearGradient(0, waterLevel, 0, h);
      waterGrad.addColorStop(0, '#38bdf8');
      waterGrad.addColorStop(0.3, '#0ea5e9');
      waterGrad.addColorStop(0.7, '#0284c7');
      waterGrad.addColorStop(1, '#0369a1');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterLevel, w, h - waterLevel);

      // Water surface wave effect
      ctx.beginPath();
      ctx.moveTo(0, waterLevel);
      for (let x = 0; x < w; x += 20) {
        const waveY = waterLevel + Math.sin(Date.now() * 0.002 + x * 0.05) * 3;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(w, waterLevel);
      ctx.lineTo(w, waterLevel + 10);
      ctx.lineTo(0, waterLevel + 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // Water level indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('← Water Surface', 10, waterLevel - 10);

      // Bubbles
      if (Math.random() < 0.05) {
        bubblesRef.current.push({
          x: Math.random() * w,
          y: h,
          r: 2 + Math.random() * 4,
          vy: -1 - Math.random() * 2,
        });
      }

      for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
        const b = bubblesRef.current[i];
        b.y += b.vy;
        b.x += Math.sin(Date.now() * 0.01 + b.y * 0.1) * 0.3;

        if (b.y < waterLevel) {
          bubblesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Update and draw falling objects
      fallingObjectsRef.current.forEach(obj => {
        if (!obj.settled) {
          // Physics
          const inWater = obj.y > waterLevel;
          
          if (inWater) {
            // Buoyancy and drag
            const buoyancy = (1 - obj.density) * 0.3;
            obj.vy += 0.2 + buoyancy; // Gravity + buoyancy
            obj.vy *= 0.95; // Water drag
            
            // Check if reached target
            if (obj.density < 1 && obj.y > obj.targetY) {
              // Floating object bobbing
              obj.y += (obj.targetY - obj.y) * 0.1;
              obj.vy *= 0.8;
              if (Math.abs(obj.y - obj.targetY) < 2) {
                obj.settled = true;
              }
            } else if (obj.density >= 1 && obj.y >= obj.targetY) {
              obj.y = obj.targetY;
              obj.vy = 0;
              obj.settled = true;
            }
          } else {
            // In air - falling
            obj.vy += 0.5;
          }
          
          obj.y += obj.vy;
          obj.rotation += obj.vr;
          obj.vr *= 0.98;
        } else {
          // Settled - gentle bob for floating objects
          if (obj.density < 1) {
            obj.y = obj.targetY + Math.sin(Date.now() * 0.003 + obj.x) * 2;
            obj.rotation = Math.sin(Date.now() * 0.002 + obj.x) * 0.05;
          }
        }

        // Draw object
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.rotation);

        // Shadow/glow
        ctx.beginPath();
        ctx.arc(0, 3, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();

        // Emoji
        ctx.font = '36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.emoji, 0, 0);

        ctx.restore();

        // Label when settled
        if (obj.settled) {
          const floats = obj.density < 1;
          ctx.fillStyle = floats ? '#22c55e' : '#ef4444';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(
            floats ? '✓ FLOATS!' : '✗ SINKS!',
            obj.x,
            obj.y + 35
          );
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '9px sans-serif';
          ctx.fillText(obj.name, obj.x, obj.y + 48);
        }
      });

      // Density scale legend
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.roundRect(w - 120, h - 70, 110, 60, 8);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Density Guide:', w - 112, h - 52);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#22c55e';
      ctx.fillText('< 1.0 → Floats! 🎈', w - 112, h - 38);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('> 1.0 → Sinks! ⬇️', w - 112, h - 24);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
