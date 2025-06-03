import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack 
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: styles.headerTitle,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
  },
});