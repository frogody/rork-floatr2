import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  MessageCircle, 
  Shield, 
  HelpCircle, 
  FileText,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

const helpSections = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions',
    icon: HelpCircle,
    route: '/help/faq',
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    description: 'Water safety and emergency procedures',
    icon: Shield,
    route: '/help/safety',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    description: 'Help us improve the app',
    icon: MessageCircle,
    route: '/help/feedback',
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    description: 'Important emergency numbers',
    icon: Phone,
    route: '/help/emergency',
  },
];

const contactOptions = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'support@floatr.app',
    icon: Mail,
    action: () => {
      // In a real app, this would open email client
      console.log('Open email client');
    },
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: '1-800-FLOATR',
    icon: Phone,
    action: () => {
      // In a real app, this would make a phone call
      console.log('Make phone call');
    },
  },
];

export default function HelpScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const handleSectionPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Help Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Help Topics
          </Text>
          
          <View style={styles.sectionContent}>
            {helpSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <TouchableOpacity
                  key={section.id}
                  style={[styles.helpItem, { backgroundColor: colors.surface.primary }]}
                  onPress={() => handleSectionPress(section.route)}
                >
                  <View style={[styles.helpIcon, { backgroundColor: colors.background.secondary }]}>
                    <IconComponent size={24} color={colors.primary} />
                  </View>
                  
                  <View style={styles.helpContent}>
                    <Text style={[styles.helpTitle, { color: colors.text.primary }]}>
                      {section.title}
                    </Text>
                    <Text style={[styles.helpDescription, { color: colors.text.secondary }]}>
                      {section.description}
                    </Text>
                  </View>
                  
                  <ChevronRight size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Contact Support
          </Text>
          
          <View style={styles.sectionContent}>
            {contactOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.contactItem, { backgroundColor: colors.surface.primary }]}
                  onPress={option.action}
                >
                  <View style={[styles.contactIcon, { backgroundColor: colors.background.secondary }]}>
                    <IconComponent size={20} color={colors.primary} />
                  </View>
                  
                  <View style={styles.contactContent}>
                    <Text style={[styles.contactTitle, { color: colors.text.primary }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.contactDescription, { color: colors.text.secondary }]}>
                      {option.description}
                    </Text>
                  </View>
                  
                  <ExternalLink size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            App Information
          </Text>
          
          <View style={[styles.infoCard, { backgroundColor: colors.surface.primary }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Version</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>1.0.0</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Build</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>2024.1.1</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Platform</Text>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>React Native</Text>
            </View>
          </View>
        </View>

        {/* Legal Links */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.legalLink, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/legal/terms')}
          >
            <FileText size={20} color={colors.text.secondary} />
            <Text style={[styles.legalText, { color: colors.text.primary }]}>
              Terms of Service
            </Text>
            <ChevronRight size={16} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.legalLink, { backgroundColor: colors.surface.primary }]}
            onPress={() => router.push('/legal/privacy')}
          >
            <FileText size={20} color={colors.text.secondary} />
            <Text style={[styles.legalText, { color: colors.text.primary }]}>
              Privacy Policy
            </Text>
            <ChevronRight size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  helpIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 8,
  },
  legalText: {
    flex: 1,
    fontSize: 16,
  },
});