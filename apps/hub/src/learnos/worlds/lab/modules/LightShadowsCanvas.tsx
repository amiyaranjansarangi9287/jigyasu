import { useRef, useEffect, useCallback } from 'react';

interface LightShadowsCanvasProps {
  lightX: number;
  lightY: number;
  onLightMove?: (x: number, y: number) => void;
}

export default function LightShadowsCanvas({ lightX, lightY, onLightMove }: LightShadowsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const lightPosRef = useRef({ x: lightX, y: lightY });
  const isDraggingRef = useRef(false);
  

  useEffect(() => {
    lightPosRef.current = { x: lightX, y: lightY };
  }, [lightX, lightY]);

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    // Constrain to top half of canvas
    const constrainedY = Math.min(y, 45);
    const constrainedX = Math.max(10, Math.min(90, x));
    
    if (onLightMove) {
      onLightMove(constrainedX, constrainedY);
    }
  }, [onLightMove]);

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

    // Objects that cast shadows
    const objects = [
      { x: w * 0.25, y: h * 0.75, type: 'tree', width: 30, height: 80 },
      { x: w * 0.5, y: h * 0.78, type: 'person', width: 25, height: 50 },
      { x: w * 0.75, y: h * 0.76, type: 'house', width: 60, height: 55 },
    ];

    const groundY = h * 0.82;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Sky gradient based on light position
      const lightYPercent = lightPosRef.current.y / 50;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      
      if (lightYPercent < 0.3) {
        // High sun - bright blue
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(1, '#7dd3fc');
      } else if (lightYPercent < 0.6) {
        // Medium - softer blue
        skyGrad.addColorStop(0, '#60a5fa');
        skyGrad.addColorStop(1, '#93c5fd');
      } else {
        // Low sun - orange/sunset
        skyGrad.addColorStop(0, '#fb923c');
        skyGrad.addColorStop(0.5, '#fbbf24');
        skyGrad.addColorStop(1, '#fde68a');
      }
      
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Ground
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Convert light percentage to actual position
      const actualLightX = (lightPosRef.current.x / 100) * w;
      const actualLightY = (lightPosRef.current.y / 100) * h;

      // Light source (Sun/Flashlight)
      const lightRadius = 30;
      const glowRadius = 80;

      // Light glow
      const glowGrad = ctx.createRadialGradient(actualLightX, actualLightY, 0, actualLightX, actualLightY, glowRadius);
      glowGrad.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
      glowGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.2)');
      glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.beginPath();
      ctx.arc(actualLightX, actualLightY, glowRadius, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Light rays
      ctx.save();
      ctx.globalAlpha = 0.15;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const rayLength = 400;
        ctx.beginPath();
        ctx.moveTo(actualLightX, actualLightY);
        ctx.lineTo(
          actualLightX + Math.cos(angle) * rayLength,
          actualLightY + Math.sin(angle) * rayLength
        );
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 8;
        ctx.stroke();
      }
      ctx.restore();

      // Draw shadows for each object
      objects.forEach(obj => {
        // Calculate shadow direction (opposite of light)
        const dx = obj.x - actualLightX;
        const dy = (obj.y - obj.height / 2) - actualLightY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Shadow length based on light angle
        const lightAngle = Math.atan2(dy, dx);
        const shadowLength = Math.max(20, (obj.height * 2) * (1 + (actualLightY / h) * 2));
        
        // Shadow end point
        const shadowEndX = obj.x + Math.cos(lightAngle) * shadowLength;
        const shadowEndY = groundY + 5;

        // Draw shadow
        ctx.save();
        ctx.globalAlpha = 0.4 - (distance / w) * 0.2;
        
        ctx.beginPath();
        if (obj.type === 'tree') {
          // Tree shadow
          ctx.moveTo(obj.x - 5, groundY);
          ctx.lineTo(obj.x + 5, groundY);
          ctx.lineTo(shadowEndX + 15, shadowEndY);
          ctx.lineTo(shadowEndX - 15, shadowEndY);
        } else if (obj.type === 'person') {
          // Person shadow
          ctx.moveTo(obj.x - 8, groundY);
          ctx.lineTo(obj.x + 8, groundY);
          ctx.lineTo(shadowEndX + 12, shadowEndY);
          ctx.lineTo(shadowEndX - 12, shadowEndY);
        } else {
          // House shadow
          ctx.moveTo(obj.x - obj.width / 2, groundY);
          ctx.lineTo(obj.x + obj.width / 2, groundY);
          ctx.lineTo(shadowEndX + obj.width / 2, shadowEndY);
          ctx.lineTo(shadowEndX - obj.width / 2, shadowEndY);
        }
        ctx.closePath();
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.restore();
      });

      // Draw objects
      objects.forEach(obj => {
        if (obj.type === 'tree') {
          // Trunk
          ctx.fillStyle = '#92400e';
          ctx.fillRect(obj.x - 8, obj.y - 30, 16, 35);
          // Leaves
          ctx.beginPath();
          ctx.arc(obj.x, obj.y - 50, 28, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(obj.x - 15, obj.y - 35, 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(obj.x + 15, obj.y - 35, 20, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === 'person') {
          // Body
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(obj.x - 10, obj.y - 30, 20, 30);
          // Head
          ctx.beginPath();
          ctx.arc(obj.x, obj.y - 40, 12, 0, Math.PI * 2);
          ctx.fillStyle = '#fcd34d';
          ctx.fill();
          // Face
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(obj.x - 4, obj.y - 42, 2, 0, Math.PI * 2);
          ctx.arc(obj.x + 4, obj.y - 42, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (obj.type === 'house') {
          // House body
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(obj.x - 25, obj.y - 35, 50, 40);
          // Roof
          ctx.beginPath();
          ctx.moveTo(obj.x - 30, obj.y - 35);
          ctx.lineTo(obj.x, obj.y - 60);
          ctx.lineTo(obj.x + 30, obj.y - 35);
          ctx.closePath();
          ctx.fillStyle = '#dc2626';
          ctx.fill();
          // Door
          ctx.fillStyle = '#92400e';
          ctx.fillRect(obj.x - 8, obj.y - 20, 16, 25);
          // Window
          ctx.fillStyle = '#60a5fa';
          ctx.fillRect(obj.x + 12, obj.y - 28, 12, 12);
        }
      });

      // Sun/light source
      const sunGrad = ctx.createRadialGradient(actualLightX - 5, actualLightY - 5, 0, actualLightX, actualLightY, lightRadius);
      sunGrad.addColorStop(0, '#fef9c3');
      sunGrad.addColorStop(0.3, '#fde047');
      sunGrad.addColorStop(0.7, '#fbbf24');
      sunGrad.addColorStop(1, '#f59e0b');
      ctx.beginPath();
      ctx.arc(actualLightX, actualLightY, lightRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.fill();

      // Drag indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('☀️', actualLightX, actualLightY + 4);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px sans-serif';
      ctx.fillText('Drag me!', actualLightX, actualLightY + 50);

      // Instructions
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(10, 10, 180, 50, 8);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🔦 Light travels straight!', 20, 28);
      ctx.font = '10px sans-serif';
      ctx.fillText('Objects block light → shadows form', 20, 44);

      frameRef.current = requestAnimationFrame(animate);
    };

    // Event handlers
    const handleStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      
      if ('touches' in e) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        handleInteraction(e.clientX, e.clientY);
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      
      if ('touches' in e) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      } else {
        handleInteraction(e.clientX, e.clientY);
      }
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    canvas.style.cursor = 'grab';

    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [handleInteraction]);

  return <canvas ref={canvasRef} className="w-full aspect-[16/10] block" />;
}
