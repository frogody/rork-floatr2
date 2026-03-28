import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

interface PulseAnimationProps {
  children: React.ReactNode;
  duration?: number;
  scale?: number;
}

export const PulseAnimation: React.FC<PulseAnimationProps> = ({ 
  children, 
  duration = 2000, 
  scale = 1.05 
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: scale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
  );
};

interface FadeInAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeInAnimation: React.FC<FadeInAnimationProps> = ({ 
  children, 
  delay = 0, 
  duration = 500 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

interface SlideInAnimationProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
}

export const SlideInAnimation: React.FC<SlideInAnimationProps> = ({ 
  children, 
  direction = 'up',
  delay = 0, 
  duration = 500,
  distance = 50
}) => {
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return [{ translateX: slideAnim }];
      case 'right':
        return [{ translateX: Animated.multiply(slideAnim, -1) }];
      case 'up':
        return [{ translateY: slideAnim }];
      case 'down':
        return [{ translateY: Animated.multiply(slideAnim, -1) }];
      default:
        return [{ translateY: slideAnim }];
    }
  };

  return (
    <Animated.View style={{ transform: getTransform() }}>
      {children}
    </Animated.View>
  );
};

interface BounceAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  onComplete?: () => void;
}

export const BounceAnimation: React.FC<BounceAnimationProps> = ({ 
  children, 
  trigger = false,
  onComplete
}) => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start(onComplete);
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
      {children}
    </Animated.View>
  );
};

interface ShakeAnimationProps {
  children: React.ReactNode;
  trigger?: boolean;
  intensity?: number;
}

export const ShakeAnimation: React.FC<ShakeAnimationProps> = ({ 
  children, 
  trigger = false,
  intensity = 10
}) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: intensity, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -intensity, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: intensity, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
      {children}
    </Animated.View>
  );
};