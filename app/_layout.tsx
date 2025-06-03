import { useEffect } from 'react';
import { Stack, router, useSegments, useRootNavigationState } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/Toast';
import { Platform, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import colors from '@/constants/colors';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { logger } from '@/utils/logger';
import { errorReporting } from '@/utils/errorReporting';

export default function RootLayout() {
  const { isAuthenticated, checkAuth, isInitialized } = useAuthStore();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    logger.info('RootLayout: Initializing app', {
      isInitialized,
      isAuthenticated,
      fontsLoaded,
      fontError: !!fontError
    });

    if (!isInitialized) {
      logger.debug('RootLayout: Checking auth state');
      checkAuth();
    }
    
    if (Platform.OS !== 'web') {
      try {
        SystemUI.setBackgroundColorAsync(colors.background.primary);
        if (Platform.OS === 'ios') {
          SystemUI.setStatusBarStyle('light');
        }
      } catch (error) {
        logger.error('RootLayout: Failed to set system UI', { error: error.message });
      }
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    // Check if navigation state is ready and stores are initialized
    if (!navigationState?.key || !isInitialized || !fontsLoaded) {
      logger.debug('RootLayout: Waiting for initialization', {
        hasNavigationState: !!navigationState?.key,
        isInitialized,
        fontsLoaded
      });
      return;
    }

    const inAuthGroup = segments.length > 0 && segments[0] === 'auth';
    const inOnboardingGroup = segments.length > 0 && segments[0] === 'onboarding';

    logger.info('RootLayout: Navigation check', { 
      isAuthenticated, 
      segments, 
      inAuthGroup, 
      inOnboardingGroup 
    });

    try {
      if (isAuthenticated && (inAuthGroup || segments.length === 0)) {
        logger.info('RootLayout: Redirecting authenticated user to tabs');
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
        logger.info('RootLayout: Redirecting unauthenticated user to login');
        router.replace('/auth/login');
      }
    } catch (error) {
      logger.error('RootLayout: Navigation error', { error: error.message });
      errorReporting.captureError(error, 'error', { 
        context: 'navigation_redirect',
        isAuthenticated,
        segments: segments.join('/')
      });
    }
  }, [isAuthenticated, segments, navigationState?.key, isInitialized, fontsLoaded]);

  // Handle font loading errors
  useEffect(() => {
    if (fontError) {
      logger.error('RootLayout: Font loading error', { error: fontError.message });
      errorReporting.captureError(fontError, 'warning', { context: 'font_loading' });
    }
  }, [fontError]);

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