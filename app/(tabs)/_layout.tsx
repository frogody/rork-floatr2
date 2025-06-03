import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { Compass, MessageCircle, User } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background.primary : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colorScheme === 'dark' ? colors.text.secondary : '#64748B',
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? colors.background.primary : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? colors.text.primary : '#0A0A0A',
        // Disable native animations on web
        ...Platform.select({
          web: {
            tabBarShowLabel: true,
            tabBarLabelPosition: 'below-icon',
          },
          default: {
            tabBarShowLabel: true,
            tabBarLabelPosition: 'below-icon',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
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