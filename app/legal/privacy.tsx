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

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Privacy Policy",
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last Updated: June 3, 2025</Text>
        
        <Text style={styles.heading}>Privacy Policy</Text>
        
        <Text style={styles.paragraph}>
          At Floatr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>
        
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        
        <Text style={styles.paragraph}>
          We collect information that you provide directly to us when you:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Create an account</Text>
          <Text style={styles.bulletItem}>• Complete your profile</Text>
          <Text style={styles.bulletItem}>• Upload photos</Text>
          <Text style={styles.bulletItem}>• Communicate with other users</Text>
          <Text style={styles.bulletItem}>• Contact our support team</Text>
          <Text style={styles.bulletItem}>• Respond to surveys or promotions</Text>
        </View>
        
        <Text style={styles.paragraph}>
          This information may include:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Name and contact information</Text>
          <Text style={styles.bulletItem}>• Profile information and preferences</Text>
          <Text style={styles.bulletItem}>• Photos and media</Text>
          <Text style={styles.bulletItem}>• Messages and communication content</Text>
          <Text style={styles.bulletItem}>• Location data</Text>
          <Text style={styles.bulletItem}>• Device information</Text>
        </View>
        
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Provide, maintain, and improve our services</Text>
          <Text style={styles.bulletItem}>• Process and complete transactions</Text>
          <Text style={styles.bulletItem}>• Send you technical notices and support messages</Text>
          <Text style={styles.bulletItem}>• Respond to your comments and questions</Text>
          <Text style={styles.bulletItem}>• Develop new products and services</Text>
          <Text style={styles.bulletItem}>• Monitor and analyze usage patterns</Text>
          <Text style={styles.bulletItem}>• Prevent fraudulent transactions and monitor against theft</Text>
          <Text style={styles.bulletItem}>• Personalize your experience</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Sharing Your Information</Text>
        
        <Text style={styles.paragraph}>
          We may share your information with:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Other users as part of the normal operation of the service</Text>
          <Text style={styles.bulletItem}>• Service providers who perform services on our behalf</Text>
          <Text style={styles.bulletItem}>• Third parties in connection with a business transfer</Text>
          <Text style={styles.bulletItem}>• Law enforcement or other third parties as required by law</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Your Choices</Text>
        
        <Text style={styles.paragraph}>
          You can control your information through:
        </Text>
        
        <View style={styles.bulletList}>
          <Text style={styles.bulletItem}>• Account Settings: Update or correct your profile information</Text>
          <Text style={styles.bulletItem}>• Location Services: Control when we collect your precise location</Text>
          <Text style={styles.bulletItem}>• Push Notifications: Manage notifications in your device settings</Text>
          <Text style={styles.bulletItem}>• Marketing Communications: Opt out of promotional emails</Text>
        </View>
        
        <Text style={styles.sectionTitle}>Data Security</Text>
        
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
        </Text>
        
        <Text style={styles.sectionTitle}>International Data Transfers</Text>
        
        <Text style={styles.paragraph}>
          Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ.
        </Text>
        
        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        
        <Text style={styles.paragraph}>
          Our service is not directed to children under 18. We do not knowingly collect personal information from children under 18. If we learn we have collected personal information of a child under 18, we will delete such information.
        </Text>
        
        <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
        
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        
        <Text style={styles.contactInfo}>
          privacy@floatr.com
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