import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Check, Sparkles } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SuccessAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SuccessAnimation({ visible, onComplete }: SuccessAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotation = useRef(new Animated.Value(0)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  
  const sparkleAnims = useRef(
    Array.from({ length: 6 }, () => ({
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
      checkScale.setValue(0);
      checkRotation.setValue(0);
      rippleScale.setValue(0);
      sparkleOpacity.setValue(0);
      
      sparkleAnims.forEach(anim => {
        anim.scale.setValue(0);
        anim.translateX.setValue(0);
        anim.translateY.setValue(0);
        anim.opacity.setValue(1);
      });

      // Enhanced success animation sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // Scale in circle with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        // Animated check mark with rotation
        Animated.parallel([
          Animated.spring(checkScale, {
            toValue: 1,
            tension: 180,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(checkRotation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        // Ripple effect
        Animated.timing(rippleScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Sparkle burst
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          ...sparkleAnims.map((anim, index) => {
            const angle = (index * 60) * (Math.PI / 180);
            const distance = 60;
            return Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 400,
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
              Animated.sequence([
                Animated.delay(300),
                Animated.timing(anim.opacity, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }),
              ]),
            ]);
          }),
        ]),
        // Hold for effect
        Animated.delay(600),
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

  const checkRotationDegrees = checkRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      {/* Sparkle particles */}
      {sparkleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.sparkle,
            {
              opacity: sparkleOpacity,
              transform: [
                { scale: anim.scale },
                { translateX: anim.translateX },
                { translateY: anim.translateY },
              ],
            },
          ]}
        >
          <Sparkles size={16} color={colors.warning} fill={colors.warning} />
        </Animated.View>
      ))}
      
      {/* Enhanced ripple effect */}
      <Animated.View
        style={[
          styles.ripple,
          {
            transform: [{ scale: rippleScale }],
            opacity: rippleScale.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.4, 0],
            }),
          },
        ]}
      />
      
      {/* Success circle */}
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
            styles.checkContainer,
            {
              transform: [
                { scale: checkScale },
                { rotate: checkRotationDegrees },
              ],
            },
          ]}
        >
          <Check size={48} color={colors.text.primary} strokeWidth={3} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
  },
  sparkle: {
    position: 'absolute',
  },
  ripple: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.success,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});