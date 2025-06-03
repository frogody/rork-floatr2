import { Stack } from 'expo-router';
import { View } from 'react-native';
import colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="signup"
          options={{
            title: 'Create Account',
          }}
        />
        <Stack.Screen 
          name="login"
          options={{
            title: 'Sign In',
          }}
        />
      </Stack>
    </View>
  );
}