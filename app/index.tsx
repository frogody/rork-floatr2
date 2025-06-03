import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform,
  Dimensions,
  Animated
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const { isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
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
            variant="ghost"
            size="large"
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
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
    paddingTop: Platform.OS === 'ios' ? 120 : 80,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  header: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 24,
    color: colors.background.dark,
  },
  textContainer: {
    maxWidth: width * 0.85,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: 16,
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