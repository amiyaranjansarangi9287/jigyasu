// src/worlds/tiny/hooks/useCompanion.ts

import { useRef, useCallback } from 'react';
import type { CompanionType, CompanionEmotion } from '../types/tiny.types';

interface CompanionConfig {
  type: CompanionType;
  x: number;
  y: number;
  size: number;
}

export function useCompanion(config: CompanionConfig) {
  const emotionRef = useRef<CompanionEmotion>('idle');
  const scaleRef = useRef(1.0);
  const rotationRef = useRef(0);
  const bounceRef = useRef(0);
  const emotionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setEmotion = useCallback((emotion: CompanionEmotion, durationMs = 2000) => {
    emotionRef.current = emotion;
    if (emotionTimerRef.current) {
      clearTimeout(emotionTimerRef.current);
    }
    if (emotion !== 'idle') {
      emotionTimerRef.current = setTimeout(() => {
        emotionRef.current = 'idle';
      }, durationMs);
    }
  }, []);

  const updateCompanion = useCallback((_dt: number, time: number) => {
    const emotion = emotionRef.current;
    switch (emotion) {
      case 'idle':
        scaleRef.current = 1.0 + Math.sin(time * 1.5) * 0.02;
        bounceRef.current = 0;
        rotationRef.current = 0;
        break;
      case 'happy':
        bounceRef.current = Math.abs(Math.sin(time * 8)) * 15;
        scaleRef.current = 1.1;
        rotationRef.current = Math.sin(time * 6) * 0.1;
        break;
      case 'excited':
        bounceRef.current = Math.abs(Math.sin(time * 10)) * 20;
        scaleRef.current = 1.2;
        rotationRef.current = Math.sin(time * 8) * 0.2;
        break;
      case 'surprised':
        scaleRef.current = 1.3;
        bounceRef.current = 25;
        rotationRef.current = 0;
        break;
      case 'curious':
        scaleRef.current = 1.05;
        rotationRef.current = 0.3;
        bounceRef.current = 0;
        break;
      case 'sleepy':
        scaleRef.current = 0.9 + Math.sin(time * 0.5) * 0.05;
        bounceRef.current = Math.sin(time * 0.5) * 5;
        rotationRef.current = 0;
        break;
      case 'celebrating':
        scaleRef.current = 1.4 + Math.sin(time * 5) * 0.1;
        bounceRef.current = Math.abs(Math.sin(time * 8)) * 30;
        rotationRef.current = time * 3;
        break;
    }
  }, []);

  const drawCompanion = useCallback((
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    emoji: string
  ) => {
    const x = config.x * canvasWidth;
    const y = config.y * canvasHeight - bounceRef.current;
    const size = config.size * scaleRef.current;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotationRef.current);
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 0, 0);
    ctx.restore();
  }, [config]);

  return {
    emotionRef,
    setEmotion,
    updateCompanion,
    drawCompanion,
  };
}
