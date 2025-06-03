import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { UserX, Trash2 } from 'lucide-react-native';
import colors from '@/constants/colors';

interface BlockedUser {
  id: string;
  name: string;
  avatarUrl: string;
  blockedAt: Date;
}

export default function BlockedUsersScreen() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: '1',
      name: 'Blocked User 1',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000',
      blockedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Blocked User 2',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=1000',
      blockedAt: new Date('2024-01-10'),
    },
  ]);

  const handleUnblock = async (userId: string, userName: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${userName}? They will be able to see your profile and message you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock', 
          onPress: () => {
            setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            Alert.alert('User Unblocked', `${userName} has been unblocked.`);
          }
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Blocked Users',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {blockedUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <UserX size={48} color={colors.text.secondary} />
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptyDescription}>
              Users you block will appear here. You can unblock them at any time.
            </Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            <Text style={styles.listHeader}>
              {blockedUsers.length} blocked user{blockedUsers.length !== 1 ? 's' : ''}
            </Text>
            
            {blockedUsers.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.blockedDate}>
                    Blocked on {formatDate(user.blockedAt)}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.unblockButton}
                  onPress={() => handleUnblock(user.id, user.name)}
                >
                  <Trash2 size={16} color={colors.error} />
                  <Text style={styles.unblockText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Blocking</Text>
          <Text style={styles.infoText}>
            When you block someone:
          </Text>
          <Text style={styles.infoText}>
            • They cannot see your profile or send you messages
          </Text>
          <Text style={styles.infoText}>
            • You will not see them in discovery
          </Text>
          <Text style={styles.infoText}>
            • Any existing matches will be removed
          </Text>
          <Text style={styles.infoText}>
            • You can unblock them at any time
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
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
    lineHeight: 24,
  },
  usersList: {
    marginBottom: 32,
  },
  listHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  blockedDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  unblockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  unblockText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
  },
  infoSection: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
});