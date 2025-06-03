import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a simple performance monitoring implementation
// In a production app, you would use a service like Firebase Performance Monitoring,
// New Relic, or Datadog

type PerformanceMetric = {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  attributes: Record<string, string | number | boolean>;
};

class PerformanceMonitoring {
  private enabled: boolean = true;
  private metrics: PerformanceMetric[] = [];
  private activeMetrics: Record<string, PerformanceMetric> = {};
  private MAX_METRICS = 100;
  private STORAGE_KEY = '@floatr_performance_metrics';
  
  constructor() {
    this.loadSettings();
    this.loadMetrics();
  }
  
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@floatr_performance_settings');
      if (settings) {
        const { enabled } = JSON.parse(settings);
        this.enabled = enabled;
      }
    } catch (error) {
      console.error('Error loading performance settings:', error);
    }
  }
  
  private async loadMetrics() {
    try {
      const metrics = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (metrics) {
        this.metrics = JSON.parse(metrics);
      }
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    }
  }
  
  private async saveMetrics() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Error saving performance metrics:', error);
    }
  }
  
  public async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem('@floatr_performance_settings', JSON.stringify({ enabled }));
    } catch (error) {
      console.error('Error saving performance settings:', error);
    }
  }
  
  public isEnabled(): boolean {
    return this.enabled;
  }
  
  public startTrace(name: string, attributes: Record<string, string | number | boolean> = {}) {
    if (!this.enabled) return;
    
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      attributes: {
        ...attributes,
        platform: Platform.OS,
        timestamp: Date.now(),
      },
    };
    
    this.activeMetrics[name] = metric;
    
    if (__DEV__) {
      console.log(`Started performance trace: ${name}`);
    }
    
    return name;
  }
  
  public stopTrace(name: string, additionalAttributes: Record<string, string | number | boolean> = {}) {
    if (!this.enabled || !this.activeMetrics[name]) return;
    
    const metric = this.activeMetrics[name];
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.attributes = {
      ...metric.attributes,
      ...additionalAttributes,
    };
    
    this.metrics.push(metric);
    delete this.activeMetrics[name];
    
    // Keep only the last MAX_METRICS metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
    
    this.saveMetrics();
    
    if (__DEV__) {
      console.log(`Stopped performance trace: ${name}, duration: ${metric.duration.toFixed(2)}ms`);
    }
    
    return metric.duration;
  }
  
  public recordMetric(name: string, value: number, attributes: Record<string, string | number | boolean> = {}) {
    if (!this.enabled) return;
    
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      endTime: performance.now(),
      duration: value,
      attributes: {
        ...attributes,
        platform: Platform.OS,
        timestamp: Date.now(),
      },
    };
    
    this.metrics.push(metric);
    
    // Keep only the last MAX_METRICS metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
    
    this.saveMetrics();
    
    if (__DEV__) {
      console.log(`Recorded metric: ${name}, value: ${value}`);
    }
  }
  
  public async flush() {
    if (!this.enabled || this.metrics.length === 0) return;
    
    // In a real implementation, you would send the metrics to your performance monitoring service
    // and clear the metrics array after successful sending
    
    if (__DEV__) {
      console.log('Flushing performance metrics:', this.metrics);
    }
    
    // Clear metrics after sending
    this.metrics = [];
    await this.saveMetrics();
  }
  
  public async clearMetrics() {
    this.metrics = [];
    await this.saveMetrics();
  }
  
  // Helper method to measure a function execution time
  public async measure<T>(name: string, fn: () => Promise<T> | T, attributes: Record<string, string | number | boolean> = {}): Promise<T> {
    this.startTrace(name, attributes);
    try {
      const result = await fn();
      return result;
    } finally {
      this.stopTrace(name);
    }
  }
}

export const performance = new PerformanceMonitoring();

// Usage example:
// performance.startTrace('load_profile', { userId: '123' });
// // Do some work
// performance.stopTrace('load_profile', { success: true });

// // Or use the measure helper
// const result = await performance.measure('fetch_data', async () => {
//   const response = await fetch('https://api.example.com/data');
//   return response.json();
// }, { endpoint: 'data' });