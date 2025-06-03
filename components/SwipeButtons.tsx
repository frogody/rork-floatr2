import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  useColorScheme,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { getColors } from '@/constants/colors';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const handlePress = async (action: () => void) => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
    action();
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button, 
          styles.smallButton, 
          { backgroundColor: colors.surface.primary },
          !canUndo && styles.disabledButton
        ]}
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
        style={[
          styles.button, 
          styles.largeButton, 
          styles.dislikeButton,
          { 
            backgroundColor: colors.surface.primary,
            borderColor: colors.error,
          }
        ]}
        onPress={() => handlePress(onDislike)}
        activeOpacity={0.7}
      >
        <X size={32} color={colors.error} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button, 
          styles.largeButton, 
          styles.superlikeButton,
          { 
            backgroundColor: colors.surface.primary,
            borderColor: colors.warning,
          }
        ]}
        onPress={() => handlePress(onSuperlike)}
        activeOpacity={0.7}
      >
        <Star size={32} color={colors.warning} fill={colors.warning} />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button, 
          styles.largeButton, 
          styles.likeButton,
          { 
            backgroundColor: colors.surface.primary,
            borderColor: colors.success,
          }
        ]}
        onPress={() => handlePress(onLike)}
        activeOpacity={0.7}
      >
        <Heart size={32} color={colors.success} fill={colors.success} />
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
  },
  likeButton: {
    borderWidth: 2,
  },
  superlikeButton: {
    borderWidth: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
});