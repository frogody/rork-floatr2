import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Filter, MapPin, List } from 'lucide-react-native';
import CrewCard from '@/components/CrewCard';
import Button from '@/components/Button';
import FilterModal from '@/components/FilterModal';
import WebMapScreen from '@/components/WebMapScreen';
import NativeMapScreen from '@/components/NativeMapScreen';
import { crews } from '@/mocks/crews';
import colors from '@/constants/colors';

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredCrews, setFilteredCrews] = useState(crews);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleCrewPress = (crew: any) => {
    console.log('Crew pressed:', crew.name);
  };

  const handleFilterApply = (filters: any) => {
    // Apply filters to crews
    let filtered = crews;
    
    if (filters.maxDistance) {
      filtered = filtered.filter(crew => crew.distance <= filters.maxDistance);
    }
    
    if (filters.boatTypes && filters.boatTypes.length > 0) {
      filtered = filtered.filter(crew => filters.boatTypes.includes(crew.boatType));
    }
    
    if (filters.activities && filters.activities.length > 0) {
      filtered = filtered.filter(crew => 
        crew.activities?.some((activity: string) => filters.activities.includes(activity))
      );
    }
    
    setFilteredCrews(filtered);
    setShowFilters(false);
  };

  const renderContent = () => {
    if (viewMode === 'map') {
      return Platform.OS === 'web' ? (
        <WebMapScreen crews={filteredCrews} onCrewPress={handleCrewPress} />
      ) : (
        <NativeMapScreen crews={filteredCrews} onCrewPress={handleCrewPress} />
      );
    }

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? colors.background.primary : '#ffffff' }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.primary : '#0A0A0A' }]}>
            Nearby Crews
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : '#64748B' }]}>
            {filteredCrews.length} crews found within 50km
          </Text>
        </View>

        <View style={styles.controls}>
          <Button
            title="Filters"
            onPress={() => setShowFilters(true)}
            variant="outline"
            icon={<Filter size={16} color={colors.primary} />}
            style={styles.filterButton}
          />
          <Button
            title={viewMode === 'list' ? 'Map' : 'List'}
            onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            variant="outline"
            icon={viewMode === 'list' ? 
              <MapPin size={16} color={colors.primary} /> : 
              <List size={16} color={colors.primary} />
            }
            style={styles.viewButton}
          />
        </View>

        <View style={styles.crewList}>
          {filteredCrews.map((crew, index) => (
            <CrewCard
              key={crew.id}
              crew={crew}
              onPress={() => handleCrewPress(crew)}
              style={styles.crewCard}
            />
          ))}
        </View>

        {filteredCrews.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: isDark ? colors.text.primary : '#0A0A0A' }]}>
              No crews found
            </Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? colors.text.secondary : '#64748B' }]}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              title="Filters"
              onPress={() => setShowFilters(true)}
              variant="ghost"
              icon={<Filter size={16} color={colors.primary} />}
            />
          ),
        }}
      />
      
      {renderContent()}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterApply}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  filterButton: {
    flex: 1,
  },
  viewButton: {
    flex: 1,
  },
  crewList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  crewCard: {
    marginBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});