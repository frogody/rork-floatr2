import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Platform 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Heart } from 'lucide-react-native';
import colors from '@/constants/colors';

interface MatchAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function MatchAnimation({ visible, onComplete }: MatchAnimationProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef(
    Array.from({ length: 8 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }

      // Main animation sequence
      Animated.sequence([
        // Show background
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        // Show heart with bounce
        Animated.spring(heartScale, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        }),
        // Particle explosion
        Animated.parallel(
          particleAnimations.map((particle, index) => {
            const angle = (index / particleAnimations.length) * 2 * Math.PI;
            const distance = 100;
            
            return Animated.parallel([
              Animated.spring(particle.scale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateX, {
                toValue: Math.cos(angle) * distance,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.translateY, {
                toValue: Math.sin(angle) * distance,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(particle.opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
              }),
            ]);
          })
        ),
      ]).start(() => {
        // Hide animation
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete?.();
          resetAnimation();
        });
      });
    }
  }, [visible]);

  const resetAnimation = () => {
    scale.setValue(0);
    opacity.setValue(0);
    heartScale.setValue(0);
    particleAnimations.forEach(particle => {
      particle.scale.setValue(0);
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.opacity.setValue(1);
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.heartContainer,
            {
              transform: [{ scale: heartScale }],
            },
          ]}
        >
          <Heart size={80} color={colors.secondary} fill={colors.secondary} />
        </Animated.View>

        {/* Particle effects */}
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { scale: particle.scale },
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <Heart size={20} color={colors.secondary} fill={colors.secondary} />
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  background: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});