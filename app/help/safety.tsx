import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, useColorScheme } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Phone, MapPin, Radio, Anchor, Users, Shield, Zap } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { EmergencyButton } from '@/components/EmergencyButton';

export default function SafetyCenterScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const handleEmergencyCall = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Emergency Call',
      'This would dial emergency services in a real app.',
      [{ text: 'OK' }]
    );
  };

  const safetyTips = [
    {
      icon: Radio,
      title: 'VHF Radio',
      description: 'Always carry a VHF radio and know how to use Channel 16 for emergencies',
      color: colors.primary,
    },
    {
      icon: Anchor,
      title: 'Float Plan',
      description: 'File a float plan with someone on shore before departing',
      color: colors.secondary,
    },
    {
      icon: Users,
      title: 'Safety Equipment',
      description: 'Ensure all passengers have properly fitted life jackets',
      color: colors.warning,
    },
    {
      icon: MapPin,
      title: 'Weather Check',
      description: 'Always check weather conditions before heading out',
      color: colors.error,
    },
  ];

  const emergencyContacts = [
    { name: 'Coast Guard', number: '911', description: 'For immediate emergencies' },
    { name: 'Marine Assistance', number: '1-800-SEA-TOW', description: 'For non-emergency towing' },
    { name: 'Weather Service', number: '1-888-NWS-1234', description: 'For weather updates' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Safety Center',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Emergency Section */}
        <View style={[styles.emergencySection, { backgroundColor: colors.error + '10', borderColor: colors.error }]}>
          <View style={styles.emergencyHeader}>
            <AlertTriangle size={24} color={colors.error} />
            <Text style={[styles.emergencyTitle, { color: colors.error }]}>Emergency</Text>
          </View>
          <Text style={[styles.emergencyDescription, { color: colors.text.secondary }]}>
            In case of immediate danger or emergency, use the button below to contact emergency services.
          </Text>
          <EmergencyButton onPress={handleEmergencyCall} />
        </View>

        {/* Safety Tips */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Safety Tips</Text>
          <View style={styles.tipsContainer}>
            {safetyTips.map((tip, index) => {
              const IconComponent = tip.icon;
              return (
                <View key={index} style={[styles.tipItem, { borderBottomColor: colors.border.primary }]}>
                  <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                    <IconComponent size={20} color={tip.color} />
                  </View>
                  <View style={styles.tipContent}>
                    <Text style={[styles.tipTitle, { color: colors.text.primary }]}>{tip.title}</Text>
                    <Text style={[styles.tipDescription, { color: colors.text.secondary }]}>{tip.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Emergency Contacts</Text>
          <View style={styles.contactsContainer}>
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.contactItem, { borderBottomColor: colors.border.primary }]}
                onPress={() => Alert.alert('Call', `Would call ${contact.number} in a real app`)}
              >
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text.primary }]}>{contact.name}</Text>
                  <Text style={[styles.contactDescription, { color: colors.text.secondary }]}>{contact.description}</Text>
                </View>
                <View style={styles.contactActions}>
                  <Phone size={20} color={colors.primary} />
                  <Text style={[styles.contactNumber, { color: colors.primary }]}>{contact.number}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety Resources */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Safety Resources</Text>
          
          <Button
            title="Create Float Plan"
            onPress={() => Alert.alert('Float Plan', 'This would open float plan creation')}
            variant="outline"
            size="medium"
            icon={<MapPin size={18} color={colors.primary} />}
            iconPosition="left"
            style={styles.resourceButton}
          />
          
          <Button
            title="Weather Alerts"
            onPress={() => router.push('/weather')}
            variant="outline"
            size="medium"
            icon={<Zap size={18} color={colors.primary} />}
            iconPosition="left"
            style={styles.resourceButton}
          />
          
          <Button
            title="Safety Checklist"
            onPress={() => Alert.alert('Safety Checklist', 'This would open a comprehensive safety checklist')}
            variant="outline"
            size="medium"
            icon={<Shield size={18} color={colors.primary} />}
            iconPosition="left"
            style={styles.resourceButton}
          />
        </View>

        {/* Safety Guidelines */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Safety Guidelines</Text>
          
          <View style={styles.guidelineItem}>
            <Text style={[styles.guidelineTitle, { color: colors.text.primary }]}>Before Departure</Text>
            <Text style={[styles.guidelineText, { color: colors.text.secondary }]}>
              {`• Check weather conditions and marine forecasts
• Inspect all safety equipment
• File a float plan with someone reliable
• Ensure fuel and supplies are adequate
• Verify all passengers have life jackets`}
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={[styles.guidelineTitle, { color: colors.text.primary }]}>While Underway</Text>
            <Text style={[styles.guidelineText, { color: colors.text.secondary }]}>
              {`• Monitor weather conditions continuously
• Maintain proper lookout at all times
• Follow navigation rules and regulations
• Keep VHF radio on Channel 16
• Stay within your experience level`}
            </Text>
          </View>
          
          <View style={styles.guidelineItem}>
            <Text style={[styles.guidelineTitle, { color: colors.text.primary }]}>Emergency Procedures</Text>
            <Text style={[styles.guidelineText, { color: colors.text.secondary }]}>
              {`• Call Mayday on VHF Channel 16 for life-threatening emergencies
• Use Pan-Pan for urgent but not life-threatening situations
• Know your exact position at all times
• Have emergency signaling devices ready
• Practice man overboard procedures`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emergencySection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipsContainer: {
    gap: 0,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  contactsContainer: {
    gap: 0,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  resourceButton: {
    marginBottom: 12,
  },
  guidelineItem: {
    marginBottom: 20,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    lineHeight: 20,
  },
});