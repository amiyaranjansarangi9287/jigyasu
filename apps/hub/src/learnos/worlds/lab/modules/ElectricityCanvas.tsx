import { useRef, useEffect } from 'react';

interface ElectricityCanvasProps {
  switchOn: boolean;
  voltage: number;
  resistance: number;
}

export default function ElectricityCanvas({ switchOn, voltage, resistance }: ElectricityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const switchRef = useRef(switchOn);
  const voltageRef = useRef(voltage);
  const resistanceRef = useRef(resistance);
  const timeRef = useRef(0);

  useEffect(() => { switchRef.current = switchOn; }, [switchOn]);
  useEffect(() => { voltageRef.current = voltage; }, [voltage]);
  useEffect(() => { resistanceRef.current = resistance; }, [resistance]);

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

    // Circuit path points (rectangle)
    const margin = 60;
    const path = [
      { x: margin, y: margin },               // top-left (battery +)
      { x: w - margin, y: margin },            // top-right (switch)
      { x: w - margin, y: h - margin },        // bottom-right (bulb)
      { x: margin, y: h - margin },            // bottom-left (battery -)
    ];

    // Electrons along the path
    const electronCount = 16;
    const electrons: { progress: number }[] = [];
    for (let i = 0; i < electronCount; i++) {
      electrons.push({ progress: i / electronCount });
    }

    const getPointOnPath = (progress: number) => {
      const p = ((progress % 1) + 1) % 1;
      const totalLen = 4; // 4 segments
      const seg = Math.floor(p * totalLen);
      const t = (p * totalLen) - seg;
      const from = path[seg % 4];
      const to = path[(seg + 1) % 4];
      return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.016;
      const isOn = switchRef.current;
      const v = voltageRef.current;
      const r = resistanceRef.current;
      const current = isOn ? v / r : 0;
      const speed = current * 0.003;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Draw wires
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (let i = 1; i <= 4; i++) {
        ctx.lineTo(path[i % 4].x, path[i % 4].y);
      }
      ctx.closePath();
      ctx.strokeStyle = isOn ? '#64748b' : '#334155';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Wire inner glow when on
      if (isOn) {
        ctx.strokeStyle = `rgba(251, 191, 36, ${current * 0.15})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Battery (left side)
      const batX = margin;
      const batY = (path[0].y + path[3].y) / 2;
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(batX - 25, batY - 40, 50, 80, 8);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Battery + terminal
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(batX - 12, batY - 48, 24, 10);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('+', batX, batY - 20);
      ctx.fillText('−', batX, batY + 25);
      // Battery label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`${v}V`, batX, batY + 2);
      // Battery icon
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('🔋 Battery', batX, batY + 55);
      ctx.fillText('(Voltage = push)', batX, batY + 67);

      // Switch (top-right)
      const swX = w - margin;
      const swY = margin;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(swX - 25, swY - 18, 50, 36, 8);
      ctx.fill();

      if (isOn) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(swX - 15, swY - 5, 30, 10);
        ctx.fillText('ON', swX, swY - 25);
      } else {
        ctx.fillStyle = '#ef4444';
        ctx.save();
        ctx.translate(swX - 15, swY + 5);
        ctx.rotate(-0.5);
        ctx.fillRect(0, -5, 30, 10);
        ctx.restore();
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OFF', swX, swY - 25);
      }
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('🔌 Switch', swX, swY + 35);

      // Light bulb (bottom-right)
      const bulbX = w - margin;
      const bulbY = h - margin;
      const bulbGlow = isOn ? current : 0;

      // Bulb glow
      if (isOn) {
        const glow = ctx.createRadialGradient(bulbX, bulbY, 0, bulbX, bulbY, 60 * bulbGlow);
        glow.addColorStop(0, `rgba(253, 224, 71, ${bulbGlow * 0.5})`);
        glow.addColorStop(0.5, `rgba(251, 191, 36, ${bulbGlow * 0.2})`);
        glow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(bulbX, bulbY, 60 * bulbGlow, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Bulb body
      ctx.beginPath();
      ctx.arc(bulbX, bulbY - 10, 22, 0, Math.PI * 2);
      ctx.fillStyle = isOn ? `rgba(253, 224, 71, ${0.5 + bulbGlow * 0.5})` : '#334155';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Bulb base
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bulbX - 10, bulbY + 10, 20, 12);
      // Filament
      ctx.beginPath();
      ctx.moveTo(bulbX - 8, bulbY + 8);
      ctx.lineTo(bulbX - 4, bulbY - 8);
      ctx.lineTo(bulbX + 4, bulbY - 8);
      ctx.lineTo(bulbX + 8, bulbY + 8);
      ctx.strokeStyle = isOn ? '#fbbf24' : '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💡 Bulb', bulbX, bulbY + 40);

      // Resistor visualization (bottom-left)
      const resX = margin;
      const resY = h - margin;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(resX - 20, resY - 15, 40, 30, 5);
      ctx.fill();
      // Zigzag resistor symbol
      ctx.beginPath();
      ctx.moveTo(resX - 15, resY);
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(resX - 10 + i * 7, resY + (i % 2 === 0 ? -8 : 8));
      }
      ctx.lineTo(resX + 15, resY);
      ctx.strokeStyle = r > 5 ? '#f97316' : '#22c55e';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText(`${r}Ω Resistance`, resX, resY + 30);
      ctx.fillText('(narrow pipe)', resX, resY + 42);

      // Electrons moving along circuit
      if (isOn) {
        electrons.forEach(e => {
          e.progress += speed;
          if (e.progress > 1) e.progress -= 1;
          const pt = getPointOnPath(e.progress);

          // Electron glow
          const eGlow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 10);
          eGlow.addColorStop(0, 'rgba(96, 165, 250, 0.6)');
          eGlow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = eGlow;
          ctx.fill();

          // Electron body
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
          ctx.fillStyle = 'white';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('e⁻', pt.x, pt.y);
        });
      }

      // Current readout
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 70, h / 2 - 25, 140, 50, 12);
      ctx.fill();
      ctx.fillStyle = isOn ? '#fbbf24' : '#64748b';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Current: ${current.toFixed(1)}A`, w / 2, h / 2 - 6);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(`V÷R = ${v}÷${r} = ${current.toFixed(1)}`, w / 2, h / 2 + 14);

      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-[4/3] block" />;
}
