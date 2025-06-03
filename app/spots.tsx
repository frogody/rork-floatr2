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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  MapPin, 
  Star, 
  Users, 
  Anchor,
  Navigation2,
  Waves,
  Sun,
  Wind
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

interface Spot {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  distance: number;
  imageUrl: string;
  tags: string[];
  depth: string;
  conditions: string;
  popularity: 'high' | 'medium' | 'low';
}

const mockSpots: Spot[] = [
  {
    id: '1',
    name: 'Stiltsville',
    description: 'Historic stilt houses in the middle of Biscayne Bay. Perfect for anchoring and exploring.',
    rating: 4.8,
    reviewCount: 234,
    distance: 3.2,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    tags: ['Historic', 'Anchoring', 'Sightseeing'],
    depth: '8-12 ft',
    conditions: 'Calm',
    popularity: 'high',
  },
  {
    id: '2',
    name: 'Sandbar at Haulover',
    description: 'Popular sandbar perfect for rafting up with other boats and socializing.',
    rating: 4.6,
    reviewCount: 189,
    distance: 1.8,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['Sandbar', 'Social', 'Swimming'],
    depth: '3-6 ft',
    conditions: 'Moderate',
    popularity: 'high',
  },
  {
    id: '3',
    name: 'Nixon Sandbar',
    description: 'Secluded sandbar with crystal clear waters, perfect for a peaceful day on the water.',
    rating: 4.7,
    reviewCount: 156,
    distance: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    tags: ['Secluded', 'Clear Water', 'Peaceful'],
    depth: '4-8 ft',
    conditions: 'Calm',
    popularity: 'medium',
  },
  {
    id: '4',
    name: 'Boca Chita Key',
    description: 'Beautiful island with lighthouse and great snorkeling opportunities.',
    rating: 4.9,
    reviewCount: 298,
    distance: 6.1,
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    tags: ['Island', 'Lighthouse', 'Snorkeling'],
    depth: '6-15 ft',
    conditions: 'Calm',
    popularity: 'high',
  },
  {
    id: '5',
    name: 'Elliott Key',
    description: 'Largest island in Biscayne National Park with hiking trails and pristine beaches.',
    rating: 4.5,
    reviewCount: 167,
    distance: 8.3,
    imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=300&fit=crop',
    tags: ['National Park', 'Hiking', 'Beaches'],
    depth: '10-20 ft',
    conditions: 'Moderate',
    popularity: 'medium',
  },
  {
    id: '6',
    name: 'Star Island',
    description: 'Exclusive area perfect for celebrity spotting and luxury yacht watching.',
    rating: 4.4,
    reviewCount: 89,
    distance: 2.1,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop',
    tags: ['Luxury', 'Celebrity', 'Exclusive'],
    depth: '12-25 ft',
    conditions: 'Calm',
    popularity: 'low',
  },
];

export default function SpotsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Spots' },
    { id: 'anchoring', label: 'Anchoring' },
    { id: 'sandbar', label: 'Sandbars' },
    { id: 'island', label: 'Islands' },
    { id: 'snorkeling', label: 'Snorkeling' },
  ];

  const filteredSpots = mockSpots.filter(spot => {
    if (selectedCategory === 'all') return true;
    return spot.tags.some(tag => tag.toLowerCase().includes(selectedCategory));
  });

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case 'high': return colors.success;
      case 'medium': return colors.accent;
      case 'low': return colors.text.secondary;
      default: return colors.text.secondary;
    }
  };

  const getConditionsIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'calm': return <Waves size={14} color={colors.success} />;
      case 'moderate': return <Wind size={14} color={colors.accent} />;
      default: return <Sun size={14} color={colors.text.secondary} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Popular Spots',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                { 
                  backgroundColor: isSelected ? colors.primary : colors.surface.primary,
                  borderColor: isSelected ? colors.primary : colors.border.primary,
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: isSelected ? colors.text.primary : colors.text.secondary }
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Spots List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.spotsList}>
          {filteredSpots.map((spot) => (
            <TouchableOpacity 
              key={spot.id} 
              style={[styles.spotCard, { backgroundColor: colors.surface.primary }]}
            >
              <Image source={{ uri: spot.imageUrl }} style={styles.spotImage} />
              
              <View style={styles.spotInfo}>
                <View style={styles.spotHeader}>
                  <Text style={[styles.spotName, { color: colors.text.primary }]}>
                    {spot.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={colors.accent} fill={colors.accent} />
                    <Text style={[styles.rating, { color: colors.text.primary }]}>
                      {spot.rating}
                    </Text>
                    <Text style={[styles.reviewCount, { color: colors.text.secondary }]}>
                      ({spot.reviewCount})
                    </Text>
                  </View>
                </View>

                <Text 
                  style={[styles.spotDescription, { color: colors.text.secondary }]} 
                  numberOfLines={2}
                >
                  {spot.description}
                </Text>

                <View style={styles.spotMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.distance} mi
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Anchor size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.depth}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    {getConditionsIcon(spot.conditions)}
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.conditions}
                    </Text>
                  </View>
                </View>

                <View style={styles.spotFooter}>
                  <View style={styles.tagsContainer}>
                    {spot.tags.slice(0, 2).map((tag, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                        <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <View style={styles.popularityContainer}>
                    <View style={[styles.popularityDot, { backgroundColor: getPopularityColor(spot.popularity) }]} />
                    <Text style={[styles.popularityText, { color: colors.text.secondary }]}>
                      {spot.popularity} traffic
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}>
                <Navigation2 size={16} color={colors.primary} />
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
  categoriesContainer: {
    paddingVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  spotsList: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  spotCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  spotImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 16,
  },
  spotInfo: {
    flex: 1,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 12,
  },
  spotDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  spotMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  spotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
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
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  popularityText: {
    fontSize: 10,
    textTransform: 'capitalize',
  },
  actionButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});