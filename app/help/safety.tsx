import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  MapPin,
  Users,
  Eye,
  MessageCircle,
  Clock
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface SafetyTip {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'meeting' | 'communication' | 'emergency' | 'general';
}

export default function SafetyScreen() {
  const handleEmergencyCall = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Emergency Contacts', 'This would show emergency contact numbers for your area.');
  };

  const safetyTips: SafetyTip[] = [
    {
      id: '1',
      title: 'Meet in Public Waters',
      description: 'Always arrange to meet in well-traveled waterways or popular anchorages where other boaters are present.',
      icon: <Users size={20} color={colors.primary} />,
      category: 'meeting',
    },
    {
      id: '2',
      title: 'Share Your Plans',
      description: 'Tell someone on shore about your meetup plans, including location, time, and expected return.',
      icon: <MessageCircle size={20} color={colors.primary} />,
      category: 'meeting',
    },
    {
      id: '3',
      title: 'Trust Your Instincts',
      description: 'If something feels off about a person or situation, trust your gut and leave immediately.',
      icon: <Eye size={20} color={colors.primary} />,
      category: 'general',
    },
    {
      id: '4',
      title: 'Keep Emergency Contacts',
      description: 'Always have Coast Guard and local marine police numbers readily available.',
      icon: <Phone size={20} color={colors.error} />,
      category: 'emergency',
    },
    {
      id: '5',
      title: 'Share Live Location',
      description: 'Use the app to share your live location with trusted contacts during meetups.',
      icon: <MapPin size={20} color={colors.primary} />,
      category: 'meeting',
    },
    {
      id: '6',
      title: 'Meet During Daylight',
      description: 'Schedule initial meetups during daylight hours when visibility is good.',
      icon: <Clock size={20} color={colors.primary} />,
      category: 'meeting',
    },
    {
      id: '7',
      title: 'Verify Identity',
      description: 'Ask for additional photos or video chat before meeting to verify the person matches their profile.',
      icon: <Shield size={20} color={colors.primary} />,
      category: 'communication',
    },
    {
      id: '8',
      title: 'Report Suspicious Behavior',
      description: 'Report any inappropriate behavior, harassment, or safety concerns immediately.',
      icon: <AlertTriangle size={20} color={colors.warning} />,
      category: 'general',
    },
  ];

  const groupedTips = {
    meeting: safetyTips.filter(tip => tip.category === 'meeting'),
    communication: safetyTips.filter(tip => tip.category === 'communication'),
    emergency: safetyTips.filter(tip => tip.category === 'emergency'),
    general: safetyTips.filter(tip => tip.category === 'general'),
  };

  const renderTip = (tip: SafetyTip) => (
    <View key={tip.id} style={styles.tipCard}>
      <View style={styles.tipIcon}>
        {tip.icon}
      </View>
      <View style={styles.tipContent}>
        <Text style={styles.tipTitle}>{tip.title}</Text>
        <Text style={styles.tipDescription}>{tip.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Safety Guidelines',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Shield size={32} color={colors.primary} />
          <Text style={styles.headerTitle}>Your Safety Matters</Text>
          <Text style={styles.headerDescription}>
            Follow these guidelines to ensure safe and enjoyable meetups on the water.
          </Text>
        </View>

        <TouchableOpacity style={styles.emergencyCard} onPress={handleEmergencyCall}>
          <View style={styles.emergencyIcon}>
            <Phone size={24} color={colors.text.primary} />
          </View>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
            <Text style={styles.emergencyDescription}>
              Quick access to Coast Guard and marine police
            </Text>
          </View>
          <AlertTriangle size={20} color={colors.error} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Safely</Text>
          {groupedTips.meeting.map(renderTip)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication</Text>
          {groupedTips.communication.map(renderTip)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Preparedness</Text>
          {groupedTips.emergency.map(renderTip)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Safety</Text>
          {groupedTips.general.map(renderTip)}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Remember: Your safety is the top priority. Never hesitate to leave a situation that makes you uncomfortable.
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
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  section: {
    marginTop: 32,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 32,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.warning,
    textAlign: 'center',
    lineHeight: 20,
  },
});