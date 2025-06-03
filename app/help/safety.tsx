import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Phone, MapPin, Radio, Anchor, Users, Shield, Zap } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';
import EmergencyButton from '@/components/EmergencyButton';

interface SafetyTip {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const safetyTips: SafetyTip[] = [
  {
    id: '1',
    icon: <Radio size={24} color={colors.status?.error || '#ef4444'} />,
    title: 'VHF Radio Communication',
    description: 'Always monitor VHF Channel 16 for emergency communications. Have a handheld VHF as backup.',
    priority: 'high',
  },
  {
    id: '2',
    icon: <Anchor size={24} color={colors.status?.warning || '#f59e0b'} />,
    title: 'Proper Anchoring',
    description: 'Use appropriate anchor scope (7:1 ratio). Check weather conditions and holding ground before anchoring.',
    priority: 'high',
  },
  {
    id: '3',
    icon: <Users size={24} color={colors.status?.info || '#3b82f6'} />,
    title: 'Raft-up Safety',
    description: 'Designate one boat as the anchor boat. Use proper fenders and lines. Maintain watch schedules.',
    priority: 'medium',
  },
  {
    id: '4',
    icon: <Shield size={24} color={colors.status?.success || '#10b981'} />,
    title: 'Life Jackets',
    description: 'Ensure all guests have properly fitted life jackets. Check expiration dates on inflatable PFDs.',
    priority: 'high',
  },
  {
    id: '5',
    icon: <Zap size={24} color={colors.status?.warning || '#f59e0b'} />,
    title: 'Weather Awareness',
    description: 'Monitor weather forecasts continuously. Have an escape plan for deteriorating conditions.',
    priority: 'high',
  },
  {
    id: '6',
    icon: <MapPin size={24} color={colors.status?.info || '#3b82f6'} />,
    title: 'Share Your Location',
    description: 'Always file a float plan with someone onshore. Update your position regularly.',
    priority: 'medium',
  },
];

const emergencyContacts = [
  { name: 'Coast Guard Emergency', number: '911' },
  { name: 'Coast Guard Non-Emergency', number: '(800) 368-5647' },
  { name: 'Marine Assistance', number: '*SEA (*732)' },
];

export default function SafetyScreen() {
  const handleEmergencyCall = async (number: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Emergency Call',
      `Call ${number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would initiate a phone call
            console.log(`Calling ${number}`);
          }
        },
      ]
    );
  };

  const handleTipPress = async (tip: SafetyTip) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(tip.title, tip.description);
  };

  const getPriorityColor = (priority: SafetyTip['priority']) => {
    switch (priority) {
      case 'high':
        return colors.status?.error || '#ef4444';
      case 'medium':
        return colors.status?.warning || '#f59e0b';
      case 'low':
        return colors.status?.info || '#3b82f6';
      default:
        return colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Safety Tips",
          headerRight: () => (
            <EmergencyButton onPress={() => handleEmergencyCall('911')} />
          ),
        }}
      />
      
      <StatusBar style="light" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AlertTriangle size={32} color={colors.status?.warning || '#f59e0b'} />
          <Text style={styles.headerTitle}>Marine Safety</Text>
          <Text style={styles.headerSubtitle}>
            Essential safety tips for boating and raft-ups
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Guidelines</Text>
          {safetyTips.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={styles.tipCard}
              onPress={() => handleTipPress(tip)}
            >
              <View style={styles.tipHeader}>
                <View style={styles.tipIcon}>
                  {tip.icon}
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(tip.priority) }]}>
                    <Text style={styles.priorityText}>
                      {tip.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.tipDescription}>{tip.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactCard}
              onPress={() => handleEmergencyCall(contact.number)}
            >
              <Phone size={20} color={colors.status?.error || '#ef4444'} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <Button
            title="Coast Guard Auxiliary"
            onPress={() => {
              // Open external link
              console.log('Opening Coast Guard Auxiliary website');
            }}
            variant="outline"
            style={styles.resourceButton}
          />
          
          <Button
            title="Weather Forecast"
            onPress={() => {
              // Open weather app or website
              console.log('Opening weather forecast');
            }}
            variant="outline"
            style={styles.resourceButton}
          />
          
          <Button
            title="Navigation Charts"
            onPress={() => {
              // Open charts app
              console.log('Opening navigation charts');
            }}
            variant="outline"
            style={styles.resourceButton}
          />
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            These safety tips are general guidelines. Always follow local regulations and use your best judgment. 
            In case of emergency, contact the Coast Guard immediately.
          </Text>
        </View>
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
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
  resourceButton: {
    marginBottom: 12,
  },
  disclaimer: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
});