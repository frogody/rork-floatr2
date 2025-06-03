import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { 
  MapPin, 
  Users, 
  Star, 
  Navigation2,
  Anchor,
  Waves
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Ensure mockCrews is always an array
  const safeCrews = Array.isArray(mockCrews) ? mockCrews : [];

  const filters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'anchored', label: 'Anchored', icon: Anchor },
    { id: 'moving', label: 'Moving', icon: Navigation2 },
    { id: 'nearby', label: 'Nearby', icon: MapPin },
  ];

  const filteredCrews = safeCrews.filter(crew => {
    switch (selectedFilter) {
      case 'active':
        return crew.isActive;
      case 'nearby':
        return crew.distance < 2;
      case 'verified':
        return crew.verified;
      case 'anchored':
        return !crew.isActive; // Assuming non-active crews are anchored
      case 'moving':
        return crew.isActive; // Assuming active crews are moving
      default:
        return true;
    }
  }).sort((a, b) => a.distance - b.distance);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? colors.success : colors.text.secondary;
  };

  const getTimeAgo = (lastActive: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleCrewPress = (crewId: string) => {
    router.push(`/crew/${crewId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Nearby Crews</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            {filteredCrews.length} crews found
          </Text>
        </View>
      </View>

      {/* Compact Filter Tabs */}
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
                { 
                  backgroundColor: isSelected ? colors.primary : colors.surface.primary,
                  borderColor: isSelected ? colors.primary : colors.border.primary,
                }
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <IconComponent 
                size={12} 
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

      {/* Crew List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.crewList}>
          {filteredCrews.map((crew) => (
            <TouchableOpacity 
              key={crew.id} 
              style={[styles.crewCard, { backgroundColor: colors.surface.primary }]}
              onPress={() => handleCrewPress(crew.id)}
            >
              <Image source={{ uri: crew.imageUrl }} style={styles.crewImage} />
              
              <View style={styles.crewInfo}>
                <View style={styles.crewHeader}>
                  <View style={styles.crewNameContainer}>
                    <Text style={[styles.crewName, { color: colors.text.primary }]}>
                      {crew.name}
                    </Text>
                    {crew.verified && (
                      <Star size={14} color={colors.primary} fill={colors.primary} />
                    )}
                  </View>
                  <Text style={[styles.crewDistance, { color: colors.text.secondary }]}>
                    {crew.distance} mi
                  </Text>
                </View>

                <View style={styles.crewMeta}>
                  <View style={styles.metaItem}>
                    <Anchor size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {crew.boatType || 'Boat'}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {crew.memberCount}
                    </Text>
                  </View>
                </View>

                <View style={styles.crewStatus}>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(crew.isActive) }]} />
                    <Text style={[styles.statusText, { color: colors.text.secondary }]}>
                      {crew.isActive ? 'Active now' : getTimeAgo(crew.lastActive)}
                    </Text>
                  </View>
                  {crew.location && (
                    <View style={styles.locationContainer}>
                      <MapPin size={12} color={colors.text.secondary} />
                      <Text style={[styles.locationText, { color: colors.text.secondary }]}>
                        {crew.location}
                      </Text>
                    </View>
                  )}
                </View>

                <Text 
                  style={[styles.crewDescription, { color: colors.text.secondary }]} 
                  numberOfLines={2}
                >
                  {crew.description}
                </Text>

                {/* Tags */}
                <View style={styles.tagsContainer}>
                  {crew.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
                onPress={() => handleCrewPress(crew.id)}
              >
                <Navigation2 size={16} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        {filteredCrews.length === 0 && (
          <View style={styles.emptyState}>
            <Waves size={48} color={colors.text.secondary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>
              No crews found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.text.secondary }]}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 6,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  crewList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  crewCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  crewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  crewInfo: {
    flex: 1,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  crewNameContainer: {
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
  crewDistance: {
    fontSize: 12,
    fontWeight: '500',
  },
  crewMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  crewStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  crewDescription: {
    fontSize: 14,
    lineHeight: 18,
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
    fontSize: 10,
    fontWeight: '500',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    lineHeight: 20,
  },
});