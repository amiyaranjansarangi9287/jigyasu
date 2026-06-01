import { useRef, useEffect } from 'react';

interface DayNightCanvasProps {
  autoRotate: boolean;
  rotationSpeed: number;
}

export default function DayNightCanvas({ autoRotate, rotationSpeed }: DayNightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const autoRotateRef = useRef(autoRotate);
  const speedRef = useRef(rotationSpeed);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    speedRef.current = rotationSpeed;
  }, [rotationSpeed]);

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

    // Sun position (left side)
    const sunX = 60;
    const sunY = h / 2;

    // Earth position (center-right)
    const earthX = w * 0.6;
    const earthY = h / 2;
    const earthRadius = Math.min(w, h) * 0.22;

    // Stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Space background
      const spaceGrad = ctx.createLinearGradient(0, 0, w, h);
      spaceGrad.addColorStop(0, '#0f172a');
      spaceGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      stars.forEach(star => {
        const twinkle = 0.4 + Math.sin(Date.now() * 0.003 + star.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
      });

      // Sun glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 120);
      sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.4)');
      sunGlow.addColorStop(0.5, 'rgba(251, 191, 36, 0.15)');
      sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      // Sun
      const sunGrad = ctx.createRadialGradient(sunX - 10, sunY - 10, 0, sunX, sunY, 45);
      sunGrad.addColorStop(0, '#fef9c3');
      sunGrad.addColorStop(0.3, '#fde047');
      sunGrad.addColorStop(0.7, '#facc15');
      sunGrad.addColorStop(1, '#f59e0b');
      ctx.beginPath();
      ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Sun rays
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + Date.now() * 0.0005;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 50, sunY + Math.sin(angle) * 50);
        ctx.lineTo(sunX + Math.cos(angle) * 70, sunY + Math.sin(angle) * 70);
        ctx.stroke();
      }

      // Sunlight beams toward Earth
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.moveTo(sunX + 45, sunY - 60);
      ctx.lineTo(earthX - earthRadius, earthY - earthRadius * 1.5);
      ctx.lineTo(earthX - earthRadius, earthY + earthRadius * 1.5);
      ctx.lineTo(sunX + 45, sunY + 60);
      ctx.closePath();
      ctx.fillStyle = '#fde047';
      ctx.fill();
      ctx.restore();

      // Update rotation
      if (autoRotateRef.current) {
        rotationRef.current += speedRef.current * 0.01;
      }

      // Earth shadow (dark side)
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius + 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
      ctx.restore();

      // Earth
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.clip();

      // Earth base (ocean)
      const oceanGrad = ctx.createRadialGradient(earthX - 20, earthY - 20, 0, earthX, earthY, earthRadius);
      oceanGrad.addColorStop(0, '#60a5fa');
      oceanGrad.addColorStop(0.7, '#3b82f6');
      oceanGrad.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2);

      // Continents (simplified, rotating)
      const continents = [
        { cx: 0.2, cy: -0.2, rx: 0.25, ry: 0.2 },  // North America-ish
        { cx: 0.5, cy: 0.2, rx: 0.2, ry: 0.3 },    // South America-ish
        { cx: -0.3, cy: -0.1, rx: 0.2, ry: 0.15 }, // Europe-ish
        { cx: -0.2, cy: 0.3, rx: 0.25, ry: 0.2 },  // Africa-ish
        { cx: -0.6, cy: 0.1, rx: 0.15, ry: 0.2 },  // Asia-ish
      ];

      ctx.fillStyle = '#22c55e';
      continents.forEach(cont => {
        // Apply rotation
        const rotatedX = cont.cx * Math.cos(rotationRef.current) - cont.cy * Math.sin(rotationRef.current);
        const x = earthX + rotatedX * earthRadius;
        const y = earthY + cont.cy * earthRadius;
        
        // Only draw if on visible side
        if (rotatedX > -0.5) {
          ctx.beginPath();
          ctx.ellipse(x, y, cont.rx * earthRadius * (0.5 + rotatedX * 0.5), cont.ry * earthRadius, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Day/Night terminator (shadow on right side = night side)
      const nightGrad = ctx.createLinearGradient(earthX - earthRadius, 0, earthX + earthRadius, 0);
      nightGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      nightGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0)');
      nightGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      nightGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.7)');
      nightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
      ctx.fillStyle = nightGrad;
      ctx.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2);

      ctx.restore();

      // Earth outline
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Little house marker (shows where "you" are)
      const houseAngle = rotationRef.current + Math.PI * 0.3;
      const houseX = earthX + Math.cos(houseAngle) * earthRadius * 0.85;
      const houseY = earthY + Math.sin(houseAngle) * earthRadius * 0.3;
      
      // Only show house if on front of Earth
      if (Math.cos(houseAngle) > -0.3) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(houseX, houseY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏠', houseX, houseY + 3);

        // Day or night for the house?
        const isDay = Math.cos(houseAngle) > 0.3;
        ctx.fillStyle = isDay ? '#fde047' : '#6366f1';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(isDay ? '☀️ Day' : '🌙 Night', houseX, houseY - 15);
      }

      // Labels
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️ SUN', sunX, sunY + 70);

      ctx.fillStyle = '#60a5fa';
      ctx.fillText('🌍 EARTH', earthX, earthY + earthRadius + 30);

      // Rotation arrow
      if (autoRotateRef.current) {
        ctx.save();
        ctx.translate(earthX, earthY - earthRadius - 20);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 15, Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(15 * Math.cos(Math.PI * 0.8), 15 * Math.sin(Math.PI * 0.8));
        ctx.lineTo(15 * Math.cos(Math.PI * 0.8) - 5, 15 * Math.sin(Math.PI * 0.8) - 5);
        ctx.stroke();
        ctx.restore();
      }

      // Info boxes
      // Day side
      ctx.fillStyle = 'rgba(253, 224, 71, 0.1)';
      ctx.beginPath();
      ctx.roundRect(earthX - earthRadius - 10, earthY + earthRadius + 45, 80, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Facing Sun', earthX - earthRadius + 30, earthY + earthRadius + 63);
      ctx.fillText('= DAY ☀️', earthX - earthRadius + 30, earthY + earthRadius + 75);

      // Night side  
      ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
      ctx.beginPath();
      ctx.roundRect(earthX + earthRadius - 70, earthY + earthRadius + 45, 80, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#a5b4fc';
      ctx.font = '11px sans-serif';
      ctx.fillText('Away from Sun', earthX + earthRadius - 30, earthY + earthRadius + 63);
      ctx.fillText('= NIGHT 🌙', earthX + earthRadius - 30, earthY + earthRadius + 75);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
