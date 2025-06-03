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

export default function TermsOfServiceScreen() {
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
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using Floatr ("the App"), you accept and agree to be bound by the terms and provision of this agreement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use License</Text>
          <Text style={styles.sectionText}>
            Permission is granted to temporarily use Floatr for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Conduct</Text>
          <Text style={styles.sectionText}>
            You agree to use Floatr responsibly and in accordance with all applicable laws. You will not use the App to harass, abuse, or harm others.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Safety and Boating</Text>
          <Text style={styles.sectionText}>
            Floatr is designed to help boaters connect safely. Always follow maritime safety regulations, check weather conditions, and inform others of your plans before meeting.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Privacy</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Disclaimer</Text>
          <Text style={styles.sectionText}>
            The materials on Floatr are provided on an "as is" basis. Floatr makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitations</Text>
          <Text style={styles.sectionText}>
            In no event shall Floatr or its suppliers be liable for any damages arising out of the use or inability to use the materials on Floatr.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact Information</Text>
          <Text style={styles.sectionText}>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
});