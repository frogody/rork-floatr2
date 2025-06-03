import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Heart, Zap, Anchor } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SwipeButtonsProps {
  onPass: () => void;
  onWave: () => void;
  onAnchor: () => void;
  isAnchored: boolean;
  boostsRemaining?: number;
}

export default function SwipeButtons({ 
  onPass, 
  onWave, 
  onAnchor, 
  isAnchored,
  boostsRemaining = 0 
}: SwipeButtonsProps) {
  
  const handlePress = async (action: () => void) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    action();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.passButton} 
        onPress={() => handlePress(onPass)}
        activeOpacity={0.7}
      >
        <X size={24} color={colors.error} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.anchorButton, isAnchored && styles.anchoredButton]} 
        onPress={() => handlePress(onAnchor)}
        activeOpacity={0.7}
      >
        <Anchor size={20} color={isAnchored ? colors.text.primary : colors.text.secondary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.boostButton} 
        onPress={() => handlePress(() => {})} // Boost handled in parent
        activeOpacity={0.7}
      >
        <Zap size={20} color={colors.warning} fill={colors.warning} />
        {boostsRemaining > 0 && (
          <View style={styles.boostBadge}>
            <Text style={styles.boostBadgeText}>{boostsRemaining}</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.waveButton} 
        onPress={() => handlePress(onWave)}
        activeOpacity={0.7}
      >
        <Heart size={24} color={colors.success} fill={colors.success} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
    gap: 20,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
  },
  anchorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchoredButton: {
    backgroundColor: colors.primary,
  },
  boostButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.warning,
    position: 'relative',
  },
  boostBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.warning,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background.dark,
  },
  waveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.success,
  },
});