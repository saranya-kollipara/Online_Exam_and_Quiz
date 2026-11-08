// Application logger utility

const levels = {
  INFO: '\x1b[36m[INFO]\x1b[0m',
  SUCCESS: '\x1b[32m[SUCCESS]\x1b[0m',
  WARN: '\x1b[33m[WARN]\x1b[0m',
  ERROR: '\x1b[31m[ERROR]\x1b[0m'
};

export const logger = {
  info: (msg, meta = '') => {
    console.log(`${new Date().toISOString()} ${levels.INFO} ${msg}`, meta ? meta : '');
  },
  success: (msg, meta = '') => {
    console.log(`${new Date().toISOString()} ${levels.SUCCESS} ${msg}`, meta ? meta : '');
  },
  warn: (msg, meta = '') => {
    console.warn(`${new Date().toISOString()} ${levels.WARN} ${msg}`, meta ? meta : '');
  },
  error: (msg, error = '') => {
    console.error(`${new Date().toISOString()} ${levels.ERROR} ${msg}`, error ? error : '');
  }
};

