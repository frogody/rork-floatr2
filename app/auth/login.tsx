import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/hooks/useToast';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuthStore();
  const showToast = useToastStore(state => state.showToast);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast({
        message: 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ 
        id: Math.random().toString(),
        email,
        displayName: email.split('@')[0],
        createdAt: new Date()
      });
      router.replace('/(tabs)');
    } catch (error) {
      showToast({
        message: 'Invalid email or password',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          placeholderTextColor={colors.text.secondary}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor={colors.text.secondary}
          secureTextEntry
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          variant="primary"
          size="large"
          loading={isLoading}
          style={styles.button}
        />

        <Button
          title="Need an account? Sign Up"
          onPress={() => router.push('/auth/signup')}
          variant="ghost"
          size="large"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  form: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text.primary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  button: {
    marginTop: 8,
  },
});