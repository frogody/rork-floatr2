import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';

type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

interface ErrorReport {
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  metadata: {
    userId?: string;
    sessionId: string;
    timestamp: number;
    platform: string;
    appVersion: string;
    deviceModel: string;
    osVersion: string;
    networkType?: string;
    screenName?: string;
    [key: string]: any;
  };
}

class ErrorReporting {
  private enabled: boolean = true;
  private userId: string | undefined = undefined;
  private sessionId: string = '';
  private reports: ErrorReport[] = [];
  private MAX_REPORTS = 50;
  private STORAGE_KEY = '@floatr_error_reports';
  private isInitialized = false;
  
  constructor() {
    this.sessionId = this.generateId();
    this.initialize();
  }

  private async initialize() {
    try {
      await this.loadSettings();
      await this.loadReports();
      this.setupGlobalErrorHandler();
      this.isInitialized = true;
    } catch (error) {
      console.error('ErrorReporting: Failed to initialize', error);
    }
  }
  
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@floatr_error_reporting_settings');
      if (settings) {
        const { enabled } = JSON.parse(settings);
        this.enabled = enabled;
      }
    } catch (error) {
      console.error('ErrorReporting: Error loading settings', error);
    }
  }
  
  private async loadReports() {
    try {
      const reports = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (reports) {
        this.reports = JSON.parse(reports);
      }
    } catch (error) {
      console.error('ErrorReporting: Error loading reports', error);
    }
  }
  
  private async saveReports() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('ErrorReporting: Error saving reports', error);
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  private setupGlobalErrorHandler() {
    if (Platform.OS === 'web') {
      // Web error handling
      window.addEventListener('error', (event) => {
        this.captureError(event.error || event.message, 'error', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.captureError(event.reason, 'error', {
          type: 'unhandled_promise_rejection'
        });
      });
    } else {
      // React Native error handling
      const originalErrorHandler = ErrorUtils.getGlobalHandler();
      
      ErrorUtils.setGlobalHandler(async (error, isFatal) => {
        await this.captureError(error, isFatal ? 'fatal' : 'error');
        originalErrorHandler(error, isFatal);
      });
    }
  }
  
  public async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem('@floatr_error_reporting_settings', JSON.stringify({ enabled }));
    } catch (error) {
      console.error('ErrorReporting: Error saving settings', error);
    }
  }
  
  public isEnabled(): boolean {
    return this.enabled;
  }
  
  public setUserId(userId: string | undefined) {
    this.userId = userId;
  }
  
  public setContext(key: string, value: any) {
    if (__DEV__) {
      console.log('ErrorReporting: Setting context', key, value);
    }
  }
  
  public async captureError(error: Error | string, severity: ErrorSeverity = 'error', metadata: Record<string, any> = {}) {
    if (!this.enabled) return;
    
    try {
      let networkType = 'unknown';
      try {
        if (Platform.OS !== 'web') {
          const networkState = await NetInfo.fetch();
          networkType = networkState.type || 'unknown';
        }
      } catch (e) {
        // Ignore network errors
      }
      
      const report: ErrorReport = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        severity,
        metadata: {
          ...metadata,
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: Date.now(),
          platform: Platform.OS,
          appVersion: Platform.OS !== 'web' ? Application.nativeApplicationVersion || '1.0.0' : '1.0.0',
          deviceModel: Platform.OS !== 'web' ? Device.modelName || 'Unknown' : 'Web Browser',
          osVersion: Platform.Version.toString(),
          networkType,
        },
      };
      
      this.reports.push(report);
      
      // Keep only the last MAX_REPORTS reports
      if (this.reports.length > this.MAX_REPORTS) {
        this.reports = this.reports.slice(-this.MAX_REPORTS);
      }
      
      await this.saveReports();
      
      if (__DEV__) {
        console.log('ErrorReporting: Captured error', report);
      }
    } catch (captureError) {
      console.error('ErrorReporting: Failed to capture error', captureError);
    }
  }
  
  public async captureMessage(message: string, severity: ErrorSeverity = 'info', metadata: Record<string, any> = {}) {
    await this.captureError(message, severity, metadata);
  }
  
  public async flush() {
    if (!this.enabled || this.reports.length === 0) return;
    
    if (__DEV__) {
      console.log('ErrorReporting: Flushing reports', this.reports);
    }
    
    // In production, send reports to your error reporting service here
    
    // Clear reports after sending
    this.reports = [];
    await this.saveReports();
  }
  
  public async clearReports() {
    this.reports = [];
    await this.saveReports();
  }

  public getReports(): ErrorReport[] {
    return [...this.reports];
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export const errorReporting = new ErrorReporting();