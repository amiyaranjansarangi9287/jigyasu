/**
 * Comprehensive Logging Utility
 * Structured logging with multiple log levels and output destinations
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  maxBufferSize: number;
}

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private sessionId: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: LogLevel.INFO,
      enableConsole: true,
      enableRemote: false,
      maxBufferSize: 100,
      ...config,
    };

    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.minLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    return `[${timestamp}] [${levelName}] ${entry.message}${contextStr}`;
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    if (this.logBuffer.length > this.config.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) {
      return;
    }

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote:', error);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      sessionId: this.sessionId,
    };

    this.addToBuffer(entry);

    if (this.config.enableConsole) {
      const formatted = this.formatLogEntry(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formatted);
          break;
        case LogLevel.INFO:
          console.info(formatted);
          break;
        case LogLevel.WARN:
          console.warn(formatted);
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formatted);
          break;
      }
    }

    if (this.config.enableRemote) {
      this.sendToRemote(entry);
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context);
  }

  /**
   * Get all buffered logs
   */
  getLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  /**
   * Set user context for logs
   */
  setUserId(userId: string): void {
    this.sessionId = userId;
  }

  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Create default logger instance
export const logger = new Logger({
  minLevel: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: import.meta.env.PROD,
  remoteEndpoint: import.meta.env.VITE_LOGGING_ENDPOINT,
});

/**
 * Performance logger for measuring execution times
 */
export class PerformanceLogger {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  /**
   * Mark a point in time
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
    logger.debug(`Mark: ${name}`);
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    const startTime = this.marks.get(startMark);
    if (!startTime) {
      logger.warn(`Start mark not found: ${startMark}`);
      return 0;
    }

    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    if (endTime === undefined) {
      logger.warn(`End mark not found: ${endMark}`);
      return 0;
    }

    const duration = endTime - startTime;
    this.measures.set(name, duration);
    
    logger.info(`Measure: ${name} = ${duration.toFixed(2)}ms`, {
      startMark,
      endMark,
      duration,
    });

    return duration;
  }

  /**
   * Get all measures
   */
  getMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  /**
   * Clear all marks and measures
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

export const performanceLogger = new PerformanceLogger();

/**
 * Error logger with stack trace capture
 */
export class ErrorLogger {
  /**
   * Log error with full context
   */
  logError(error: Error, context?: Record<string, any>): void {
    logger.error(error.message, {
      name: error.name,
      stack: error.stack,
      ...context,
    });
  }

  /**
   * Log unhandled promise rejections
   */
  setupUnhandledRejectionHandler(): void {
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled Promise Rejection', {
        reason: event.reason,
      });
    });
  }

  /**
   * Log global errors
   */
  setupGlobalErrorHandler(): void {
    window.addEventListener('error', (event) => {
      logger.error('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });
  }
}

export const errorLogger = new ErrorLogger();
