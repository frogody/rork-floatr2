import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image
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
}

const ChatListItem: React.FC<ChatListItemProps> = ({ match, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress}>
      <Image source={{ uri: match.photoUrl }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{match.crewName}</Text>
          <Text style={styles.chatTime}>
            {match.lastMessage ? formatTime(match.lastMessage.timestamp) : ''}
          </Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {match.lastMessage?.content || 'Say hello!'}
        </Text>
        <Text style={styles.chatLocation}>{match.location}</Text>
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
  const { showToast } = useToast();
  const { matches, isLoading, fetchMatches } = useMatchStore();
  const [refreshing, setRefreshing] = useState(false);

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
      <MessageCircle size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: "Messages",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleSearch} style={styles.headerButton}>
                <Search size={22} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => showToast({ type: 'info', message: 'Options coming soon' })} style={styles.headerButton}>
                <MoreVertical size={22} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <StatusBar style="light" />
      
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
    backgroundColor: colors.background.primary,
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
    borderBottomColor: colors.border.primary,
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
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
  chatMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  chatLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.tertiary,
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
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
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
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 140,
  },
});