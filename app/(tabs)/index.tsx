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
import { router } from 'expo-router';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Anchor, 
  Navigation2,
  Compass,
  Waves,
  TrendingUp,
  Calendar,
  Star
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function DiscoveryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [searchQuery, setSearchQuery] = useState('');

  const nearbyCrews = mockCrews.slice(0, 5).map(crew => ({
    id: crew.id,
    name: crew.name,
    distance: `${crew.distance} mi`,
    status: crew.isActive ? 'active' : 'offline',
    photoUrl: crew.imageUrl,
    crewSize: crew.memberCount,
    verified: crew.verified,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'offline': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const handleCrewPress = (crewId: string) => {
    router.push(`/crew/${crewId}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'spots':
        router.push('/spots');
        break;
      case 'weather':
        router.push('/weather');
        break;
      case 'events':
        router.push('/meetups/create');
        break;
      case 'trending':
        router.push('/(tabs)/nearby');
        break;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Discover</Text>
        <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>Find crews and experiences</Text>
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
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.surface.primary }]}
          onPress={() => router.push('/(tabs)/nearby')}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {nearbyCrews.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Nearby
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>5</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Events</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}
            onPress={() => handleQuickAction('spots')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <MapPin size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Popular Spots</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Trending locations</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}
            onPress={() => handleQuickAction('weather')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <Waves size={24} color={colors.accent} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Weather</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Check conditions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}
            onPress={() => handleQuickAction('events')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <Calendar size={24} color={colors.secondary} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Events</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Create meetups</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionCard, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/(tabs)/match')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.background.secondary }]}>
              <TrendingUp size={24} color={colors.success} />
            </View>
            <Text style={[styles.quickActionTitle, { color: colors.text.primary }]}>Match</Text>
            <Text style={[styles.quickActionSubtitle, { color: colors.text.secondary }]}>Find crews</Text>
          </TouchableOpacity>
        </View>

        {/* Crew List */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Nearby Crews</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/nearby')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.crewListContent}>
          {nearbyCrews.map((crew) => (
            <TouchableOpacity 
              key={crew.id} 
              style={[styles.crewCard, { backgroundColor: colors.surface.primary }]}
              onPress={() => handleCrewPress(crew.id)}
            >
              <Image source={{ uri: crew.photoUrl }} style={styles.crewImage} />
              <View style={styles.crewInfo}>
                <View style={styles.crewHeader}>
                  <View style={styles.crewNameContainer}>
                    <Text style={[styles.crewName, { color: colors.text.primary }]}>{crew.name}</Text>
                    {crew.verified && (
                      <Star size={14} color={colors.primary} fill={colors.primary} />
                    )}
                  </View>
                  <Text style={[styles.crewDistance, { color: colors.text.secondary }]}>{crew.distance}</Text>
                </View>
                <View style={styles.crewDetails}>
                  <View style={styles.crewStatus}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(crew.status) }]} />
                    <Text style={[styles.statusText, { color: colors.text.secondary }]}>{crew.status}</Text>
                  </View>
                  <Text style={[styles.crewSizeText, { color: colors.text.secondary }]}>{crew.crewSize} members</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}>
                <Compass size={16} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
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
  content: {
    flex: 1,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
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
  crewNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
});