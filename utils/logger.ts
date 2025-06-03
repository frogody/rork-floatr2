import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: number;
  platform: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private storageKey = '@floatr_logs';
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadLogs();
      this.isInitialized = true;
    } catch (error) {
      console.error('Logger: Failed to initialize', error);
    }
  }

  private async loadLogs() {
    try {
      const storedLogs = await AsyncStorage.getItem(this.storageKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Logger: Failed to load logs', error);
    }
  }

  private async saveLogs() {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Logger: Failed to save logs', error);
    }
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      platform: Platform.OS,
    };

    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    const consoleMessage = `[${level.toUpperCase()}] ${message}`;
    switch (level) {
      case 'debug':
        console.log(consoleMessage, data || '');
        break;
      case 'info':
        console.info(consoleMessage, data || '');
        break;
      case 'warn':
        console.warn(consoleMessage, data || '');
        break;
      case 'error':
        console.error(consoleMessage, data || '');
        break;
    }

    // Save to storage (async, don't wait)
    if (this.isInitialized) {
      this.saveLogs().catch(error => {
        console.error('Logger: Failed to save logs', error);
      });
    }
  }

  public debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  public error(message: string, data?: any) {
    this.log('error', message, data);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Logger: Failed to clear logs', error);
    }
  }

  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  public getRecentLogs(minutes: number = 10): LogEntry[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.logs.filter(log => log.timestamp > cutoff);
  }
}

export const logger = new Logger();