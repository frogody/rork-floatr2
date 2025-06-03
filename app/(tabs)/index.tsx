import React from 'react';
import { 
  View, 
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { useSwipeStore } from '@/store/swipeStore';
import { crews } from '@/mocks/crews';

const { height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { handleLike, handlePass } = useSwipeStore();

  const handleSwipeLeft = () => {
    handlePass(crews[currentIndex].id);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = () => {
    handleLike(crews[currentIndex].id);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.cardsContainer}>
        {crews.map((crew, index) => {
          if (index < currentIndex) return null;
          
          if (index === currentIndex) {
            return (
              <CrewCard
                key={crew.id}
                crew={crew}
                isFirst={true}
                swipeLeft={handleSwipeLeft}
                swipeRight={handleSwipeRight}
              />
            );
          }
          
          if (index === currentIndex + 1) {
            return (
              <CrewCard
                key={crew.id}
                crew={crew}
                isFirst={false}
                swipeLeft={handleSwipeLeft}
                swipeRight={handleSwipeRight}
              />
            );
          }
          
          return null;
        })}
      </View>

      <SwipeButtons
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: Platform.select({
      ios: height * 0.12,
      android: height * 0.09,
      default: height * 0.08,
    }),
  },
});