import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/Toast';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import colors from '@/constants/colors';

export default function RootLayout() {
  const { isAuthenticated, checkAuth, isInitialized } = useAuthStore();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
    
    // Set system UI colors
    SystemUI.setBackgroundColorAsync(colors.background.primary);
    if (Platform.OS === 'ios') {
      SystemUI.setStatusBarStyle('light');
    }
  }, [isInitialized, checkAuth]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <ToastProvider />
    </>
  );
}