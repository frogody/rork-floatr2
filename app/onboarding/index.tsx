import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function OnboardingScreen() {
  const { setOnboarded } = useAuthStore();

  const handleComplete = () => {
    setOnboarded(true);
    // After onboarding, go to tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Welcome to Floatr',
          headerShown: false,
        }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Floatr!</Text>
        <Text style={styles.description}>
          Let's get you set up to meet amazing people on the water.
        </Text>
      </View>

      <Button
        title="Get Started"
        onPress={handleComplete}
        variant="primary"
        size="large"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginBottom: 24,
  },
});