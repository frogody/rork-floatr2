import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  Image,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width, height } = Dimensions.get('window');

// FLOATR floaties image
const HERO_IMAGE = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2940&auto=format&fit=crop';

export default function WelcomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  
  const { isAuthenticated, isInitialized, checkAuth } = useAuthStore();
  const systemColorScheme = useColorScheme();
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
        duration: 1200,
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
        {Platform.OS !== 'web' ? (
          <Video
            source={require('../assets/videos/A_floaty_with_202506032109_wciyz.mov')}
            style={styles.heroVideo}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />
        ) : (
          <Image
            source={{ uri: HERO_IMAGE }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.overlay} />
        <View style={styles.gradientOverlay} />
      </Animated.View>
      
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
            <Text style={[styles.title, { color: colors.text.primary }]}>Connect</Text>
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
            variant="secondary"
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
  heroVideo: {
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
    paddingHorizontal: 32,
    paddingTop: height * 0.25, // Move content down significantly
    paddingBottom: 48,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start', // Left align everything
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  appIcon: {
    width: 44,
    height: 44,
  },
  textContainer: {
    maxWidth: width * 0.85,
    alignItems: 'flex-start', // Left align text container
  },
  title: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'left',
    letterSpacing: -2,
    lineHeight: 60,
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'left',
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    textAlign: 'left',
    lineHeight: 26,
    opacity: 0.9,
    fontWeight: '400',
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    gap: 16,
    paddingTop: 20,
    alignItems: 'flex-start', // Left align buttons
  },
  primaryButton: {
    width: '100%',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});