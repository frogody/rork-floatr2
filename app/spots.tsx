import React from 'react';
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
  Navigation2,
  Anchor,
  Waves
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

const popularSpots = [
  {
    id: '1',
    name: 'Stiltsville',
    description: 'Historic stilt houses in the middle of Biscayne Bay',
    distance: '8.2 mi',
    rating: 4.8,
    visitors: 234,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    tags: ['Historic', 'Scenic', 'Photography'],
  },
  {
    id: '2',
    name: 'Sandbar Paradise',
    description: 'Popular sandbar perfect for swimming and socializing',
    distance: '3.1 mi',
    rating: 4.6,
    visitors: 156,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['Swimming', 'Social', 'Shallow'],
  },
  {
    id: '3',
    name: 'Coral Reef Gardens',
    description: 'Pristine coral reef perfect for snorkeling and diving',
    distance: '12.5 mi',
    rating: 4.9,
    visitors: 89,
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    tags: ['Diving', 'Snorkeling', 'Marine Life'],
  },
  {
    id: '4',
    name: 'Sunset Point',
    description: 'Best spot in Miami for watching spectacular sunsets',
    distance: '5.7 mi',
    rating: 4.7,
    visitors: 312,
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    tags: ['Sunset', 'Romantic', 'Views'],
  },
  {
    id: '5',
    name: 'Fishing Grounds',
    description: 'Deep water fishing spot known for large catches',
    distance: '15.3 mi',
    rating: 4.5,
    visitors: 67,
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    tags: ['Fishing', 'Deep Water', 'Sport'],
  },
  {
    id: '6',
    name: 'Mangrove Tunnels',
    description: 'Peaceful kayaking through natural mangrove tunnels',
    distance: '6.8 mi',
    rating: 4.4,
    visitors: 123,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    tags: ['Kayaking', 'Nature', 'Peaceful'],
  },
];

export default function SpotsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

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
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Discover Amazing Spots
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            Popular destinations for boaters in your area
          </Text>
        </View>

        <View style={styles.spotsList}>
          {popularSpots.map((spot) => (
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
                    <Star size={14} color={colors.primary} fill={colors.primary} />
                    <Text style={[styles.rating, { color: colors.text.secondary }]}>
                      {spot.rating}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.spotDescription, { color: colors.text.secondary }]}>
                  {spot.description}
                </Text>

                <View style={styles.spotMeta}>
                  <View style={styles.metaItem}>
                    <Navigation2 size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.distance}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users size={12} color={colors.text.secondary} />
                    <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                      {spot.visitors} visitors
                    </Text>
                  </View>
                </View>

                <View style={styles.tagsContainer}>
                  {spot.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                      <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
              >
                <MapPin size={16} color={colors.primary} />
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
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
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  spotInfo: {
    flex: 1,
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
    fontWeight: '500',
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
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 12,
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