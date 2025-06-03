import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSwipeStore } from '@/store/swipeStore';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import HeartAnimation from '@/components/HeartAnimation';
import MatchAnimation from '@/components/MatchAnimation';
import colors from '@/constants/colors';

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
  } = useSwipeStore();

  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);

  useEffect(() => {
    fetchCrews();
  }, []);

  const handleLike = () => {
    likeCrewAtIndex(currentIndex);
    setShowHeartAnimation(true);
  };

  const handleDislike = () => {
    dislikeCrewAtIndex(currentIndex);
  };

  const handleSuperlike = () => {
    superlikeCrewAtIndex(currentIndex);
    setShowMatchAnimation(true);
  };

  if (isLoading || !crews.length) {
    return (
      <View style={styles.container}>
        {/* Add loading state or empty state UI here */}
      </View>
    );
  }

  const currentCrew = crews[currentIndex];
  const canUndo = lastAction.type !== null && lastAction.crewId !== null;

  if (!currentCrew) {
    return (
      <View style={styles.container}>
        {/* Add no more crews UI here */}
      </View>
    );
  }

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
});