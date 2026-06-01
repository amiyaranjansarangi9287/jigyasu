import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely, resolving conflicts.
 * @param inputs - Array of class names, conditionals, or objects.
 * @returns A single merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
