import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Platform, Pressable, useColorScheme } from 'react-native';
import { Check, AlertTriangle, Info, Star, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColors } from '@/constants/colors';
import { useToastStore } from '@/hooks/useToast';

export function ToastProvider() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const visible = useToastStore((state) => state.visible);
  const message = useToastStore((state) => state.message);
  const type = useToastStore((state) => state.type);
  const hideToast = useToastStore((state) => state.hideToast);
  
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  const showAnimation = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: insets.top + 10,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
        stiffness: 120,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity, insets.top]);

  const hideAnimation = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
        stiffness: 120,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  useEffect(() => {
    if (visible) {
      showAnimation();
    } else {
      hideAnimation();
    }
  }, [visible, showAnimation, hideAnimation]);

  const getIcon = useCallback(() => {
    const iconSize = 20;
    switch (type) {
      case 'success':
        return <Check size={iconSize} color={colors.status.success} strokeWidth={2.5} />;
      case 'error':
        return <AlertTriangle size={iconSize} color={colors.status.error} strokeWidth={2.5} />;
      case 'info':
        return <Info size={iconSize} color={colors.status.info} strokeWidth={2.5} />;
      case 'warning':
        return <Star size={iconSize} color={colors.status.warning} strokeWidth={2.5} />;
      default:
        return <Info size={iconSize} color={colors.status.info} strokeWidth={2.5} />;
    }
  }, [type, colors]);

  const getBackgroundColor = useCallback(() => {
    switch (type) {
      case 'success':
        return colors.status.success + '15';
      case 'error':
        return colors.status.error + '15';
      case 'info':
        return colors.status.info + '15';
      case 'warning':
        return colors.status.warning + '15';
      default:
        return colors.surface.secondary;
    }
  }, [type, colors]);

  const getBorderColor = useCallback(() => {
    switch (type) {
      case 'success':
        return colors.status.success + '30';
      case 'error':
        return colors.status.error + '30';
      case 'info':
        return colors.status.info + '30';
      case 'warning':
        return colors.status.warning + '30';
      default:
        return colors.border.primary;
    }
  }, [type, colors]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ translateY }],
          opacity,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          top: 0,
        }
      ]}
    >
      <Pressable
        style={styles.content}
        onPress={hideToast}
        accessibilityRole="button"
        accessibilityLabel={`${type} notification: ${message}. Tap to dismiss.`}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <Text style={[styles.message, { color: colors.text.primary }]} numberOfLines={3}>
          {message}
        </Text>
        <Pressable
          style={styles.closeButton}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
        >
          <X size={16} color={colors.text.secondary} strokeWidth={2} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    marginTop: 2,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    padding: 2,
    marginTop: 1,
  },
});