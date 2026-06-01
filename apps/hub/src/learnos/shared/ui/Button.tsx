// src/shared/ui/Button.tsx
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variants = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl min-h-[36px]',
  md: 'px-6 py-3 text-base rounded-2xl min-h-[44px]',
  lg: 'px-8 py-4 text-lg rounded-2xl min-h-[56px]',
  xl: 'px-10 py-5 text-xl rounded-3xl min-h-[80px]',
};

import React from 'react';

export const Button = React.memo(function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        font-bold transition-all duration-200 select-none
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
});
