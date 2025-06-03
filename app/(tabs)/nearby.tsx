import React, { useState, useEffect } from 'react';
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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MapPin, Filter, Users, Anchor, Navigation2 } from 'lucide-react-native';
import colors from '@/constants/colors';

interface NearbyCrew {
  id: string;
  name: string;
  distance: string;
  status: 'anchored' | 'moving' | 'docked';
  photoUrl: string;
  crewSize: number;
  boatType: string;
  location: string;
}

const mockNearbyCrews: NearbyCrew[] = [
  {
    id: '1',
    name: 'Sunset Sailors',
    distance: '1.2 mi',
    status: 'anchored',
    photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400',
    crewSize: 4,
    boatType: 'Sailboat',
    location: 'Marina Bay',
  },
  {
    id: '2',
    name: 'Ocean Explorers',
    distance: '2.8 mi',
    status: 'moving',
    photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400',
    crewSize: 6,
    boatType: 'Motor Yacht',
    location: 'Open Water',
  },
  {
    id: '3',
    name: 'Bay Cruisers',
    distance: '0.8 mi',
    status: 'docked',
    photoUrl: 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=400',
    crewSize: 3,
    boatType: 'Center Console',
    location: 'Harbor Point',
  },
];

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const currentColors = isDark ? colors : colors.light;
  
  const [filteredCrews, setFilteredCrews] = useState<NearbyCrew[]>(mockNearbyCrews);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'anchored', label: 'Anchored', icon: Anchor },
    { id: 'moving', label: 'Moving', icon: Navigation2 },
    { id: 'docked', label: 'Docked', icon: MapPin },
  ];

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredCrews(mockNearbyCrews);
    } else {
      setFilteredCrews(mockNearbyCrews.filter(crew => crew.status === selectedFilter));
    }
  }, [selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'anchored': return colors.accent;
      case 'moving': return colors.primary;
      case 'docked': return colors.secondary;
      default: return currentColors.text.secondary;
    }
  };

  const renderCrewItem = ({ item }: { item: NearbyCrew }) => (
    <TouchableOpacity style={[styles.crewCard, { backgroundColor: currentColors.background.card }]}>
      <Image source={{ uri: item.photoUrl }} style={styles.crewImage} />
      <View style={styles.crewInfo}>
        <View style={styles.crewHeader}>
          <Text style={[styles.crewName, { color: currentColors.text.primary }]}>
            {item.name}
          </Text>
          <Text style={[styles.crewDistance, { color: currentColors.text.secondary }]}>
            {item.distance}
          </Text>
        </View>
        <Text style={[styles.crewLocation, { color: currentColors.text.secondary }]}>
          {item.location}
        </Text>
        <View style={styles.crewDetails}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: currentColors.text.secondary }]}>
              {item.status}
            </Text>
          </View>
          <Text style={[styles.crewSize, { color: currentColors.text.secondary }]}>
            {item.crewSize} crew • {item.boatType}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: currentColors.background.primary }]} 
      edges={['bottom']}
    >
      <Stack.Screen
        options={{
          headerTitle: "Nearby Crews",
          headerStyle: {
            backgroundColor: currentColors.background.primary,
          },
          headerTintColor: currentColors.text.primary,
          headerRight: () => (
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={22} color={currentColors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Filter Tabs */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filtersContent}
          renderItem={({ item }) => {
            const IconComponent = item.icon;
            const isSelected = selectedFilter === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  { backgroundColor: currentColors.background.card },
                  isSelected && { backgroundColor: colors.primary }
                ]}
                onPress={() => setSelectedFilter(item.id)}
              >
                <IconComponent 
                  size={18} 
                  color={isSelected ? colors.text.primary : currentColors.text.secondary} 
                />
                <Text style={[
                  styles.filterTabText,
                  { color: isSelected ? colors.text.primary : currentColors.text.secondary }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Stats */}
      <View style={[styles.statsContainer, { backgroundColor: currentColors.background.card }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: currentColors.text.primary }]}>
            {filteredCrews?.length || 0}
          </Text>
          <Text style={[styles.statLabel, { color: currentColors.text.secondary }]}>
            {filteredCrews?.length === 1 ? 'crew found' : 'crews found'}
          </Text>
        </View>
      </View>

      {/* Crew List */}
      <FlatList
        data={filteredCrews}
        keyExtractor={(item) => item.id}
        renderItem={renderCrewItem}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButton: {
    padding: 4,
  },
  filtersContainer: {
    paddingVertical: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  crewCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
  },
  crewDistance: {
    fontSize: 14,
  },
  crewLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  crewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
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
  crewSize: {
    fontSize: 12,
  },
});