import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';
import { useMatchStore } from '@/store/matchStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Search, Plus } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { formatDistanceToNow } from '@/utils/dateUtils';

export default function ChatScreen() {
  const router = useRouter();
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

  const renderChatItem = ({ item }) => {
    const timeAgo = item.lastMessage?.timestamp 
      ? formatDistanceToNow(new Date(item.lastMessage.timestamp))
      : formatDistanceToNow(new Date(item.matchedAt));

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => handleChatPress(item.id)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.photoUrl }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.crewName}</Text>
            <Text style={styles.chatTime}>{timeAgo}</Text>
          </View>
          <Text 
            style={styles.chatPreview}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage?.content || "You matched with this crew!"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No messages yet</Text>
      <Text style={styles.emptySubtitle}>
        When you match with other crews, you'll be able to message them here
      </Text>
      <Button 
        title="Discover Crews" 
        onPress={() => router.push('/(tabs)/')}
        variant="primary"
        style={styles.discoverButton}
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
              <Button
                icon={<Search size={22} color={colors.text.primary} />}
                onPress={() => {}}
                variant="ghost"
                style={styles.iconButton}
              />
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
          renderItem={renderChatItem}
          contentContainerStyle={matches.length === 0 ? styles.emptyList : styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
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
  },
  iconButton: {
    marginLeft: 8,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  chatInfo: {
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
    color: colors.text.tertiary,
  },
  chatPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  discoverButton: {
    minWidth: 160,
  },
});