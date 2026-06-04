import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: any) => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm';
  const hoverClasses = hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : '';

  if (hoverable || onClick) {
    return (
      <motion.div
        whileHover={{ y: hoverable ? -4 : 0 }}
        onClick={onClick}
        className={`${baseClasses} ${hoverClasses} ${className}`}
        role={onClick ? 'button' : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-b border-slate-100 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 border-t border-slate-100 bg-slate-50/50 ${className}`}>{children}</div>;
}
