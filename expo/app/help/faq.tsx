import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { ChevronDown, ChevronUp, Search } from 'lucide-react-native';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'How does Floatr matching work?',
      answer: "Floatr uses your location, preferences, and boat details to match you with nearby boaters. When you like a crew and they like you back, it's a match! You can then message each other to coordinate meetups on the water.",
      category: 'general',
    },
    {
      id: '2',
      question: 'Is my location always visible to other users?',
      answer: "Your precise location is never shared with other users without your permission. We only show approximate distances (e.g., \"2 miles away\") to protect your privacy. You can choose to share your exact location with matches through the messaging feature.",
      category: 'privacy',
    },
    {
      id: '3',
      question: 'How do I verify my boat?',
      answer: "To verify your boat, go to Profile > Edit Boat Details and tap \"Verify Boat.\" You'll need to upload photos of your boat registration or documentation, and our team will review it within 48 hours. Verified boats get a special badge and higher visibility in search results.",
      category: 'account',
    },
    {
      id: '4',
      question: 'What is Floatr Premium?',
      answer: "Floatr Premium is our subscription service that offers enhanced features like unlimited likes, advanced filters, \"see who liked you,\" profile boosts, and ad-free experience. You can subscribe monthly or annually through your app store account.",
      category: 'premium',
    },
    {
      id: '5',
      question: 'How do I report inappropriate behavior?',
      answer: "If you encounter inappropriate behavior, tap the three dots in the top right of a profile or conversation and select \"Report.\" Choose the reason for reporting and provide details. Our safety team reviews all reports within 24 hours and takes appropriate action.",
      category: 'safety',
    },
    {
      id: '6',
      question: 'Can I use Floatr without a boat?',
      answer: "Yes! Floatr is for everyone who loves being on the water. You can create a profile as a crew member looking to join boats, or as a boat owner looking for crew or other boats to meet up with.",
      category: 'general',
    },
    {
      id: '7',
      question: 'How do I delete my account?',
      answer: "To delete your account, go to Settings > Account > Delete Account. Please note that this action is permanent and will delete all your data, matches, and conversations.",
      category: 'account',
    },
    {
      id: '8',
      question: 'Is Floatr available internationally?',
      answer: "Currently, Floatr is available in the United States, Canada, Australia, and select European countries. We're expanding to new regions regularly, so check our website for the latest availability information.",
      category: 'general',
    },
  ];
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'general', name: 'General' },
    { id: 'account', name: 'Account' },
    { id: 'privacy', name: 'Privacy' },
    { id: 'safety', name: 'Safety' },
    { id: 'premium', name: 'Premium' },
  ];
  
  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);
  
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Frequently Asked Questions",
        }}
      />
      
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                activeCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  activeCategory === category.id && styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredFAQs.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.faqItem,
              expandedId === item.id && styles.faqItemExpanded,
            ]}
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              {expandedId === item.id ? (
                <ChevronUp size={20} color={colors.text.tertiary} />
              ) : (
                <ChevronDown size={20} color={colors.text.tertiary} />
              )}
            </View>
            
            {expandedId === item.id && (
              <View style={styles.faqAnswer}>
                <Text style={styles.faqAnswerText}>{item.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.surface.secondary,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
  },
  categoryButtonTextActive: {
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  faqItem: {
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  faqItemExpanded: {
    backgroundColor: colors.surface.secondary,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 22,
  },
  spacer: {
    height: 40,
  },
});