import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, router } from 'expo-router';
import { 
  MapPin, 
  Star, 
  Users, 
  TrendingUp,
  Filter,
  Navigation
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

const popularSpots = [
  {
    id: '1',
    name: 'Stiltsville',
    description: 'Historic stilt houses in Biscayne Bay with crystal clear waters',
    rating: 4.8,
    reviews: 124,
    distance: 3.2,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    tags: ['Historic', 'Scenic', 'Swimming'],
    trending: true,
  },
  {
    id: '2',
    name: 'Sandbar at Haulover',
    description: 'Popular sandbar perfect for anchoring and socializing',
    rating: 4.6,
    reviews: 89,
    distance: 2.1,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    tags: ['Sandbar', 'Party', 'Shallow'],
    trending: false,
  },
  {
    id: '3',
    name: 'Key Biscayne',
    description: 'Beautiful beaches and calm waters for family fun',
    rating: 4.7,
    reviews: 156,
    distance: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['Beach', 'Family', 'Calm'],
    trending: true,
  },
  {
    id: '4',
    name: 'Nixon Sandbar',
    description: 'Secluded spot perfect for peaceful anchoring',
    rating: 4.5,
    reviews: 67,
    distance: 5.2,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    tags: ['Secluded', 'Peaceful', 'Anchoring'],
    trending: false,
  },
];

export default function SpotsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = ['all', 'trending', 'nearby', 'family', 'party'];

  const filteredSpots = popularSpots.filter(spot => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'trending') return spot.trending;
    if (selectedFilter === 'nearby') return spot.distance < 3;
    return spot.tags.some(tag => tag.toLowerCase().includes(selectedFilter));
  });

  const handleSpotPress = (spotId: string) => {
    router.push(`/spot/${spotId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen 
        options={{ 
          title: 'Popular Spots',
          headerRight: () => (
            <TouchableOpacity 
              style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
              onPress={() => router.push('/map')}
            >
              <Navigation size={18} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab, 
                { backgroundColor: selectedFilter === filter ? colors.primary : colors.surface.primary }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterTabText, 
                { color: selectedFilter === filter ? colors.text.primary : colors.text.secondary }
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {filteredSpots.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Spots Found
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              {filteredSpots.filter(spot => spot.trending).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Trending
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text.primary }]}>
              4.6
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
              Avg Rating
            </Text>
          </View>
        </View>

        {/* Spots List */}
        <View style={styles.spotsList}>
          {filteredSpots.map((spot) => (
            <TouchableOpacity
              key={spot.id}
              style={[styles.spotCard, { backgroundColor: colors.surface.primary }]}
              onPress={() => handleSpotPress(spot.id)}
            >
              <Image source={{ uri: spot.imageUrl }} style={styles.spotImage} />
              
              <View style={styles.spotContent}>
                <View style={styles.spotHeader}>
                  <View style={styles.spotTitleRow}>
                    <Text style={[styles.spotName, { color: colors.text.primary }]}>
                      {spot.name}
                    </Text>
                    {spot.trending && (
                      <View style={[styles.trendingBadge, { backgroundColor: colors.accent }]}>
                        <TrendingUp size={12} color={colors.text.primary} />
                        <Text style={[styles.trendingText, { color: colors.text.primary }]}>
                          Trending
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.spotMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={colors.accent} fill={colors.accent} />
                      <Text style={[styles.rating, { color: colors.text.primary }]}>
                        {spot.rating}
                      </Text>
                      <Text style={[styles.reviews, { color: colors.text.secondary }]}>
                        ({spot.reviews})
                      </Text>
                    </View>
                    
                    <View style={styles.distanceContainer}>
                      <MapPin size={14} color={colors.text.secondary} />
                      <Text style={[styles.distance, { color: colors.text.secondary }]}>
                        {spot.distance} mi
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={[styles.spotDescription, { color: colors.text.secondary }]} numberOfLines={2}>
                  {spot.description}
                </Text>

                <View style={styles.tagsContainer}>
                  {spot.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
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
  filtersContainer: {
    marginBottom: 20,
    marginTop: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabText: {
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
  spotsList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  spotCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spotImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  spotContent: {
    padding: 16,
  },
  spotHeader: {
    marginBottom: 8,
  },
  spotTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendingText: {
    fontSize: 10,
    fontWeight: '600',
  },
  spotMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 12,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
  },
  spotDescription: {
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