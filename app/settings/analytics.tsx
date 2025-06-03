import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  useColorScheme,
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { BarChart3, TrendingUp, Eye, Shield, Info } from 'lucide-react-native';
import { getColors } from '@/constants/colors';

export default function AnalyticsSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme === 'dark');
  const [settings, setSettings] = React.useState({
    shareUsageData: true,
    sharePerformanceData: false,
    shareCrashReports: true,
    shareLocationData: false,
  });

  const handleHaptic = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const updateSetting = React.useCallback(async (key: string, value: boolean) => {
    await handleHaptic();
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [handleHaptic]);

  const analyticsOptions = [
    {
      key: 'shareUsageData',
      title: 'Usage Analytics',
      description: 'Help us improve the app by sharing how you use features',
      icon: BarChart3,
    },
    {
      key: 'sharePerformanceData',
      title: 'Performance Data',
      description: 'Share app performance metrics to help us optimize',
      icon: TrendingUp,
    },
    {
      key: 'shareCrashReports',
      title: 'Crash Reports',
      description: 'Automatically send crash reports to help us fix bugs',
      icon: Shield,
    },
    {
      key: 'shareLocationData',
      title: 'Location Analytics',
      description: 'Share anonymized location data for feature improvements',
      icon: Eye,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Analytics & Data',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Analytics & Data Sharing
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Control what data you share to help us improve Floatr. All data is anonymized and used only for app improvement.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          {analyticsOptions.map((option, index) => (
            <View key={option.key}>
              <View style={styles.optionItem}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: colors.primary + '20' }]}>
                    <option.icon size={20} color={colors.primary} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={settings[option.key as keyof typeof settings]}
                  onValueChange={(value) => updateSetting(option.key, value)}
                  trackColor={{ false: colors.border.primary, true: colors.primary }}
                  thumbColor={colors.background.primary}
                />
              </View>
              {index < analyticsOptions.length - 1 && (
                <View style={[styles.separator, { backgroundColor: colors.border.primary }]} />
              )}
            </View>
          ))}
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.infoHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.text.primary }]}>
              Privacy Information
            </Text>
          </View>
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            • All analytics data is completely anonymized{'\n'}
            • We never share personal information with third parties{'\n'}
            • You can change these settings at any time{'\n'}
            • Data is only used to improve app functionality{'\n'}
            • Location data is aggregated and never tied to your identity
          </Text>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});