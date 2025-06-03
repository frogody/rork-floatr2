import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  haptic?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  gradient = false,
  gradientColors,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  haptic = true,
  ...rest
}: ButtonProps) {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[`${size}Button`],
    styles[`${variant}Button`],
    disabled && styles.disabledButton,
    style as ViewStyle,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle as TextStyle,
  ];

  const defaultGradientColors: readonly [string, string, ...string[]] = variant === 'primary' 
    ? [colors.gradient.blue[0], colors.gradient.blue[1]] as readonly [string, string, ...string[]]
    : variant === 'secondary' 
      ? [colors.gradient.sunset[0], colors.gradient.sunset[1]] as readonly [string, string, ...string[]]
      : ['transparent', 'transparent'] as readonly [string, string, ...string[]];

  const handlePress = async () => {
    if (haptic && Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const ButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' ? colors.primary : colors.text.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={textStyles}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </>
  );

  if (gradient && !disabled && variant !== 'outline' && variant !== 'text') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        style={[styles.buttonContainer, style]}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={gradientColors || defaultGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles}
        >
          <ButtonContent />
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[...buttonStyles]}
      activeOpacity={0.8}
      {...rest}
    >
      <ButtonContent />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
    minHeight: 44, // Ensure proper touch target size for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  // Size variations
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 8,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryText: {
    color: colors.text.primary,
  },
  secondaryText: {
    color: colors.text.primary,
  },
  outlineText: {
    color: colors.primary,
  },
  textText: {
    color: colors.primary,
  },
  // State styles
  disabledButton: {
    backgroundColor: colors.text.secondary,
    opacity: 0.5,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    color: colors.text.primary,
    opacity: 0.7,
  },
});