// Safe localStorage abstractions for Quentrix AI

const PREFIX = 'quentrix_ai_';

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Storage get error for key ${key}:`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for key ${key}:`, e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch (e) {
      console.warn(`Storage remove error for key ${key}:`, e);
    }
  },
  clear: () => {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
  }
};

