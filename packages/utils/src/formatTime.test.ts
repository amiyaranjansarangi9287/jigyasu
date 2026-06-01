import { describe, it, expect } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime utility', () => {
  it('formats standard positive minutes', () => {
    expect(formatTime(615)).toBe('10:15');
    expect(formatTime(60)).toBe('1:00');
  });

  it('handles exact 12 o clock', () => {
    expect(formatTime(720)).toBe('12:00');
    expect(formatTime(0)).toBe('12:00');
  });

  it('handles minutes over 12 hours (wraparound)', () => {
    expect(formatTime(735)).toBe('12:15');
    expect(formatTime(1440)).toBe('12:00');
  });

  it('handles negative minutes', () => {
    expect(formatTime(-15)).toBe('11:45');
    expect(formatTime(-60)).toBe('11:00');
  });
});
