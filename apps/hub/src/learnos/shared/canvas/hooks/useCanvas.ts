// src/shared/canvas/hooks/useCanvas.ts
import { useRef, useEffect, useCallback } from 'react';
import { CanvasHelpers } from '../helpers/CanvasHelpers';

interface UseCanvasOptions {
  width?: number;
  height?: number;
  autoResize?: boolean;
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameRef = useRef<number>(0);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const width = options.width ?? rect.width;
    const height = options.height ?? rect.height;
    dimensionsRef.current = { width, height };
    ctxRef.current = CanvasHelpers.setupHiDPI(canvas, width, height);
    return ctxRef.current;
  }, [options.width, options.height]);

  const startLoop = useCallback((draw: (ctx: CanvasRenderingContext2D, dt: number) => void) => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = time;
      const ctx = ctxRef.current;
      if (ctx) {
        const { width, height } = dimensionsRef.current;
        CanvasHelpers.clearCanvas(ctx, width, height);
        draw(ctx, dt);
      }
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (options.autoResize) {
      const handleResize = () => setup();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [options.autoResize, setup]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return {
    canvasRef,
    ctxRef,
    dimensionsRef,
    setup,
    startLoop,
    stopLoop,
  };
}
