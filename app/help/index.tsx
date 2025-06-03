import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { 
  HelpCircle, 
  Shield, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight,
  LifeBuoy,
  FileText,
  Mail
} from 'lucide-react-native';

export default function HelpScreen() {
  const router = useRouter();
  
  const helpSections = [
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions',
      icon: <HelpCircle size={24} color={colors.primary} />,
      route: '/help/faq',
    },
    {
      id: 'safety',
      title: 'Safety Tips',
      description: 'Stay safe while using Floatr',
      icon: <Shield size={24} color={colors.status.success} />,
      route: '/help/safety',
    },
    {
      id: 'emergency',
      title: 'Emergency Services',
      description: 'Get help in emergency situations',
      icon: <AlertTriangle size={24} color={colors.status.error} />,
      route: '/help/emergency',
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      description: 'Help us improve Floatr',
      icon: <MessageSquare size={24} color={colors.status.info} />,
      route: '/help/feedback',
    },
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: <Mail size={24} color={colors.secondary} />,
      route: '/help/feedback',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Read our terms of service',
      icon: <FileText size={24} color={colors.text.tertiary} />,
      route: '/legal/terms',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Read our privacy policy',
      icon: <FileText size={24} color={colors.text.tertiary} />,
      route: '/legal/privacy',
    },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Help & Support",
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LifeBuoy size={32} color={colors.text.primary} />
          </View>
          <Text style={styles.title}>How can we help you?</Text>
          <Text style={styles.subtitle}>
            Find answers, get support, and share your feedback
          </Text>
        </View>
        
        <View style={styles.sectionList}>
          {helpSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionItem}
              onPress={() => router.push(section.route)}
              activeOpacity={0.7}
            >
              <View style={styles.sectionIcon}>
                {section.icon}
              </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
              <ChevronRight size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Floatr v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.tertiary,
  },
});