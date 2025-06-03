import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { FileText, ExternalLink, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

interface LegalItem {
  id: string;
  title: string;
  description: string;
  onPress: () => void;
}

export default function LegalScreen() {
  const handleTermsPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would open the terms of service
  };

  const handlePrivacyPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would open the privacy policy
  };

  const handleCommunityPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would open community guidelines
  };

  const handleSafetyPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // In a real app, this would open safety guidelines
  };

  const legalItems: LegalItem[] = [
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      onPress: handleTermsPress,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'Learn how we protect your data',
      onPress: handlePrivacyPress,
    },
    {
      id: 'community',
      title: 'Community Guidelines',
      description: 'Rules for respectful interaction',
      onPress: handleCommunityPress,
    },
    {
      id: 'safety',
      title: 'Safety Guidelines',
      description: 'Boating safety and best practices',
      onPress: handleSafetyPress,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Legal',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Legal Information</Text>
          <Text style={styles.subtitle}>
            Important documents and guidelines for using Floatr
          </Text>
        </View>
        
        <View style={styles.legalItems}>
          {legalItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.legalItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.legalIcon}>
                <FileText size={20} color={colors.text.primary} />
              </View>
              
              <View style={styles.legalContent}>
                <Text style={styles.legalTitle}>{item.title}</Text>
                <Text style={styles.legalDescription}>{item.description}</Text>
              </View>
              
              <ExternalLink size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Floatr, you agree to our Terms of Service and Privacy Policy. 
            These documents are regularly updated to reflect changes in our practices and applicable laws.
          </Text>
          
          <Text style={styles.lastUpdated}>
            Last updated: December 2024
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
  legalItems: {
    paddingHorizontal: 16,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  legalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  legalContent: {
    flex: 1,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  legalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});