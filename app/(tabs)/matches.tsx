import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useMatchStore } from '@/store/matchStore';
import MatchCard from '@/components/MatchCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import colors from '@/constants/colors';
import { Plus } from 'lucide-react-native';

export default function MatchesScreen() {
  const { matches, fetchMatches, isLoading, error } = useMatchStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const handleMatchPress = async (matchId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/chat/${matchId}`);
  };

  const handleCreatePress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would open a create group chat or invite friends modal
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Matches</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
            <Plus size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <SkeletonLoader type="list" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Matches</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
            <Plus size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Error: {error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Matches</Text>
        <TouchableOpacity style={styles.createButton} onPress={handleCreatePress}>
          <Plus size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      {matches.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No matches yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Wave at other crews to start matching and chatting
          </Text>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchCard match={item} onPress={() => handleMatchPress(item.id)} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});