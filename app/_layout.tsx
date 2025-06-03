import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from '@/lib/trpc';
import { ToastProvider } from '@/hooks/useToast';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize auth state
        await initialize();
        
        // Set system UI colors
        if (Platform.OS === 'android') {
          await SystemUI.setBackgroundColorAsync(colors.background.primary);
        }
        
        if (Platform.OS === 'ios') {
          // SystemUI.setStatusBarStyle is available on iOS
          // await SystemUI.setStatusBarStyle('light');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded || fontError) {
      prepare();
    }
  }, [fontsLoaded, fontError, initialize]);

  useEffect(() => {
    if (appIsReady && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded, fontError]);

  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider>
        <ToastProvider>
          <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <StatusBar style="light" backgroundColor={colors.background.primary} />
            <Stack
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.background.primary,
                },
                headerTintColor: '#F8FAFC',
                headerTitleStyle: {
                  fontFamily: 'Inter-SemiBold',
                },
                contentStyle: {
                  backgroundColor: colors.background.primary,
                },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
              <Stack.Screen name="auth/forgot-password" options={{ title: 'Reset Password' }} />
              <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
              <Stack.Screen name="premium" options={{ title: 'Premium' }} />
              <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
              <Stack.Screen name="boat/edit" options={{ title: 'Edit Boat' }} />
              <Stack.Screen name="settings/index" options={{ title: 'Settings' }} />
              <Stack.Screen name="settings/account" options={{ title: 'Account' }} />
              <Stack.Screen name="settings/notifications" options={{ title: 'Notifications' }} />
              <Stack.Screen name="settings/blocked-users" options={{ title: 'Blocked Users' }} />
              <Stack.Screen name="settings/analytics" options={{ title: 'Analytics' }} />
              <Stack.Screen name="help/index" options={{ title: 'Help & Support' }} />
              <Stack.Screen name="help/faq" options={{ title: 'FAQ' }} />
              <Stack.Screen name="help/safety" options={{ title: 'Safety' }} />
              <Stack.Screen name="help/emergency" options={{ title: 'Emergency' }} />
              <Stack.Screen name="help/feedback" options={{ title: 'Feedback' }} />
              <Stack.Screen name="legal/index" options={{ title: 'Legal' }} />
              <Stack.Screen name="legal/terms" options={{ title: 'Terms of Service' }} />
              <Stack.Screen name="legal/privacy" options={{ title: 'Privacy Policy' }} />
              <Stack.Screen name="privacy" options={{ title: 'Privacy Settings' }} />
              <Stack.Screen name="who-liked-you" options={{ title: 'Who Liked You' }} />
              <Stack.Screen name="meetups/create" options={{ title: 'Create Meetup' }} />
              <Stack.Screen name="meetups/[id]" options={{ title: 'Meetup Details' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </View>
        </ToastProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}