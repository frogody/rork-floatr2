import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crew } from '@/types';
import colors from '@/constants/colors';
import { MapPin, Users, Ruler, Ship } from 'lucide-react-native';

interface CrewCardProps {
  crew: Crew;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function CrewCard({ crew, onPress }: CrewCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Subtle shimmer effect for premium feel
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const shimmerTranslateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable 
        onPress={onPress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}
      >
        <Image 
          source={{ uri: crew.photoUrls?.[0] || crew.photoUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Shimmer overlay for premium effect */}
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslateX }],
            },
          ]}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <Text style={styles.name}>{crew.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.text.primary} />
                <Text style={styles.location}>{crew.location} • {crew.distance} mi</Text>
              </View>
            </View>
            
            <Text style={styles.bio} numberOfLines={2}>
              {crew.bio || crew.description}
            </Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detail}>
                <Users size={14} color={colors.text.primary} />
                <Text style={styles.detailText}>
                  {crew.memberCount || crew.crewSize} crew
                </Text>
              </View>
              <View style={styles.detail}>
                <Ship size={14} color={colors.text.primary} />
                <Text style={styles.detailText}>{crew.boatType}</Text>
              </View>
              <View style={styles.detail}>
                <Ruler size={14} color={colors.text.primary} />
                <Text style={styles.detailText}>{crew.boatLength}ft</Text>
              </View>
            </View>
            
            <View style={styles.tagsContainer}>
              {crew.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  infoContainer: {
    gap: 8,
  },
  header: {
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  bio: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.9,
    marginBottom: 8,
    lineHeight: 22,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tagText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
});