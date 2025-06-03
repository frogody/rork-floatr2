import { Stack } from 'expo-router';
import { View } from 'react-native';
import colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Stack>
        <Stack.Screen 
          name="signup"
          options={{
            headerShown: true,
            title: 'Create Account',
            headerStyle: {
              backgroundColor: colors.background.primary,
            },
            headerTintColor: colors.text.primary,
          }}
        />
        <Stack.Screen 
          name="login"
          options={{
            headerShown: true,
            title: 'Sign In',
            headerStyle: {
              backgroundColor: colors.background.primary,
            },
            headerTintColor: colors.text.primary,
          }}
        />
      </Stack>
    </View>
  );
}