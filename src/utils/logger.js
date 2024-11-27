const logLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };
  
  class Logger {
    constructor() {
      this.level = process.env.LOG_LEVEL || 'INFO';
    }
  
    formatMessage(level, message, meta = {}) {
      return JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
      });
    }
  
    error(message, meta) {
      if (logLevels[this.level] >= logLevels.ERROR) {
        console.error(this.formatMessage('ERROR', message, meta));
      }
    }
  
    warn(message, meta) {
      if (logLevels[this.level] >= logLevels.WARN) {
        console.warn(this.formatMessage('WARN', message, meta));
      }
    }
  
    info(message, meta) {
      if (logLevels[this.level] >= logLevels.INFO) {
        console.info(this.formatMessage('INFO', message, meta));
      }
    }
  
    debug(message, meta) {
      if (logLevels[this.level] >= logLevels.DEBUG) {
        console.debug(this.formatMessage('DEBUG', message, meta));
      }
    }
  }
  
  export const logger = new Logger();