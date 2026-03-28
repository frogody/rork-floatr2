import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { OnboardingStep as OnboardingStepType } from '@/types';
import colors from '@/constants/colors';

interface OnboardingStepProps {
  step: OnboardingStepType;
}

const { width } = Dimensions.get('window');

export default function OnboardingStep({ step }: OnboardingStepProps) {
  return (
    <View style={styles.container}>
      {step.imageUrl && (
        <Image 
          source={{ uri: step.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 32,
    borderRadius: 16,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});