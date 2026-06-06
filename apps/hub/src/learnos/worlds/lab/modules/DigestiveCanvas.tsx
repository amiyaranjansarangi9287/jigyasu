import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DigestiveCanvasProps {
  currentStage: number;
  isPlaying: boolean;
}

export default function DigestiveCanvas({ currentStage, isPlaying }: DigestiveCanvasProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const foodPosRef = useRef({ x: 0, y: 0 });
  const stageRef = useRef(currentStage);
  const isPlayingRef = useRef(isPlaying);
  const animProgressRef = useRef(0);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; color: string }[]>([]);

  useEffect(() => {
    stageRef.current = currentStage;
    animProgressRef.current = 0;
  }, [currentStage]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

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

    // Body outline path points
    const bodyPath = {
      mouth: { x: w * 0.5, y: h * 0.08 },
      esophagus: { x: w * 0.5, y: h * 0.22 },
      stomach: { x: w * 0.45, y: h * 0.38 },
      smallIntestine: { x: w * 0.5, y: h * 0.58 },
      largeIntestine: { x: w * 0.5, y: h * 0.78 },
      end: { x: w * 0.5, y: h * 0.92 },
    };

    // Initialize food position
    foodPosRef.current = { ...bodyPath.mouth };

    const getStagePosition = (stage: number, progress: number) => {
      const positions = [
        bodyPath.mouth,
        bodyPath.esophagus,
        bodyPath.stomach,
        bodyPath.smallIntestine,
        bodyPath.largeIntestine,
        bodyPath.end,
      ];
      
      const currentPos = positions[Math.min(stage, positions.length - 1)];
      const nextPos = positions[Math.min(stage + 1, positions.length - 1)];
      
      return {
        x: currentPos.x + (nextPos.x - currentPos.x) * progress,
        y: currentPos.y + (nextPos.y - currentPos.y) * progress,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Background - body silhouette
      ctx.fillStyle = '#fce7f3';
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, w * 0.4, h * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw digestive system

      // Mouth
      ctx.beginPath();
      ctx.arc(bodyPath.mouth.x, bodyPath.mouth.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = stageRef.current === 0 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(252, 165, 165, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Teeth
      ctx.fillStyle = 'white';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI + Math.PI;
        ctx.beginPath();
        ctx.arc(
          bodyPath.mouth.x + Math.cos(angle) * 18,
          bodyPath.mouth.y + Math.sin(angle) * 18,
          4, 0, Math.PI * 2
        );
        ctx.fill();
      }

      // Esophagus (tube)
      ctx.beginPath();
      ctx.moveTo(bodyPath.mouth.x - 12, bodyPath.mouth.y + 20);
      ctx.lineTo(bodyPath.esophagus.x - 10, bodyPath.esophagus.y);
      ctx.lineTo(bodyPath.stomach.x - 15, bodyPath.stomach.y - 30);
      ctx.lineTo(bodyPath.stomach.x + 15, bodyPath.stomach.y - 30);
      ctx.lineTo(bodyPath.esophagus.x + 10, bodyPath.esophagus.y);
      ctx.lineTo(bodyPath.mouth.x + 12, bodyPath.mouth.y + 20);
      ctx.closePath();
      ctx.fillStyle = stageRef.current === 1 ? 'rgba(251, 146, 60, 0.9)' : 'rgba(254, 215, 170, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stomach
      ctx.beginPath();
      ctx.ellipse(bodyPath.stomach.x, bodyPath.stomach.y, 45, 35, -0.2, 0, Math.PI * 2);
      ctx.fillStyle = stageRef.current === 2 ? 'rgba(34, 197, 94, 0.9)' : 'rgba(187, 247, 208, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Stomach acid bubbles
      if (stageRef.current === 2) {
        for (let i = 0; i < 5; i++) {
          const bx = bodyPath.stomach.x + Math.sin(Date.now() * 0.003 + i) * 25;
          const by = bodyPath.stomach.y + Math.cos(Date.now() * 0.002 + i * 2) * 15;
          ctx.beginPath();
          ctx.arc(bx, by, 4 + Math.sin(Date.now() * 0.01 + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(134, 239, 172, 0.6)';
          ctx.fill();
        }
      }

      // Small Intestine (squiggly)
      ctx.beginPath();
      ctx.moveTo(bodyPath.stomach.x + 30, bodyPath.stomach.y + 20);
      const siY = bodyPath.smallIntestine.y;
      for (let i = 0; i < 8; i++) {
        const x = w * 0.3 + (i % 2 === 0 ? 0 : w * 0.4);
        const y = bodyPath.stomach.y + 40 + i * 15;
        ctx.lineTo(x, Math.min(y, siY + 30));
      }
      ctx.strokeStyle = stageRef.current === 3 ? 'rgba(59, 130, 246, 0.9)' : 'rgba(191, 219, 254, 0.7)';
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.strokeStyle = '#1d4ed8';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineCap = 'butt';

      // Villi visualization for small intestine
      if (stageRef.current === 3) {
        ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
        for (let i = 0; i < 20; i++) {
          const vx = w * 0.3 + Math.random() * w * 0.4;
          const vy = bodyPath.stomach.y + 50 + Math.random() * 80;
          ctx.beginPath();
          ctx.ellipse(vx, vy, 3, 6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Large Intestine (U shape)
      ctx.beginPath();
      ctx.moveTo(w * 0.25, bodyPath.smallIntestine.y + 20);
      ctx.lineTo(w * 0.25, bodyPath.largeIntestine.y);
      ctx.quadraticCurveTo(w * 0.25, bodyPath.largeIntestine.y + 30, w * 0.5, bodyPath.largeIntestine.y + 30);
      ctx.quadraticCurveTo(w * 0.75, bodyPath.largeIntestine.y + 30, w * 0.75, bodyPath.largeIntestine.y);
      ctx.lineTo(w * 0.75, bodyPath.smallIntestine.y + 20);
      ctx.strokeStyle = stageRef.current === 4 ? 'rgba(168, 85, 247, 0.9)' : 'rgba(221, 214, 254, 0.7)';
      ctx.lineWidth = 22;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.strokeStyle = '#7c3aed';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineCap = 'butt';

      // Update animation
      if (isPlayingRef.current) {
        animProgressRef.current += 0.008;
        if (animProgressRef.current > 1) {
          animProgressRef.current = 1;
        }
      }

      // Get food position
      const foodPos = getStagePosition(stageRef.current, animProgressRef.current);
      foodPosRef.current = foodPos;

      // Draw food particle trail
      if (isPlayingRef.current && Math.random() < 0.3) {
        particlesRef.current.push({
          x: foodPos.x + (Math.random() - 0.5) * 10,
          y: foodPos.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          life: 1,
          color: stageRef.current < 2 ? '#ef4444' : stageRef.current < 4 ? '#22c55e' : '#a855f7',
        });
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.life * 99).toString(16).padStart(2, '0');
        ctx.fill();
      }

      // Draw food
      const foodSize = stageRef.current < 2 ? 20 : stageRef.current < 4 ? 15 : 10;
      
      ctx.save();
      ctx.translate(foodPos.x, foodPos.y);
      ctx.rotate(Date.now() * 0.002);
      
      // Apple shape that gets smaller
      if (stageRef.current < 3) {
        // Whole or partially digested apple
        ctx.beginPath();
        ctx.arc(0, 0, foodSize, 0, Math.PI * 2);
        const appleGrad = ctx.createRadialGradient(-3, -3, 0, 0, 0, foodSize);
        appleGrad.addColorStop(0, '#fca5a5');
        appleGrad.addColorStop(0.5, '#ef4444');
        appleGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = appleGrad;
        ctx.fill();
        
        // Stem
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(-2, -foodSize - 5, 4, 8);
      } else {
        // Nutrients (smaller particles)
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + Date.now() * 0.003;
          const dist = foodSize * 0.5;
          ctx.beginPath();
          ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 4, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#22c55e';
          ctx.fill();
        }
      }
      ctx.restore();

      // Labels for each organ
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      
      const labels = [
        { pos: bodyPath.mouth, text: '👄 Mouth', active: stageRef.current === 0 },
        { pos: { x: bodyPath.esophagus.x + 50, y: bodyPath.esophagus.y }, text: '📍 Esophagus', active: stageRef.current === 1 },
        { pos: { x: bodyPath.stomach.x + 60, y: bodyPath.stomach.y }, text: '🫙 Stomach', active: stageRef.current === 2 },
        { pos: { x: w * 0.8, y: bodyPath.smallIntestine.y - 10 }, text: '🌀 Small Intestine', active: stageRef.current === 3 },
        { pos: { x: w * 0.2, y: bodyPath.largeIntestine.y - 20 }, text: '🔄 Large Intestine', active: stageRef.current === 4 },
      ];

      labels.forEach(label => {
        if (label.active) {
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 12px sans-serif';
        } else {
          ctx.fillStyle = 'rgba(100, 116, 139, 0.7)';
          ctx.font = '10px sans-serif';
        }
        ctx.fillText(label.text, label.pos.x, label.pos.y - 35);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[3/4] sm:aspect-[4/5] block" />;
}
