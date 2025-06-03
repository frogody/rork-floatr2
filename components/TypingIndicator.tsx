import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import colors from '@/constants/colors';

interface TypingIndicatorProps {
  userName: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const duration = 600;
      const delay = 200;

      Animated.loop(
        Animated.sequence([
          Animated.timing(dot1, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(dot1, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
        ])
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot2, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot2, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay);

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(dot3, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(dot3, {
              toValue: 0,
              duration,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, delay * 2);
    };

    animateDots();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{userName} is typing</Text>
        <View style={styles.dotsContainer}>
          <Animated.View 
            style={[
              styles.dot, 
              { opacity: dot1 }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { opacity: dot2 }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { opacity: dot3 }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    marginVertical: 4,
    maxWidth: '80%',
    paddingHorizontal: 16,
  },
  bubble: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.secondary,
  },
});