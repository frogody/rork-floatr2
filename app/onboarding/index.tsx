import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  useColorScheme,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Anchor, Users, MapPin, Shield, ChevronRight, X } from 'lucide-react-native';
import { OnboardingStep } from '@/components/OnboardingStep';
import { ProgressDots } from '@/components/ProgressDots';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width: screenWidth } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    icon: Anchor,
    title: 'Welcome to Floatr',
    description: 'Connect with fellow water enthusiasts and discover amazing boating experiences together.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000',
  },
  {
    id: 2,
    icon: Users,
    title: 'Find Your Crew',
    description: 'Match with like-minded boaters based on your interests, experience level, and location.',
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000',
  },
  {
    id: 3,
    icon: MapPin,
    title: 'Discover New Waters',
    description: 'Explore popular spots, get real-time weather conditions, and plan your next adventure.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1000',
  },
  {
    id: 4,
    icon: Shield,
    title: 'Stay Safe Together',
    description: 'Built-in safety features including emergency contacts, float plans, and weather alerts.',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1000',
  },
];

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { setOnboarded } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<any>(null);

  const handleNext = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({
        x: nextStep * screenWidth,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    handleComplete();
  };

  const handleComplete = () => {
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  const handleDotPress = async (index: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setCurrentStep(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
  };

  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <X size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* App Logo */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoBackground, { backgroundColor: colors.primary }]}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.appName, { color: colors.text.primary }]}>Floatr</Text>
        <Text style={[styles.tagline, { color: colors.text.secondary }]}>Meet on the Water</Text>
      </View>

      {/* Onboarding Steps */}
      <View style={styles.stepsContainer}>
        <OnboardingStep
          ref={scrollViewRef}
          steps={onboardingSteps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          colors={colors}
        />
      </View>

      {/* Progress and Navigation */}
      <View style={styles.footer}>
        <ProgressDots
          total={onboardingSteps.length}
          current={currentStep}
          onDotPress={handleDotPress}
          colors={colors}
        />
        
        <View style={styles.navigationContainer}>
          <Button
            title={isLastStep ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
            icon={!isLastStep ? <ChevronRight size={20} color={colors.text.primary} /> : undefined}
            iconPosition="right"
            style={styles.nextButton}
          />
          
          {!isLastStep && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipTextButton}>
              <Text style={[styles.skipText, { color: colors.text.secondary }]}>
                Skip for now
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  skipButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  stepsContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navigationContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  nextButton: {
    width: '100%',
    marginBottom: 16,
  },
  skipTextButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
});