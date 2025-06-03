import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Animated, 
  PanResponder,
  Dimensions,
  Alert,
  Platform,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSwipeStore } from '@/store/swipeStore';
import CrewCard from '@/components/CrewCard';
import SwipeButtons from '@/components/SwipeButtons';
import UndoButton from '@/components/UndoButton';
import SkeletonLoader from '@/components/SkeletonLoader';
import colors from '@/constants/colors';
import { Crew } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;

export default function DiscoverScreen() {
  const { 
    crews, 
    fetchCrews, 
    swipeLeft, 
    swipeRight, 
    undoLastSwipe,
    swipeHistory,
    isLoading, 
    error, 
    setAnchor, 
    isAnchored 
  } = useSwipeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipeRightGesture(gesture.dx);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipeLeftGesture(gesture.dx);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    fetchCrews();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCrews();
    setCurrentIndex(0);
    setRefreshing(false);
  };

  const handleSwipeLeftGesture = async (dx: number) => {
    if (crews.length <= currentIndex) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH * 1.5, y: dx },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      swipeLeft(crews[currentIndex].id);
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleSwipeRightGesture = async (dx: number) => {
    if (crews.length <= currentIndex) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH * 1.5, y: dx },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      swipeRight(crews[currentIndex].id);
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
      
      // Show match alert (in a real app, this would check for mutual matches)
      if (Math.random() > 0.7) {
        Alert.alert(
          "It's a Match!",
          `You and ${crews[currentIndex].name} have waved at each other.`,
          [
            { text: 'Send Message', onPress: () => router.push('/chat/new') },
            { text: 'Keep Swiping', style: 'cancel' },
          ]
        );
      }
    });
  };

  const handleWave = () => {
    handleSwipeRightGesture(0);
  };

  const handlePass = () => {
    handleSwipeLeftGesture(0);
  };

  const handleUndo = () => {
    undoLastSwipe();
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  const handleAnchor = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setAnchor(!isAnchored);
    Alert.alert(
      isAnchored ? 'Anchor Lifted' : 'Anchor Dropped',
      isAnchored 
        ? 'You are now moving. Other boaters will see you as underway.' 
        : 'You are now visible as anchored. Nearby boaters can see you are stationary.',
      [{ text: 'OK' }]
    );
  };

  const renderCards = () => {
    if (isLoading && !refreshing) {
      return <SkeletonLoader type="card" />;
    }

    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Error: {error}</Text>
        </View>
      );
    }

    if (crews.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No crews found nearby</Text>
        </View>
      );
    }

    if (currentIndex >= crews.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No more crews nearby</Text>
          <Text style={styles.emptyStateSubtext}>Check back later or expand your search radius</Text>
        </View>
      );
    }

    return crews
      .map((crew, index) => {
        if (index < currentIndex) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={crew.id}
              style={[
                styles.cardContainer,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View style={[styles.likeContainer, { opacity: likeOpacity }]}>
                <Text style={styles.likeText}>WAVE</Text>
              </Animated.View>
              
              <Animated.View style={[styles.nopeContainer, { opacity: nopeOpacity }]}>
                <Text style={styles.nopeText}>PASS</Text>
              </Animated.View>
              
              <CrewCard crew={crew} />
            </Animated.View>
          );
        }

        if (index === currentIndex + 1) {
          return (
            <Animated.View
              key={crew.id}
              style={[
                styles.cardContainer,
                {
                  opacity: nextCardOpacity,
                  transform: [{ scale: nextCardScale }],
                  zIndex: -1,
                },
              ]}
            >
              <CrewCard crew={crew} />
            </Animated.View>
          );
        }

        return null;
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <UndoButton 
        onUndo={handleUndo} 
        disabled={swipeHistory.length === 0} 
      />
      
      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>
      
      <SwipeButtons
        onWave={handleWave}
        onPass={handlePass}
        onAnchor={handleAnchor}
        isAnchored={isAnchored}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  likeContainer: {
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1,
    transform: [{ rotate: '20deg' }],
    borderWidth: 4,
    borderRadius: 8,
    padding: 8,
    borderColor: colors.success,
  },
  likeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.success,
  },
  nopeContainer: {
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1,
    transform: [{ rotate: '-20deg' }],
    borderWidth: 4,
    borderRadius: 8,
    padding: 8,
    borderColor: colors.error,
  },
  nopeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.error,
  },
});