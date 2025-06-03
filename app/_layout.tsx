import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/Toast';
import { Platform, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import colors from '@/constants/colors';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout() {
  const { isAuthenticated, checkAuth, isInitialized } = useAuthStore();
  const segments = useSegments();
  
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
    
    if (Platform.OS !== 'web') {
      try {
        SystemUI.setBackgroundColorAsync(colors.background.primary);
        if (Platform.OS === 'ios') {
          SystemUI.setStatusBarStyle('light');
        }
      } catch (error) {
        console.error('Failed to set system UI:', error);
      }
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (!isInitialized || !fontsLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const hasSegments = segments.length > 0;

    try {
      if (isAuthenticated && (inAuthGroup || !hasSegments)) {
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [isAuthenticated, segments, isInitialized, fontsLoaded]);

  if (!fontsLoaded || !isInitialized) {
    return <View style={{ flex: 1, backgroundColor: colors.background.primary }} />;
  }

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <ToastProvider />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.primary }
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="premium" />
          <Stack.Screen name="profile/edit" />
          <Stack.Screen name="boat/edit" />
          <Stack.Screen name="help" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="legal" />
          <Stack.Screen name="meetups" />
        </Stack>
      </View>
    </ErrorBoundary>
  );
}