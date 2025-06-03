import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { getColors } from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.background.primary,
              },
              headerTintColor: colors.text.primary,
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
              },
              headerShadowVisible: false,
              headerBackTitle: '',
              animation: Platform.select({
                ios: 'slide_from_right',
                android: 'slide_from_right',
                web: 'none',
              }),
              gestureEnabled: Platform.OS !== 'web',
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="crew/[id]" options={{ title: 'Crew Details' }} />
            <Stack.Screen name="spots" options={{ title: 'Popular Spots' }} />
            <Stack.Screen name="weather" options={{ title: 'Weather' }} />
            <Stack.Screen name="meetups/create" options={{ title: 'Create Event' }} />
            <Stack.Screen name="meetups/[id]" options={{ title: 'Event Details' }} />
            <Stack.Screen name="chat/[id]" options={{ title: 'Chat' }} />
            <Stack.Screen name="profile/edit" options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="boat/edit" options={{ title: 'Edit Boat' }} />
            <Stack.Screen name="premium" options={{ title: 'Premium' }} />
            <Stack.Screen name="who-liked-you" options={{ title: 'Who Liked You' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="help" options={{ title: 'Help' }} />
            <Stack.Screen name="legal" options={{ title: 'Legal' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <ToastProvider />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}