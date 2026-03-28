import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Heart, X, Crown, Zap } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { Crew } from '@/types';
import { mockCrews } from '@/mocks/crews';
import Button from '@/components/Button';

export default function WhoLikedYouScreen() {
  const { user } = useAuthStore();
  const [likedByCrews, setLikedByCrews] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data for who liked you
    setTimeout(() => {
      const randomCrews = mockCrews.slice(0, Math.floor(Math.random() * 5) + 3);
      setLikedByCrews(randomCrews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLike = async (crew: Crew) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      "It's a Match!",
      `You and ${crew.name} have waved at each other.`,
      [
        { text: 'Send Message', onPress: () => router.push(`/chat/${crew.id}`) },
        { text: 'Keep Looking', style: 'cancel' },
      ]
    );
    
    // Remove from list
    setLikedByCrews(prev => prev.filter(c => c.id !== crew.id));
  };

  const handlePass = async (crew: Crew) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Remove from list
    setLikedByCrews(prev => prev.filter(c => c.id !== crew.id));
  };

  const renderCrewItem = ({ item }: { item: Crew }) => (
    <View style={styles.crewItem}>
      <Image source={{ uri: item.photoUrl }} style={styles.crewImage} />
      
      <View style={styles.crewInfo}>
        <Text style={styles.crewName}>{item.name}</Text>
        <Text style={styles.crewLocation}>{item.location}</Text>
        <Text style={styles.crewDistance}>{item.distance} miles away</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.passButton} 
          onPress={() => handlePass(item)}
        >
          <X size={20} color={colors.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={() => handleLike(item)}
        >
          <Heart size={20} color={colors.success} fill={colors.success} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!user?.isPremium) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <Stack.Screen
          options={{
            title: 'Who Liked You',
            headerStyle: {
              backgroundColor: colors.background.dark,
            },
            headerTintColor: colors.text.primary,
          }}
        />
        
        <View style={styles.premiumRequired}>
          <Crown size={64} color={colors.warning} />
          <Text style={styles.premiumTitle}>Premium Feature</Text>
          <Text style={styles.premiumDescription}>
            See who liked you and get unlimited swipes with Floatr Premium
          </Text>
          
          <Button
            title="Go Premium"
            onPress={() => router.push('/premium')}
            variant="primary"
            size="large"
            gradient
            style={styles.premiumButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Who Liked You',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your admirers...</Text>
        </View>
      ) : likedByCrews.length === 0 ? (
        <View style={styles.emptyState}>
          <Heart size={64} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>No likes yet</Text>
          <Text style={styles.emptyDescription}>
            Keep swiping to find crews that are interested in you!
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedByCrews}
          renderItem={renderCrewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {likedByCrews.length} crew{likedByCrews.length !== 1 ? 's' : ''} liked you
              </Text>
              <Text style={styles.headerSubtitle}>
                Wave back to start a conversation
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  premiumRequired: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  premiumButton: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  crewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  crewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  crewLocation: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  crewDistance: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  passButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});