import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Settings, 
  Edit, 
  Ship, 
  Ruler, 
  Users, 
  Award, 
  Star, 
  LogOut,
  Crown
} from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, boat, signOut } = useAuthStore();

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleEditBoat = () => {
    router.push('/boat/edit');
  };

  const handleGoPremium = () => {
    router.push('/premium');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <Image 
          source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000' }} 
          style={styles.profileImage}
        />
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.displayName || 'Your Name'}</Text>
          <Text style={styles.profileBio}>{user?.bio || 'Add a bio to tell others about yourself and your boating style.'}</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Edit size={16} color={colors.text.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.boatSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Boat</Text>
          <TouchableOpacity onPress={handleEditBoat}>
            <Edit size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        {boat ? (
          <View style={styles.boatCard}>
            <Image 
              source={{ uri: boat.photoUrl || 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000' }} 
              style={styles.boatImage}
            />
            
            <View style={styles.boatInfo}>
              <Text style={styles.boatName}>{boat.name}</Text>
              
              <View style={styles.boatDetails}>
                <View style={styles.boatDetail}>
                  <Ship size={14} color={colors.text.secondary} />
                  <Text style={styles.boatDetailText}>{boat.type}</Text>
                </View>
                
                <View style={styles.boatDetail}>
                  <Ruler size={14} color={colors.text.secondary} />
                  <Text style={styles.boatDetailText}>{boat.length}ft</Text>
                </View>
                
                <View style={styles.boatDetail}>
                  <Users size={14} color={colors.text.secondary} />
                  <Text style={styles.boatDetailText}>Capacity: {boat.capacity}</Text>
                </View>
              </View>
              
              {boat.verified && (
                <View style={styles.verifiedBadge}>
                  <Award size={12} color={colors.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBoatButton} onPress={handleEditBoat}>
            <Text style={styles.addBoatText}>+ Add Your Boat</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.premiumBanner} onPress={handleGoPremium}>
        <LinearGradient
          colors={colors.gradient.sunset}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.premiumGradient}
        >
          <View style={styles.premiumContent}>
            <Crown size={24} color={colors.text.primary} />
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumTitle}>Go Floatr Premium</Text>
              <Text style={styles.premiumDescription}>Unlimited swipes, Wave First, and more</Text>
            </View>
            <Star size={24} color={colors.text.primary} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Waves Sent</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Raft-Ups</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Locations</Text>
          </View>
        </View>
      </View>
      
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="outline"
        size="medium"
        icon={<LogOut size={16} color={colors.primary} />}
        style={styles.signOutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    padding: 16,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  editButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  boatSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  boatCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  boatImage: {
    width: '100%',
    height: 160,
  },
  boatInfo: {
    padding: 16,
  },
  boatName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  boatDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  boatDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boatDetailText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  addBoatButton: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBoatText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  premiumBanner: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumGradient: {
    padding: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  premiumDescription: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  statsSection: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  signOutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
});