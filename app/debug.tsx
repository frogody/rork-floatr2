import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { 
  Bug, 
  Settings, 
  Database, 
  Wifi, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { TroubleshootingPanel } from '@/components/TroubleshootingPanel';
import { useAuthStore } from '@/store/authStore';
import { useSwipeStore } from '@/store/swipeStore';
import { useMatchStore } from '@/store/matchStore';
import { logger } from '@/utils/logger';
import { errorReporting } from '@/utils/errorReporting';

export default function DebugScreen() {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const authStore = useAuthStore();
  const swipeStore = useSwipeStore();
  const matchStore = useMatchStore();

  const triggerTestError = () => {
    try {
      throw new Error('This is a test error for debugging purposes');
    } catch (error) {
      errorReporting.captureError(error, 'error', { 
        context: 'debug_screen',
        userTriggered: true 
      });
      logger.error('Test error triggered', { source: 'debug_screen' });
    }
  };

  const clearAllStores = () => {
    authStore.signOut();
    swipeStore.resetSwipes();
    logger.info('Debug: All stores cleared');
  };

  const logCurrentState = () => {
    logger.debug('Current app state', {
      auth: {
        isAuthenticated: authStore.isAuthenticated,
        isInitialized: authStore.isInitialized,
        hasUser: !!authStore.user,
      },
      swipe: {
        currentIndex: swipeStore.currentIndex,
        crewsCount: swipeStore.crews.length,
        likedCount: swipeStore.likedCrews.length,
      },
      match: {
        matchesCount: matchStore.matches.length,
        messagesCount: Object.keys(matchStore.messages).length,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Debug Tools',
          headerShown: true,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Database size={24} color={colors.primary} />
              <Text style={styles.statusLabel}>Auth Store</Text>
              <View style={styles.statusIndicator}>
                {authStore.isInitialized ? (
                  <CheckCircle size={16} color={colors.status.success} />
                ) : (
                  <AlertTriangle size={16} color={colors.status.warning} />
                )}
              </View>
            </View>

            <View style={styles.statusItem}>
              <Wifi size={24} color={colors.primary} />
              <Text style={styles.statusLabel}>Network</Text>
              <View style={styles.statusIndicator}>
                <CheckCircle size={16} color={colors.status.success} />
              </View>
            </View>

            <View style={styles.statusItem}>
              <Bug size={24} color={colors.primary} />
              <Text style={styles.statusLabel}>Error Reporting</Text>
              <View style={styles.statusIndicator}>
                {errorReporting.isEnabled() ? (
                  <CheckCircle size={16} color={colors.status.success} />
                ) : (
                  <AlertTriangle size={16} color={colors.status.warning} />
                )}
              </View>
            </View>

            <View style={styles.statusItem}>
              <Settings size={24} color={colors.primary} />
              <Text style={styles.statusLabel}>Logger</Text>
              <View style={styles.statusIndicator}>
                {logger.isEnabled() ? (
                  <CheckCircle size={16} color={colors.status.success} />
                ) : (
                  <AlertTriangle size={16} color={colors.status.warning} />
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setShowTroubleshooting(true)}
          >
            <Bug size={20} color={colors.background.primary} />
            <Text style={styles.actionButtonText}>Open Troubleshooting Panel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={logCurrentState}>
            <RefreshCw size={20} color={colors.background.primary} />
            <Text style={styles.actionButtonText}>Log Current State</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={triggerTestError}>
            <AlertTriangle size={20} color={colors.background.primary} />
            <Text style={styles.actionButtonText}>Trigger Test Error</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={clearAllStores}
          >
            <Database size={20} color={colors.status.error} />
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Clear All Stores
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Auth Store</Text>
            <Text style={styles.infoText}>Authenticated: {authStore.isAuthenticated ? 'Yes' : 'No'}</Text>
            <Text style={styles.infoText}>Initialized: {authStore.isInitialized ? 'Yes' : 'No'}</Text>
            <Text style={styles.infoText}>User ID: {authStore.user?.id || 'None'}</Text>
            <Text style={styles.infoText}>Error: {authStore.error || 'None'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Swipe Store</Text>
            <Text style={styles.infoText}>Current Index: {swipeStore.currentIndex}</Text>
            <Text style={styles.infoText}>Total Crews: {swipeStore.crews.length}</Text>
            <Text style={styles.infoText}>Liked: {swipeStore.likedCrews.length}</Text>
            <Text style={styles.infoText}>Disliked: {swipeStore.dislikedCrews.length}</Text>
            <Text style={styles.infoText}>Super Liked: {swipeStore.superlikedCrews.length}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Match Store</Text>
            <Text style={styles.infoText}>Matches: {matchStore.matches.length}</Text>
            <Text style={styles.infoText}>Conversations: {Object.keys(matchStore.messages).length}</Text>
            <Text style={styles.infoText}>Loading: {matchStore.isLoading ? 'Yes' : 'No'}</Text>
            <Text style={styles.infoText}>Error: {matchStore.error || 'None'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development Info</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Environment: {__DEV__ ? 'Development' : 'Production'}</Text>
            <Text style={styles.infoText}>Platform: {require('react-native').Platform.OS}</Text>
            <Text style={styles.infoText}>Version: {require('react-native').Platform.Version}</Text>
            <Text style={styles.infoText}>Logger Level: {logger.getMinLevel()}</Text>
            <Text style={styles.infoText}>Error Reporting: {errorReporting.isEnabled() ? 'Enabled' : 'Disabled'}</Text>
          </View>
        </View>
      </ScrollView>

      <TroubleshootingPanel 
        visible={showTroubleshooting}
        onClose={() => setShowTroubleshooting(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statusItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  statusIndicator: {
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.background.primary,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  dangerButtonText: {
    color: colors.status.error,
  },
  infoCard: {
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginBottom: 4,
  },
});