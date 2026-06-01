// # BEHAVIORAL CONTRACT: Tailwind conflict resolution and falsy handling
import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges basic classes', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('resolves tailwind conflicts', () => {
    // twMerge behavior: later classes override earlier ones
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles falsy values (clsx behavior)', () => {
    expect(cn('text-sm', false && 'text-lg', undefined, null, '')).toBe('text-sm');
  });

  it('handles array and object inputs (clsx behavior)', () => {
    expect(cn('text-sm', { 'font-bold': true, 'hidden': false })).toBe('text-sm font-bold');
    expect(cn(['text-sm', 'font-bold'])).toBe('text-sm font-bold');
  });
});
