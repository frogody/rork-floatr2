import { AccessibilityInfo, Platform } from 'react-native';

// This is a simple accessibility helper
// In a production app, you would have more comprehensive accessibility support

class AccessibilityHelper {
  private isScreenReaderEnabled: boolean = false;
  private isReduceMotionEnabled: boolean = false;
  private isReduceTransparencyEnabled: boolean = false;
  private isHighContrastEnabled: boolean = false;
  private listeners: {
    screenReader: Array<(isEnabled: boolean) => void>;
    reduceMotion: Array<(isEnabled: boolean) => void>;
    reduceTransparency: Array<(isEnabled: boolean) => void>;
    highContrast: Array<(isEnabled: boolean) => void>;
  } = {
    screenReader: [],
    reduceMotion: [],
    reduceTransparency: [],
    highContrast: [],
  };
  
  constructor() {
    this.setupListeners();
  }
  
  private async setupListeners() {
    // Check initial values
    this.isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    
    if (Platform.OS !== 'web') {
      this.isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      
      if (Platform.OS === 'ios') {
        this.isReduceTransparencyEnabled = await AccessibilityInfo.isReduceTransparencyEnabled();
      }
    }
    
    // Set up listeners
    AccessibilityInfo.addEventListener('screenReaderChanged', this.handleScreenReaderChange);
    
    if (Platform.OS !== 'web') {
      AccessibilityInfo.addEventListener('reduceMotionChanged', this.handleReduceMotionChange);
      
      if (Platform.OS === 'ios') {
        AccessibilityInfo.addEventListener('reduceTransparencyChanged', this.handleReduceTransparencyChange);
      }
    }
  }
  
  private handleScreenReaderChange = (isEnabled: boolean) => {
    this.isScreenReaderEnabled = isEnabled;
    this.listeners.screenReader.forEach(listener => listener(isEnabled));
  };
  
  private handleReduceMotionChange = (isEnabled: boolean) => {
    this.isReduceMotionEnabled = isEnabled;
    this.listeners.reduceMotion.forEach(listener => listener(isEnabled));
  };
  
  private handleReduceTransparencyChange = (isEnabled: boolean) => {
    this.isReduceTransparencyEnabled = isEnabled;
    this.listeners.reduceTransparency.forEach(listener => listener(isEnabled));
  };
  
  private handleHighContrastChange = (isEnabled: boolean) => {
    this.isHighContrastEnabled = isEnabled;
    this.listeners.highContrast.forEach(listener => listener(isEnabled));
  };
  
  public getIsScreenReaderEnabled(): boolean {
    return this.isScreenReaderEnabled;
  }
  
  public getIsReduceMotionEnabled(): boolean {
    return this.isReduceMotionEnabled;
  }
  
  public getIsReduceTransparencyEnabled(): boolean {
    return this.isReduceTransparencyEnabled;
  }
  
  public getIsHighContrastEnabled(): boolean {
    return this.isHighContrastEnabled;
  }
  
  public addScreenReaderListener(listener: (isEnabled: boolean) => void) {
    this.listeners.screenReader.push(listener);
    // Immediately call with current state
    listener(this.isScreenReaderEnabled);
    
    // Return a function to remove the listener
    return () => {
      this.listeners.screenReader = this.listeners.screenReader.filter(l => l !== listener);
    };
  }
  
  public addReduceMotionListener(listener: (isEnabled: boolean) => void) {
    this.listeners.reduceMotion.push(listener);
    // Immediately call with current state
    listener(this.isReduceMotionEnabled);
    
    // Return a function to remove the listener
    return () => {
      this.listeners.reduceMotion = this.listeners.reduceMotion.filter(l => l !== listener);
    };
  }
  
  public addReduceTransparencyListener(listener: (isEnabled: boolean) => void) {
    this.listeners.reduceTransparency.push(listener);
    // Immediately call with current state
    listener(this.isReduceTransparencyEnabled);
    
    // Return a function to remove the listener
    return () => {
      this.listeners.reduceTransparency = this.listeners.reduceTransparency.filter(l => l !== listener);
    };
  }
  
  public addHighContrastListener(listener: (isEnabled: boolean) => void) {
    this.listeners.highContrast.push(listener);
    // Immediately call with current state
    listener(this.isHighContrastEnabled);
    
    // Return a function to remove the listener
    return () => {
      this.listeners.highContrast = this.listeners.highContrast.filter(l => l !== listener);
    };
  }
  
  public destroy() {
    // Remove listeners
    AccessibilityInfo.removeEventListener('screenReaderChanged', this.handleScreenReaderChange);
    
    if (Platform.OS !== 'web') {
      AccessibilityInfo.removeEventListener('reduceMotionChanged', this.handleReduceMotionChange);
      
      if (Platform.OS === 'ios') {
        AccessibilityInfo.removeEventListener('reduceTransparencyChanged', this.handleReduceTransparencyChange);
      }
    }
  }
  
  // Helper methods for common accessibility tasks
  
  public getAccessibleLabel(label: string, hint?: string): { accessibilityLabel: string } {
    return {
      accessibilityLabel: hint ? `${label}, ${hint}` : label,
    };
  }
  
  public getButtonProps(label: string, hint?: string): {
    accessibilityLabel: string;
    accessibilityRole: 'button';
    accessibilityState: { disabled?: boolean };
    accessible: boolean;
  } {
    return {
      accessibilityLabel: hint ? `${label}, ${hint}` : label,
      accessibilityRole: 'button',
      accessibilityState: {},
      accessible: true,
    };
  }
  
  public getDisabledButtonProps(label: string, hint?: string): {
    accessibilityLabel: string;
    accessibilityRole: 'button';
    accessibilityState: { disabled: boolean };
    accessible: boolean;
  } {
    return {
      accessibilityLabel: hint ? `${label}, ${hint}` : label,
      accessibilityRole: 'button',
      accessibilityState: { disabled: true },
      accessible: true,
    };
  }
  
  public announce(message: string) {
    AccessibilityInfo.announceForAccessibility(message);
  }
}

export const accessibility = new AccessibilityHelper();

// Usage example:
// // Check if screen reader is enabled
// const isScreenReaderEnabled = accessibility.getIsScreenReaderEnabled();

// // Add a listener for reduce motion changes
// const removeListener = accessibility.addReduceMotionListener((isEnabled) => {
//   console.log('Reduce motion changed:', isEnabled);
// });

// // Get accessibility props for a button
// const buttonProps = accessibility.getButtonProps('Like', 'Double tap to like this profile');

// // Announce a message to screen readers
// accessibility.announce('Profile loaded successfully');

// // Clean up when component unmounts
// useEffect(() => {
//   return () => {
//     removeListener();
//   };
// }, []);