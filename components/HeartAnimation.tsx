import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Heart } from 'lucide-react-native';
import colors from '@/constants/colors';

interface HeartAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function HeartAnimation({ visible, onComplete }: HeartAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 8 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      heartScale.setValue(0);
      particleAnims.forEach(anim => {
        anim.scale.setValue(0);
        anim.translateX.setValue(0);
        anim.translateY.setValue(0);
        anim.opacity.setValue(1);
      });

      // Start animation sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Scale in circle
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Scale in heart with bounce
        Animated.spring(heartScale, {
          toValue: 1,
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
        // Particle explosion
        Animated.parallel([
          ...particleAnims.map((anim, index) => {
            const angle = (index * 45) * (Math.PI / 180);
            const distance = 60;
            return Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: Math.cos(angle) * distance,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: Math.sin(angle) * distance,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ]);
          }),
        ]),
        // Hold for a moment
        Animated.delay(300),
        // Fade out
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      {/* Particle hearts */}
      {particleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { scale: anim.scale },
                { translateX: anim.translateX },
                { translateY: anim.translateY },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          <Heart size={16} color={colors.secondary} fill={colors.secondary} />
        </Animated.View>
      ))}
      
      {/* Main heart circle */}
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }],
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
          <Heart size={40} color={colors.text.primary} fill={colors.text.primary} strokeWidth={0} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});