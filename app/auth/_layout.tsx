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
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontFamily: 'Inter-SemiBold',
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerBackTitle: 'Back',
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen 
          name="signup"
          options={{
            title: 'Create Account',
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="login"
          options={{
            title: 'Sign In',
            headerShown: true,
          }}
        />
      </Stack>
    </View>
  );
}