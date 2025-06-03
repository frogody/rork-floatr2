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
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { Anchor } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HERO_IMAGE = 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2940&auto=format&fit=crop';

export default function WelcomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const imageAnim = React.useRef(new Animated.Value(0)).current;
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
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1200,
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
          styles.heroImageContainer,
          {
            opacity: imageAnim,
          }
        ]}
      >
        <Image 
          source={{ uri: HERO_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
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
          <View style={styles.iconContainer}>
            <Anchor size={28} color={colors.background.primary} />
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
    backgroundColor: colors.background.primary,
  },
  heroImageContainer: {
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
  textContainer: {
    maxWidth: width * 0.85,
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