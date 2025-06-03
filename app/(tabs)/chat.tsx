import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  Image,
  useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle, Search, MoreVertical } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useMatchStore } from '@/store/matchStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';
import { Match } from '@/types';

interface ChatListItemProps {
  match: Match;
  onPress: () => void;
  isDark: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ match, onPress, isDark }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'now';
    }
  };

  const currentColors = isDark ? colors : colors.light;

  return (
    <TouchableOpacity 
      style={[styles.chatItem, { borderBottomColor: currentColors.border.primary }]} 
      onPress={onPress}
    >
      <Image source={{ uri: match.photoUrl }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: currentColors.text.primary }]}>
            {match.crewName}
          </Text>
          <Text style={[styles.chatTime, { color: currentColors.text.secondary }]}>
            {match.lastMessage ? formatTime(match.lastMessage.timestamp) : ''}
          </Text>
        </View>
        <Text style={[styles.chatMessage, { color: currentColors.text.secondary }]} numberOfLines={1}>
          {match.lastMessage?.content || 'Say hello!'}
        </Text>
        <Text style={[styles.chatLocation, { color: currentColors.text.tertiary }]}>
          {match.location}
        </Text>
      </View>
      {match.unreadCount && match.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{match.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { showToast } = useToast();
  const { matches, isLoading, fetchMatches } = useMatchStore();
  const [refreshing, setRefreshing] = useState(false);

  const currentColors = isDark ? colors : colors.light;

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleChatPress = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  const handleSearch = () => {
    showToast({
      type: 'info',
      message: 'Search coming soon',
      duration: 2000
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MessageCircle size={64} color={currentColors.text.tertiary} />
      <Text style={[styles.emptyTitle, { color: currentColors.text.primary }]}>
        No conversations yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: currentColors.text.secondary }]}>
        Start matching with crews to begin chatting
      </Text>
      <Button 
        title="Find Crews" 
        onPress={() => router.push('/(tabs)/')} 
        variant="primary"
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: currentColors.background.primary }]} 
      edges={['bottom']}
    >
      <Stack.Screen
        options={{
          headerTitle: "Messages",
          headerStyle: {
            backgroundColor: currentColors.background.primary,
          },
          headerTintColor: currentColors.text.primary,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleSearch} style={styles.headerButton}>
                <Search size={22} color={currentColors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => showToast({ type: 'info', message: 'Options coming soon' })} 
                style={styles.headerButton}
              >
                <MoreVertical size={22} color={currentColors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {isLoading ? (
        <SkeletonLoader type="list" />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem 
              match={item} 
              onPress={() => handleChatPress(item.id)}
              isDark={isDark}
            />
          )}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    fontSize: 12,
  },
  chatMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  chatLocation: {
    fontSize: 12,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 140,
  },
});