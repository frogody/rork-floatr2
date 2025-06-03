import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  MapPin, 
  Users, 
  Star, 
  Anchor,
  MessageCircle,
  Heart,
  Share,
  Clock,
  Navigation2,
  Waves,
  Calendar,
  Phone,
  Mail
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';
import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');

export default function CrewDetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [isLiked, setIsLiked] = useState(false);

  // Find the crew by ID
  const crew = mockCrews.find(c => c.id === id);

  if (!crew) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Crew not found</Text>
      </View>
    );
  }

  const getTimeAgo = (lastActive: Date) => {
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Active now';
    if (minutes < 60) return `Active ${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Active ${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `Active ${days}d ago`;
  };

  const handleMessage = () => {
    router.push(`/chat/${crew.id}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // Share functionality
  };

  const handleJoinCrew = () => {
    // Join crew functionality
    router.push('/meetups/create');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: crew.name,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleShare}
              >
                <Share size={18} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.headerButton, { backgroundColor: colors.surface.primary }]}
                onPress={handleLike}
              >
                <Heart 
                  size={18} 
                  color={isLiked ? colors.error : colors.text.primary}
                  fill={isLiked ? colors.error : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: crew.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: crew.isActive ? colors.success : colors.text.secondary }
              ]} />
              <Text style={[styles.statusText, { color: colors.text.primary }]}>
                {getTimeAgo(crew.lastActive)}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.crewName, { color: colors.text.primary }]}>
                {crew.name}
              </Text>
              {crew.verified && (
                <Star size={20} color={colors.primary} fill={colors.primary} />
              )}
            </View>
            <View style={styles.distanceContainer}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={[styles.distance, { color: colors.text.secondary }]}>
                {crew.distance} mi away
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text.secondary }]}>
            {crew.description}
          </Text>

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
            {crew.location && (
              <View style={styles.metaItem}>
                <Navigation2 size={16} color={colors.text.secondary} />
                <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                  {crew.location}
                </Text>
              </View>
            )}
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {crew.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
                <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.surface.primary }]}
            onPress={handleMessage}
          >
            <MessageCircle size={20} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/meetups/create')}
          >
            <Calendar size={20} color={colors.secondary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Plan Meetup</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionButton, { backgroundColor: colors.surface.primary }]}
          >
            <Phone size={20} color={colors.accent} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <View style={[styles.additionalInfo, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            About This Crew
          </Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Clock size={16} color={colors.text.secondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                  Typical Schedule
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  Weekends & Evenings
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Waves size={16} color={colors.text.secondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                  Experience Level
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  All Levels Welcome
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Users size={16} color={colors.text.secondary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                  Age Range
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {crew.age ? `${crew.age - 5}-${crew.age + 10}` : '25-45'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Join This Crew"
            onPress={handleJoinCrew}
            variant="primary"
            size="large"
            style={styles.joinButton}
          />
          
          <Button
            title="Send Message"
            onPress={handleMessage}
            variant="secondary"
            size="large"
            style={styles.messageButton}
          />
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
  errorText: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerActions: {
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
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoCard: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  crewName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  additionalInfo: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  joinButton: {
    width: '100%',
  },
  messageButton: {
    width: '100%',
  },
});