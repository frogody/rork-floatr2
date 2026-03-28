import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PremiumFeature } from '@/types';
import colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
}

export default function PremiumFeatureCard({ feature }: PremiumFeatureCardProps) {
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[feature.icon.charAt(0).toUpperCase() + feature.icon.slice(1)];
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent size={20} color={colors.text.primary} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{feature.name}</Text>
        <Text style={styles.description}>{feature.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});