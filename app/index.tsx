import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isAuthenticated) {
      if (isOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isAuthenticated, isOnboarded]);

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000' }}
        style={styles.backgroundImage}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.gradient}
      />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.logoContainer,
            { transform: [{ scale: logoScale }] }
          ]}
        >
          <Text style={styles.logo}>Floatr</Text>
          <Text style={styles.tagline}>Meet on the Water</Text>
        </Animated.View>
        
        <View style={styles.descriptionContainer}>
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
            style={styles.button}
          />
          
          <Button 
            title="Sign In" 
            onPress={handleSignIn} 
            variant="outline"
            size="large"
            style={styles.button}
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
  backgroundImage: {
    position: 'absolute',
    width,
    height,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.7,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  tagline: {
    fontSize: 24,
    color: colors.text.primary,
    opacity: 0.9,
  },
  descriptionContainer: {
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.8,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
  },
});