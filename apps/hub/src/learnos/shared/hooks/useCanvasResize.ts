// src/shared/hooks/useCanvasResize.ts
import { useRef, useEffect, useCallback } from 'react';

export function useCanvasResize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
) {
  const animRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    draw(ctx, rect.width, rect.height);
  }, [canvasRef, draw]);

  useEffect(() => {
    resize();
    const observer = new ResizeObserver(resize);
    const canvas = canvasRef.current;
    if (canvas) observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [resize, canvasRef]);

  return animRef;
}
