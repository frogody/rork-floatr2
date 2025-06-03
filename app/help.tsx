import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Book, 
  Video,
  ChevronRight,
  ExternalLink
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface HelpItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress: () => void;
}

export default function HelpScreen() {
  const handleContactSupport = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Contact Support', 'This would open email client or support chat.');
  };

  const handleCallSupport = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Call Support', 'This would initiate a phone call to support.');
  };

  const handleFAQ = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/help/faq');
  };

  const handleUserGuide = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('User Guide', 'This would open the user guide or tutorial.');
  };

  const handleVideoTutorials = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Video Tutorials', 'This would open video tutorials.');
  };

  const helpItems: HelpItem[] = [
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions',
      icon: <Book size={20} color={colors.text.primary} />,
      onPress: handleFAQ,
    },
    {
      id: 'guide',
      title: 'User Guide',
      description: 'Learn how to use Floatr effectively',
      icon: <Book size={20} color={colors.text.primary} />,
      onPress: handleUserGuide,
    },
    {
      id: 'videos',
      title: 'Video Tutorials',
      description: 'Watch step-by-step tutorials',
      icon: <Video size={20} color={colors.text.primary} />,
      onPress: handleVideoTutorials,
    },
    {
      id: 'chat',
      title: 'Live Chat Support',
      description: 'Chat with our support team',
      icon: <MessageCircle size={20} color={colors.text.primary} />,
      onPress: handleContactSupport,
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us an email for detailed help',
      icon: <Mail size={20} color={colors.text.primary} />,
      onPress: handleContactSupport,
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: <Phone size={20} color={colors.text.primary} />,
      onPress: handleCallSupport,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Help & Support',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How can we help you?</Text>
          <Text style={styles.subtitle}>
            Choose from the options below or contact our support team directly
          </Text>
        </View>
        
        <View style={styles.helpItems}>
          {helpItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.helpItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.helpIcon}>
                {item.icon}
              </View>
              
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>{item.title}</Text>
                <Text style={styles.helpDescription}>{item.description}</Text>
              </View>
              
              <ChevronRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Still need help?</Text>
          <Text style={styles.footerText}>
            Our support team is available 24/7 to assist you with any questions or issues.
          </Text>
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
  helpItems: {
    paddingHorizontal: 16,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});