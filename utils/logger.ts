import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a simple logging implementation
// In a production app, you would use a service like Datadog, LogRocket, or a custom backend

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  tags: Record<string, string | number | boolean>;
}

class Logger {
  private enabled: boolean = true;
  private minLevel: LogLevel = __DEV__ ? 'debug' : 'info';
  private logs: LogEntry[] = [];
  private MAX_LOGS = 200;
  private STORAGE_KEY = '@floatr_logs';
  
  constructor() {
    this.loadSettings();
    this.loadLogs();
  }
  
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@floatr_logger_settings');
      if (settings) {
        const { enabled, minLevel } = JSON.parse(settings);
        this.enabled = enabled;
        this.minLevel = minLevel;
      }
    } catch (error) {
      console.error('Error loading logger settings:', error);
    }
  }
  
  private async loadLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (logs) {
        this.logs = JSON.parse(logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  }
  
  private async saveLogs() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error saving logs:', error);
    }
  }
  
  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const minLevelIndex = levels.indexOf(this.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= minLevelIndex;
  }
  
  public async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem('@floatr_logger_settings', JSON.stringify({ 
        enabled, 
        minLevel: this.minLevel 
      }));
    } catch (error) {
      console.error('Error saving logger settings:', error);
    }
  }
  
  public async setMinLevel(level: LogLevel) {
    this.minLevel = level;
    try {
      await AsyncStorage.setItem('@floatr_logger_settings', JSON.stringify({ 
        enabled: this.enabled, 
        minLevel: level 
      }));
    } catch (error) {
      console.error('Error saving logger settings:', error);
    }
  }
  
  public isEnabled(): boolean {
    return this.enabled;
  }
  
  public getMinLevel(): LogLevel {
    return this.minLevel;
  }
  
  private log(level: LogLevel, message: string, tags: Record<string, string | number | boolean> = {}) {
    if (!this.shouldLog(level)) return;
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      tags: {
        ...tags,
        platform: Platform.OS,
      },
    };
    
    this.logs.push(entry);
    
    // Keep only the last MAX_LOGS logs
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
    
    this.saveLogs();
    
    // Also log to console in development
    if (__DEV__) {
      const consoleMethod = level === 'debug' ? console.debug :
                           level === 'info' ? console.info :
                           level === 'warn' ? console.warn :
                           console.error;
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, tags);
    }
  }
  
  public debug(message: string, tags: Record<string, string | number | boolean> = {}) {
    this.log('debug', message, tags);
  }
  
  public info(message: string, tags: Record<string, string | number | boolean> = {}) {
    this.log('info', message, tags);
  }
  
  public warn(message: string, tags: Record<string, string | number | boolean> = {}) {
    this.log('warn', message, tags);
  }
  
  public error(message: string, tags: Record<string, string | number | boolean> = {}) {
    this.log('error', message, tags);
  }
  
  public async flush() {
    if (!this.enabled || this.logs.length === 0) return;
    
    // In a real implementation, you would send the logs to your logging service
    // and clear the logs array after successful sending
    
    if (__DEV__) {
      console.log('Flushing logs:', this.logs);
    }
    
    // Clear logs after sending
    this.logs = [];
    await this.saveLogs();
  }
  
  public async clearLogs() {
    this.logs = [];
    await this.saveLogs();
  }
  
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const logger = new Logger();

// Usage example:
// logger.debug('App started', { version: '1.0.0' });
// logger.info('User logged in', { userId: '123', method: 'email' });
// logger.warn('API rate limit approaching', { endpoint: '/users', remaining: 10 });
// logger.error('Failed to load profile', { userId: '123', error: 'Network error' });