import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Switch,
  Alert,
  Platform,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  BarChart, 
  PieChart,
  Activity,
  Eye,
  EyeOff,
  Shield,
  Info
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function AnalyticsSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [crashReportingEnabled, setCrashReportingEnabled] = useState(true);
  const [performanceMonitoringEnabled, setPerformanceMonitoringEnabled] = useState(true);
  const [userBehaviorTracking, setUserBehaviorTracking] = useState(false);
  
  const handleToggleAnalytics = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setAnalyticsEnabled(value);
  };
  
  const handleToggleCrashReporting = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCrashReportingEnabled(value);
  };
  
  const handleTogglePerformanceMonitoring = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPerformanceMonitoringEnabled(value);
  };
  
  const handleToggleUserBehaviorTracking = async (value: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setUserBehaviorTracking(value);
  };
  
  const handleDeleteData = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Delete Analytics Data',
      'Are you sure you want to delete all your analytics data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete analytics data
            Alert.alert('Data Deleted', 'Your analytics data has been deleted successfully.');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Analytics & Privacy',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Data Collection Settings</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Control how Floatr collects and uses your data to improve the app experience
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <BarChart size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Usage Analytics</Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Collect anonymous data about how you use the app to help us improve features
                </Text>
              </View>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={handleToggleAnalytics}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <Activity size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Crash Reporting</Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Send crash reports to help us identify and fix bugs
                </Text>
              </View>
            </View>
            <Switch
              value={crashReportingEnabled}
              onValueChange={handleToggleCrashReporting}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <PieChart size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Performance Monitoring</Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Track app performance to help us optimize speed and responsiveness
                </Text>
              </View>
            </View>
            <Switch
              value={performanceMonitoringEnabled}
              onValueChange={handleTogglePerformanceMonitoring}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIconContainer, { backgroundColor: colors.primary + '20' }]}>
                {userBehaviorTracking ? (
                  <Eye size={20} color={colors.primary} />
                ) : (
                  <EyeOff size={20} color={colors.primary} />
                )}
              </View>
              <View>
                <Text style={[styles.settingTitle, { color: colors.text.primary }]}>User Behavior Tracking</Text>
                <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                  Track detailed user interactions to personalize your experience
                </Text>
              </View>
            </View>
            <Switch
              value={userBehaviorTracking}
              onValueChange={handleToggleUserBehaviorTracking}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
        
        <View style={[styles.infoBox, { backgroundColor: colors.surface.primary }]}>
          <Info size={20} color={colors.text.secondary} />
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            We take your privacy seriously. All data is collected anonymously and used only to improve the app experience. 
            You can change these settings at any time.
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Data Management</Text>
          
          <Button
            title="Delete My Analytics Data"
            onPress={handleDeleteData}
            variant="outline"
            size="medium"
            style={[styles.deleteButton, { borderColor: colors.error }]}
            textStyle={{ color: colors.error }}
          />
          
          <Button
            title="View Privacy Policy"
            onPress={() => router.push('/legal/privacy')}
            variant="ghost"
            size="medium"
            icon={<Shield size={18} color={colors.primary} />}
            iconPosition="left"
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
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  deleteButton: {
    marginBottom: 16,
  },
});