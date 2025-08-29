// Logger utility for debugging
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

export class Logger {
  static log(message, data = null, level = LogLevel.INFO) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    console.groupCollapsed(`${prefix} ${message}`);
    console.log('Message:', message);
    
    if (data) {
      console.log('Data:', data);
      if (typeof data === 'object') {
        console.table(data);
      }
    }
    
    console.groupEnd();
  }

  static debug(message, data = null) {
    this.log(message, data, LogLevel.DEBUG);
  }

  static info(message, data = null) {
    this.log(message, data, LogLevel.INFO);
  }

  static warn(message, data = null) {
    this.log(message, data, LogLevel.WARN);
  }

  static error(message, data = null) {
    this.log(message, data, LogLevel.ERROR);
  }

  static apiRequest(method, url, data = null) {
    this.debug(`API Request - ${method.toUpperCase()} ${url}`, data);
  }

  static apiResponse(status, data = null) {
    this.info(`API Response - Status: ${status}`, data);
  }

  static apiError(error) {
    this.error('API Error', {
      message: error.message,
      status: error.status,
      data: error.data,
      stack: error.stack
    });
  }
}

// Export default instance
export default new Logger();
