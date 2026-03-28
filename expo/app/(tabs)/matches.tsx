import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, MessageCircle, Star, Users, MapPin } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

interface Match {
  id: string;
  crew: {
    id: string;
    name: string;
    imageUrl: string;
    memberCount: number;
    distance: number;
    verified: boolean;
  };
  matchedAt: Date;
  hasUnreadMessages: boolean;
  lastMessage?: string;
}

// Generate mock matches from crews
const generateMockMatches = (): Match[] => {
  return mockCrews.slice(0, 8).map((crew, index) => ({
    id: `match-${crew.id}`,
    crew: {
      id: crew.id,
      name: crew.name,
      imageUrl: crew.imageUrl,
      memberCount: crew.memberCount,
      distance: crew.distance,
      verified: crew.verified || false,
    },
    matchedAt: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)), // Stagger dates
    hasUnreadMessages: index % 3 === 0, // Some have unread messages
    lastMessage: index % 2 === 0 ? "Hey! Want to meet up at the marina?" : undefined,
  }));
};

export default function MatchesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMatches(generateMockMatches());
      setIsLoading(false);
    }, 1000);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setMatches(generateMockMatches());
      setRefreshing(false);
    }, 2000);
  }, []);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const handleMatchPress = (match: Match) => {
    router.push(`/crew/${match.crew.id}`);
  };

  const handleChatPress = (match: Match) => {
    router.push(`/chat/${match.crew.id}`);
  };

  const renderMatch = ({ item: match }: { item: Match }) => (
    <TouchableOpacity 
      style={[styles.matchCard, { backgroundColor: colors.surface.primary }]}
      onPress={() => handleMatchPress(match)}
    >
      <View style={styles.matchHeader}>
        <Image source={{ uri: match.crew.imageUrl }} style={styles.crewImage} />
        
        <View style={styles.matchInfo}>
          <View style={styles.nameContainer}>
            <Text style={[styles.crewName, { color: colors.text.primary }]}>
              {match.crew.name}
            </Text>
            {match.crew.verified && (
              <Star size={14} color={colors.primary} fill={colors.primary} />
            )}
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Users size={12} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {match.crew.memberCount} members
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={12} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {match.crew.distance} mi away
              </Text>
            </View>
          </View>
          
          <Text style={[styles.matchTime, { color: colors.text.secondary }]}>
            Matched {getTimeAgo(match.matchedAt)}
          </Text>
          
          {match.lastMessage && (
            <Text 
              style={[styles.lastMessage, { color: colors.text.secondary }]} 
              numberOfLines={1}
            >
              {match.lastMessage}
            </Text>
          )}
        </View>

        {match.hasUnreadMessages && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]} />
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
          onPress={() => handleMatchPress(match)}
        >
          <Heart size={16} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>
            View Profile
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => handleChatPress(match)}
        >
          <MessageCircle size={16} color={colors.text.primary} />
          <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>
            Message
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
          Loading your matches...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Your Matches',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {matches.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: colors.background.primary }]}>
          <Heart size={64} color={colors.text.secondary} />
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
            No matches yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
            Start swiping to find crews you would like to connect with
          </Text>
          <TouchableOpacity 
            style={[styles.startMatchingButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/match')}
          >
            <Text style={[styles.startMatchingText, { color: colors.text.primary }]}>
              Start Matching
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  matchCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  matchHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    position: 'relative',
  },
  crewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  matchInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  crewName: {
    fontSize: 18,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  matchTime: {
    fontSize: 12,
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  primaryButton: {
    // Additional styles for primary button
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  startMatchingButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startMatchingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});