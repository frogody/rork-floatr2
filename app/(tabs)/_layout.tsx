import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Users, MessageCircle, User } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.dark,
          borderTopColor: 'rgba(255,255,255,0.1)',
          height: Platform.OS === 'ios' ? 88 : 60, // Account for iPhone home indicator
          paddingBottom: Platform.OS === 'ios' ? 34 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 0 : 8,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.background.dark,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // Add smooth transitions
        animation: 'shift',
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerShown: false, // Hide header for swipe screen
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}