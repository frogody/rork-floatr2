import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import colors from '@/constants/colors';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I find other boaters nearby?',
    answer: 'Use the Discover tab to swipe through profiles of boaters in your area. You can also check the Nearby tab to see boaters on a map view.',
  },
  {
    id: '2',
    question: 'What does "dropping anchor" mean?',
    answer: 'Dropping anchor lets other boaters know you are stationary and open to raft-ups. When anchored, you will appear as available to nearby boaters.',
  },
  {
    id: '3',
    question: 'How do I start a conversation?',
    answer: 'When you and another crew both wave at each other, you will create a match. You can then start chatting through the Matches tab.',
  },
  {
    id: '4',
    question: 'Is my location shared with everyone?',
    answer: 'Your location is only shared with nearby boaters when you have the app open and location sharing enabled. You can control this in Settings.',
  },
  {
    id: '5',
    question: 'What are the premium features?',
    answer: 'Premium includes unlimited swipes, Wave First (see who waved at you), incognito mode, read receipts, and access to exclusive meet-up zones.',
  },
  {
    id: '6',
    question: 'How do I report inappropriate behavior?',
    answer: 'You can report users by going to their profile and tapping the report button, or contact our support team directly.',
  },
  {
    id: '7',
    question: 'Can I use Floatr without a boat?',
    answer: 'Floatr is designed for boat owners and crews. However, you can join as a crew member if you are invited by a boat owner.',
  },
  {
    id: '8',
    question: 'How do I verify my boat?',
    answer: 'Boat verification helps build trust in the community. Contact support with your boat registration documents to get verified.',
  },
];

export default function FAQScreen() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = async (id: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'FAQ',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequently Asked Questions</Text>
          <Text style={styles.subtitle}>
            Find answers to the most common questions about Floatr
          </Text>
        </View>
        
        <View style={styles.faqList}>
          {faqData.map((item) => {
            const isExpanded = expandedItems.has(item.id);
            
            return (
              <View key={item.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqQuestion}
                  onPress={() => toggleExpanded(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.questionText}>{item.question}</Text>
                  {isExpanded ? (
                    <ChevronUp size={20} color={colors.text.secondary} />
                  ) : (
                    <ChevronDown size={20} color={colors.text.secondary} />
                  )}
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
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
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  faqList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  faqItem: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  answerText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginTop: 12,
  },
});