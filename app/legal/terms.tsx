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

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Terms of Service',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.title}>Terms of Service</Text>
          <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By accessing and using Floatr, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.text}>
            Permission is granted to temporarily download one copy of Floatr per device for personal, non-commercial transitory viewing only.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.text}>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Prohibited Uses</Text>
          <Text style={styles.text}>
            You may not use our service:
          </Text>
          <Text style={styles.bulletPoint}>• For any unlawful purpose</Text>
          <Text style={styles.bulletPoint}>• To harass, abuse, or harm others</Text>
          <Text style={styles.bulletPoint}>• To transmit spam or unsolicited messages</Text>
          <Text style={styles.bulletPoint}>• To impersonate others</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Safety and Conduct</Text>
          <Text style={styles.text}>
            Users are responsible for their own safety when meeting others through the app. Floatr is not responsible for any incidents that occur during meetups.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Privacy Policy</Text>
          <Text style={styles.text}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Termination</Text>
          <Text style={styles.text}>
            We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
          <Text style={styles.text}>
            We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Information</Text>
          <Text style={styles.text}>
            If you have any questions about these Terms of Service, please contact us at legal@floatr.app
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