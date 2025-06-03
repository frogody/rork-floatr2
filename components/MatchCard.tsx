import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Match } from '@/types';
import colors from '@/constants/colors';
import { MapPin, MessageCircle, Sparkles } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

export default function MatchCard({ match, onPress }: MatchCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Subtle glow animation for new matches
    if (!match.lastMessage) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [match.lastMessage]);

  // Format the time since match
  const getTimeSince = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return `${diffMins}m`;
  };

  const handlePress = async () => {
    // Enhanced press animation
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 400,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress();
  };

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
        {/* Glow effect for new matches */}
        {!match.lastMessage && (
          <Animated.View
            style={[
              styles.glowOverlay,
              { opacity: glowOpacity }
            ]}
          />
        )}
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: match.photoUrl }} style={styles.image} />
          {!match.lastMessage && (
            <View style={styles.newMatchBadge}>
              <Sparkles size={12} color={colors.text.primary} />
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View>
            <Text style={styles.name}>{match.crewName}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={12} color={colors.text.secondary} />
              <Text style={styles.location}>{match.location}</Text>
            </View>
          </View>
          
          <View style={styles.messageContainer}>
            {match.lastMessage ? (
              <>
                <MessageCircle size={12} color={colors.text.secondary} />
                <Text style={styles.message} numberOfLines={1}>
                  {match.lastMessage.content}
                </Text>
              </>
            ) : (
              <View style={styles.newMatchContainer}>
                <Text style={styles.newMatch}>New Match!</Text>
                <Sparkles size={14} color={colors.secondary} />
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{getTimeSince(match.matchedAt)}</Text>
          {match.unreadCount && match.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {match.unreadCount > 9 ? '9+' : match.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondary,
    borderRadius: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  newMatchBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.card,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  newMatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newMatch: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  timeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  unreadBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.primary,
  },
});