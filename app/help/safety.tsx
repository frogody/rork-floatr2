import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { Shield, AlertTriangle, Navigation, Anchor, Users, Smartphone } from 'lucide-react-native';

export default function SafetyTipsScreen() {
  const safetyTips = [
    {
      id: '1',
      title: 'Meet in Public Places',
      description: 'Always meet new boating connections in public, well-populated areas like marinas or popular sandbars.',
      icon: <Users size={24} color={colors.status.info} />,
    },
    {
      id: '2',
      title: 'Share Your Plans',
      description: 'Let friends or family know where you're going and who you're meeting. Share your location with trusted contacts.',
      icon: <Smartphone size={24} color={colors.status.info} />,
    },
    {
      id: '3',
      title: 'Follow Boating Regulations',
      description: 'Always adhere to local boating laws, speed limits, and no-wake zones. Never operate a vessel while intoxicated.',
      icon: <Navigation size={24} color={colors.status.warning} />,
    },
    {
      id: '4',
      title: 'Check Weather Conditions',
      description: 'Always check marine forecasts before heading out. Don't hesitate to cancel plans if conditions are unfavorable.',
      icon: <AlertTriangle size={24} color={colors.status.warning} />,
    },
    {
      id: '5',
      title: 'Maintain Communication',
      description: 'Keep your phone charged and in a waterproof case. Consider a VHF radio for areas with poor cell coverage.',
      icon: <Smartphone size={24} color={colors.status.success} />,
    },
    {
      id: '6',
      title: 'Trust Your Instincts',
      description: 'If something doesn't feel right, it probably isn't. Don't hesitate to end an encounter that makes you uncomfortable.',
      icon: <Shield size={24} color={colors.status.success} />,
    },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Safety Tips",
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <Shield size={40} color={colors.text.primary} />
            <Text style={styles.title}>Stay Safe on the Water</Text>
            <Text style={styles.subtitle}>
              Follow these tips to ensure a safe and enjoyable experience
            </Text>
          </View>
        </View>
        
        <View style={styles.tipsContainer}>
          {safetyTips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                {tip.icon}
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyTitle}>In Case of Emergency</Text>
          <Text style={styles.emergencyDescription}>
            If you find yourself in an emergency situation on the water:
          </Text>
          <View style={styles.emergencySteps}>
            <Text style={styles.emergencyStep}>1. Call 911 or Coast Guard (VHF Channel 16)</Text>
            <Text style={styles.emergencyStep}>2. Use the Emergency Button in the Floatr app</Text>
            <Text style={styles.emergencyStep}>3. Signal for help with visual distress signals</Text>
          </View>
        </View>
        
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
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  tipsContainer: {
    padding: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  emergencyContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.status.error,
  },
  emergencyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: colors.status.error,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  emergencySteps: {
    marginTop: 8,
  },
  emergencyStep: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  spacer: {
    height: 40,
  },
});