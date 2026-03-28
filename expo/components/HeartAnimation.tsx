import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';
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
  const heartPulse = useRef(new Animated.Value(1)).current;
  const sparkleRotation = useRef(new Animated.Value(0)).current;
  
  const particleAnims = useRef(
    Array.from({ length: 12 }, () => ({
      scale: new Animated.Value(0),
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
      rotation: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      heartScale.setValue(0);
      heartPulse.setValue(1);
      sparkleRotation.setValue(0);
      
      particleAnims.forEach(anim => {
        anim.scale.setValue(0);
        anim.translateX.setValue(0);
        anim.translateY.setValue(0);
        anim.opacity.setValue(1);
        anim.rotation.setValue(0);
      });

      // Enhanced animation sequence
      Animated.sequence([
        // Fade in background with blur effect
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale in circle with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        // Scale in heart with dramatic bounce
        Animated.spring(heartScale, {
          toValue: 1,
          tension: 180,
          friction: 4,
          useNativeDriver: true,
        }),
        // Start continuous heart pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(heartPulse, {
              toValue: 1.1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(heartPulse, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
        // Sparkle rotation
        Animated.loop(
          Animated.timing(sparkleRotation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ),
        // Enhanced particle explosion
        Animated.parallel([
          ...particleAnims.map((anim, index) => {
            const angle = (index * 30) * (Math.PI / 180);
            const distance = 80 + (index % 3) * 20;
            return Animated.parallel([
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateX, {
                toValue: Math.cos(angle) * distance,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(anim.translateY, {
                toValue: Math.sin(angle) * distance,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(anim.rotation, {
                toValue: 360,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.delay(400),
                Animated.timing(anim.opacity, {
                  toValue: 0,
                  duration: 600,
                  useNativeDriver: true,
                }),
              ]),
            ]);
          }),
        ]),
        // Hold for dramatic effect
        Animated.delay(800),
        // Fade out with scale
        Animated.parallel([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const sparkleRotationDegrees = sparkleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      {/* Enhanced particle hearts and sparkles */}
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
                { rotate: anim.rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }) },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          {index % 3 === 0 ? (
            <Sparkles size={16} color={colors.warning} fill={colors.warning} />
          ) : (
            <Heart size={14} color={colors.secondary} fill={colors.secondary} />
          )}
        </Animated.View>
      ))}
      
      {/* Rotating sparkle ring */}
      <Animated.View
        style={[
          styles.sparkleRing,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: sparkleRotationDegrees },
            ],
          },
        ]}
      >
        {[...Array(8)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.sparklePoint,
              {
                transform: [
                  { rotate: `${index * 45}deg` },
                  { translateY: -60 },
                ],
              },
            ]}
          >
            <Sparkles size={12} color={colors.warning} fill={colors.warning} />
          </View>
        ))}
      </Animated.View>
      
      {/* Main heart circle with enhanced styling */}
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
              transform: [
                { scale: heartScale },
                { scale: heartPulse },
              ],
            },
          ]}
        >
          <Heart size={48} color={colors.text.primary} fill={colors.text.primary} strokeWidth={0} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
  },
  sparkleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparklePoint: {
    position: 'absolute',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});