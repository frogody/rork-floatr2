import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { useSwipeStore } from '@/store/swipeStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Filter, Bell, Search } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function DiscoverScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { 
    crews, 
    currentIndex, 
    isLoading, 
    fetchCrews, 
    likeCrewAtIndex, 
    dislikeCrewAtIndex,
    superlikeCrewAtIndex,
    undoLastAction
  } = useSwipeStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCrews();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCrews();
    setRefreshing(false);
  };

  const handleLike = () => {
    if (currentIndex < crews.length) {
      likeCrewAtIndex(currentIndex);
      showToast({
        type: 'success',
        message: 'Liked crew!',
        duration: 2000
      });
    }
  };

  const handleDislike = () => {
    if (currentIndex < crews.length) {
      dislikeCrewAtIndex(currentIndex);
    }
  };

  const handleSuperlike = () => {
    if (currentIndex < crews.length) {
      superlikeCrewAtIndex(currentIndex);
      showToast({
        type: 'boost',
        message: 'Super liked crew!',
        duration: 2000
      });
    }
  };

  const handleUndo = () => {
    undoLastAction();
    showToast({
      type: 'info',
      message: 'Action undone',
      duration: 2000
    });
  };

  const handleOpenFilters = () => {
    // Open filter modal
    showToast({
      type: 'info',
      message: 'Filters coming soon',
      duration: 2000
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No more crews</Text>
      <Text style={styles.emptySubtitle}>Check back later or expand your search criteria</Text>
      <Button 
        title="Refresh" 
        onPress={handleRefresh} 
        variant="primary"
        style={styles.refreshButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerTitle: "Discover Crews",
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                icon={<Bell size={22} color={colors.text.primary} />}
                onPress={() => {}}
                variant="ghost"
                style={styles.iconButton}
              />
              <Button
                icon={<Filter size={22} color={colors.text.primary} />}
                onPress={handleOpenFilters}
                variant="ghost"
                style={styles.iconButton}
              />
            </View>
          ),
        }}
      />
      
      <StatusBar style="light" />
      
      {isLoading ? (
        <SkeletonLoader type="card" />
      ) : crews.length === 0 ? (
        renderEmptyState()
      ) : (
        <View style={styles.content}>
          <FlatList
            data={[crews[currentIndex]]}
            keyExtractor={(item) => item?.id || 'empty'}
            renderItem={({ item }) => item && <CrewCard crew={item} />}
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
          
          <SwipeButtons
            onLike={handleLike}
            onDislike={handleDislike}
            onSuperlike={handleSuperlike}
            onUndo={handleUndo}
            canUndo={currentIndex > 0}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 8,
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
  refreshButton: {
    minWidth: 120,
  },
});