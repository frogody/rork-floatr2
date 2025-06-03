import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { useSwipeStore } from '@/store/swipeStore';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import HeartAnimation from '@/components/HeartAnimation';
import MatchAnimation from '@/components/MatchAnimation';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { RefreshCw } from 'lucide-react-native';

const { height } = Dimensions.get('window');

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
    error,
  } = useSwipeStore();

  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  useEffect(() => {
    console.log('DiscoveryScreen mounted, fetching crews...');
    fetchCrews();
  }, [fetchCrews]);

  useEffect(() => {
    console.log('DiscoveryScreen state:', {
      crews: crews.length,
      currentIndex,
      isLoading,
      error,
      currentCrew: crews[currentIndex]?.id
    });
  }, [crews, currentIndex, isLoading, error]);

  const handleLike = () => {
    console.log('Like button pressed');
    likeCrewAtIndex(currentIndex);
    setShowHeartAnimation(true);
  };

  const handleDislike = () => {
    console.log('Dislike button pressed');
    dislikeCrewAtIndex(currentIndex);
  };

  const handleSuperlike = () => {
    console.log('Superlike button pressed');
    superlikeCrewAtIndex(currentIndex);
    setShowMatchAnimation(true);
  };

  const handleRetry = () => {
    console.log('Retry button pressed');
    fetchCrews();
  };

  // Loading state
  if (isLoading) {
    console.log('Showing loading state');
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Finding crews near you...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    console.log('Showing error state:', error);
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Try Again"
          onPress={handleRetry}
          variant="primary"
          size="large"
          style={styles.retryButton}
          icon={<RefreshCw size={20} color={colors.background.primary} />}
        />
      </View>
    );
  }

  // No crews available
  if (!crews.length) {
    console.log('No crews available');
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyTitle}>No crews found</Text>
        <Text style={styles.emptyText}>
          We could not find any crews in your area. Try expanding your search radius or check back later.
        </Text>
        <Button
          title="Refresh"
          onPress={handleRetry}
          variant="primary"
          size="large"
          style={styles.retryButton}
          icon={<RefreshCw size={20} color={colors.background.primary} />}
        />
      </View>
    );
  }

  const currentCrew = crews[currentIndex];
  const canUndo = lastAction.type !== null && lastAction.crewId !== null;

  // No more crews to show
  if (!currentCrew) {
    console.log('No more crews to show');
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyTitle}>That's everyone!</Text>
        <Text style={styles.emptyText}>
          You have seen all available crews in your area. Check back later for new members.
        </Text>
        <Button
          title="Start Over"
          onPress={handleRetry}
          variant="primary"
          size="large"
          style={styles.retryButton}
          icon={<RefreshCw size={20} color={colors.background.primary} />}
        />
      </View>
    );
  }

  console.log('Rendering main discovery screen with crew:', currentCrew.id);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <CrewCard crew={currentCrew} />
      </View>
      
      <View style={styles.buttonsContainer}>
        <SwipeButtons
          onLike={handleLike}
          onDislike={handleDislike}
          onSuperlike={handleSuperlike}
          onUndo={undoLastAction}
          canUndo={canUndo}
        />
      </View>

      <HeartAnimation 
        visible={showHeartAnimation}
        onComplete={() => setShowHeartAnimation(false)}
      />
      
      <MatchAnimation
        visible={showMatchAnimation}
        onComplete={() => setShowMatchAnimation(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  cardContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    height: height * 0.7,
  },
  buttonsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 140,
  },
});