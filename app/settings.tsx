import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Bell, 
  Shield, 
  MapPin, 
  Eye, 
  Volume2, 
  Smartphone,
  HelpCircle,
  FileText,
  Star,
  ChevronRight
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleToggle = async (setter: (value: boolean) => void, currentValue: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  const handleNavigation = async (path: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(path as any);
  };

  const handleAction = async (action: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    switch (action) {
      case 'rate':
        Alert.alert('Rate App', 'Thank you for using Floatr! This would open the app store.');
        break;
      case 'feedback':
        Alert.alert('Send Feedback', 'This would open a feedback form or email client.');
        break;
      default:
        break;
    }
  };

  const settings: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Get notified about matches and messages',
      icon: <Bell size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: notifications,
      onToggle: (value) => handleToggle(setNotifications, notifications),
    },
    {
      id: 'location',
      title: 'Location Sharing',
      description: 'Share your location with nearby boaters',
      icon: <MapPin size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: locationSharing,
      onToggle: (value) => handleToggle(setLocationSharing, locationSharing),
    },
    {
      id: 'incognito',
      title: 'Incognito Mode',
      description: 'Browse without being seen (Premium)',
      icon: <Eye size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: incognitoMode,
      onToggle: (value) => handleToggle(setIncognitoMode, incognitoMode),
    },
    {
      id: 'sound',
      title: 'Sound Effects',
      description: 'Play sounds for app interactions',
      icon: <Volume2 size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: soundEffects,
      onToggle: (value) => handleToggle(setSoundEffects, soundEffects),
    },
    {
      id: 'haptic',
      title: 'Haptic Feedback',
      description: 'Feel vibrations for app interactions',
      icon: <Smartphone size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: hapticFeedback,
      onToggle: (value) => handleToggle(setHapticFeedback, hapticFeedback),
    },
    {
      id: 'privacy',
      title: 'Privacy & Safety',
      description: 'Manage your privacy settings',
      icon: <Shield size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/privacy'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: <HelpCircle size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/help'),
    },
    {
      id: 'terms',
      title: 'Terms & Privacy Policy',
      description: 'Read our terms and privacy policy',
      icon: <FileText size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/legal'),
    },
    {
      id: 'rate',
      title: 'Rate Floatr',
      description: 'Help us improve by rating the app',
      icon: <Star size={20} color={colors.text.primary} />,
      type: 'action',
      onPress: () => handleAction('rate'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
        
        <View style={styles.settingAction}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          ) : (
            <ChevronRight size={20} color={colors.text.secondary} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settings.slice(0, 5).map(renderSettingItem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {settings.slice(5).map(renderSettingItem)}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Floatr v1.0.0</Text>
          <Text style={styles.copyright}>© 2024 Floatr. All rights reserved.</Text>
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
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginBottom: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  settingAction: {
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  version: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});