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
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  MapPin, 
  Users, 
  Star, 
  MessageCircle,
  Heart,
  Share,
  Anchor,
  Navigation2,
  Calendar,
  Clock
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function CrewDetailsScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const crew = mockCrews.find(c => c.id === id);

  if (!crew) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Crew not found</Text>
      </View>
    );
  }

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: crew.name,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <Image source={{ uri: crew.imageUrl }} style={styles.heroImage} />
        
        {/* Crew Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.crewName, { color: colors.text.primary }]}>
                  {crew.name}
                </Text>
                {crew.verified && (
                  <Star size={20} color={colors.primary} fill={colors.primary} />
                )}
              </View>
              <Text style={[styles.distance, { color: colors.text.secondary }]}>
                {crew.distance} miles away
              </Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
              >
                <Heart size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.background.secondary }]}
              >
                <Share size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(crew.isActive) }]} />
              <Text style={[styles.statusText, { color: colors.text.secondary }]}>
                {crew.isActive ? 'Active now' : getTimeAgo(crew.lastActive)}
              </Text>
            </View>
            {crew.location && (
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.text.secondary} />
                <Text style={[styles.locationText, { color: colors.text.secondary }]}>
                  {crew.location}
                </Text>
              </View>
            )}
          </View>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Anchor size={16} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {crew.boatType || 'Boat'}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={16} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {crew.memberCount} members
              </Text>
            </View>
            {crew.age && (
              <View style={styles.metaItem}>
                <Calendar size={16} color={colors.text.secondary} />
                <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                  {crew.age} years old
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {crew.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {crew.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push(`/chat/${crew.id}`)}
          >
            <MessageCircle size={20} color={colors.text.primary} />
            <Text style={[styles.primaryButtonText, { color: colors.text.primary }]}>
              Send Message
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { backgroundColor: colors.surface.primary }]}
          >
            <Navigation2 size={20} color={colors.primary} />
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Get Directions
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 300,
  },
  infoCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  crewName: {
    fontSize: 24,
    fontWeight: '700',
  },
  distance: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomActions: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});