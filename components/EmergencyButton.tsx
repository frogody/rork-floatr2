import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Modal,
  Alert,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Phone, MapPin, X } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

interface EmergencyButtonProps {
  onEmergency: (type: 'coast-guard' | 'police' | 'medical' | 'custom') => void;
}

export default function EmergencyButton({ onEmergency }: EmergencyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleEmergencyPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setShowModal(true);
  };

  const handleEmergencyType = async (type: 'coast-guard' | 'police' | 'medical' | 'custom') => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    Alert.alert(
      'Emergency Alert',
      'Are you sure you want to send an emergency alert? This will notify emergency services and your emergency contacts.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Alert', 
          style: 'destructive',
          onPress: () => {
            onEmergency(type);
            setShowModal(false);
          }
        },
      ]
    );
  };

  const emergencyTypes = [
    {
      id: 'coast-guard',
      title: 'Coast Guard',
      description: 'Marine emergency or distress',
      icon: <Phone size={24} color={colors.text.primary} />,
      color: colors.error,
    },
    {
      id: 'medical',
      title: 'Medical Emergency',
      description: 'Someone needs immediate medical attention',
      icon: <AlertTriangle size={24} color={colors.text.primary} />,
      color: colors.error,
    },
    {
      id: 'police',
      title: 'Police',
      description: 'Security threat or criminal activity',
      icon: <Phone size={24} color={colors.text.primary} />,
      color: colors.error,
    },
    {
      id: 'custom',
      title: 'Other Emergency',
      description: 'Other type of emergency assistance',
      icon: <AlertTriangle size={24} color={colors.text.primary} />,
      color: colors.warning,
    },
  ];

  return (
    <>
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergencyPress}
        onLongPress={handleEmergencyPress}
      >
        <AlertTriangle size={20} color={colors.text.primary} />
        <Text style={styles.emergencyText}>SOS</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Alert</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.warningSection}>
            <AlertTriangle size={32} color={colors.error} />
            <Text style={styles.warningTitle}>Emergency Services</Text>
            <Text style={styles.warningText}>
              This will immediately contact emergency services and send your location to your emergency contacts.
            </Text>
          </View>

          <View style={styles.emergencyTypes}>
            {emergencyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.emergencyType, { borderColor: type.color }]}
                onPress={() => handleEmergencyType(type.id as any)}
              >
                <View style={[styles.emergencyIcon, { backgroundColor: type.color }]}>
                  {type.icon}
                </View>
                <View style={styles.emergencyContent}>
                  <Text style={styles.emergencyTitle}>{type.title}</Text>
                  <Text style={styles.emergencyDescription}>{type.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.locationInfo}>
            <MapPin size={16} color={colors.text.secondary} />
            <Text style={styles.locationText}>
              Your current location will be shared with emergency services
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emergencyTypes: {
    gap: 12,
    marginBottom: 24,
  },
  emergencyType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  emergencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    color: colors.text.secondary,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 'auto',
    paddingVertical: 16,
  },
  locationText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});