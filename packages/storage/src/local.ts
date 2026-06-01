/**
 * Safe wrapper for localStorage to handle corrupted JSON without crashing.
 */
export const localStore = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`[localStore] Failed to parse key "${key}", returning default.`);
      return defaultValue;
    }
  },
  
  set<T>(key: string, value: T): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error(`[localStore] Failed to set key "${key}":`, e);
    }
  },
  
  remove(key: string): void {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      // Ignore quota or permission errors on removal
    }
  }
};
