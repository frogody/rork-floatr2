import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import NetInfo from '@react-native-community/netinfo';

// This is a simple error reporting implementation
// In a production app, you would use a service like Sentry, Bugsnag, or Firebase Crashlytics

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
  private userId: string | null = null;
  private sessionId: string = '';
  private reports: ErrorReport[] = [];
  private MAX_REPORTS = 50;
  private STORAGE_KEY = '@floatr_error_reports';
  
  constructor() {
    this.sessionId = this.generateId();
    this.loadSettings();
    this.loadReports();
    this.setupGlobalErrorHandler();
  }
  
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@floatr_error_reporting_settings');
      if (settings) {
        const { enabled } = JSON.parse(settings);
        this.enabled = enabled;
      }
    } catch (error) {
      console.error('Error loading error reporting settings:', error);
    }
  }
  
  private async loadReports() {
    try {
      const reports = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (reports) {
        this.reports = JSON.parse(reports);
      }
    } catch (error) {
      console.error('Error loading error reports:', error);
    }
  }
  
  private async saveReports() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error saving error reports:', error);
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  private setupGlobalErrorHandler() {
    // Set up global error handler
    const originalErrorHandler = ErrorUtils.getGlobalHandler();
    
    ErrorUtils.setGlobalHandler(async (error, isFatal) => {
      await this.captureError(error, isFatal ? 'fatal' : 'error');
      originalErrorHandler(error, isFatal);
    });
  }
  
  public async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem('@floatr_error_reporting_settings', JSON.stringify({ enabled }));
    } catch (error) {
      console.error('Error saving error reporting settings:', error);
    }
  }
  
  public isEnabled(): boolean {
    return this.enabled;
  }
  
  public setUserId(userId: string | null) {
    this.userId = userId;
  }
  
  public setContext(key: string, value: any) {
    // In a real implementation, you would set context for the error reporting service
    // This would be included with all future error reports
    if (__DEV__) {
      console.log('Setting error context:', key, value);
    }
  }
  
  public async captureError(error: Error | string, severity: ErrorSeverity = 'error', metadata: Record<string, any> = {}) {
    if (!this.enabled) return;
    
    let networkType = 'unknown';
    try {
      if (Platform.OS !== 'web') {
        // Use NetInfo instead of expo-network
        const networkState = await NetInfo.fetch();
        networkType = networkState.type;
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
        appVersion: '1.0.0', // Get this from app.json or expo-constants
        deviceModel: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
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
    
    // In a real implementation, you would send the report to your error reporting service
    if (__DEV__) {
      console.log('Error report:', report);
    }
  }
  
  public async captureMessage(message: string, severity: ErrorSeverity = 'info', metadata: Record<string, any> = {}) {
    await this.captureError(message, severity, metadata);
  }
  
  public async flush() {
    if (!this.enabled || this.reports.length === 0) return;
    
    // In a real implementation, you would send the reports to your error reporting service
    // and clear the reports array after successful sending
    
    if (__DEV__) {
      console.log('Flushing error reports:', this.reports);
    }
    
    // Clear reports after sending
    this.reports = [];
    await this.saveReports();
  }
  
  public async clearReports() {
    this.reports = [];
    await this.saveReports();
  }
}

export const errorReporting = new ErrorReporting();

// Usage example:
// errorReporting.captureError(new Error('Something went wrong'), 'error', { screen: 'ProfileScreen' });
// errorReporting.captureMessage('User performed a risky action', 'warning', { action: 'delete_account' });
// errorReporting.flush();