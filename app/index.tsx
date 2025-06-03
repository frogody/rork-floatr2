import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleGetStarted = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/auth/signup');
  };

  const handleSignIn = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚓</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Floatr</Text>
            <Text style={styles.subtitle}>Meet on the Water</Text>
            <Text style={styles.description}>
              Connect with nearby boaters, raft-up, and share amazing experiences on the water
            </Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.primaryButton}
          />
          
          <Button
            title="Sign In"
            onPress={handleSignIn}
            variant="outline"
            size="large"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 60,
  },
  header: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 28,
    color: colors.background.dark,
  },
  textContainer: {
    maxWidth: width * 0.8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 20,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'left',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'left',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});