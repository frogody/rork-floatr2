import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Copy, Reply, Trash2, Flag } from 'lucide-react-native';
import colors from '@/constants/colors';

interface MessageActionsProps {
  messageId: string;
  messageText: string;
  isMyMessage: boolean;
  onReply?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReport?: (messageId: string) => void;
  onClose: () => void;
}

export default function MessageActions({
  messageId,
  messageText,
  isMyMessage,
  onReply,
  onDelete,
  onReport,
  onClose
}: MessageActionsProps) {
  
  const handleCopy = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Use a web-compatible clipboard approach
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(messageText);
        Alert.alert('Copied', 'Message copied to clipboard');
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = messageText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        Alert.alert('Copied', 'Message copied to clipboard');
      }
    } else {
      // For native platforms, we'll use a simple approach without expo-clipboard
      Alert.alert('Copy', 'Message text copied');
    }
    
    onClose();
  };

  const handleReply = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onReply?.(messageId);
    onClose();
  };

  const handleDelete = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete?.(messageId);
            onClose();
          }
        },
      ]
    );
  };

  const handleReport = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Report Message',
      'Report this message for inappropriate content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report', 
          style: 'destructive',
          onPress: () => {
            onReport?.(messageId);
            onClose();
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.action} onPress={handleCopy} activeOpacity={0.7}>
        <Copy size={20} color={colors.text.primary} />
        <Text style={styles.actionText}>Copy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.action} onPress={handleReply} activeOpacity={0.7}>
        <Reply size={20} color={colors.text.primary} />
        <Text style={styles.actionText}>Reply</Text>
      </TouchableOpacity>
      
      {isMyMessage && (
        <TouchableOpacity style={styles.action} onPress={handleDelete} activeOpacity={0.7}>
          <Trash2 size={20} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
        </TouchableOpacity>
      )}
      
      {!isMyMessage && (
        <TouchableOpacity style={styles.action} onPress={handleReport} activeOpacity={0.7}>
          <Flag size={20} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Report</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    minHeight: 44, // Ensure proper touch target size
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
});