import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { Heart, MessageCircle, MapPin, User, Compass, Zap } from 'lucide-react-native';
import { getColors } from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.text.secondary : '#8E8E93',
        tabBarStyle: {
          backgroundColor: isDark ? colors.background.secondary : '#ffffff',
          borderTopColor: isDark ? colors.border.primary : '#E5E5EA',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.background.primary : '#ffffff',
        },
        headerTintColor: isDark ? colors.text.primary : '#0A0A0A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Compass size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          title: 'Match',
          tabBarIcon: ({ color, size }) => (
            <Zap size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          title: 'Matches',
          tabBarIcon: ({ color, size }) => (
            <Heart size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}