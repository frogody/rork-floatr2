import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Send, Info, Phone, Video, MoreVertical, Flag, UserX, Camera, Image as ImageIcon } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useMatchStore } from '@/store/matchStore';
import { Message } from '@/types';
import ReportModal from '@/components/ReportModal';
import BlockModal from '@/components/BlockModal';
import MessageActions from '@/components/MessageActions';
import TypingIndicator from '@/components/TypingIndicator';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { matches, messages, fetchMessages, sendMessage, isLoading } = useMatchStore();
  const [inputText, setInputText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const match = matches.find(m => m.id === id);
  const chatMessages = messages[id as string] || [];

  useEffect(() => {
    if (id) {
      fetchMessages(id);
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chatMessages]);

  // Simulate typing indicator
  useEffect(() => {
    if (inputText.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [inputText]);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    sendMessage(id as string, inputText.trim());
    setInputText('');
    setReplyingTo(null);
  };

  const handleOptionsPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowOptions(!showOptions);
  };

  const handleReport = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowOptions(false);
    setShowReportModal(true);
  };

  const handleBlock = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowOptions(false);
    setShowBlockModal(true);
  };

  const handleReportSubmit = (reason: string, details: string) => {
    // In a real app, this would send the report to the backend
    console.log('Report submitted:', { reason, details, userId: match?.crewId });
  };

  const handleBlockUser = () => {
    // In a real app, this would block the user in the backend
    console.log('User blocked:', match?.crewId);
    router.back();
  };

  const handleMessageLongPress = async (messageId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowMessageActions(messageId);
  };

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    setShowMessageActions(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    // In a real app, this would delete the message
    console.log('Delete message:', messageId);
    setShowMessageActions(null);
  };

  const handleReportMessage = (messageId: string) => {
    // In a real app, this would report the message
    console.log('Report message:', messageId);
    setShowMessageActions(null);
  };

  const handleMediaPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      'Share Media',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => console.log('Open camera') },
        { text: 'Photo Library', onPress: () => console.log('Open photo library') },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.senderId === 'me';
    const replyMessage = replyingTo === item.id ? chatMessages.find(m => m.id === replyingTo) : null;
    
    return (
      <TouchableOpacity
        onLongPress={() => handleMessageLongPress(item.id)}
        style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}
      >
        <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]}>
          {replyMessage && (
            <View style={styles.replyContainer}>
              <Text style={styles.replyText} numberOfLines={1}>
                Replying to: {replyMessage.content}
              </Text>
            </View>
          )}
          
          <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
            {item.content}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMe ? styles.myMessageTime : styles.theirMessageTime]}>
              {formatTime(item.sentAt)}
            </Text>
            {isMe && (
              <Text style={styles.messageStatus}>✓✓</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (date: Date) => {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: match?.crewName || 'Chat',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleOptionsPress}>
                <MoreVertical size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {showOptions && (
        <Pressable style={styles.overlay} onPress={() => setShowOptions(false)}>
          <View style={styles.optionsMenu}>
            <TouchableOpacity style={styles.optionItem} onPress={handleReport}>
              <Flag size={16} color={colors.error} />
              <Text style={[styles.optionText, { color: colors.error }]}>Report User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={handleBlock}>
              <UserX size={16} color={colors.error} />
              <Text style={[styles.optionText, { color: colors.error }]}>Block User</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.chatHeader}>
                <Image 
                  source={{ uri: match?.photoUrl }} 
                  style={styles.chatImage}
                />
                <Text style={styles.chatLocation}>{match?.location}</Text>
                <Text style={styles.chatPrompt}>
                  Start planning your raft-up with {match?.crewName}
                </Text>
              </View>
            )}
            ListFooterComponent={() => isTyping ? <TypingIndicator visible={true} /> : null}
          />
          
          {replyingTo && (
            <View style={styles.replyBar}>
              <Text style={styles.replyBarText}>
                Replying to message...
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Text style={styles.replyBarCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleMediaPress}>
              <Camera size={20} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={colors.text.secondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            
            <TouchableOpacity 
              style={[styles.sendButton, !inputText.trim() && styles.disabledSendButton]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </>
      )}
      
      <Modal
        visible={showMessageActions !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMessageActions(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowMessageActions(null)}>
          <View style={styles.messageActionsContainer}>
            {showMessageActions && (
              <MessageActions
                messageId={showMessageActions}
                messageText={chatMessages.find(m => m.id === showMessageActions)?.content || ''}
                isMyMessage={chatMessages.find(m => m.id === showMessageActions)?.senderId === 'me'}
                onReply={handleReply}
                onDelete={handleDeleteMessage}
                onReport={handleReportMessage}
                onClose={() => setShowMessageActions(null)}
              />
            )}
          </View>
        </Pressable>
      </Modal>
      
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        userName={match?.crewName || 'User'}
        onSubmit={handleReportSubmit}
      />
      
      <BlockModal
        visible={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        userName={match?.crewName || 'User'}
        onBlock={handleBlockUser}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsMenu: {
    position: 'absolute',
    top: 90,
    right: 16,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  chatImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  chatLocation: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  chatPrompt: {
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: colors.background.card,
    borderBottomLeftRadius: 4,
  },
  replyContainer: {
    borderLeftWidth: 3,
    borderLeftColor: 'rgba(255,255,255,0.3)',
    paddingLeft: 8,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  myMessageText: {
    color: colors.text.primary,
  },
  theirMessageText: {
    color: colors.text.primary,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirMessageTime: {
    color: colors.text.secondary,
  },
  messageStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  messageActionsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  replyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  replyBarText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  replyBarCancel: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    maxHeight: 120,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
});