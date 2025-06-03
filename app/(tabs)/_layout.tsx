import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Compass, MessageCircle, User } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? colors.background.primary : '#ffffff',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.text.secondary : '#64748B',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: isDark ? colors.background.primary : '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: isDark ? colors.text.primary : '#0A0A0A',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
        tabBarHideOnKeyboard: Platform.OS === 'android',
        animation: Platform.select({
          ios: 'shift',
          android: 'shift',
          web: 'none',
        }),
      }}
    >
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, size, focused }) => (
            <Compass 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          headerTitle: 'Nearby Crews',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <MessageCircle 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          headerTitle: 'Messages',
          tabBarBadge: undefined, // Can be set dynamically for unread messages
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <User 
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  );
}