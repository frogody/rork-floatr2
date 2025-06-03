import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  ViewToken,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Button from '@/components/Button';
import OnboardingStep from '@/components/OnboardingStep';
import ProgressDots from '@/components/ProgressDots';
import colors from '@/constants/colors';
import { OnboardingStep as OnboardingStepType } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { boatTypes } from '@/mocks/crews';

const { width } = Dimensions.get('window');

const onboardingSteps: OnboardingStepType[] = [
  {
    id: '1',
    title: 'Welcome to Floatr',
    description: 'Connect with fellow boaters, raft-up, and share amazing experiences on the water.',
    imageUrl: 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000',
  },
  {
    id: '2',
    title: 'Discover Nearby Crews',
    description: 'Swipe through profiles of boaters in your area and find your perfect match.',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1000',
  },
  {
    id: '3',
    title: 'Chat & Meet Up',
    description: 'Connect through chat and coordinate meet-ups on the water.',
    imageUrl: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000',
  },
  {
    id: '4',
    title: 'Drop Anchor',
    description: "Let others know when you are stationary and open to raft-ups.",
    imageUrl: 'https://images.unsplash.com/photo-1566438480900-0609be27a4be?q=80&w=1000',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { setOnboarded, updateBoat } = useAuthStore();

  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleNext = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentIndex < onboardingSteps.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete onboarding
      // In a real app, we would collect boat info here
      // For now, just set a mock boat
      updateBoat({
        name: 'My Boat',
        type: boatTypes[Math.floor(Math.random() * boatTypes.length)],
        length: 24,
        capacity: 8,
        photoUrl: 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000',
      });
      
      setOnboarded(true);
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Skip to the last step
    flatListRef.current?.scrollToIndex({
      index: onboardingSteps.length - 1,
      animated: true,
    });
    setCurrentIndex(onboardingSteps.length - 1);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < onboardingSteps.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={({ item }) => <OnboardingStep step={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
      
      <View style={styles.footer}>
        <ProgressDots 
          total={onboardingSteps.length} 
          current={currentIndex} 
        />
        
        <View style={styles.buttonContainer}>
          {currentIndex < onboardingSteps.length - 1 && (
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="text"
              size="medium"
            />
          )}
          
          <Button
            title={currentIndex === onboardingSteps.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            variant="primary"
            size="large"
            gradient
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  nextButton: {
    flex: 1,
  },
});