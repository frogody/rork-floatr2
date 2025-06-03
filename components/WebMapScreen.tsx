import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { MapPin, Navigation, Users, Filter, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';
import { Button } from '@/components/Button';

interface CrewWithDistance {
  id: string;
  name: string;
  description: string;
  distance: number;
  members: number;
  isOnline: boolean;
}

export default function WebMapScreen(): React.ReactElement {
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'members'>('distance');

  const crewsWithData = useMemo((): CrewWithDistance[] => {
    return mockCrews.map((crew) => ({
      ...crew,
      distance: Math.floor(Math.random() * 10 + 1),
      members: Math.floor(Math.random() * 25 + 5),
      isOnline: Math.random() > 0.3,
    }));
  }, []);

  const sortedCrews = useMemo(() => {
    return [...crewsWithData].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      return b.members - a.members;
    });
  }, [crewsWithData, sortBy]);

  const handleCrewPress = (crewId: string) => {
    setSelectedCrew(selectedCrew === crewId ? null : crewId);
  };

  const handleConnect = (crewId: string, crewName: string) => {
    console.log('Connecting to crew:', crewId, crewName);
    // Here you would implement the connection logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <MapPin size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Nearby Crews</Text>
        <Text style={styles.subtitle}>
          Interactive map is available on mobile. Here are crews in your area:
        </Text>
        
        <View style={styles.controls}>
          <View style={styles.sortButtons}>
            <Pressable
              style={[
                styles.sortButton,
                sortBy === 'distance' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('distance')}
            >
              <Navigation size={16} color={sortBy === 'distance' ? colors.text.primary : colors.text.secondary} />
              <Text style={[
                styles.sortButtonText,
                sortBy === 'distance' && styles.sortButtonTextActive,
              ]}>
                Distance
              </Text>
            </Pressable>
            
            <Pressable
              style={[
                styles.sortButton,
                sortBy === 'members' && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy('members')}
            >
              <Users size={16} color={sortBy === 'members' ? colors.text.primary : colors.text.secondary} />
              <Text style={[
                styles.sortButtonText,
                sortBy === 'members' && styles.sortButtonTextActive,
              ]}>
                Members
              </Text>
            </Pressable>
          </View>
          
          <Button
            title="Filter"
            onPress={() => console.log('Open filter')}
            variant="outline"
            size="small"
            icon={<Filter size={16} color={colors.primary} />}
            style={styles.filterButton}
          />
        </View>
      </View>
      
      <ScrollView 
        style={styles.crewList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.crewListContent}
      >
        {sortedCrews.map((crew) => (
          <Pressable
            key={crew.id}
            style={[
              styles.crewCard,
              selectedCrew === crew.id && styles.crewCardSelected,
            ]}
            onPress={() => handleCrewPress(crew.id)}
            accessibilityRole="button"
            accessibilityLabel={`${crew.name} crew, ${crew.distance} miles away, ${crew.members} members`}
          >
            <View style={styles.crewHeader}>
              <View style={styles.crewInfo}>
                <View style={styles.crewNameRow}>
                  <Text style={styles.crewName}>{crew.name}</Text>
                  {crew.isOnline && <View style={styles.onlineIndicator} />}
                </View>
                <Text style={styles.crewDescription}>{crew.description}</Text>
              </View>
              
              <View style={styles.locationBadge}>
                <Navigation size={14} color={colors.primary} />
                <Text style={styles.distance}>{crew.distance} mi</Text>
              </View>
            </View>
            
            <View style={styles.crewStats}>
              <View style={styles.stat}>
                <Users size={16} color={colors.text.secondary} />
                <Text style={styles.statText}>{crew.members} members</Text>
              </View>
              
              <Text style={styles.statusText}>
                {crew.isOnline ? 'Active now' : 'Last seen recently'}
              </Text>
            </View>
            
            {selectedCrew === crew.id && (
              <View style={styles.crewActions}>
                <Button
                  title="Connect"
                  onPress={() => handleConnect(crew.id, crew.name)}
                  variant="primary"
                  size="small"
                  style={styles.connectButton}
                />
                <Button
                  title="View Profile"
                  onPress={() => console.log('View profile:', crew.id)}
                  variant="outline"
                  size="small"
                  style={styles.profileButton}
                />
              </View>
            )}
          </Pressable>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {sortedCrews.length} crews found in your area
          </Text>
          <Button
            title="Refresh Location"
            onPress={() => console.log('Refresh location')}
            variant="ghost"
            size="small"
            icon={<Search size={16} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sortButtons: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    padding: 2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  sortButtonTextActive: {
    color: colors.text.primary,
  },
  filterButton: {
    minWidth: 80,
  },
  crewList: {
    flex: 1,
  },
  crewListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  crewCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  crewCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  crewInfo: {
    flex: 1,
    marginRight: 12,
  },
  crewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  crewName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
  },
  crewDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  crewStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  crewActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  connectButton: {
    flex: 1,
  },
  profileButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 12,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});