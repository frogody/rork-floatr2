import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Eye, 
  EyeOff, 
  MapPin, 
  Shield, 
  Users,
  MessageCircle,
  Camera,
  UserX,
  AlertTriangle,
  Lock,
  Globe
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

export default function PrivacySettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [locationSharing, setLocationSharing] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showLastActive, setShowLastActive] = useState(true);
  const [allowMessages, setAllowMessages] = useState('matches');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [photoVisibility, setPhotoVisibility] = useState('everyone');
  const [incognitoMode, setIncognitoMode] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);

  const visibilityOptions = [
    { value: 'everyone', label: 'Everyone', description: 'Your profile is visible to all users' },
    { value: 'matches', label: 'Matches Only', description: 'Only people you have matched with can see your profile' },
    { value: 'hidden', label: 'Hidden', description: 'Your profile is not visible in discovery' },
  ];

  const messageOptions = [
    { value: 'everyone', label: 'Everyone', description: 'Anyone can send you messages' },
    { value: 'matches', label: 'Matches Only', description: 'Only people you have matched with can message you' },
    { value: 'none', label: 'No One', description: 'No one can send you messages' },
  ];

  const photoVisibilityOptions = [
    { value: 'everyone', label: 'Everyone', description: 'All users can see your photos' },
    { value: 'matches', label: 'Matches Only', description: 'Only matches can see your photos' },
    { value: 'blurred', label: 'Blurred', description: 'Photos are blurred until you match' },
  ];

  const handleToggle = async (setter: (value: boolean) => void, currentValue: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  const handleIncognitoToggle = async (enabled: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (enabled) {
      Alert.alert(
        'Incognito Mode',
        'In incognito mode, you will not appear in discovery and your profile will be hidden from other users. You can still view and match with others.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => setIncognitoMode(true) },
        ]
      );
    } else {
      setIncognitoMode(false);
    }
  };

  const handleBlockedUsers = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/settings/blocked-users');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Privacy & Safety',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Profile Visibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Eye size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Who can see my profile</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                {visibilityOptions.find(o => o.value === profileVisibility)?.description}
              </Text>
            </View>
          </View>
          
          {visibilityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                { borderBottomColor: colors.border.primary }
              ]}
              onPress={() => setProfileVisibility(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                { 
                  borderColor: colors.border.primary,
                  backgroundColor: profileVisibility === option.value ? colors.primary : 'transparent'
                }
              ]}>
                {profileVisibility === option.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location & Distance */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Location & Distance</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <MapPin size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Share Location
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Allow others to see your approximate location
              </Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={() => handleToggle(setLocationSharing, locationSharing)}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <Globe size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Show Distance
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Display distance from you on profiles
              </Text>
            </View>
            <Switch
              value={showDistance}
              onValueChange={() => handleToggle(setShowDistance, showDistance)}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!locationSharing}
            />
          </View>
        </View>

        {/* Activity Status */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Activity Status</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <Users size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Show Online Status
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Let others see when you are online
              </Text>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={() => handleToggle(setShowOnlineStatus, showOnlineStatus)}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <Users size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Show Last Active
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Display when you were last active
              </Text>
            </View>
            <Switch
              value={showLastActive}
              onValueChange={() => handleToggle(setShowLastActive, showLastActive)}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        {/* Messaging */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Messaging</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MessageCircle size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Who can message me</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                {messageOptions.find(o => o.value === allowMessages)?.description}
              </Text>
            </View>
          </View>
          
          {messageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                { borderBottomColor: colors.border.primary }
              ]}
              onPress={() => setAllowMessages(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                { 
                  borderColor: colors.border.primary,
                  backgroundColor: allowMessages === option.value ? colors.primary : 'transparent'
                }
              ]}>
                {allowMessages === option.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <MessageCircle size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Read Receipts
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Let others know when you have read their messages
              </Text>
            </View>
            <Switch
              value={readReceipts}
              onValueChange={() => handleToggle(setReadReceipts, readReceipts)}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        {/* Photo Privacy */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Photo Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Camera size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Photo visibility</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                {photoVisibilityOptions.find(o => o.value === photoVisibility)?.description}
              </Text>
            </View>
          </View>
          
          {photoVisibilityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                { borderBottomColor: colors.border.primary }
              ]}
              onPress={() => setPhotoVisibility(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.text.secondary }]}>
                  {option.description}
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                { 
                  borderColor: colors.border.primary,
                  backgroundColor: photoVisibility === option.value ? colors.primary : 'transparent'
                }
              ]}>
                {photoVisibility === option.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advanced Privacy */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Advanced Privacy</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.settingIcon}>
              <EyeOff size={20} color={colors.text.primary} />
            </View>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Incognito Mode
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Browse profiles without appearing in discovery
              </Text>
            </View>
            <Switch
              value={incognitoMode}
              onValueChange={handleIncognitoToggle}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleBlockedUsers}>
            <View style={styles.settingIcon}>
              <UserX size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.text.primary }]}>Blocked Users</Text>
              <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                Manage users you have blocked
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Safety Information */}
        <View style={[styles.safetySection, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.safetyHeader}>
            <AlertTriangle size={20} color={colors.warning} />
            <Text style={[styles.safetyTitle, { color: colors.text.primary }]}>Safety Reminder</Text>
          </View>
          <Text style={[styles.safetyText, { color: colors.text.secondary }]}>
            Always meet new people in public places and let someone know where you are going. 
            Trust your instincts and report any suspicious behavior.
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 52,
    borderBottomWidth: 1,
    gap: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  switchContent: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 14,
  },
  safetySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  safetyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});