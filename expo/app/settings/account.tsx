import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Switch
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Key, 
  Download, 
  Trash2, 
  Shield,
  AlertTriangle,
  Save,
  Smartphone,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function AccountSettingsScreen() {
  const { user, signOut } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    Alert.alert('Success', 'Password changed successfully!');
  };

  const handleExportData = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      'Export Data',
      'We will prepare your data and send it to your email address within 24 hours. This includes your profile information, matches, and message history.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Export Requested', 'You will receive an email with your data export within 24 hours.');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data including:\n\n• Profile and photos\n• All matches and conversations\n• Boat information\n• Usage history\n\nThis action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure you want to delete your account? Type "DELETE" to confirm:',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete Forever', 
                  style: 'destructive',
                  onPress: () => {
                    // In a real app, this would call the deletion API
                    Alert.alert('Account Deleted', 'Your account has been scheduled for deletion. You will be signed out now.');
                    signOut();
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (enabled) {
      Alert.alert(
        'Enable Two-Factor Authentication',
        'We will send a verification code to your email address to set up 2FA.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Code', 
            onPress: () => {
              setTwoFactorEnabled(true);
              Alert.alert('Code Sent', 'Check your email for the verification code.');
            }
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'This will make your account less secure. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => setTwoFactorEnabled(false)
          },
        ]
      );
    }
  };

  const handleRequestVerification = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Alert.alert(
      'Account Verification',
      'Account verification helps other users trust your profile. We will review your submitted information and photos.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Verification', 
          onPress: () => {
            Alert.alert('Verification Started', 'We will review your account and notify you within 2-3 business days.');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Account Settings',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.passwordSection}>
            <Text style={styles.subsectionTitle}>Change Password</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.text.secondary}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? 
                    <EyeOff size={20} color={colors.text.secondary} /> : 
                    <Eye size={20} color={colors.text.secondary} />
                  }
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password (min 8 characters)"
                  placeholderTextColor={colors.text.secondary}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? 
                    <EyeOff size={20} color={colors.text.secondary} /> : 
                    <Eye size={20} color={colors.text.secondary} />
                  }
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.text.secondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeOff size={20} color={colors.text.secondary} /> : 
                    <Eye size={20} color={colors.text.secondary} />
                  }
                </TouchableOpacity>
              </View>
            </View>
            
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              variant="primary"
              size="medium"
              loading={loading}
              icon={<Save size={16} color={colors.text.primary} />}
              style={styles.changePasswordButton}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>
                {twoFactorEnabled ? 'Enabled - Extra security for your account' : 'Add an extra layer of security'}
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={handleToggle2FA}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Verification</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleRequestVerification}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Verify Your Account</Text>
              <Text style={styles.settingDescription}>Get a verified badge to build trust</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingIcon}>
              <Download size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export My Data</Text>
              <Text style={styles.settingDescription}>Download a copy of your data (GDPR compliant)</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
            <View style={styles.settingIcon}>
              <Trash2 size={20} color={colors.error} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>Delete Account</Text>
              <Text style={styles.settingDescription}>Permanently delete your account and all data</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.warningBox}>
            <AlertTriangle size={16} color={colors.warning} />
            <Text style={styles.warningText}>
              Account deletion is permanent and cannot be undone. All your matches, messages, photos, and profile data will be lost forever. Consider exporting your data first.
            </Text>
          </View>
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  passwordSection: {
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
  },
  changePasswordButton: {
    marginTop: 8,
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
    marginBottom: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.warning,
    lineHeight: 20,
  },
});