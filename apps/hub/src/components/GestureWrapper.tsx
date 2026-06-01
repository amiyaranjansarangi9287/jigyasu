import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GestureWrapperProps {
  children: React.ReactNode;
  onLongPress?: () => void;
  longPressMs?: number;
  className?: string;
  contextMenu?: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onPinchZoom?: (scale: number) => void;
}

export default function GestureWrapper({
  children,
  onLongPress,
  longPressMs = 600,
  className = '',
  contextMenu,
  onSwipeLeft,
  onSwipeRight,
  onPinchZoom
}: GestureWrapperProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pinchBaseDistRef = useRef<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const startPress = useCallback((e: React.PointerEvent) => {
    setIsPressing(true);
    touchStartRef.current = { x: e.clientX, y: e.clientY };
    timerRef.current = setTimeout(() => {
      if (onLongPress) onLongPress();
      if (contextMenu) setShowMenu(true);
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // haptic feedback
      }
    }, longPressMs);
  }, [onLongPress, longPressMs, contextMenu]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && onPinchZoom) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (pinchBaseDistRef.current === null) {
        pinchBaseDistRef.current = dist;
      } else {
        onPinchZoom(dist / pinchBaseDistRef.current);
      }
    }
  }, [onPinchZoom]);

  const cancelPress = useCallback((e?: React.PointerEvent) => {
    setIsPressing(false);
    pinchBaseDistRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (e && touchStartRef.current && (onSwipeLeft || onSwipeRight)) {
      const dx = e.clientX - touchStartRef.current.x;
      const dy = e.clientY - touchStartRef.current.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && onSwipeRight) onSwipeRight();
        if (dx < 0 && onSwipeLeft) onSwipeLeft();
      }
    }
    touchStartRef.current = null;
  }, [onSwipeLeft, onSwipeRight]);

  return (
    <div className={`relative ${className}`} onTouchMove={handleTouchMove}>
      <motion.div
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onPointerCancel={cancelPress}
        animate={{ scale: isPressing ? 0.98 : 1 }}
        transition={{ duration: 0.2 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {showMenu && contextMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 min-w-[200px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl overflow-hidden p-2 flex flex-col gap-1 border border-slate-200"
                onClick={() => setShowMenu(false)}
              >
                {contextMenu}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
