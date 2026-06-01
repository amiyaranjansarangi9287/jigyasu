/**
 * Formats a total number of minutes into a 12-hour clock string (e.g., "10:15").
 * Handles wrap-around (e.g., 720 minutes) and negative minutes.
 */
export function formatTime(totalMinutes: number): string {
  // Normalize minutes to a positive value within a 12-hour (720 min) cycle
  const normalized = ((totalMinutes % 720) + 720) % 720;
  const h = Math.floor(normalized / 60) || 12; // 0 becomes 12
  const m = normalized % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}
