import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Cloud, 
  Users, 
  Shield,
  ExternalLink
} from 'lucide-react-native';
import colors from '@/constants/colors';
import EmergencyButton from '@/components/EmergencyButton';

export default function SafetyScreen() {
  const handleLinkPress = async (url: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  const safetyTips = [
    {
      icon: <Cloud size={20} color={colors.primary} />,
      title: 'Check Weather Conditions',
      description: 'Always check marine weather forecasts before heading out. Avoid boating in severe weather conditions.',
    },
    {
      icon: <Users size={20} color={colors.primary} />,
      title: 'Tell Someone Your Plans',
      description: 'Always inform someone on shore about your boating plans, including destination and expected return time.',
    },
    {
      icon: <Shield size={20} color={colors.primary} />,
      title: 'Wear Life Jackets',
      description: 'Ensure all passengers have properly fitted life jackets. They should be worn at all times on deck.',
    },
    {
      icon: <MapPin size={20} color={colors.primary} />,
      title: 'Know Your Location',
      description: 'Always know your exact location and have multiple navigation methods available.',
    },
  ];

  const emergencyContacts = [
    {
      name: 'US Coast Guard',
      number: '*CG (#24)',
      description: 'For maritime emergencies',
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'For immediate life-threatening emergencies',
    },
    {
      name: 'Marine Assistance',
      number: '1-800-SEA-TOW',
      description: 'For non-emergency towing and assistance',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Boating Safety',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>Emergency Assistance</Text>
          <Text style={styles.emergencyDescription}>
            If you are in immediate danger, use the emergency button below to call for help and share your location.
          </Text>
          <EmergencyButton style={styles.emergencyButton} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          {safetyTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                {tip.icon}
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactCard}
              onPress={() => handleLinkPress(`tel:${contact.number}`)}
            >
              <Phone size={20} color={colors.text.primary} />
              <View style={styles.contactContent}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => handleLinkPress('https://www.uscgboating.org/')}
          >
            <ExternalLink size={20} color={colors.primary} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>US Coast Guard Boating Safety</Text>
              <Text style={styles.resourceDescription}>Official boating safety information and courses</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceCard}
            onPress={() => handleLinkPress('https://weather.gov/marine')}
          >
            <ExternalLink size={20} color={colors.primary} />
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Marine Weather Forecasts</Text>
              <Text style={styles.resourceDescription}>Current marine weather conditions and forecasts</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.disclaimer}>
          <AlertTriangle size={16} color={colors.warning} />
          <Text style={styles.disclaimerText}>
            This app is not a substitute for proper marine safety equipment and training. 
            Always follow local boating regulations and safety guidelines.
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
  emergencySection: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emergencyButton: {
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactContent: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceContent: {
    flex: 1,
    marginLeft: 16,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 32,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.warning,
    lineHeight: 18,
  },
});