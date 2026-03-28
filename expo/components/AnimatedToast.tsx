import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Platform,
  Dimensions 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, X, Heart, Zap, AlertCircle, AlertTriangle } from 'lucide-react-native';
import colors from '@/constants/colors';

interface AnimatedToastProps {
  visible: boolean;
  type: 'success' | 'error' | 'match' | 'boost' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onHide?: () => void;
}

const { width } = Dimensions.get('window');

export default function AnimatedToast({
  visible,
  type,
  title,
  message,
  duration = 3000,
  onHide
}: AnimatedToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      if (Platform.OS !== 'web') {
        const hapticType = type === 'success' || type === 'match' 
          ? Haptics.ImpactFeedbackStyle.Medium
          : type === 'error'
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Light;
        
        Haptics.impactAsync(hapticType);
      }

      // Show animation with enhanced spring physics
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Icon bounce animation after main animation
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 200,
          friction: 6,
          useNativeDriver: true,
        }).start();
      });

      // Auto hide
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide?.();
    });
  };

  const getIcon = () => {
    const iconProps = { size: 20, color: colors.text.primary };
    
    switch (type) {
      case 'success':
        return <Check {...iconProps} color={colors.success} />;
      case 'error':
        return <X {...iconProps} color={colors.error} />;
      case 'match':
        return <Heart {...iconProps} color={colors.secondary} fill={colors.secondary} />;
      case 'boost':
        return <Zap {...iconProps} color={colors.warning} fill={colors.warning} />;
      case 'warning':
        return <AlertTriangle {...iconProps} color={colors.warning} />;
      case 'info':
        return <AlertCircle {...iconProps} color={colors.primary} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.95)';
      case 'error':
        return 'rgba(239, 68, 68, 0.95)';
      case 'match':
        return 'rgba(236, 72, 153, 0.95)';
      case 'boost':
        return 'rgba(245, 158, 11, 0.95)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.95)';
      case 'info':
        return 'rgba(59, 130, 246, 0.95)';
      default:
        return colors.surface.primary;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [
            { translateY },
            { scale }
          ],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.iconContainer,
            { transform: [{ scale: iconScale }] }
          ]}
        >
          {getIcon()}
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  message: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
    marginTop: 2,
  },
});