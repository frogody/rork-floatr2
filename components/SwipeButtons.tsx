import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Heart, Star } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SwipeButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeButtons({ onSwipeLeft, onSwipeRight }: SwipeButtonsProps) {
  const handlePress = async (direction: 'left' | 'right') => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    direction === 'left' ? onSwipeLeft() : onSwipeRight();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.nopeButton]}
        onPress={() => handlePress('left')}
        activeOpacity={0.9}
      >
        <X size={30} color={colors.status.error} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.superLikeButton]}
        onPress={() => {}}
        activeOpacity={0.9}
      >
        <Star size={30} color={colors.status.info} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.likeButton]}
        onPress={() => handlePress('right')}
        activeOpacity={0.9}
      >
        <Heart size={30} color={colors.status.success} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
    }),
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: colors.status.error,
  },
  superLikeButton: {
    borderWidth: 2,
    borderColor: colors.status.info,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: colors.status.success,
  },
});