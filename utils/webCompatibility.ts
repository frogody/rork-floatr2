import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';

// Web-safe wrapper for native-only features
export const withNativeFeature = <T>(nativeComponent: T, webFallback?: T): T | null => {
  return isNative ? nativeComponent : (webFallback || null);
};

// Safe async storage wrapper
export const safeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      }
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('Storage getItem failed:', error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
        return;
      }
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('Storage setItem failed:', error);
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
        return;
      }
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('Storage removeItem failed:', error);
    }
  }
};

// Safe haptics wrapper
export const safeHaptics = {
  selection: async (): Promise<void> => {
    if (isNative) {
      try {
        const { Haptics } = require('expo-haptics');
        await Haptics.selectionAsync();
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  },
  
  impact: async (style: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> => {
    if (isNative) {
      try {
        const { Haptics } = require('expo-haptics');
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[style]);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }
};

// Safe location wrapper
export const safeLocation = {
  getCurrentPosition: async (): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      if (isWeb && navigator.geolocation) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.warn('Web geolocation failed:', error);
              resolve(null);
            }
          );
        });
      } else if (isNative) {
        const Location = require('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return null;
        }
        const location = await Location.getCurrentPositionAsync({});
        return {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      }
      return null;
    } catch (error) {
      console.warn('Location access failed:', error);
      return null;
    }
  }
};