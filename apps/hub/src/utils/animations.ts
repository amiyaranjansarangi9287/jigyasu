/**
 * Advanced Animation Utilities
 * Enhanced Framer Motion animations for page transitions and micro-interactions
 */

import { Variants } from 'framer-motion';

/**
 * Page transition variants
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Staggered children animation
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Scale animation for interactive elements
 */
export const scaleOnHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Fade in up animation
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Fade in down animation
 */
export const fadeInDown: Variants = {
  initial: {
    opacity: 0,
    y: -30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Pulse animation for attention-grabbing elements
 */
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Bounce animation for success states
 */
export const bounce: Variants = {
  initial: { scale: 0 },
  animate: {
    scale: [0, 1.2, 1],
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: {
    x: '-100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

/**
 * Rotate animation
 */
export const rotate: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Shimmer effect for loading states
 */
export const shimmer: Variants = {
  initial: {
    backgroundPosition: '-1000px 0',
  },
  animate: {
    backgroundPosition: '1000px 0',
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

/**
 * Spring animation for physics-based interactions
 */
export const springConfig = {
  type: 'spring' as const,
  damping: 25,
  stiffness: 300,
};

/**
 * Animation presets for common use cases
 */
export const animationPresets = {
  pageTransition: pageVariants,
  staggerContainer,
  staggerItem,
  scaleOnHover,
  fadeInUp,
  fadeInDown,
  pulse,
  bounce,
  slideInRight,
  slideInLeft,
  rotate,
  shimmer,
  spring: springConfig,
};

/**
 * Reduced motion variant for accessibility
 */
export const reducedMotion = {
  transition: {
    duration: 0,
  },
};

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation variants with reduced motion support
 */
export function getAccessibleVariants(variants: Variants): Variants {
  if (prefersReducedMotion()) {
    return {
      ...variants,
      animate: {
        ...variants.animate,
        transition: reducedMotion.transition,
      },
    };
  }
  return variants;
}
