import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Platform } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#0A0A0A' : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? '#F8FAFC' : '#0A0A0A',
        headerTitleStyle: {
          fontWeight: '600',
        },
        // Disable native gesture on web to prevent conflicts
        ...Platform.select({
          web: {
            gestureEnabled: false,
          },
          default: {
            gestureEnabled: true,
          },
        }),
      }}
    />
  );
}