import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// This is a simple analytics implementation
// In a production app, you would use a service like Firebase Analytics, 
// Amplitude, Mixpanel, or Segment

type EventName = 
  | 'app_open'
  | 'app_close'
  | 'sign_up'
  | 'sign_in'
  | 'sign_out'
  | 'view_profile'
  | 'edit_profile'
  | 'view_matches'
  | 'create_match'
  | 'send_message'
  | 'view_chat'
  | 'create_meetup'
  | 'view_meetup'
  | 'upgrade_premium'
  | 'view_premium'
  | 'view_settings'
  | 'change_settings'
  | 'view_help'
  | 'send_feedback'
  | 'view_faq'
  | 'view_safety'
  | 'view_emergency'
  | 'view_privacy'
  | 'view_terms'
  | 'search_nearby'
  | 'filter_nearby'
  | 'block_user'
  | 'report_user'
  | 'delete_account'
  | 'error';

type EventProperties = Record<string, string | number | boolean | null>;

class Analytics {
  private enabled: boolean = true;
  private userId: string | null = null;
  private sessionId: string = '';
  private events: Array<{
    name: EventName;
    properties: EventProperties;
    timestamp: number;
  }> = [];
  private MAX_EVENTS = 100;
  private STORAGE_KEY = '@floatr_analytics';
  
  constructor() {
    this.sessionId = this.generateId();
    this.loadSettings();
    this.loadEvents();
  }
  
  private async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('@floatr_analytics_settings');
      if (settings) {
        const { enabled } = JSON.parse(settings);
        this.enabled = enabled;
      }
    } catch (error) {
      console.error('Error loading analytics settings:', error);
    }
  }
  
  private async loadEvents() {
    try {
      const events = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (events) {
        this.events = JSON.parse(events);
      }
    } catch (error) {
      console.error('Error loading analytics events:', error);
    }
  }
  
  private async saveEvents() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.error('Error saving analytics events:', error);
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  public async setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      await AsyncStorage.setItem('@floatr_analytics_settings', JSON.stringify({ enabled }));
    } catch (error) {
      console.error('Error saving analytics settings:', error);
    }
  }
  
  public isEnabled(): boolean {
    return this.enabled;
  }
  
  public setUserId(userId: string | null) {
    this.userId = userId;
  }
  
  public async trackEvent(name: EventName, properties: EventProperties = {}) {
    if (!this.enabled) return;
    
    const event = {
      name,
      properties: {
        ...properties,
        userId: this.userId,
        sessionId: this.sessionId,
        platform: Platform.OS,
        appVersion: '1.0.0', // Get this from app.json or expo-constants
        deviceModel: Platform.OS === 'ios' ? 'iOS Device' : 'Android Device',
        osVersion: Platform.Version.toString(),
      },
      timestamp: Date.now(),
    };
    
    this.events.push(event);
    
    // Keep only the last MAX_EVENTS events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }
    
    await this.saveEvents();
    
    // In a real implementation, you would send the event to your analytics service
    if (__DEV__) {
      console.log('Analytics event:', event);
    }
  }
  
  public async flush() {
    if (!this.enabled || this.events.length === 0) return;
    
    // In a real implementation, you would send the events to your analytics service
    // and clear the events array after successful sending
    
    if (__DEV__) {
      console.log('Flushing analytics events:', this.events);
    }
    
    // Clear events after sending
    this.events = [];
    await this.saveEvents();
  }
  
  public async clearEvents() {
    this.events = [];
    await this.saveEvents();
  }
}

export const analytics = new Analytics();

// Usage example:
// analytics.trackEvent('sign_in', { method: 'email' });
// analytics.trackEvent('view_profile', { userId: '123', source: 'matches' });
// analytics.flush();