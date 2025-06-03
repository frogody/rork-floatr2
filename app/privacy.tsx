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
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Eye, 
  MapPin, 
  Users, 
  Shield, 
  Lock,
  UserX,
  AlertTriangle
} from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

export default function PrivacyScreen() {
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showBoatInfo, setShowBoatInfo] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);

  const handleToggle = async (setter: (value: boolean) => void, currentValue: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'This would initiate the account deletion process.');
          }
        },
      ]
    );
  };

  const handleExportData = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Export Data', 'This would generate and send you a copy of your data.');
  };

  const handleBlockedUsers = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Blocked Users', 'This would show your blocked users list.');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Privacy & Safety',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Visibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Eye size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Show Online Status</Text>
              <Text style={styles.settingDescription}>Let others see when you are active</Text>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={() => handleToggle(setShowOnlineStatus, showOnlineStatus)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MapPin size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Show Distance</Text>
              <Text style={styles.settingDescription}>Display your distance to other boaters</Text>
            </View>
            <Switch
              value={showDistance}
              onValueChange={() => handleToggle(setShowDistance, showDistance)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Users size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Show Boat Information</Text>
              <Text style={styles.settingDescription}>Display your boat details to others</Text>
            </View>
            <Switch
              value={showBoatInfo}
              onValueChange={() => handleToggle(setShowBoatInfo, showBoatInfo)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Allow Messages from Matches</Text>
              <Text style={styles.settingDescription}>Only matched users can message you</Text>
            </View>
            <Switch
              value={allowMessages}
              onValueChange={() => handleToggle(setAllowMessages, allowMessages)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <TouchableOpacity style={styles.actionItem} onPress={handleBlockedUsers}>
            <View style={styles.settingIcon}>
              <UserX size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Blocked Users</Text>
              <Text style={styles.settingDescription}>Manage your blocked users list</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Lock size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Data Collection</Text>
              <Text style={styles.settingDescription}>Allow analytics for app improvement</Text>
            </View>
            <Switch
              value={dataCollection}
              onValueChange={() => handleToggle(setDataCollection, dataCollection)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <Button
            title="Export My Data"
            onPress={handleExportData}
            variant="outline"
            size="medium"
            style={styles.exportButton}
          />
        </View>
        
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.settingIcon}>
              <AlertTriangle size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>Delete Account</Text>
              <Text style={styles.settingDescription}>Permanently delete your account and data</Text>
            </View>
          </TouchableOpacity>
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
  actionItem: {
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
  exportButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  dangerSection: {
    marginBottom: 32,
    paddingBottom: 32,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
  },
});