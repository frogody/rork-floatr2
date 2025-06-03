import React, { useEffect } from 'react';
import { Platform, View, Text, StyleSheet, LogBox } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SystemUI from 'expo-system-ui';
import * as Linking from 'expo-linking';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from '@/lib/trpc';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/hooks/useToast';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '@/localization/en';
import es from '@/localization/es';
import fr from '@/localization/fr';
import NetInfo from '@react-native-community/netinfo';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Ignore specific warnings in development
if (__DEV__) {
  LogBox.ignoreLogs([
    'Animated: `useNativeDriver` was not specified',
    'Non-serializable values were found in the navigation state',
  ]);
}

// Setup internationalization
const i18n = new I18n({
  en,
  es,
  fr,
});

i18n.defaultLocale = 'en';
i18n.locale = Localization.locale.split('-')[0];
i18n.enableFallback = true;

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  // Check for app updates
  useEffect(() => {
    async function checkForUpdates() {
      if (!__DEV__ && Platform.OS !== 'web') {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        } catch (error) {
          console.log('Error checking for updates:', error);
        }
      }
    }
    
    checkForUpdates();
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    async function setupNetworkMonitoring() {
      if (Platform.OS !== 'web') {
        try {
          // Initial network state check
          console.log('Network monitoring initialized');
          
          // Use NetInfo instead of expo-network
          unsubscribe = NetInfo.addEventListener(state => {
            console.log('Network state changed:', state.isConnected);
          });
        } catch (error) {
          console.log('Error setting up network monitoring:', error);
        }
      }
    }
    
    setupNetworkMonitoring();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Log app and device info
  useEffect(() => {
    async function logAppInfo() {
      if (Platform.OS !== 'web') {
        try {
          const appName = Application.applicationName;
          const appVersion = Application.nativeApplicationVersion;
          const buildVersion = Application.nativeBuildVersion;
          // Use Device.deviceName instead of getDeviceNameAsync
          const deviceName = Device.deviceName || 'Unknown Device';
          const deviceType = Device.deviceType;
          const osName = Device.osName;
          const osVersion = Device.osVersion;
          
          console.log('App Info:', {
            appName,
            appVersion,
            buildVersion,
            deviceName,
            deviceType,
            osName,
            osVersion,
            locale: i18n.locale,
          });
        } catch (error) {
          console.log('Error logging app info:', error);
        }
      }
    }
    
    logAppInfo();
  }, []);

  // Set system UI colors
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background.primary);
    if (Platform.OS === 'ios') {
      SystemUI.setStatusBarStyle('light');
    }
  }, []);

  // Handle deep linking
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      console.log('Deep link URL:', url);
      // Handle the deep link URL here
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Get the initial URL if the app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL:', url);
      }
    });

    // Check authentication status
    checkAuth();

    return () => {
      subscription.remove();
    };
  }, []);

  // Show splash screen until fonts are loaded and auth is checked
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after a short delay for a smoother transition
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 500);
    }
  }, [fontsLoaded, fontError]);

  // If fonts are still loading, don't render anything
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <SafeAreaProvider>
          <ToastProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: colors.background.primary,
                  },
                  headerTintColor: colors.text.primary,
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
                <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(tabs)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/login"
                  options={{
                    title: "Sign In",
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="auth/signup"
                  options={{
                    title: "Create Account",
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="auth/forgot-password"
                  options={{
                    title: "Reset Password",
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="premium"
                  options={{
                    title: "Floatr Premium",
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="help"
                  options={{
                    title: "Help & Support",
                  }}
                />
                <Stack.Screen
                  name="help/index"
                  options={{
                    title: "Help Center",
                  }}
                />
                <Stack.Screen
                  name="help/faq"
                  options={{
                    title: "FAQ",
                  }}
                />
                <Stack.Screen
                  name="help/safety"
                  options={{
                    title: "Safety Tips",
                  }}
                />
                <Stack.Screen
                  name="help/emergency"
                  options={{
                    title: "Emergency Services",
                  }}
                />
                <Stack.Screen
                  name="help/feedback"
                  options={{
                    title: "Send Feedback",
                  }}
                />
                <Stack.Screen
                  name="legal/privacy"
                  options={{
                    title: "Privacy Policy",
                  }}
                />
                <Stack.Screen
                  name="legal/terms"
                  options={{
                    title: "Terms of Service",
                  }}
                />
                <Stack.Screen
                  name="legal/index"
                  options={{
                    title: "Legal Information",
                  }}
                />
                <Stack.Screen
                  name="profile/edit"
                  options={{
                    title: "Edit Profile",
                  }}
                />
                <Stack.Screen
                  name="boat/edit"
                  options={{
                    title: "Edit Boat Details",
                  }}
                />
                <Stack.Screen
                  name="settings/index"
                  options={{
                    title: "Settings",
                  }}
                />
                <Stack.Screen
                  name="settings/account"
                  options={{
                    title: "Account Settings",
                  }}
                />
                <Stack.Screen
                  name="settings/notifications"
                  options={{
                    title: "Notification Settings",
                  }}
                />
                <Stack.Screen
                  name="settings/blocked-users"
                  options={{
                    title: "Blocked Users",
                  }}
                />
                <Stack.Screen
                  name="settings/analytics"
                  options={{
                    title: "Analytics & Data",
                  }}
                />
                <Stack.Screen
                  name="chat/[id]"
                  options={{
                    title: "Chat",
                  }}
                />
                <Stack.Screen
                  name="who-liked-you"
                  options={{
                    title: "Who Liked You",
                  }}
                />
                <Stack.Screen
                  name="meetups/create"
                  options={{
                    title: "Create Meetup",
                  }}
                />
                <Stack.Screen
                  name="meetups/[id]"
                  options={{
                    title: "Meetup Details",
                  }}
                />
              </Stack>
            </GestureHandlerRootView>
          </ToastProvider>
        </SafeAreaProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}