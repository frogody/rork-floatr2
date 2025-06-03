import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, MessageCircle, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import { MatchCard } from '@/components/MatchCard';
import { useMatchStore } from '@/store/matchStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function MatchesScreen() {
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

  const handleMatchPress = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  const handleWhoLikedYou = () => {
    router.push('/who-liked-you');
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No matches yet</Text>
      <Text style={styles.emptySubtitle}>
        Keep swiping to find crews you'd like to raft up with
      </Text>
      <Button 
        title="Start Swiping" 
        onPress={() => router.push('/(tabs)/')} 
        variant="primary"
        style={styles.emptyButton}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.whoLikedCard} onPress={handleWhoLikedYou}>
        <View style={styles.whoLikedContent}>
          <Star size={24} color={colors.secondary} />
          <View style={styles.whoLikedText}>
            <Text style={styles.whoLikedTitle}>See who likes you</Text>
            <Text style={styles.whoLikedSubtitle}>Upgrade to Premium</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: "Matches",
          headerRight: () => (
            <TouchableOpacity onPress={() => showToast({ type: 'info', message: 'Filter coming soon' })}>
              <MessageCircle size={22} color={colors.text.primary} />
            </TouchableOpacity>
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
            <MatchCard 
              match={item} 
              onPress={() => handleMatchPress(item.id)}
            />
          )}
          ListHeaderComponent={renderHeader}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  whoLikedCard: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  whoLikedContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whoLikedText: {
    marginLeft: 16,
    flex: 1,
  },
  whoLikedTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  whoLikedSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.secondary,
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