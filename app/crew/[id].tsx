import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { 
  MapPin, 
  Users, 
  Star, 
  Anchor, 
  MessageCircle,
  Heart,
  Share,
  Flag,
  Calendar,
  Navigation
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function CrewDetailScreen() {
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

  const handleMessage = () => {
    router.push(`/chat/${crew.id}`);
  };

  const handleLike = () => {
    // Add to favorites
    console.log('Liked crew:', crew.id);
  };

  const handleShare = () => {
    // Share crew
    console.log('Share crew:', crew.id);
  };

  const handleReport = () => {
    router.push(`/report/${crew.id}`);
  };

  const handleJoinRequest = () => {
    router.push(`/join-request/${crew.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen 
        options={{ 
          title: crew.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleShare}
              >
                <Share size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleReport}
              >
                <Flag size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: crew.imageUrl }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={colors.text.primary} />
              <Text style={[styles.distanceText, { color: colors.text.primary }]}>
                {crew.distance} mi away
              </Text>
            </View>
          </View>
        </View>

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text.primary }]}>{crew.name}</Text>
            {crew.verified && (
              <Star size={20} color={colors.primary} fill={colors.primary} />
            )}
          </View>

          <View style={styles.metaRow}>
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

            <View style={styles.metaItem}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: crew.isActive ? colors.success : colors.text.secondary }
              ]} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {crew.isActive ? 'Active now' : 'Offline'}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {crew.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {crew.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.surface.secondary }]}>
                <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/map')}
          >
            <Navigation size={20} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/events')}
          >
            <Calendar size={20} color={colors.secondary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Events</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.quickAction, { backgroundColor: colors.surface.primary }]}
            onPress={handleLike}
          >
            <Heart size={20} color={colors.error} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Favorite</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Location</Text>
          <View style={styles.locationInfo}>
            <MapPin size={16} color={colors.text.secondary} />
            <Text style={[styles.locationText, { color: colors.text.secondary }]}>
              {crew.location || 'Miami, FL'}
            </Text>
          </View>
        </View>

        {/* Activity */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recent Activity</Text>
          <Text style={[styles.activityText, { color: colors.text.secondary }]}>
            Last active {crew.isActive ? 'now' : new Date(crew.lastActive).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={[styles.actionButtons, { backgroundColor: colors.background.primary }]}>
        <TouchableOpacity 
          style={[styles.secondaryButton, { backgroundColor: colors.surface.primary }]}
          onPress={handleMessage}
        >
          <MessageCircle size={20} color={colors.primary} />
          <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleJoinRequest}
        >
          <Text style={[styles.primaryButtonText, { color: colors.text.primary }]}>Request to Join</Text>
        </TouchableOpacity>
      </View>
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
  errorText: {
    fontSize: 18,
    fontWeight: '600',
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
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mainInfo: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
  },
  activityText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButton: {
    flex: 1,
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
  primaryButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});