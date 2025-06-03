import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView 
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Privacy Policy',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.text}>
            We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with other users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          <Text style={styles.text}>
            With your permission, we collect and process information about your location to help you discover nearby boaters and plan meetups.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.text}>
            We use the information we collect to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and maintain our service</Text>
          <Text style={styles.bulletPoint}>• Connect you with other boaters</Text>
          <Text style={styles.bulletPoint}>• Send you notifications</Text>
          <Text style={styles.bulletPoint}>• Improve our service</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information Sharing</Text>
          <Text style={styles.text}>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.text}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.text}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal data</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>• Export your data</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cookies and Tracking</Text>
          <Text style={styles.text}>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.text}>
            Our service is not intended for children under 18. We do not knowingly collect personal information from children under 18.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.text}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.text}>
            If you have any questions about this Privacy Policy, please contact us at privacy@floatr.app
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
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 4,
  },
});