import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { useSwipeStore } from '@/store/swipeStore';
import { useToast } from '@/hooks/useToast';

export default function DiscoveryScreen() {
  const { 
    crews, 
    currentIndex,
    fetchCrews,
    likeCrewAtIndex,
    dislikeCrewAtIndex,
    superlikeCrewAtIndex,
    undoLastAction,
    isLoading,
    error,
    lastAction,
  } = useSwipeStore();
  
  const { showToast } = useToast();

  useEffect(() => {
    fetchCrews().catch(error => {
      showToast({
        message: "Couldn't load crews",
        type: 'error'
      });
    });
  }, []);

  useEffect(() => {
    if (error) {
      showToast({
        message: error,
        type: 'error'
      });
    }
  }, [error]);

  const handleLike = () => {
    likeCrewAtIndex(currentIndex);
  };

  const handleDislike = () => {
    dislikeCrewAtIndex(currentIndex);
  };

  const handleSuperlike = () => {
    superlikeCrewAtIndex(currentIndex);
  };

  const currentCrew = crews[currentIndex];
  const hasMoreCrews = currentIndex < crews.length;
  const canUndo = lastAction.type !== null;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Discover',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !hasMoreCrews ? (
        <View style={styles.centered}>
          <CrewCard 
            crew={{
              id: 'empty',
              name: 'No More Crews',
              description: 'Check back later for more crews!',
              location: '',
              distance: 0,
              photoUrl: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732',
              tags: [],
              crewSize: 0,
              boatType: '',
              boatLength: 0,
            }}
          />
        </View>
      ) : (
        <>
          <View style={styles.cardContainer}>
            {currentCrew && <CrewCard crew={currentCrew} />}
          </View>
          
          <SwipeButtons
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperlike={handleSuperlike}
            onUndo={undoLastAction}
            canUndo={canUndo}
          />
        </>
      )}
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
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});