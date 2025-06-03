import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { MapPin, Anchor, Users } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

interface CrewCardProps {
  crew: {
    id: string;
    name: string;
    age: number;
    location: string;
    bio: string;
    images: string[];
    boatType: string;
    crewSize: number;
  };
  isFirst: boolean;
  swipeLeft: () => void;
  swipeRight: () => void;
}

export function CrewCard({ crew, isFirst, swipeLeft, swipeRight }: CrewCardProps) {
  const position = React.useRef(new Animated.ValueXY()).current;
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

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'right' | 'left') => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      direction === 'right' ? swipeRight() : swipeLeft();
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const renderCard = () => (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        !isFirst && { transform: [{ scale: nextCardScale }] },
      ]}
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      <Image source={{ uri: crew.images[0] }} style={styles.image} />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.info}>
          <Text style={styles.name}>{crew.name}, {crew.age}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.text.primary} />
              <Text style={styles.detailText}>{crew.location}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Anchor size={16} color={colors.text.primary} />
              <Text style={styles.detailText}>{crew.boatType}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Users size={16} color={colors.text.primary} />
              <Text style={styles.detailText}>Crew of {crew.crewSize}</Text>
            </View>
          </View>
          
          <Text style={styles.bio}>{crew.bio}</Text>
        </View>
      </LinearGradient>

      {isFirst && (
        <>
          <Animated.View
            style={[styles.likeStamp, { opacity: likeOpacity }]}
          >
            <Text style={styles.stampText}>LIKE</Text>
          </Animated.View>
          
          <Animated.View
            style={[styles.nopeStamp, { opacity: nopeOpacity }]}
          >
            <Text style={styles.stampText}>NOPE</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );

  return renderCard();
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.9,
    height: Platform.select({
      ios: SCREEN_HEIGHT * 0.7,
      android: SCREEN_HEIGHT * 0.65,
      default: SCREEN_HEIGHT * 0.6,
    }),
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  likeStamp: {
    position: 'absolute',
    top: 50,
    right: 40,
    transform: [{ rotate: '30deg' }],
    borderWidth: 4,
    borderColor: colors.status.success,
    padding: 8,
    borderRadius: 8,
  },
  nopeStamp: {
    position: 'absolute',
    top: 50,
    left: 40,
    transform: [{ rotate: '-30deg' }],
    borderWidth: 4,
    borderColor: colors.status.error,
    padding: 8,
    borderRadius: 8,
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});