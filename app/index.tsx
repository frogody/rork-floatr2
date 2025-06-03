import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ship } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

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
      
      <ImageBackground
        source={{ 
          uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Logo Section */}
            <View style={styles.logoSection}>
              <Animated.View 
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] }
                ]}
              >
                <Ship size={48} color={colors.primary} />
              </Animated.View>
              
              <Text style={styles.appName}>Floatr</Text>
              <Text style={styles.tagline}>Meet on the Water</Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                Connect with nearby boaters, raft-up, and share amazing experiences on the water
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonSection}>
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

            {/* Bottom spacing for safe area */}
            <View style={styles.bottomSpacer} />
          </Animated.View>
        </LinearGradient>
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
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.15,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 20,
    color: colors.text.primary,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
  },
  descriptionSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    color: colors.text.primary,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 320,
  },
  buttonSection: {
    gap: 16,
    paddingBottom: 20,
  },
  primaryButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 34 : 20,
  },
});