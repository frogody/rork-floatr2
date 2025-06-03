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
  RefreshControl,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Filter, RotateCcw, Zap } from 'lucide-react-native';
import { useSwipeStore } from '@/store/swipeStore';
import CrewCard from '@/components/CrewCard';
import SwipeButtons from '@/components/SwipeButtons';
import UndoButton from '@/components/UndoButton';
import SkeletonLoader from '@/components/SkeletonLoader';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import colors from '@/constants/colors';
import { Crew } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 120;
const BOOST_THRESHOLD = -150; // Swipe up threshold for boost

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
  const [showFilters, setShowFilters] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    distance: 25,
    boatTypes: [],
    crewSize: { min: 1, max: 12 },
    tags: [],
  });
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  
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

  const boostOpacity = position.y.interpolate({
    inputRange: [-200, -100, 0],
    outputRange: [1, 0.5, 0],
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
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Add haptic feedback when starting to drag
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        
        // Scale effect when dragging
        const distance = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
        const scaleValue = Math.max(0.95, 1 - distance / 1000);
        scale.setValue(scaleValue);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < BOOST_THRESHOLD) {
          handleBoostGesture();
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          handleSwipeRightGesture(gesture.dx);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          handleSwipeLeftGesture(gesture.dx);
        } else {
          // Snap back with spring animation
          Animated.parallel([
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              tension: 100,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 5,
              tension: 100,
              useNativeDriver: false,
            })
          ]).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    fetchCrews();
    
    // Show tutorial for first-time users
    const hasSeenTutorial = false; // In real app, check AsyncStorage
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 1000);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await fetchCrews();
    setCurrentIndex(0);
    setRefreshing(false);
  };

  const handleSwipeLeftGesture = async (dx: number) => {
    if (crews.length <= currentIndex) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: -SCREEN_WIDTH * 1.5, y: dx },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      swipeLeft(crews[currentIndex].id);
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
      scale.setValue(1);
    });
  };

  const handleSwipeRightGesture = async (dx: number) => {
    if (crews.length <= currentIndex) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: SCREEN_WIDTH * 1.5, y: dx },
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: false,
      })
    ]).start(() => {
      swipeRight(crews[currentIndex].id);
      setCurrentIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      
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

  const handleBoostGesture = async () => {
    if (crews.length <= currentIndex) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Boost This Profile',
      'Use a boost to get priority visibility with this crew?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Boost', 
          onPress: () => {
            // In real app, this would use a boost credit
            Alert.alert('Boosted!', 'Your profile will be shown first to this crew.');
            handleSwipeRightGesture(0);
          }
        },
      ]
    );
    
    // Reset position
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 5,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: false,
      })
    ]).start();
  };

  const handleWave = () => {
    handleSwipeRightGesture(0);
  };

  const handlePass = () => {
    handleSwipeLeftGesture(0);
  };

  const handleUndo = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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

  const handleFiltersPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowFilters(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    // In a real app, this would refetch crews with the new filters
    console.log('Applying filters:', newFilters);
    fetchCrews(); // Refetch with new filters
  };

  const renderCards = () => {
    if (isLoading && !refreshing) {
      return <SkeletonLoader type="card" />;
    }

    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchCrews}>
            <RotateCcw size={16} color={colors.primary} />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (crews.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No crews found nearby</Text>
          <Text style={styles.emptyStateSubtext}>Try adjusting your filters or check back later</Text>
        </View>
      );
    }

    if (currentIndex >= crews.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No more crews nearby</Text>
          <Text style={styles.emptyStateSubtext}>Check back later or expand your search radius</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <RotateCcw size={16} color={colors.primary} />
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
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
                    { scale },
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
              
              <Animated.View style={[styles.boostContainer, { opacity: boostOpacity }]}>
                <Zap size={24} color={colors.warning} />
                <Text style={styles.boostText}>BOOST</Text>
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

  const renderTutorial = () => {
    if (!showTutorial) return null;

    return (
      <View style={styles.tutorialOverlay}>
        <View style={styles.tutorialContent}>
          <Text style={styles.tutorialTitle}>How to Use Floatr</Text>
          <View style={styles.tutorialStep}>
            <Text style={styles.tutorialText}>👈 Swipe left to pass</Text>
          </View>
          <View style={styles.tutorialStep}>
            <Text style={styles.tutorialText}>👉 Swipe right to wave</Text>
          </View>
          <View style={styles.tutorialStep}>
            <Text style={styles.tutorialText}>👆 Swipe up to boost</Text>
          </View>
          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => setShowTutorial(false)}
          >
            <Text style={styles.tutorialButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topControls}>
          <UndoButton 
            onUndo={handleUndo} 
            disabled={swipeHistory.length === 0} 
          />
          
          <TouchableOpacity style={styles.filterButton} onPress={handleFiltersPress}>
            <Filter size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardsContainer}>
          {renderCards()}
        </View>
        
        <SwipeButtons
          onWave={handleWave}
          onPass={handlePass}
          onAnchor={handleAnchor}
          isAnchored={isAnchored}
        />
      </ScrollView>
      
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
      
      {renderTutorial()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContainer: {
    flex: 1,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 600,
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
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  retryText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
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
  boostContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  boostText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.background.dark,
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tutorialContent: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    margin: 32,
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  tutorialStep: {
    marginBottom: 12,
  },
  tutorialText: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
  },
  tutorialButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  tutorialButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});