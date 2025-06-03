import { useEffect } from 'react';
import { Stack, router, useSegments, useRootNavigationState } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/Toast';
import { Platform, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import colors from '@/constants/colors';

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
    if (!isInitialized) {
      checkAuth();
    }
    
    SystemUI.setBackgroundColorAsync(colors.background.primary);
    if (Platform.OS === 'ios') {
      SystemUI.setStatusBarStyle('light');
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (!navigationState?.key || !isInitialized || !fontsLoaded) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    console.log('Navigation check:', { 
      isAuthenticated, 
      segments, 
      inAuthGroup, 
      inOnboardingGroup 
    });

    if (isAuthenticated && (inAuthGroup || segments.length === 0)) {
      console.log('Redirecting to tabs');
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      console.log('Redirecting to login');
      router.replace('/auth/login');
    }
  }, [isAuthenticated, segments, navigationState?.key, isInitialized, fontsLoaded]);

  if (!fontsLoaded || !isInitialized) {
    return <View style={{ flex: 1, backgroundColor: colors.background.primary }} />;
  }

  return (
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
  );
}