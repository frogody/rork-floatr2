import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import colors from '@/constants/colors';

export default function DiscoveryScreen() {
  return (
    <View style={styles.container}>
      <CrewCard />
      <SwipeButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
});