import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Phone, Shield, AlertTriangle, MapPin, Share2, Users, Clock, MessageSquare } from 'lucide-react-native';
import colors from '@/constants/colors';
import { analytics } from '@/utils/analytics';

export default function SafetyTips() {
  const router = useRouter();
  
  React.useEffect(() => {
    analytics.trackEvent('view_safety');
  }, []);

  const navigateToEmergency = () => {
    router.push('/help/emergency');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Shield size={32} color={colors.primary} />
          <Text style={styles.title}>Safety Tips for Boaters</Text>
        </View>
        
        <Text style={styles.subtitle}>Stay Safe While Meeting New Crews</Text>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <MapPin size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Meet in Public Places</Text>
          </View>
          <Text style={styles.tipText}>
            Always meet new connections in public marinas, docks, or boat clubs. Avoid isolated areas for first meetings.
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Share2 size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Share Your Plans</Text>
          </View>
          <Text style={styles.tipText}>
            Let friends or family know where you are going and who you are meeting. Share your location with trusted contacts.
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Users size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Bring a Friend</Text>
          </View>
          <Text style={styles.tipText}>
            Consider bringing a friend along for your first meeting with a new connection, especially if you are the boat owner.
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Clock size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Start with Short Trips</Text>
          </View>
          <Text style={styles.tipText}>
            For first outings, plan short trips during daylight hours rather than overnight or extended journeys.
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <MessageSquare size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Keep Communication on the App</Text>
          </View>
          <Text style={styles.tipText}>
            Maintain conversations within the Floatr app until you feel comfortable sharing personal contact information.
          </Text>
        </View>
        
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <AlertTriangle size={24} color={colors.primary} />
            <Text style={styles.tipTitle}>Trust Your Instincts</Text>
          </View>
          <Text style={styles.tipText}>
            If something feels wrong or uncomfortable, trust your gut feeling. Do not hesitate to end a meeting or decline an invitation.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.emergencyButton} onPress={navigateToEmergency}>
          <Phone size={20} color="#fff" />
          <Text style={styles.emergencyButtonText}>Emergency Resources</Text>
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Floatr is committed to creating a safe community for boaters, but please remember that you are responsible for your own safety. Always exercise caution when meeting new people.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.secondary,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginLeft: 10,
  },
  tipText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 22,
  },
  emergencyButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});