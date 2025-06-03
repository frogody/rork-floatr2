import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function WelcomeScreen() {
  const { user } = useAuthStore();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleGetStarted = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Floatr</Text>
            <Text style={styles.subtitle}>Meet on the Water</Text>
            <Text style={styles.description}>
              Connect with nearby boaters, raft-up, and share amazing experiences on the water
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              size="large"
              gradient
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
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});