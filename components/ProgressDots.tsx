import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import colors from '@/constants/colors';

interface ProgressDotsProps {
  total: number;
  current: number;
  activeColor?: string;
  inactiveColor?: string;
}

export default function ProgressDots({ 
  total, 
  current, 
  activeColor = colors.primary, 
  inactiveColor = 'rgba(255,255,255,0.3)' 
}: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === current ? activeColor : inactiveColor,
              width: index === current ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});