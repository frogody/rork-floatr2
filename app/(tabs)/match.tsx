import React, { useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { getColors } from '@/constants/colors';
import { useSwipeStore } from '@/store/swipeStore';

export default function MatchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

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
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Finding crews for you...
        </Text>
      </View>
    );
  }

  const currentCrew = crews[currentIndex];
  const canUndo = lastAction.type !== null && currentIndex > 0;

  if (!currentCrew) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[styles.noMoreText, { color: colors.text.secondary }]}>
          No more crews available
        </Text>
        <Text style={[styles.noMoreSubtext, { color: colors.text.tertiary }]}>
          Check back later for new crews in your area
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Match</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          Swipe to connect with crews
        </Text>
      </View>

      {/* Card Container */}
      <View style={styles.cardContainer}>
        <CrewCard crew={currentCrew} />
      </View>

      {/* Swipe Buttons */}
      <SwipeButtons 
        onLike={() => likeCrewAtIndex(currentIndex)}
        onDislike={() => dislikeCrewAtIndex(currentIndex)}
        onSuperlike={() => superlikeCrewAtIndex(currentIndex)}
        onUndo={undoLastAction}
        canUndo={canUndo}
      />

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={[styles.progressText, { color: colors.text.tertiary }]}>
          {currentIndex + 1} of {crews.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  noMoreText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMoreSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  progressContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  progressText: {
    fontSize: 12,
  },
});