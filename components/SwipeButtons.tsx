import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Heart, Anchor } from 'lucide-react-native';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface SwipeButtonsProps {
  onWave: () => void;
  onPass: () => void;
  onAnchor: () => void;
}

export default function SwipeButtons({ onWave, onPass, onAnchor }: SwipeButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.passButton]} 
        onPress={onPass}
        activeOpacity={0.8}
      >
        <X size={24} color={colors.error} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.anchorButton]} 
        onPress={onAnchor}
        activeOpacity={0.8}
      >
        <Anchor size={24} color={colors.primary} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.waveButtonContainer}
        onPress={onWave}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors.gradient.sunset}
          style={styles.waveButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Heart size={24} color={colors.text.primary} fill={colors.text.primary} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 16,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.error,
  },
  anchorButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  waveButtonContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  waveButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});