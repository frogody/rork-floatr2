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
  const waterRipple = useRef(new Animated.Value(0)).current;
  const sunGlow = useRef(new Animated.Value(0)).current;

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
    // Enhanced entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous water ripple effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(waterRipple, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waterRipple, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle sun glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sunGlow, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(sunGlow, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const rippleScale = waterRipple.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const rippleOpacity = waterRipple.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.1, 0],
  });

  const glowOpacity = sunGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Beautiful sunset boat background */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000' }}
        style={styles.backgroundImage}
      />
      
      {/* Animated water ripple overlay */}
      <Animated.View
        style={[
          styles.rippleOverlay,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleOpacity,
          },
        ]}
      />
      
      {/* Sun glow effect */}
      <Animated.View
        style={[
          styles.sunGlow,
          { opacity: glowOpacity }
        ]}
      />
      
      {/* Enhanced gradient overlay */}
      <LinearGradient
        colors={[
          'transparent', 
          'rgba(0, 0, 0, 0.1)', 
          'rgba(0, 0, 0, 0.4)', 
          'rgba(0, 0, 0, 0.8)'
        ]}
        locations={[0, 0.3, 0.7, 1]}
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
  rippleOverlay: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: height * 0.3,
    left: -width * 0.5,
  },
  sunGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
    top: height * 0.15,
    right: width * 0.2,
    shadowColor: '#FFC107',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.8,
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
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 24,
    color: colors.text.primary,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  descriptionContainer: {
    marginBottom: 48,
  },
  description: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.9,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});