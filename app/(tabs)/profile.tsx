import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  useColorScheme,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Settings, 
  Edit3, 
  Camera, 
  Heart, 
  MapPin, 
  Calendar,
  Anchor,
  ChevronRight,
  Star,
  Shield,
  Crown
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');

  const handleHaptic = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const handleEditProfile = React.useCallback(async () => {
    await handleHaptic();
    router.push('/profile/edit');
  }, [handleHaptic]);

  const handleEditPhotos = React.useCallback(async () => {
    await handleHaptic();
    router.push('/profile/photos');
  }, [handleHaptic]);

  const handleSettings = React.useCallback(async () => {
    await handleHaptic();
    router.push('/settings');
  }, [handleHaptic]);

  const handlePreferences = React.useCallback(async () => {
    await handleHaptic();
    router.push('/profile/preferences');
  }, [handleHaptic]);

  const handlePremium = React.useCallback(async () => {
    await handleHaptic();
    router.push('/premium');
  }, [handleHaptic]);

  const handleLogout = React.useCallback(async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await handleHaptic();
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  }, [handleHaptic, logout]);

  const profileActions = [
    {
      icon: Edit3,
      title: 'Edit Profile',
      subtitle: 'Update your info and bio',
      onPress: handleEditProfile,
    },
    {
      icon: Camera,
      title: 'Manage Photos',
      subtitle: 'Add or reorder your photos',
      onPress: handleEditPhotos,
    },
    {
      icon: Heart,
      title: 'Dating Preferences',
      subtitle: 'Who you want to meet',
      onPress: handlePreferences,
    },
    {
      icon: Crown,
      title: 'Floatr Premium',
      subtitle: 'Unlock exclusive features',
      onPress: handlePremium,
      premium: true,
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'Privacy, notifications & more',
      onPress: handleSettings,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.background.secondary }]}
            onPress={handleSettings}
            accessibilityLabel="Settings"
          >
            <Settings size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ 
                uri: user?.photos?.[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={[styles.editPhotoButton, { backgroundColor: colors.primary }]}
              onPress={handleEditPhotos}
            >
              <Camera size={16} color={colors.background.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text.primary }]}>
              {user?.name || 'Your Name'}, {user?.age || 25}
            </Text>
            
            <View style={styles.profileDetails}>
              <View style={styles.detailItem}>
                <MapPin size={14} color={colors.text.secondary} />
                <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                  {user?.location || 'Miami, FL'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Anchor size={14} color={colors.text.secondary} />
                <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                  {user?.boatType || 'Yacht Owner'}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Star size={14} color={colors.accent} />
                <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                  4.8 Rating
                </Text>
              </View>
            </View>

            {user?.bio && (
              <Text style={[styles.profileBio, { color: colors.text.secondary }]}>
                {user.bio}
              </Text>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Matches</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Meetups</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Days Active</Text>
          </View>
        </View>

        {/* Profile Actions */}
        <View style={styles.actionsContainer}>
          {profileActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionItem, { backgroundColor: colors.background.secondary }]}
              onPress={action.onPress}
              accessibilityLabel={action.title}
            >
              <View style={styles.actionLeft}>
                <View style={[
                  styles.actionIcon, 
                  { 
                    backgroundColor: action.premium ? colors.accent : colors.primary + '20' 
                  }
                ]}>
                  <action.icon 
                    size={20} 
                    color={action.premium ? colors.background.primary : colors.primary} 
                  />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: colors.text.primary }]}>
                    {action.title}
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: colors.text.secondary }]}>
                    {action.subtitle}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="ghost"
            size="large"
            style={[styles.logoutButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  profileDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
  },
  profileBio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsContainer: {
    marginHorizontal: 24,
    gap: 2,
    marginBottom: 32,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  logoutContainer: {
    marginHorizontal: 24,
  },
  logoutButton: {
    borderWidth: 1,
  },
});