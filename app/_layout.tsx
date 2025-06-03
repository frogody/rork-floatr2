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
            <Stack.Screen 
              name="crew/[id]" 
              options={{ 
                title: 'Crew Details',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="spots" 
              options={{ 
                title: 'Popular Spots',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="weather" 
              options={{ 
                title: 'Weather',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="meetups/create" 
              options={{ 
                title: 'Create Event',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="meetups/[id]" 
              options={{ 
                title: 'Event Details',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                title: 'Chat',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="profile/edit" 
              options={{ 
                title: 'Edit Profile',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="profile/photos" 
              options={{ 
                title: 'Manage Photos',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="profile/preferences" 
              options={{ 
                title: 'Preferences',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="boat/edit" 
              options={{ 
                title: 'Edit Boat',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="premium" 
              options={{ 
                title: 'Premium',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="who-liked-you" 
              options={{ 
                title: 'Who Liked You',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/index" 
              options={{ 
                title: 'Settings',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/account" 
              options={{ 
                title: 'Account',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/privacy" 
              options={{ 
                title: 'Privacy & Safety',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/notifications" 
              options={{ 
                title: 'Notifications',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/blocked-users" 
              options={{ 
                title: 'Blocked Users',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="settings/analytics" 
              options={{ 
                title: 'Data & Analytics',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="help/index" 
              options={{ 
                title: 'Help & Support',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="help/faq" 
              options={{ 
                title: 'FAQ',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="help/safety" 
              options={{ 
                title: 'Safety Center',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="help/feedback" 
              options={{ 
                title: 'Feedback',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="help/emergency" 
              options={{ 
                title: 'Emergency',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="legal/index" 
              options={{ 
                title: 'Legal',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="legal/terms" 
              options={{ 
                title: 'Terms of Service',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="legal/privacy" 
              options={{ 
                title: 'Privacy Policy',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="modal" 
              options={{ 
                presentation: 'modal',
                headerShown: true 
              }} 
            />
          </Stack>
          <ToastProvider />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}