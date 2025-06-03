import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  private isInitialized = false;
  
  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadSettings();
      await this.loadLogs();
      this.isInitialized = true;
    } catch (error) {
      console.error('Logger: Failed to initialize', error);
    }
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
      console.error('Logger: Error loading settings', error);
    }
  }
  
  private async loadLogs() {
    try {
      const logs = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (logs) {
        this.logs = JSON.parse(logs);
      }
    } catch (error) {
      console.error('Logger: Error loading logs', error);
    }
  }
  
  private async saveLogs() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Logger: Error saving logs', error);
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
      console.error('Logger: Error saving settings', error);
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
      console.error('Logger: Error saving settings', error);
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
    
    try {
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
      
      // Also log to console
      const consoleMethod = level === 'debug' ? console.debug :
                           level === 'info' ? console.info :
                           level === 'warn' ? console.warn :
                           console.error;
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, tags);
    } catch (error) {
      console.error('Logger: Failed to log message', error);
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
    
    if (__DEV__) {
      console.log('Logger: Flushing logs', this.logs);
    }
    
    // In production, send logs to your logging service here
    
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

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export const logger = new Logger();