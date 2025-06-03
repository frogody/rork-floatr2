import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  LifeBuoy, 
  MessageCircleQuestion, 
  AlertTriangle, 
  MessageSquarePlus, 
  ChevronRight 
} from 'lucide-react-native';
import colors from '@/constants/colors';
import EmergencyButton from '@/components/EmergencyButton';

const helpSections = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Get answers to common questions',
    icon: <MessageCircleQuestion size={24} color={colors.text.primary} />,
    route: '/help/faq',
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    description: 'Important safety information for boating',
    icon: <AlertTriangle size={24} color={colors.status.warning} />,
    route: '/help/safety',
  },
  {
    id: 'feedback',
    title: 'Send Feedback',
    description: 'Help us improve your experience',
    icon: <MessageSquarePlus size={24} color={colors.text.primary} />,
    route: '/help/feedback',
  },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Help & Support",
          headerRight: () => (
            <EmergencyButton />
          ),
        }}
      />
      
      <StatusBar style="light" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LifeBuoy size={32} color={colors.primary} />
          <Text style={styles.headerTitle}>How can we help?</Text>
          <Text style={styles.headerSubtitle}>
            Get support and learn more about using Floatr
          </Text>
        </View>

        <View style={styles.sections}>
          {helpSections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.sectionCard}
              onPress={() => router.push(section.route)}
            >
              <View style={styles.sectionContent}>
                <View style={styles.sectionIcon}>
                  {section.icon}
                </View>
                <View style={styles.sectionText}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
                <ChevronRight size={20} color={colors.text.secondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>Emergency?</Text>
          <Text style={styles.emergencyDescription}>
            If you're in immediate danger or need urgent assistance, tap below to contact emergency services.
          </Text>
          <EmergencyButton style={styles.emergencyButton} />
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
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  sections: {
    marginTop: 16,
  },
  sectionCard: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 16,
  },
  sectionText: {
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
  emergencySection: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.status.error,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emergencyButton: {
    marginTop: 8,
  },
});