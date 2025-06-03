import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Terms of Service",
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: June 3, 2025</Text>
        
        <Text style={styles.heading}>Terms of Service</Text>
        
        <Text style={styles.paragraph}>
          Welcome to Floatr! These Terms of Service ("Terms") govern your access to and use of the Floatr application, so please read them carefully before using our services.
        </Text>
        
        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        
        <Text style={styles.paragraph}>
          By creating a Floatr account or using any part of our services, you agree to be bound by these Terms. If you don't agree to these Terms, you may not use our services.
        </Text>
        
        <Text style={styles.sectionTitle}>Eligibility</Text>
        
        <Text style={styles.paragraph}>
          You must be at least 18 years old to create an account and use Floatr. By creating an account and using our services, you represent and warrant that:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• You are at least 18 years old</Text>
          <Text style={styles.bulletItem}>• You can form a binding contract with Floatr</Text>
          <Text style={styles.bulletItem}>• You are not a person barred from receiving services under the laws of the United States or any other applicable jurisdiction</Text>
          <Text style={styles.bulletItem}>• You will comply with these Terms and all applicable local, state, national, and international laws, rules, and regulations</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Your Account</Text>
        
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Create only one account for yourself</Text>
          <Text style={styles.bulletItem}>• Provide accurate, current, and complete information during registration</Text>
          <Text style={styles.bulletItem}>• Maintain and promptly update your account information</Text>
          <Text style={styles.bulletItem}>• Keep your password secure and confidential</Text>
          <Text style={styles.bulletItem}>• Notify us immediately of any unauthorized use of your account</Text>
        </View>
        
        <Text style={styles.sectionTitle}>User Content</Text>
        
        <Text style={styles.paragraph}>
          You are solely responsible for the content you post on Floatr, including photos, messages, and other materials. You agree not to post content that:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Is illegal, obscene, pornographic, or violent</Text>
          <Text style={styles.bulletItem}>• Promotes discrimination, bigotry, racism, or harm</Text>
          <Text style={styles.bulletItem}>• Infringes on intellectual property rights</Text>
          <Text style={styles.bulletItem}>• Contains viruses or malicious code</Text>
          <Text style={styles.bulletItem}>• Harasses, bullies, or intimidates others</Text>
          <Text style={styles.bulletItem}>• Impersonates any person or entity</Text>
          <Text style={styles.bulletItem}>• Contains spam, advertising, or solicitations</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Safety</Text>
        
        <Text style={styles.paragraph}>
          Floatr is designed to promote connections between boaters, but your safety is important. We recommend:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Meeting in public places initially</Text>
          <Text style={styles.bulletItem}>• Telling a friend or family member about your plans</Text>
          <Text style={styles.bulletItem}>• Staying sober during initial meetings</Text>
          <Text style={styles.bulletItem}>• Following all boating safety regulations</Text>
          <Text style={styles.bulletItem}>• Reporting suspicious behavior to us and authorities</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Premium Services</Text>
        
        <Text style={styles.paragraph}>
          Floatr offers premium features through subscription plans. By purchasing a subscription:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• You authorize us to charge your chosen payment method</Text>
          <Text style={styles.bulletItem}>• Subscriptions automatically renew until canceled</Text>
          <Text style={styles.bulletItem}>• You can cancel at any time through your app store account settings</Text>
          <Text style={styles.bulletItem}>• No refunds are provided for partial subscription periods</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Intellectual Property</Text>
        
        <Text style={styles.paragraph}>
          Floatr and its content, features, and functionality are owned by Floatr and are protected by copyright, trademark, and other intellectual property laws. You may not:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Copy, modify, or create derivative works</Text>
          <Text style={styles.bulletItem}>• Reverse engineer or decompile the app</Text>
          <Text style={styles.bulletItem}>• Remove copyright or trademark notices</Text>
          <Text style={styles.bulletItem}>• Use our trademarks without permission</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        
        <Text style={styles.paragraph}>
          To the maximum extent permitted by law, Floatr shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, resulting from your access to or use of our services.
        </Text>
        
        <Text style={styles.sectionTitle}>Indemnification</Text>
        
        <Text style={styles.paragraph}>
          You agree to indemnify, defend, and hold harmless Floatr and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of our services or your violation of these Terms.
        </Text>
        
        <Text style={styles.sectionTitle}>Termination</Text>
        
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate your account at any time for any reason without notice. You may terminate your account at any time by following the instructions in the app.
        </Text>
        
        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        
        <Text style={styles.paragraph}>
          We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our app and updating the "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at:
        </Text>
        
        <Text style={styles.contactInfo}>
          terms@floatr.com
        </Text>
        
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
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.tertiary,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  bulletItem: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
});