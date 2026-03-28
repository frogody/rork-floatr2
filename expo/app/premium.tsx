import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { X } from 'lucide-react-native';
import Button from '@/components/Button';
import PremiumFeatureCard from '@/components/PremiumFeatureCard';
import colors from '@/constants/colors';
import { premiumFeatures } from '@/mocks/crews';
import { LinearGradient } from 'expo-linear-gradient';

export default function PremiumScreen() {
  const handleClose = () => {
    router.back();
  };

  const handleSubscribe = () => {
    Alert.alert(
      'Premium Subscription',
      'In a real app, this would open the in-app purchase flow.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerTitle: '',
          headerTransparent: true,
        }}
      />
      
      <LinearGradient
        colors={['rgba(236, 72, 153, 0.8)', 'rgba(59, 130, 246, 0.8)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Go Floatr Premium</Text>
          <Text style={styles.subtitle}>Unlock the full boating experience</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {premiumFeatures.map((feature) => (
            <PremiumFeatureCard key={feature.id} feature={feature} />
          ))}
        </View>
        
        <View style={styles.pricingContainer}>
          <Text style={styles.pricingTitle}>Choose Your Plan</Text>
          
          <TouchableOpacity style={[styles.planCard, styles.selectedPlan]}>
            <View>
              <Text style={styles.planName}>Annual</Text>
              <Text style={styles.planPrice}>$79.99/year</Text>
            </View>
            <Text style={styles.planSaving}>Save 33%</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.planCard}>
            <View>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planPrice}>$9.99/month</Text>
            </View>
          </TouchableOpacity>
          
          <Text style={styles.pricingNote}>
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
          </Text>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Subscribe Now"
          onPress={handleSubscribe}
          variant="primary"
          size="large"
          gradient
          gradientColors={colors.gradient.sunset}
          style={styles.subscribeButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: 120,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.9,
  },
  featuresContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  pricingContainer: {
    marginHorizontal: 16,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  planSaving: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pricingNote: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: colors.background.dark,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  subscribeButton: {
    width: '100%',
  },
});