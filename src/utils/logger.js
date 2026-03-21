/**
 * Logger utility for development and production environments
 * In production, only errors are logged
 * In development, all logs are shown
 */

const isDevelopment = import.meta.env.DEV;

const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log errors (always logged)
   */
  error: (...args) => {
    console.error(...args);
    // TODO: Send to error tracking service (e.g., Sentry)
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log information (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
};

export default logger;
