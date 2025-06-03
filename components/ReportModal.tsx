import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Modal, 
  TouchableOpacity,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Flag, AlertTriangle } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  onSubmit: (reason: string, details: string) => void;
}

const reportReasons = [
  'Inappropriate photos',
  'Harassment or bullying',
  'Spam or fake profile',
  'Inappropriate messages',
  'Safety concerns',
  'Other',
];

export default function ReportModal({ visible, onClose, userName, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReasonSelect = async (reason: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedReason(reason);
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    onSubmit(selectedReason, details);
    
    // Reset form
    setSelectedReason('');
    setDetails('');
    onClose();
    
    Alert.alert(
      'Report Submitted',
      'Thank you for your report. We will review it and take appropriate action.',
      [{ text: 'OK' }]
    );
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Report {userName}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          <View style={styles.warningBox}>
            <AlertTriangle size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Reports are anonymous and help keep our community safe. False reports may result in account restrictions.
            </Text>
          </View>
          
          <Text style={styles.sectionTitle}>Why are you reporting this user?</Text>
          
          <View style={styles.reasonsList}>
            {reportReasons.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={[
                  styles.reasonItem,
                  selectedReason === reason && styles.selectedReason
                ]}
                onPress={() => handleReasonSelect(reason)}
              >
                <Text style={[
                  styles.reasonText,
                  selectedReason === reason && styles.selectedReasonText
                ]}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.sectionTitle}>Additional details (optional)</Text>
          <TextInput
            style={styles.detailsInput}
            placeholder="Provide any additional context..."
            placeholderTextColor={colors.text.secondary}
            value={details}
            onChangeText={setDetails}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <Button
            title="Submit Report"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={loading}
            disabled={!selectedReason}
            icon={<Flag size={16} color={colors.text.primary} />}
            style={styles.submitButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.warning,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  reasonsList: {
    marginBottom: 24,
  },
  reasonItem: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedReason: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  reasonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  selectedReasonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  detailsInput: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
    height: 100,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 'auto',
  },
});