import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Image,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
import { getColors } from '@/constants/colors';

export default function DiscoveryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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
    {
      id: '4',
      name: 'Marina Masters',
      distance: '3.1 mi',
      status: 'anchored',
      photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400',
      crewSize: 5,
    },
    {
      id: '5',
      name: 'Coastal Cruisers',
      distance: '0.5 mi',
      status: 'moving',
      photoUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=400',
      crewSize: 2,
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

  const filteredCrews = nearbyCrews.filter(crew => {
    if (selectedFilter === 'all') return true;
    return crew.status === selectedFilter;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Discover</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Find crews near you</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.surface.primary }]}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search crews, boats, locations..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface.primary }]}>
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
              style={[
                styles.filterTab, 
                { backgroundColor: isSelected ? colors.primary : colors.surface.primary }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <IconComponent 
                size={18} 
                color={isSelected ? colors.text.primary : colors.text.secondary} 
              />
              <Text style={[
                styles.filterTabText, 
                { color: isSelected ? colors.text.primary : colors.text.secondary }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {filteredCrews.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              {selectedFilter === 'all' ? 'Nearby' : selectedFilter}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Anchored</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Marinas</Text>
          </View>
        </View>
      </View>

      {/* Crew List */}
      <ScrollView style={styles.crewList} showsVerticalScrollIndicator={false}>
        <View style={styles.crewListContent}>
          {filteredCrews.map((crew) => (
            <TouchableOpacity key={crew.id} style={[styles.crewCard, { backgroundColor: colors.surface.primary }]}>
              <Image source={{ uri: crew.photoUrl }} style={styles.crewImage} />
              <View style={styles.crewInfo}>
                <View style={styles.crewHeader}>
                  <Text style={[styles.crewName, { color: colors.text.primary }]}>{crew.name}</Text>
                  <Text style={[styles.crewDistance, { color: colors.text.secondary }]}>{crew.distance}</Text>
                </View>
                <View style={styles.crewDetails}>
                  <View style={styles.crewStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(crew.status) }]} />
                    <Text style={[styles.statusText, { color: colors.text.secondary }]}>{crew.status}</Text>
                  </View>
                  <Text style={[styles.crewSizeText, { color: colors.text.secondary }]}>{crew.crewSize} crew</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}>
                <Compass size={16} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Popular Spots</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Discover trending locations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}>
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <Waves size={24} color={colors.accent} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Weather</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Check conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
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
  filterButton: {
    width: 48,
    height: 48,
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
    borderRadius: 20,
    gap: 8,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    flexDirection: 'row',
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
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  crewList: {
    flex: 1,
  },
  crewListContent: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  crewCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  crewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  crewInfo: {
    flex: 1,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
  },
  crewDistance: {
    fontSize: 14,
  },
  crewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crewStatus: {
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
    textTransform: 'capitalize',
  },
  crewSizeText: {
    fontSize: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
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
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});