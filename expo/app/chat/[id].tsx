import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  MapPin,
  Camera,
  Mic
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isOwn: boolean;
  type: 'text' | 'location' | 'image';
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! Are you planning to go out on the water this weekend?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwn: false,
      type: 'text',
    },
    {
      id: '2',
      text: 'Yes! We are thinking about heading to the sandbar around 2 PM on Saturday. Want to join us?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isOwn: true,
      type: 'text',
    },
    {
      id: '3',
      text: 'That sounds perfect! What should I bring?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      isOwn: false,
      type: 'text',
    },
    {
      id: '4',
      text: 'Just bring some snacks and drinks to share. We have all the water toys and equipment covered!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      isOwn: true,
      type: 'text',
    },
  ]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const crew = mockCrews.find(c => c.id === id);
  
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date(),
        isOwn: true,
        type: 'text',
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      
      // Simulate response
      setTimeout(() => {
        const responses = [
          'Sounds great!',
          'Perfect, see you there!',
          'Looking forward to it!',
          'That works for me!',
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          isOwn: false,
          type: 'text',
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!crew) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background.primary }]}>
        <Text style={[styles.errorText, { color: colors.text.primary }]}>Chat not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: crew.name,
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Phone size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Video size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <MoreHorizontal size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.messageContainer,
              msg.isOwn ? styles.ownMessage : styles.otherMessage
            ]}
          >
            <View 
              style={[
                styles.messageBubble,
                {
                  backgroundColor: msg.isOwn ? colors.primary : colors.surface.primary,
                }
              ]}
            >
              <Text 
                style={[
                  styles.messageText,
                  { color: msg.isOwn ? colors.text.primary : colors.text.primary }
                ]}
              >
                {msg.text}
              </Text>
              <Text 
                style={[
                  styles.messageTime,
                  { color: msg.isOwn ? colors.text.primary : colors.text.secondary }
                ]}
              >
                {formatTime(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background.primary }]}>
        <View style={styles.inputActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface.primary }]}>
            <Camera size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface.primary }]}>
            <MapPin size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.messageInputContainer, { backgroundColor: colors.surface.primary }]}>
          <TextInput
            style={[styles.messageInput, { color: colors.text.primary }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.text.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Send size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface.primary }]}>
          <Mic size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  inputActions: {
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
});