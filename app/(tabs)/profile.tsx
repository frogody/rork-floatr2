import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  useColorScheme,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Settings, 
  Edit3, 
  Camera, 
  Heart, 
  MessageCircle, 
  MapPin,
  Star,
  Crown,
  Anchor,
  Users,
  Calendar,
  Award,
  Shield
} from 'lucide-react-native';
import Button from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, boat } = useAuthStore();

  const handleSettingsPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/settings/index');
  };

  const handleEditProfile = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/profile/edit');
  };

  const handleEditPhotos = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/profile/photos');
  };

  const handleEditBoat = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/boat/edit');
  };

  const handlePremium = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/premium');
  };

  const stats = [
    { label: 'Matches', value: '47', icon: Heart },
    { label: 'Chats', value: '23', icon: MessageCircle },
    { label: 'Meetups', value: '12', icon: Users },
    { label: 'Miles', value: '1.2k', icon: MapPin },
  ];

  const achievements = [
    { title: 'First Mate', description: 'Completed your first meetup', icon: Star },
    { title: 'Navigator', description: 'Visited 10 different spots', icon: MapPin },
    { title: 'Social Sailor', description: 'Made 25 connections', icon: Users },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Profile',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <TouchableOpacity onPress={handleSettingsPress} style={styles.settingsButton}>
              <Settings size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000' }} 
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleEditPhotos}>
              <Camera size={16} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: colors.text.primary }]}>
                {user?.displayName || 'Your Name'}
              </Text>
              {user?.isVerified && (
                <Shield size={20} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.bio, { color: colors.text.secondary }]}>
              {user?.bio || 'Add a bio to tell others about yourself...'}
            </Text>
            
            <View style={styles.profileActions}>
              <Button
                title="Edit Profile"
                onPress={handleEditProfile}
                variant="secondary"
                size="small"
                icon={<Edit3 size={16} color={colors.text.primary} />}
                style={styles.editButton}
              />
              <Button
                title="Premium"
                onPress={handlePremium}
                variant="primary"
                size="small"
                icon={<Crown size={16} color={colors.text.primary} />}
                style={styles.premiumButton}
              />
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <View key={index} style={styles.statItem}>
                  <IconComponent size={20} color={colors.primary} />
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Boat Information */}
        {boat && (
          <View style={[styles.boatContainer, { backgroundColor: colors.surface.primary }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>My Boat</Text>
              <TouchableOpacity onPress={handleEditBoat}>
                <Edit3 size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.boatInfo}>
              <Image 
                source={{ uri: boat.photoUrl || 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000' }} 
                style={styles.boatImage}
              />
              <View style={styles.boatDetails}>
                <Text style={[styles.boatName, { color: colors.text.primary }]}>{boat.name}</Text>
                <Text style={[styles.boatType, { color: colors.text.secondary }]}>{boat.type}</Text>
                <View style={styles.boatSpecs}>
                  <Text style={[styles.boatSpec, { color: colors.text.secondary }]}>{boat.length}ft</Text>
                  <Text style={[styles.boatSpec, { color: colors.text.secondary }]}>•</Text>
                  <Text style={[styles.boatSpec, { color: colors.text.secondary }]}>{boat.capacity} people</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {!boat && (
          <View style={[styles.addBoatContainer, { backgroundColor: colors.surface.primary }]}>
            <Anchor size={32} color={colors.text.secondary} />
            <Text style={[styles.addBoatTitle, { color: colors.text.primary }]}>Add Your Boat</Text>
            <Text style={[styles.addBoatDescription, { color: colors.text.secondary }]}>
              Let others know what you are sailing with
            </Text>
            <Button
              title="Add Boat"
              onPress={handleEditBoat}
              variant="primary"
              size="medium"
              style={styles.addBoatButton}
            />
          </View>
        )}

        {/* Achievements */}
        <View style={[styles.achievementsContainer, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <View key={index} style={[styles.achievementItem, { borderBottomColor: colors.border.primary }]}>
                  <View style={[styles.achievementIcon, { backgroundColor: colors.primary + '20' }]}>
                    <IconComponent size={20} color={colors.primary} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, { color: colors.text.primary }]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, { color: colors.text.secondary }]}>
                      {achievement.description}
                    </Text>
                  </View>
                  <Award size={16} color={colors.warning} />
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={[styles.quickActionItem, { borderBottomColor: colors.border.primary }]}
            onPress={() => router.push('/profile/preferences')}
          >
            <Heart size={20} color={colors.text.secondary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
              Matching Preferences
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickActionItem, { borderBottomColor: colors.border.primary }]}
            onPress={() => router.push('/who-liked-you')}
          >
            <Star size={20} color={colors.text.secondary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
              Who Liked You
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionItem}
            onPress={() => router.push('/settings/privacy')}
          >
            <Shield size={20} color={colors.text.secondary} />
            <Text style={[styles.quickActionText, { color: colors.text.primary }]}>
              Privacy & Safety
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
  content: {
    flex: 1,
  },
  settingsButton: {
    padding: 8,
  },
  profileHeader: {
    padding: 20,
    marginBottom: 16,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  premiumButton: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  boatContainer: {
    padding: 20,
    marginBottom: 16,
  },
  boatInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  boatImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  boatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  boatName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  boatType: {
    fontSize: 14,
    marginBottom: 4,
  },
  boatSpecs: {
    flexDirection: 'row',
    gap: 8,
  },
  boatSpec: {
    fontSize: 12,
  },
  addBoatContainer: {
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  addBoatTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  addBoatDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  addBoatButton: {
    minWidth: 120,
  },
  achievementsContainer: {
    padding: 20,
    marginBottom: 16,
  },
  achievementsList: {
    gap: 0,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
  },
  quickActions: {
    padding: 20,
    marginBottom: 32,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  quickActionText: {
    fontSize: 16,
  },
});