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
  ChevronRight,
  User,
  CreditCard,
  Moon,
  Sun,
  RefreshCw,
  Trash2,
  Key,
  UserX,
  LogOut
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  destructive?: boolean;
}

export default function SettingsScreen() {
  const { user, signOut, deleteAccount, isLoading } = useAuthStore();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
      case 'replay-onboarding':
        Alert.alert(
          'Replay Tutorial',
          'This will restart the onboarding flow. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Continue', 
              onPress: () => {
                // Reset onboarding state and navigate
                router.push('/onboarding');
              }
            },
          ]
        );
        break;
      case 'change-password':
        handleNavigation('/settings/account');
        break;
      case 'delete-account':
        Alert.alert(
          'Delete Account',
          'This action cannot be undone. All your data will be permanently deleted.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete Account', 
              style: 'destructive',
              onPress: async () => {
                if (Platform.OS !== 'web') {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                }
                await deleteAccount();
              }
            },
          ]
        );
        break;
      case 'sign-out':
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Sign Out', 
              onPress: async () => {
                if (Platform.OS !== 'web') {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                signOut();
              }, 
              style: 'destructive' 
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const settings: SettingItem[] = [
    {
      id: 'account',
      title: 'Account Settings',
      description: 'Password, security, and account management',
      icon: <User size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/settings/account'),
    },
    {
      id: 'premium',
      title: 'Floatr Premium',
      description: 'Unlock premium features and boosts',
      icon: <CreditCard size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/premium'),
    },
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
      id: 'dark-mode',
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      icon: darkMode ? <Moon size={20} color={colors.text.primary} /> : <Sun size={20} color={colors.text.primary} />,
      type: 'toggle',
      value: darkMode,
      onToggle: (value) => handleToggle(setDarkMode, darkMode),
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
      id: 'blocked-users',
      title: 'Blocked Users',
      description: 'Manage your blocked users list',
      icon: <UserX size={20} color={colors.text.primary} />,
      type: 'navigation',
      onPress: () => handleNavigation('/settings/blocked-users'),
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
      id: 'change-password',
      title: 'Change Password',
      description: 'Update your account password',
      icon: <Key size={20} color={colors.text.primary} />,
      type: 'action',
      onPress: () => handleAction('change-password'),
    },
    {
      id: 'replay-tutorial',
      title: 'Replay Tutorial',
      description: 'Go through the onboarding again',
      icon: <RefreshCw size={20} color={colors.text.primary} />,
      type: 'action',
      onPress: () => handleAction('replay-onboarding'),
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
      onPress: () => handleNavigation('/legal/terms'),
    },
    {
      id: 'rate',
      title: 'Rate Floatr',
      description: 'Help us improve by rating the app',
      icon: <Star size={20} color={colors.text.primary} />,
      type: 'action',
      onPress: () => handleAction('rate'),
    },
    {
      id: 'sign-out',
      title: 'Sign Out',
      description: 'Sign out of your account',
      icon: <LogOut size={20} color={colors.error} />,
      type: 'action',
      onPress: () => handleAction('sign-out'),
      destructive: true,
    },
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      icon: <Trash2 size={20} color={colors.error} />,
      type: 'action',
      onPress: () => handleAction('delete-account'),
      destructive: true,
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, item.destructive && styles.destructiveItem]}
        onPress={item.onPress}
        disabled={item.type === 'toggle' || isLoading}
        activeOpacity={item.type === 'toggle' ? 1 : 0.7}
      >
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>
            {item.title}
          </Text>
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
              disabled={item.id === 'incognito' && !user?.isPremium}
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
        <View style={styles.profileSection}>
          <Text style={styles.profileName}>{user?.displayName || 'User'}</Text>
          <Text style={styles.profileEmail}>Manage your Floatr experience</Text>
          {user?.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium Member</Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {settings.slice(0, 2).map(renderSettingItem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settings.slice(2, 8).map(renderSettingItem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          {settings.slice(8, 11).map(renderSettingItem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {settings.slice(11, 15).map(renderSettingItem)}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          {settings.slice(15).map(renderSettingItem)}
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
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  premiumBadge: {
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.background.dark,
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
  destructiveItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
  destructiveText: {
    color: colors.error,
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