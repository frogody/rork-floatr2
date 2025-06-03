import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import colors from '@/constants/colors';
import { useSwipeStore } from '@/store/swipeStore';

export default function DiscoveryScreen() {
  const { 
    crews,
    currentIndex,
    fetchCrews,
    likeCrewAtIndex,
    dislikeCrewAtIndex,
    superlikeCrewAtIndex,
    undoLastAction,
    lastAction,
    isLoading,
  } = useSwipeStore();

  useEffect(() => {
    fetchCrews();
  }, [fetchCrews]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentCrew = crews[currentIndex];
  const canUndo = lastAction.type !== null && currentIndex > 0;

  if (!currentCrew) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.noMoreText}>No more crews available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CrewCard crew={currentCrew} />
      <SwipeButtons 
        onLike={() => likeCrewAtIndex(currentIndex)}
        onDislike={() => dislikeCrewAtIndex(currentIndex)}
        onSuperlike={() => superlikeCrewAtIndex(currentIndex)}
        onUndo={undoLastAction}
        canUndo={canUndo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
  },
});