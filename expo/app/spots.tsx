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
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  MapPin, 
  Star, 
  Users, 
  Anchor,
  Waves,
  Navigation2,
  Heart,
  Share
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

interface Spot {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: number;
  type: string;
  features: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

const mockSpots: Spot[] = [
  {
    id: '1',
    name: 'Stiltsville',
    description: 'Historic stilt houses in the middle of Biscayne Bay. Perfect for exploring and photography.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 124,
    distance: 3.2,
    type: 'Historic Site',
    features: ['Photography', 'History', 'Shallow Water'],
    coordinates: { lat: 25.6586, lng: -80.1918 }
  },
  {
    id: '2',
    name: 'Sandbar at Haulover',
    description: 'Popular sandbar perfect for anchoring, swimming, and socializing with other boaters.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 89,
    distance: 1.8,
    type: 'Sandbar',
    features: ['Swimming', 'Anchoring', 'Social'],
    coordinates: { lat: 25.9007, lng: -80.1210 }
  },
  {
    id: '3',
    name: 'Key Biscayne Marina',
    description: 'Full-service marina with fuel, dining, and easy access to the Atlantic Ocean.',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    rating: 4.4,
    reviewCount: 67,
    distance: 4.1,
    type: 'Marina',
    features: ['Fuel', 'Dining', 'Services'],
    coordinates: { lat: 25.6910, lng: -80.1694 }
  },
  {
    id: '4',
    name: 'Dinner Key Marina',
    description: 'Historic marina in Coconut Grove with restaurants and easy city access.',
    imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 156,
    distance: 2.5,
    type: 'Marina',
    features: ['Restaurants', 'Historic', 'City Access'],
    coordinates: { lat: 25.7282, lng: -80.2310 }
  },
  {
    id: '5',
    name: 'Fowey Rocks Lighthouse',
    description: 'Iconic lighthouse perfect for fishing and diving. Deep water access.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 43,
    distance: 8.9,
    type: 'Lighthouse',
    features: ['Fishing', 'Diving', 'Deep Water'],
    coordinates: { lat: 25.5903, lng: -80.0969 }
  },
  {
    id: '6',
    name: 'Biscayne National Park',
    description: 'Protected waters with pristine coral reefs and abundant marine life.',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 201,
    distance: 12.3,
    type: 'National Park',
    features: ['Coral Reefs', 'Wildlife', 'Protected'],
    coordinates: { lat: 25.4900, lng: -80.2100 }
  }
];

export default function SpotsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [selectedType, setSelectedType] = useState('all');

  const spotTypes = ['all', 'Marina', 'Sandbar', 'Historic Site', 'Lighthouse', 'National Park'];

  const filteredSpots = selectedType === 'all' 
    ? mockSpots 
    : mockSpots.filter(spot => spot.type === selectedType);

  const handleSpotPress = (spot: Spot) => {
    // In a real app, this would navigate to a detailed spot view
    console.log('Navigate to spot:', spot.name);
  };

  const handleDirections = (spot: Spot) => {
    // In a real app, this would open navigation
    console.log('Get directions to:', spot.name);
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

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {spotTypes.map((type) => {
          const isSelected = selectedType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterTab, 
                { 
                  backgroundColor: isSelected ? colors.primary : colors.surface.primary,
                  borderColor: isSelected ? colors.primary : colors.border.primary,
                }
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.filterTabText, 
                { color: isSelected ? colors.text.primary : colors.text.secondary }
              ]}>
                {type === 'all' ? 'All' : type}
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
              onPress={() => handleSpotPress(spot)}
            >
              <Image source={{ uri: spot.imageUrl }} style={styles.spotImage} />
              
              <View style={styles.spotInfo}>
                <View style={styles.spotHeader}>
                  <Text style={[styles.spotName, { color: colors.text.primary }]}>
                    {spot.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.rating, { color: colors.text.primary }]}>
                      {spot.rating}
                    </Text>
                    <Text style={[styles.reviewCount, { color: colors.text.secondary }]}>
                      ({spot.reviewCount})
                    </Text>
                  </View>
                </View>

                <View style={styles.spotMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.distance} mi away
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Anchor size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.type}
                    </Text>
                  </View>
                </View>

                <Text 
                  style={[styles.spotDescription, { color: colors.text.secondary }]} 
                  numberOfLines={2}
                >
                  {spot.description}
                </Text>

                {/* Features */}
                <View style={styles.featuresContainer}>
                  {spot.features.slice(0, 3).map((feature, index) => (
                    <View key={index} style={[styles.feature, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.featureText, { color: colors.text.secondary }]}>{feature}</Text>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleDirections(spot)}
                  >
                    <Navigation2 size={16} color={colors.text.primary} />
                    <Text style={[styles.actionButtonText, { color: colors.text.primary }]}>
                      Directions
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
                  >
                    <Heart size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.iconButton, { backgroundColor: colors.background.secondary }]}
                  >
                    <Share size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
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
  filtersContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
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
  },
  spotInfo: {
    padding: 16,
  },
  spotHeader: {
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
  },
  spotMeta: {
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
  spotDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuresContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  feature: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});