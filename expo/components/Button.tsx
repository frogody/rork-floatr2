import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
  Animated,
  AccessibilityRole,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  accessibilityLabel,
  accessibilityHint,
  testID,
}: ButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = React.useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePressOut = React.useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePress = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptics might not be available on all devices
        console.warn('Haptics not available:', error);
      }
    }
    onPress();
  }, [onPress]);

  const getVariantStyles = React.useMemo((): ViewStyle => {
    const baseStyles: ViewStyle = {
      opacity: disabled ? 0.5 : 1,
    };

    if (disabled) {
      return {
        ...baseStyles,
        backgroundColor: colors.status?.disabled || colors.text.disabled || '#666',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      case 'destructive':
        return {
          ...baseStyles,
          backgroundColor: colors.status?.error || colors.error || '#FF3B30',
        };
      default:
        return baseStyles;
    }
  }, [variant, disabled]);

  const getSizeStyles = React.useMemo((): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 14,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
          minHeight: 48,
        };
    }
  }, [size]);

  const getTextColor = React.useMemo((): string => {
    if (disabled) return colors.text.disabled || '#666';
    switch (variant) {
      case 'outline':
      case 'ghost':
      case 'text':
        return colors.primary;
      case 'destructive':
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  }, [variant, disabled]);

  const getTextSize = React.useMemo((): number => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  }, [size]);

  const buttonContent = React.useMemo(() => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={getTextColor} 
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <React.Fragment>
          {icon && iconPosition === 'left' && icon}
          <Text
            style={[
              styles.text,
              { 
                color: getTextColor,
                fontSize: getTextSize,
              },
              icon && (iconPosition === 'left' ? styles.textWithLeftIcon : styles.textWithRightIcon),
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </React.Fragment>
      )}
    </>
  ), [loading, icon, iconPosition, title, getTextColor, getTextSize, textStyle]);

  return (
    <Animated.View 
      style={{ 
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          getVariantStyles,
          getSizeStyles,
          style,
        ]}
        activeOpacity={0.9}
        accessibilityRole="button" as AccessibilityRole
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading,
        }}
        testID={testID}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithLeftIcon: {
    marginLeft: 8,
  },
  textWithRightIcon: {
    marginRight: 8,
  },
});