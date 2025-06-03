import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width, height } = Dimensions.get('window');

// Fallback background image for the hero section
const HERO_IMAGE = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2940&auto=format&fit=crop';

export default function WelcomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const colors = getColors(true); // Use dark colors for welcome screen

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.warn('Auth check failed:', error);
      }
    };
    
    initializeAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isInitialized && isAuthenticated) {
      // Use replace to avoid navigation stack issues
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [isAuthenticated, isInitialized]);

  React.useEffect(() => {
    const animations = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    animations.start();

    return () => {
      animations.stop();
    };
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleGetStarted = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
    router.push('/auth/signup');
  }, []);

  const handleSignIn = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
    router.push('/auth/login');
  }, []);

  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background.primary }]}>
        <StatusBar style="light" />
        <Animated.View style={[styles.loadingContent, { opacity: fadeAnim }]}>
          <View style={[styles.loadingIcon, { backgroundColor: colors.primary }]}>
            <Image 
              source={require('../assets/images/icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.loadingText, { color: colors.text.primary }]}>Floatr</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style="light" />
      
      <Animated.View 
        style={[
          styles.heroContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <Image
          source={{ uri: HERO_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.gradientOverlay} />
      </Animated.View>
      
      <Animated.View 
        style={[
          styles.content,
          {
            paddingTop: 60,
            paddingBottom: 32,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <Animated.View 
            style={[
              styles.iconContainer,
              { 
                backgroundColor: colors.primary,
                transform: [{ scale: scaleAnim }] 
              }
            ]}
          >
            <Image 
              source={require('../assets/images/icon.png')} 
              style={styles.appIcon}
              resizeMode="contain"
            />
          </Animated.View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Floatr</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Meet on the Water</Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>
              Connect with nearby boaters, raft-up, and share amazing experiences on the water. 
              Your next adventure is just a swipe away.
            </Text>
          </View>
        </View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            variant="primary"
            size="large"
            style={styles.primaryButton}
            accessibilityLabel="Get started with Floatr"
            accessibilityHint="Navigate to sign up screen"
          />
          
          <Button
            title="Sign In"
            onPress={handleSignIn}
            variant="ghost"
            size="large"
            style={styles.secondaryButton}
            accessibilityLabel="Sign in to existing account"
            accessibilityHint="Navigate to sign in screen"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
  },
  heroContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    background: Platform.select({
      web: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)',
      default: undefined,
    }),
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    position: 'relative',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appIcon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    maxWidth: width * 0.9,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'left',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    width: '100%',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    width: '100%',
  },
});