import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { 
  Search, 
  MessageCircle, 
  Users, 
  Star,
  MoreHorizontal
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

interface ChatConversation {
  id: string;
  crew: {
    id: string;
    name: string;
    imageUrl: string;
    memberCount: number;
    verified: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: Date;
    isFromMe: boolean;
  };
  unreadCount: number;
  isOnline: boolean;
}

// Generate mock conversations from crews
const generateMockConversations = (): ChatConversation[] => {
  const messages = [
    "Hey! Want to meet up at the marina?",
    "Great sailing weather today!",
    "Thanks for the awesome day on the water",
    "Are you free this weekend?",
    "The sunset cruise was amazing!",
    "Let's plan another fishing trip",
    "Perfect conditions for wakeboarding",
    "See you at the sandbar!"
  ];

  return mockCrews.slice(0, 6).map((crew, index) => ({
    id: `chat-${crew.id}`,
    crew: {
      id: crew.id,
      name: crew.name,
      imageUrl: crew.imageUrl,
      memberCount: crew.memberCount,
      verified: crew.verified || false,
    },
    lastMessage: {
      text: messages[index % messages.length],
      timestamp: new Date(Date.now() - (index * 2 * 60 * 60 * 1000)), // Stagger times
      isFromMe: index % 3 === 0,
    },
    unreadCount: index % 4 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
    isOnline: crew.isActive,
  }));
};

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [conversations, setConversations] = useState<ChatConversation[]>(generateMockConversations());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.crew.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleConversationPress = (conversation: ChatConversation) => {
    router.push(`/chat/${conversation.crew.id}`);
  };

  const renderConversation = ({ item: conversation }: { item: ChatConversation }) => (
    <TouchableOpacity 
      style={[styles.conversationCard, { backgroundColor: colors.surface.primary }]}
      onPress={() => handleConversationPress(conversation)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: conversation.crew.imageUrl }} style={styles.avatar} />
        {conversation.isOnline && (
          <View style={[styles.onlineIndicator, { backgroundColor: colors.success }]} />
        )}
      </View>
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <View style={styles.nameContainer}>
            <Text style={[styles.crewName, { color: colors.text.primary }]}>
              {conversation.crew.name}
            </Text>
            {conversation.crew.verified && (
              <Star size={14} color={colors.primary} fill={colors.primary} />
            )}
          </View>
          <Text style={[styles.timestamp, { color: colors.text.secondary }]}>
            {getTimeAgo(conversation.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messagePreview}>
          <Text 
            style={[
              styles.lastMessage, 
              { 
                color: conversation.unreadCount > 0 ? colors.text.primary : colors.text.secondary,
                fontWeight: conversation.unreadCount > 0 ? '600' : '400'
              }
            ]} 
            numberOfLines={1}
          >
            {conversation.lastMessage.isFromMe ? 'You: ' : ''}{conversation.lastMessage.text}
          </Text>
          
          <View style={styles.messageActions}>
            {conversation.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.unreadCount, { color: colors.text.primary }]}>
                  {conversation.unreadCount}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.moreButton}>
              <MoreHorizontal size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.crewMeta}>
          <Users size={12} color={colors.text.secondary} />
          <Text style={[styles.memberCount, { color: colors.text.secondary }]}>
            {conversation.crew.memberCount} members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Messages</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
          {conversations.length} conversations
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.surface.primary }]}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search conversations..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      {filteredConversations.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color={colors.text.secondary} />
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
            {searchQuery ? 'No conversations found' : 'No messages yet'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
            {searchQuery 
              ? 'Try searching for a different crew name'
              : 'Start matching with crews to begin conversations'
            }
          </Text>
          {!searchQuery && (
            <TouchableOpacity 
              style={[styles.startMatchingButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/match')}
            >
              <Text style={[styles.startMatchingText, { color: colors.text.primary }]}>
                Start Matching
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  crewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberCount: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startMatchingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startMatchingText: {
    fontSize: 14,
    fontWeight: '600',
  },
});