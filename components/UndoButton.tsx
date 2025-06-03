import React from 'react';
import { TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';

interface UndoButtonProps {
  onUndo: () => void;
  disabled?: boolean;
}

export default function UndoButton({ onUndo, disabled = false }: UndoButtonProps) {
  const handlePress = async () => {
    if (disabled) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onUndo();
  };

  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <RotateCcw size={16} color={disabled ? colors.text.secondary : colors.primary} />
      <Text style={[styles.text, disabled && styles.disabledText]}>Undo</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 10,
  },
  text: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.text.secondary,
  },
});