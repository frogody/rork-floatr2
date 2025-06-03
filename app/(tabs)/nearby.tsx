import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { 
  MapPin, 
  Filter, 
  Navigation, 
  Users,
  Anchor,
  Waves,
  Settings
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [sortBy, setSortBy] = useState('distance');

  const radiusOptions = [1, 2, 5, 10, 25];
  const sortOptions = [
    { id: 'distance', label: 'Distance', icon: MapPin },
    { id: 'members', label: 'Crew Size', icon: Users },
    { id: 'activity', label: 'Activity', icon: Waves },
  ];

  const nearbyCrews = mockCrews
    .filter(crew => crew.distance <= selectedRadius)
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'members':
          return b.memberCount - a.memberCount;
        case 'activity':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return 0;
      }
    });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCrewPress = (crewId: string) => {
    router.push(`/crew/${crewId}`);
  };

  const handleMapPress = () => {
    router.push('/map');
  };

  const handleFiltersPress = () => {
    router.push('/filters');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen 
        options={{ 
          title: 'Nearby',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleMapPress}
              >
                <Navigation size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleFiltersPress}
              >
                <Filter size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Radius Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Search Radius</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.radiusContainer}>
            {radiusOptions.map((radius) => (
              <TouchableOpacity
                key={radius}
                style={[
                  styles.radiusOption,
                  { 
                    backgroundColor: selectedRadius === radius ? colors.primary : colors.surface.primary,
                  }
                ]}
                onPress={() => setSelectedRadius(radius)}
              >
                <Text style={[
                  styles.radiusText,
                  { 
                    color: selectedRadius === radius ? colors.text.primary : colors.text.secondary,
                  }
                ]}>
                  {radius} mi
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sort Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Sort By</Text>
          <View style={styles.sortContainer}>
            {sortOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = sortBy === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    { 
                      backgroundColor: isSelected ? colors.primary : colors.surface.primary,
                    }
                  ]}
                  onPress={() => setSortBy(option.id)}
                >
                  <IconComponent 
                    size={16} 
                    color={isSelected ? colors.text.primary : colors.text.secondary} 
                  />
                  <Text style={[
                    styles.sortText,
                    { 
                      color: isSelected ? colors.text.primary : colors.text.secondary,
                    }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {nearbyCrews.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Crews Found
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {nearbyCrews.filter(crew => crew.isActive).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Active Now
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {selectedRadius}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Mile Radius
            </Text>
          </View>
        </View>

        {/* Crews List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Nearby Crews ({nearbyCrews.length})
          </Text>
          
          {nearbyCrews.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface.primary }]}>
              <MapPin size={48} color={colors.text.secondary} />
              <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
                No crews found
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
                Try increasing your search radius or check back later
              </Text>
            </View>
          ) : (
            <View style={styles.crewsList}>
              {nearbyCrews.map((crew) => (
                <TouchableOpacity
                  key={crew.id}
                  style={[styles.crewCard, { backgroundColor: colors.surface.primary }]}
                  onPress={() => handleCrewPress(crew.id)}
                >
                  <View style={styles.crewHeader}>
                    <View style={styles.crewInfo}>
                      <Text style={[styles.crewName, { color: colors.text.primary }]}>
                        {crew.name}
                      </Text>
                      <View style={styles.crewMeta}>
                        <View style={styles.metaItem}>
                          <MapPin size={12} color={colors.text.secondary} />
                          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                            {crew.distance} mi
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Users size={12} color={colors.text.secondary} />
                          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                            {crew.memberCount}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <View style={[
                            styles.statusDot, 
                            { backgroundColor: crew.isActive ? colors.success : colors.text.secondary }
                          ]} />
                          <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                            {crew.isActive ? 'Active' : 'Offline'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
                      onPress={() => handleCrewPress(crew.id)}
                    >
                      <Anchor size={16} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                  
                  <Text style={[styles.crewDescription, { color: colors.text.secondary }]} numberOfLines={2}>
                    {crew.description}
                  </Text>
                  
                  <View style={styles.tagsContainer}>
                    {crew.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                        <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  radiusContainer: {
    flexDirection: 'row',
  },
  radiusOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
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
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  crewsList: {
    gap: 12,
  },
  crewCard: {
    borderRadius: 16,
    padding: 16,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  crewMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});