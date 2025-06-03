import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Animated } from 'react-native';
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
  
  const passScale = useRef(new Animated.Value(1)).current;
  const waveScale = useRef(new Animated.Value(1)).current;
  const anchorScale = useRef(new Animated.Value(1)).current;
  const boostScale = useRef(new Animated.Value(1)).current;

  const animateButton = (scale: Animated.Value, callback: () => void) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    
    callback();
  };

  const handlePress = async (action: () => void, scale: Animated.Value) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    animateButton(scale, action);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: passScale }] }}>
        <TouchableOpacity 
          style={styles.passButton} 
          onPress={() => handlePress(onPass, passScale)}
          activeOpacity={0.7}
        >
          <X size={28} color={colors.error} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={{ transform: [{ scale: anchorScale }] }}>
        <TouchableOpacity 
          style={[styles.anchorButton, isAnchored && styles.anchoredButton]} 
          onPress={() => handlePress(onAnchor, anchorScale)}
          activeOpacity={0.7}
        >
          <Anchor size={22} color={isAnchored ? colors.text.primary : colors.text.secondary} />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={{ transform: [{ scale: boostScale }] }}>
        <TouchableOpacity 
          style={styles.boostButton} 
          onPress={() => handlePress(() => {}, boostScale)} // Boost handled in parent
          activeOpacity={0.7}
        >
          <Zap size={22} color={colors.warning} fill={colors.warning} />
          {boostsRemaining > 0 && (
            <Animated.View style={styles.boostBadge}>
              <Text style={styles.boostBadgeText}>{boostsRemaining}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.View style={{ transform: [{ scale: waveScale }] }}>
        <TouchableOpacity 
          style={styles.waveButton} 
          onPress={() => handlePress(onWave, waveScale)}
          activeOpacity={0.7}
        >
          <Heart size={28} color={colors.success} fill={colors.success} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    gap: 24,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  anchorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  anchoredButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  boostButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.warning,
    position: 'relative',
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  boostBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.warning,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.dark,
  },
  boostBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background.dark,
  },
  waveButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.success,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});