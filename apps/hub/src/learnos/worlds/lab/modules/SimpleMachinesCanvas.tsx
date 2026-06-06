import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SimpleMachinesCanvasProps {
  machine: 'lever' | 'wheel' | 'ramp' | 'pulley';
  effortLevel: number;
}

export default function SimpleMachinesCanvas({ machine, effortLevel }: SimpleMachinesCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const machineRef = useRef(machine);
  const effortRef = useRef(effortLevel);
  const animRef = useRef(0);

  useEffect(() => { machineRef.current = machine; animRef.current = 0; }, [machine]);
  useEffect(() => { effortRef.current = effortLevel; }, [effortLevel]);

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
    const groundY = h * 0.85;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#e0f2fe');
      bg.addColorStop(0.8, '#bae6fd');
      bg.addColorStop(0.85, '#86efac');
      bg.addColorStop(1, '#65a30d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const effort = effortRef.current;
      animRef.current += 0.02;

      const currentMachine = machineRef.current;

      if (currentMachine === 'lever') {
        // Fulcrum (triangle)
        const fulcrumX = w * 0.5;
        ctx.beginPath();
        ctx.moveTo(fulcrumX - 20, groundY);
        ctx.lineTo(fulcrumX, groundY - 30);
        ctx.lineTo(fulcrumX + 20, groundY);
        ctx.closePath();
        ctx.fillStyle = '#64748b';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lever beam
        const leverAngle = (effort - 50) / 50 * 0.3;
        const beamLength = w * 0.35;

        ctx.save();
        ctx.translate(fulcrumX, groundY - 30);
        ctx.rotate(leverAngle);

        // Beam
        ctx.fillStyle = '#92400e';
        ctx.fillRect(-beamLength, -5, beamLength * 2, 10);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.strokeRect(-beamLength, -5, beamLength * 2, 10);

        // Heavy box on right side
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(beamLength - 40, -45, 40, 40);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HEAVY', beamLength - 20, -20);

        // Person pushing on left side
        const pushX = -beamLength + 20;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(pushX, -30, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(pushX - 7, -20, 14, 18);

        // Effort arrow
        ctx.beginPath();
        ctx.moveTo(pushX, -50);
        ctx.lineTo(pushX, -50 - effort * 0.4);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pushX - 5, -50 - effort * 0.4 + 8);
        ctx.lineTo(pushX, -50 - effort * 0.4);
        ctx.lineTo(pushX + 5, -50 - effort * 0.4 + 8);
        ctx.stroke();

        ctx.restore();

        // Labels
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬇️ Push here', fulcrumX - beamLength * 0.7, groundY - 100);
        ctx.fillText('🔺 Fulcrum', fulcrumX, groundY + 20);
        ctx.fillText('📦 Heavy load', fulcrumX + beamLength * 0.7, groundY - 100);

      } else if (currentMachine === 'ramp') {
        // Flat ground reference
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(w * 0.2, groundY);
        ctx.lineTo(w * 0.2, groundY - 120);
        ctx.stroke();
        ctx.setLineDash([]);

        // Ramp
        ctx.beginPath();
        ctx.moveTo(w * 0.2, groundY);
        ctx.lineTo(w * 0.8, groundY);
        ctx.lineTo(w * 0.2, groundY - 120);
        ctx.closePath();
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Surface texture
        for (let i = 0; i < 8; i++) {
          const x1 = w * 0.25 + i * (w * 0.55) / 8;
          const progress = (x1 - w * 0.2) / (w * 0.6);
          const y1 = groundY - 120 * (1 - progress);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1 + 5, y1 + 5);
          ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Box sliding up ramp
        const boxProgress = Math.min(1, effort / 100);
        const rampLength = w * 0.6;
        const boxOnRampX = w * 0.7 - boxProgress * rampLength * 0.5;
        const rampSlope = 120 / (w * 0.6);
        const boxOnRampY = groundY - (w * 0.8 - boxOnRampX) * rampSlope - 20;

        ctx.save();
        ctx.translate(boxOnRampX, boxOnRampY);
        ctx.rotate(-Math.atan(rampSlope));
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(-20, -20, 40, 40);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📦', 0, 5);
        ctx.restore();

        // Person pushing
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(boxOnRampX + 35, boxOnRampY - 5, 10, 0, Math.PI * 2);
        ctx.fill();

        // Labels
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Without ramp:', w * 0.15, groundY - 130);
        ctx.fillText('LOTS of force ⬆️', w * 0.15, groundY - 115);

        ctx.fillStyle = '#22c55e';
        ctx.fillText('With ramp:', w * 0.55, groundY - 140);
        ctx.fillText('LESS force needed! 🎉', w * 0.55, groundY - 125);

        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.fillText('(But you push over a longer distance)', w * 0.55, groundY - 110);

      } else if (currentMachine === 'wheel') {
        // Without wheel - dragging
        const dragX = w * 0.25;
        const dragY = groundY - 25;

        // Box being dragged (hard!)
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(dragX - 25, dragY - 25, 50, 50);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('DRAG', dragX, dragY + 5);

        // Friction lines
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(dragX - 25 + i * 12, groundY);
          ctx.lineTo(dragX - 35 + i * 12, groundY + 8);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('🤔 Hard! Lots of friction', dragX, dragY - 40);

        // With wheels - rolling
        const wheelX = w * 0.7;
        const wheelY = groundY - 35;
        const wheelRadius = 15;
        const wheelSpin = animRef.current * effort * 0.05;

        // Cart body
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(wheelX - 35, wheelY - 25, 70, 30);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('ROLL!', wheelX, wheelY - 7);

        // Wheels
        for (const wx of [wheelX - 20, wheelX + 20]) {
          ctx.beginPath();
          ctx.arc(wx, groundY - wheelRadius, wheelRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#1e293b';
          ctx.fill();

          // Spokes
          for (let s = 0; s < 4; s++) {
            const angle = (s / 4) * Math.PI * 2 + wheelSpin;
            ctx.beginPath();
            ctx.moveTo(wx, groundY - wheelRadius);
            ctx.lineTo(wx + Math.cos(angle) * (wheelRadius - 3), groundY - wheelRadius + Math.sin(angle) * (wheelRadius - 3));
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Hub
          ctx.beginPath();
          ctx.arc(wx, groundY - wheelRadius, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#94a3b8';
          ctx.fill();
        }

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('✅ Easy! Less friction', wheelX, wheelY - 45);

        // VS label
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('VS', w / 2, groundY - 40);

      } else if (currentMachine === 'pulley') {
        // Pulley system
        const pulleyX = w / 2;
        const pulleyY = 50;
        const pulleyR = 20;

        // Support beam
        ctx.fillStyle = '#78350f';
        ctx.fillRect(pulleyX - 5, 10, 10, 45);
        ctx.fillRect(pulleyX - 50, 10, 100, 12);

        // Pulley wheel
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, pulleyR, 0, Math.PI * 2);
        ctx.fillStyle = '#64748b';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Axle
        ctx.beginPath();
        ctx.arc(pulleyX, pulleyY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();

        // Rope
        const ropeLeft = pulleyY + pulleyR;
        const boxDrop = effort / 100 * (groundY - ropeLeft - 80);

        // Left rope (effort side)
        ctx.beginPath();
        ctx.moveTo(pulleyX - pulleyR, pulleyY);
        ctx.lineTo(pulleyX - pulleyR, ropeLeft + (groundY - ropeLeft - boxDrop));
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Right rope (load side)
        ctx.beginPath();
        ctx.moveTo(pulleyX + pulleyR, pulleyY);
        ctx.lineTo(pulleyX + pulleyR, ropeLeft + boxDrop);
        ctx.stroke();

        // Heavy box on right
        const boxY = ropeLeft + boxDrop;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(pulleyX + pulleyR - 20, boxY, 40, 40);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('HEAVY', pulleyX + pulleyR, boxY + 25);

        // Person pulling on left
        const personY = ropeLeft + (groundY - ropeLeft - boxDrop);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(pulleyX - pulleyR - 15, personY - 15, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(pulleyX - pulleyR - 22, personY - 5, 14, 18);

        // Arrow showing pull direction
        ctx.beginPath();
        ctx.moveTo(pulleyX - pulleyR - 30, personY + 20);
        ctx.lineTo(pulleyX - pulleyR - 30, personY + 50);
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(pulleyX - pulleyR - 35, personY + 50);
        ctx.lineTo(pulleyX - pulleyR - 30, personY + 60);
        ctx.lineTo(pulleyX - pulleyR - 25, personY + 50);
        ctx.fill();

        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('Pull DOWN ⬇️', pulleyX - pulleyR - 30, personY + 80);
        ctx.fillText('to lift UP ⬆️', pulleyX + pulleyR, boxY + 65);
      }

      // Title
      const titles: Record<string, string> = {
        lever: '🔧 Lever — Small push lifts big weight!',
        ramp: '📐 Ramp — Less force over longer distance!',
        wheel: '☸️ Wheel — Reduces friction!',
        pulley: '🪢 Pulley — Pull down to lift up!',
      };
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 150, h - 35, 300, 28, 14);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(titles[currentMachine], w / 2, h - 17);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
