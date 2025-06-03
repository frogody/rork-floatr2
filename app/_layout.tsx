import { useEffect } from 'react';
import { Stack, useRouter, useSegments, Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/Toast';
import { Platform, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import colors from '@/constants/colors';

function useProtectedRoute(isAuthenticated: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);
}

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
    
    SystemUI.setBackgroundColorAsync(colors.background.primary);
    if (Platform.OS === 'ios') {
      SystemUI.setStatusBarStyle('light');
    }
  }, [isInitialized, checkAuth]);

  // Only initialize protected routes after fonts are loaded
  if (fontsLoaded && !fontError) {
    useProtectedRoute(isAuthenticated);
  }

  if (!fontsLoaded && !fontError) {
    return null;
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <Slot />
    </View>
  );
}