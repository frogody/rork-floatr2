import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import colors from '@/constants/colors';
import { X, Heart, Star, RotateCcw } from 'lucide-react-native';

interface SwipeButtonsProps {
  onLike: () => void;
  onDislike: () => void;
  onSuperlike: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const SwipeButtons: React.FC<SwipeButtonsProps> = ({
  onLike,
  onDislike,
  onSuperlike,
  onUndo,
  canUndo,
}) => {
  const handlePress = async (action: () => void) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    action();
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.smallButton, !canUndo && styles.disabledButton]}
        onPress={() => canUndo && handlePress(onUndo)}
        activeOpacity={0.7}
        disabled={!canUndo}
      >
        <RotateCcw 
          size={24} 
          color={canUndo ? colors.text.secondary : colors.text.disabled} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.largeButton, styles.dislikeButton]}
        onPress={() => handlePress(onDislike)}
        activeOpacity={0.7}
      >
        <X size={32} color={colors.status.error} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.largeButton, styles.superlikeButton]}
        onPress={() => handlePress(onSuperlike)}
        activeOpacity={0.7}
      >
        <Star size={32} color={colors.status.warning} fill={colors.status.warning} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.largeButton, styles.likeButton]}
        onPress={() => handlePress(onLike)}
        activeOpacity={0.7}
      >
        <Heart size={32} color={colors.status.success} fill={colors.status.success} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: colors.surface.primary,
    margin: 8,
  },
  smallButton: {
    width: 48,
    height: 48,
  },
  largeButton: {
    width: 64,
    height: 64,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: colors.status.error,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: colors.status.success,
  },
  superlikeButton: {
    borderWidth: 2,
    borderColor: colors.status.warning,
  },
  disabledButton: {
    opacity: 0.5,
  },
});