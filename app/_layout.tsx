import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@/components/Toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import colors from '@/constants/colors';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: isDark ? colors.background.primary : '#ffffff',
              },
              headerTintColor: isDark ? colors.text.primary : '#0A0A0A',
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
              },
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              animation: Platform.select({
                ios: 'slide_from_right',
                android: 'slide_from_right',
                web: 'none',
              }),
              gestureEnabled: Platform.OS !== 'web',
            }}
          />
          <ToastProvider />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}