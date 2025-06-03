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
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Filter, RotateCcw, Zap, Heart, X, Crown, RefreshCw } from 'lucide-react-native';
import { useSwipeStore } from '@/store/swipeStore';
import { useAuthStore } from '@/store/authStore';
import CrewCard from '@/components/CrewCard';
import SwipeButtons from '@/components/SwipeButtons';
import UndoButton from '@/components/UndoButton';
import SkeletonLoader from '@/components/SkeletonLoader';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import colors from '@/constants/colors';
import { Crew } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
    isAnchored,
    boostProfile,
    boostsRemaining 
  } = useSwipeStore();
  const { user, hasSeenTutorial, setHasSeenTutorial } = useAuthStore();
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
  const rotation = useRef(new Animated.Value(0)).current;
  
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
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Only respond to gestures if they're significant enough
        return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5;
      },
      onPanResponderTerminationRequest: () => false, // Don't allow other components to steal the gesture
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
        const velocity = Math.sqrt(gesture.vx * gesture.vx + gesture.vy * gesture.vy);
        
        if (gesture.dy < BOOST_THRESHOLD && velocity > 0.5) {
          handleBoostGesture();
        } else if (gesture.dx > SWIPE_THRESHOLD || (gesture.dx > 50 && gesture.vx > 0.5)) {
          handleSwipeRightGesture(gesture.dx);
        } else if (gesture.dx < -SWIPE_THRESHOLD || (gesture.dx < -50 && gesture.vx < -0.5)) {
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
    
    if (boostsRemaining > 0) {
      Alert.alert(
        'Boost This Profile',
        `Use a boost to get priority visibility with ${crews[currentIndex].name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: `Use Boost (${boostsRemaining} left)`, 
            onPress: () => {
              boostProfile(crews[currentIndex].id);
              Alert.alert('Boosted!', 'Your profile will be shown first to this crew.');
              handleSwipeRightGesture(0);
            }
          },
        ]
      );
    } else {
      Alert.alert(
        'No Boosts Left',
        'Get more boosts with Floatr Premium!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Premium', onPress: () => router.push('/premium') },
        ]
      );
    }
    
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
    
    if (swipeHistory.length === 0) {
      Alert.alert('No More Undos', 'Get unlimited undos with Floatr Premium!', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Go Premium', onPress: () => router.push('/premium') },
      ]);
      return;
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

  const handleWhoLikedYou = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (user?.isPremium) {
      router.push('/who-liked-you');
    } else {
      Alert.alert(
        'Premium Feature',
        'See who liked you with Floatr Premium!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go Premium', onPress: () => router.push('/premium') },
        ]
      );
    }
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
            <RefreshCw size={16} color={colors.primary} />
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
                <Heart size={24} color={colors.success} fill={colors.success} />
                <Text style={styles.likeText}>WAVE</Text>
              </Animated.View>
              
              <Animated.View style={[styles.nopeContainer, { opacity: nopeOpacity }]}>
                <X size={24} color={colors.error} />
                <Text style={styles.nopeText}>PASS</Text>
              </Animated.View>
              
              <Animated.View style={[styles.boostContainer, { opacity: boostOpacity }]}>
                <Zap size={24} color={colors.warning} fill={colors.warning} />
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
            <X size={20} color={colors.error} />
            <Text style={styles.tutorialText}>Swipe left or tap ✕ to pass</Text>
          </View>
          <View style={styles.tutorialStep}>
            <Heart size={20} color={colors.success} fill={colors.success} />
            <Text style={styles.tutorialText}>Swipe right or tap ♥ to wave</Text>
          </View>
          <View style={styles.tutorialStep}>
            <Zap size={20} color={colors.warning} fill={colors.warning} />
            <Text style={styles.tutorialText}>Swipe up or tap ⚡ to boost</Text>
          </View>
          <TouchableOpacity 
            style={styles.tutorialButton}
            onPress={() => {
              setShowTutorial(false);
              setHasSeenTutorial(true);
            }}
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
      
      {/* Fixed header controls */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.topControls}>
          <UndoButton 
            onUndo={handleUndo} 
            disabled={swipeHistory.length === 0} 
          />
          
          <TouchableOpacity style={styles.whoLikedButton} onPress={handleWhoLikedYou}>
            <Heart size={20} color={user?.isPremium ? colors.warning : colors.text.primary} />
            {!user?.isPremium && <Crown size={12} color={colors.warning} style={styles.premiumIcon} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.filterButton} onPress={handleFiltersPress}>
            <Filter size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Main card area - no scroll view to prevent gesture conflicts */}
      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>
      
      {/* Fixed bottom controls */}
      <View style={styles.bottomContainer}>
        <SwipeButtons
          onWave={handleWave}
          onPass={handlePass}
          onAnchor={handleAnchor}
          isAnchored={isAnchored}
          boostsRemaining={boostsRemaining}
        />
      </View>
      
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
  headerContainer: {
    backgroundColor: colors.background.dark,
    zIndex: 10,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  whoLikedButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  premiumIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cardContainer: {
    position: 'absolute',
    width: '100%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    backgroundColor: colors.background.dark,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Account for iPhone home indicator
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
    minHeight: 44, // Ensure proper touch target
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
    borderRadius: 12,
    padding: 12,
    borderColor: colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  likeText: {
    fontSize: 20,
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
    borderRadius: 12,
    padding: 12,
    borderColor: colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nopeText: {
    fontSize: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tutorialText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  tutorialButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  tutorialButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});