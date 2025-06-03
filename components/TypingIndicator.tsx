import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import colors from '@/constants/colors';

interface TypingIndicatorProps {
  visible: boolean;
}

export default function TypingIndicator({ visible }: TypingIndicatorProps) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animateDot = (dot: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animation = Animated.parallel([
        animateDot(dot1, 0),
        animateDot(dot2, 200),
        animateDot(dot3, 400),
      ]);

      animation.start();

      return () => animation.stop();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }
  }, [visible, dot1, dot2, dot3]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dot1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dot2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
            ]} 
          />
          <Animated.View 
            style={[
              styles.dot, 
              { 
                opacity: dot3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }
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
  },
  bubble: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.secondary,
  },
});