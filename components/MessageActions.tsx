import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Copy, Reply, Trash2, Flag } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Message } from '@/types';

interface MessageActionsProps {
  visible: boolean;
  onClose: () => void;
  message: Message;
  onCopy: (text: string) => void;
  onReply: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReport: (messageId: string) => void;
}

export default function MessageActions({
  visible,
  onClose,
  message,
  onCopy,
  onReply,
  onDelete,
  onReport,
}: MessageActionsProps) {
  const isMyMessage = message.senderId === 'me';

  const handleAction = async (action: () => void) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    action();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => handleAction(() => onCopy(message.content))}
          >
            <Copy size={20} color={colors.text.primary} />
            <Text style={styles.actionText}>Copy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => handleAction(() => onReply(message))}
          >
            <Reply size={20} color={colors.text.primary} />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
          
          {isMyMessage && (
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => handleAction(() => onDelete(message.id))}
            >
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
            </TouchableOpacity>
          )}
          
          {!isMyMessage && (
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={() => handleAction(() => onReport(message.id))}
            >
              <Flag size={20} color={colors.error} />
              <Text style={[styles.actionText, { color: colors.error }]}>Report</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
});