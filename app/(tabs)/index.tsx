import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Anchor, 
  Navigation2,
  Compass,
  Waves
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useSwipeStore } from '@/store/swipeStore';

const { width } = Dimensions.get('window');

export default function DiscoveryScreen() {
  const { 
    crews,
    currentIndex,
    fetchCrews,
    likeCrewAtIndex,
    dislikeCrewAtIndex,
    superlikeCrewAtIndex,
    undoLastAction,
    lastAction,
    isLoading,
  } = useSwipeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNearby, setShowNearby] = useState(true);

  useEffect(() => {
    fetchCrews();
  }, [fetchCrews]);

  const filters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'anchored', label: 'Anchored', icon: Anchor },
    { id: 'moving', label: 'Moving', icon: Navigation2 },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
  ];

  const nearbyCrews = [
    {
      id: '1',
      name: 'Sunset Sailors',
      distance: '1.2 mi',
      status: 'anchored',
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400',
      crewSize: 4,
    },
    {
      id: '2',
      name: 'Ocean Explorers',
      distance: '2.8 mi',
      status: 'moving',
      photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400',
      crewSize: 6,
    },
    {
      id: '3',
      name: 'Bay Cruisers',
      distance: '0.8 mi',
      status: 'docked',
      photoUrl: 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=400',
      crewSize: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'anchored': return colors.accent;
      case 'moving': return colors.primary;
      case 'docked': return colors.secondary;
      default: return colors.text.secondary;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const currentCrew = crews[currentIndex];
  const canUndo = lastAction.type !== null && currentIndex > 0;

  if (!showNearby && !currentCrew) {
    return (
      <View style={[styles.container, styles.centered]}>
        <StatusBar style="light" />
        <Text style={styles.noMoreText}>No more crews available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSubtitle}>Find your perfect crew</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crews, boats, locations..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => {
          const IconComponent = filter.icon;
          const isSelected = selectedFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterTab, isSelected && styles.filterTabActive]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <IconComponent 
                size={18} 
                color={isSelected ? colors.text.primary : colors.text.secondary} 
              />
              <Text style={[
                styles.filterTabText, 
                isSelected && styles.filterTabTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Toggle View */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, !showNearby && styles.toggleButtonActive]}
          onPress={() => setShowNearby(false)}
        >
          <Text style={[styles.toggleText, !showNearby && styles.toggleTextActive]}>
            Swipe Mode
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, showNearby && styles.toggleButtonActive]}
          onPress={() => setShowNearby(true)}
        >
          <Text style={[styles.toggleText, showNearby && styles.toggleTextActive]}>
            Nearby List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {showNearby ? (
        <ScrollView style={styles.nearbyContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.nearbyHeader}>
            <View style={styles.nearbyStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Nearby</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Anchored</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Marinas</Text>
              </View>
            </View>
          </View>

          <View style={styles.nearbyList}>
            {nearbyCrews.map((crew) => (
              <TouchableOpacity key={crew.id} style={styles.nearbyCrewCard}>
                <Image source={{ uri: crew.photoUrl }} style={styles.nearbyCrewImage} />
                <View style={styles.nearbyCrewInfo}>
                  <View style={styles.nearbyCrewHeader}>
                    <Text style={styles.nearbyCrewName}>{crew.name}</Text>
                    <Text style={styles.nearbyCrewDistance}>{crew.distance}</Text>
                  </View>
                  <View style={styles.nearbyCrewDetails}>
                    <View style={styles.nearbyCrewStatus}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(crew.status) }]} />
                      <Text style={styles.statusText}>{crew.status}</Text>
                    </View>
                    <Text style={styles.crewSizeText}>{crew.crewSize} crew</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.nearbyActionButton}>
                  <Compass size={16} color={colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <MapPin size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionTitle}>Popular Spots</Text>
              <Text style={styles.quickActionSubtitle}>Discover trending locations</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard}>
              <View style={styles.quickActionIcon}>
                <Waves size={24} color={colors.accent} />
              </View>
              <Text style={styles.quickActionTitle}>Weather</Text>
              <Text style={styles.quickActionSubtitle}>Check conditions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.swipeContainer}>
          {currentCrew && <CrewCard crew={currentCrew} />}
          <SwipeButtons 
            onLike={() => likeCrewAtIndex(currentIndex)}
            onDislike={() => dislikeCrewAtIndex(currentIndex)}
            onSuperlike={() => superlikeCrewAtIndex(currentIndex)}
            onUndo={undoLastAction}
            canUndo={canUndo}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background.card,
    borderRadius: 20,
    gap: 8,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterTabTextActive: {
    color: colors.text.primary,
  },
  viewToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  toggleTextActive: {
    color: colors.text.primary,
  },
  nearbyContainer: {
    flex: 1,
  },
  nearbyHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nearbyStats: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  nearbyList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  nearbyCrewCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  nearbyCrewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  nearbyCrewInfo: {
    flex: 1,
  },
  nearbyCrewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nearbyCrewName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  nearbyCrewDistance: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  nearbyCrewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nearbyCrewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  crewSizeText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  nearbyActionButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  swipeContainer: {
    flex: 1,
    padding: 16,
  },
  noMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
});