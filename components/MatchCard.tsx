import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Match } from '@/types';
import colors from '@/constants/colors';
import { MapPin, MessageCircle } from 'lucide-react-native';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

export default function MatchCard({ match, onPress }: MatchCardProps) {
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

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: match.photoUrl }} style={styles.image} />
      
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
            <Text style={styles.newMatch}>New Match!</Text>
          )}
        </View>
      </View>
      
      <Text style={styles.time}>{getTimeSince(match.matchedAt)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
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
  newMatch: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 8,
  },
});