import React, { useEffect } from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SystemUI from 'expo-system-ui';
import * as Linking from 'expo-linking';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
  });

  // Set system UI colors
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background.primary);
    if (Platform.OS === 'ios') {
      SystemUI.setStatusBarStyle('light');
    }
  }, []);

  // Handle deep linking
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      // Handle the deep link URL here
      console.log('Deep link URL:', url);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.dark,
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
          name="chat/[id]"
          options={{
            title: "Chat",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}