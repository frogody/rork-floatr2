import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Modal, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, UserX, AlertTriangle } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

interface BlockModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  onBlock: () => void;
}

export default function BlockModal({ visible, onClose, userName, onBlock }: BlockModalProps) {
  const handleBlock = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      'Block User',
      `Are you sure you want to block ${userName}? They will not be able to see your profile or send you messages.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block', 
          style: 'destructive',
          onPress: () => {
            onBlock();
            onClose();
            Alert.alert('User Blocked', `${userName} has been blocked successfully.`);
          }
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <UserX size={48} color={colors.error} />
            </View>
            
            <Text style={styles.title}>Block {userName}?</Text>
            
            <Text style={styles.description}>
              Blocking this user will:
            </Text>
            
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Hide your profile from them</Text>
              <Text style={styles.bulletPoint}>• Prevent them from messaging you</Text>
              <Text style={styles.bulletPoint}>• Remove them from your matches</Text>
              <Text style={styles.bulletPoint}>• Hide them from your discovery feed</Text>
            </View>
            
            <View style={styles.warningBox}>
              <AlertTriangle size={16} color={colors.warning} />
              <Text style={styles.warningText}>
                You can unblock users anytime in Privacy & Safety settings.
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                size="medium"
                style={styles.cancelButton}
              />
              
              <Button
                title="Block User"
                onPress={handleBlock}
                variant="primary"
                size="medium"
                style={[styles.blockButton, { backgroundColor: colors.error }]}
                icon={<UserX size={16} color={colors.text.primary} />}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.background.dark,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    paddingTop: 8,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  bulletPoints: {
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
    alignSelf: 'stretch',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'stretch',
  },
  cancelButton: {
    flex: 1,
  },
  blockButton: {
    flex: 1,
  },
});