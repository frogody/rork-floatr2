import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { FileText, Shield, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function LegalScreen() {
  const handleNavigation = async (path: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(path as any);
  };

  const legalItems = [
    {
      id: 'terms',
      title: 'Terms of Service',
      description: 'Our terms and conditions for using Floatr',
      icon: <FileText size={20} color={colors.text.primary} />,
      path: '/legal/terms',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your data',
      icon: <Shield size={20} color={colors.text.primary} />,
      path: '/legal/privacy',
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
          <Text style={styles.description}>
            Important legal documents and policies for using Floatr
          </Text>
        </View>

        <View style={styles.itemsList}>
          {legalItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.item}
              onPress={() => handleNavigation(item.path)}
            >
              <View style={styles.itemIcon}>
                {item.icon}
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using Floatr, you agree to our Terms of Service and Privacy Policy.
          </Text>
          <Text style={styles.footerText}>
            Last updated: January 1, 2024
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
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  itemsList: {
    gap: 1,
    marginBottom: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 16,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 4,
  },
});