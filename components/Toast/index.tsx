import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Check, AlertTriangle, Info, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useToastStore } from '@/hooks/useToast';

export function ToastProvider() {
  const visible = useToastStore((state) => state.visible);
  const message = useToastStore((state) => state.message);
  const type = useToastStore((state) => state.type);
  
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: Platform.OS === 'ios' ? 60 : 20,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
        stiffness: 120,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: -100,
        useNativeDriver: true,
        damping: 15,
        mass: 1,
        stiffness: 120,
      }).start();
    }
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={20} color={colors.status.success} />;
      case 'error':
        return <AlertTriangle size={20} color={colors.status.error} />;
      case 'info':
        return <Info size={20} color={colors.status.info} />;
      case 'warning':
        return <Star size={20} color={colors.status.warning} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return colors.status.success + '20';
      case 'error':
        return colors.status.error + '20';
      case 'info':
        return colors.status.info + '20';
      case 'warning':
        return colors.status.warning + '20';
      default:
        return colors.surface.secondary;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY }], backgroundColor: getBackgroundColor() }
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text.primary,
  },
});