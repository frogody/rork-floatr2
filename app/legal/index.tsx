import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { FileText, Shield, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function LegalScreen() {
  const legalItems = [
    {
      title: 'Terms of Service',
      description: 'Our terms and conditions for using Floatr',
      icon: <FileText size={24} color={colors.primary} />,
      route: '/legal/terms',
    },
    {
      title: 'Privacy Policy',
      description: 'How we protect and use your data',
      icon: <Shield size={24} color={colors.primary} />,
      route: '/legal/privacy',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Legal Information</Text>
        <Text style={styles.subtitle}>
          Important legal documents and policies for Floatr
        </Text>
        
        <View style={styles.itemsContainer}>
          {legalItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={styles.itemLeft}>
                <View style={styles.iconContainer}>
                  {item.icon}
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  itemsContainer: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
    lineHeight: 18,
  },
});