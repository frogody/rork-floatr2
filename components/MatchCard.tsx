import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Match } from '@/types';
import colors from '@/constants/colors';
import { MapPin, Clock } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

export default function MatchCard({ match, onPress }: MatchCardProps) {
  const handlePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: match.photoUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{match.crewName}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={12} color={colors.text.secondary} />
            <Text style={styles.location}>{match.location}</Text>
          </View>
        </View>
        
        {match.lastMessage && (
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {typeof match.lastMessage === 'string' ? match.lastMessage : match.lastMessage.content}
            </Text>
            <View style={styles.timeContainer}>
              <Clock size={10} color={colors.text.secondary} />
              <Text style={styles.time}>
                {typeof match.lastMessage === 'string' 
                  ? formatTime(match.matchedAt)
                  : formatTime(match.lastMessage.timestamp)
                }
              </Text>
            </View>
          </View>
        )}
        
        {!match.lastMessage && (
          <Text style={styles.newMatch}>New match! Say hello 👋</Text>
        )}
      </View>
      
      <View style={styles.indicator} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 2,
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
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    marginRight: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  time: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  newMatch: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
});