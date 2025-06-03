import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  Trash2,
  Info,
  X
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { troubleshootingUtils } from '@/utils/troubleshooting';
import { logger } from '@/utils/logger';
import { errorReporting } from '@/utils/errorReporting';

interface TroubleshootingPanelProps {
  visible: boolean;
  onClose: () => void;
}

export const TroubleshootingPanel: React.FC<TroubleshootingPanelProps> = ({
  visible,
  onClose
}) => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [isPerformingRecovery, setIsPerformingRecovery] = useState(false);

  useEffect(() => {
    if (visible) {
      runDiagnostics();
    }
  }, [visible]);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const [diagnosticData, commonIssues] = await Promise.all([
        troubleshootingUtils.runDiagnostics(),
        troubleshootingUtils.checkCommonIssues()
      ]);
      
      setDiagnostics(diagnosticData);
      setIssues(commonIssues);
    } catch (error) {
      logger.error('TroubleshootingPanel: Failed to run diagnostics', { error: error.message });
      Alert.alert('Error', 'Failed to run diagnostics. Please try again.');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const performRecovery = async () => {
    setIsPerformingRecovery(true);
    try {
      const result = await troubleshootingUtils.performRecoveryActions();
      
      if (result.success) {
        Alert.alert(
          'Recovery Complete',
          `Successfully performed ${result.actionsPerformed.length} recovery actions:\n\n${result.actionsPerformed.join('\n')}`,
          [{ text: 'OK', onPress: runDiagnostics }]
        );
      } else {
        Alert.alert(
          'Recovery Partial',
          'Some recovery actions failed. Please check the logs for more details.'
        );
      }
    } catch (error) {
      logger.error('TroubleshootingPanel: Recovery failed', { error: error.message });
      Alert.alert('Error', 'Recovery actions failed. Please try restarting the app.');
    } finally {
      setIsPerformingRecovery(false);
    }
  };

  const exportDiagnostics = async () => {
    try {
      const data = await troubleshootingUtils.exportDiagnosticData();
      
      // In a real app, you would share this data or save it to a file
      Alert.alert(
        'Diagnostic Data',
        'Diagnostic data has been prepared. In a production app, this would be shared with support.',
        [
          { text: 'Copy to Clipboard', onPress: () => {
            // Copy to clipboard logic here
            logger.info('TroubleshootingPanel: Diagnostic data copied to clipboard');
          }},
          { text: 'OK' }
        ]
      );
    } catch (error) {
      logger.error('TroubleshootingPanel: Failed to export diagnostics', { error: error.message });
      Alert.alert('Error', 'Failed to export diagnostic data.');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all app data including settings, cache, and user preferences. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await troubleshootingUtils.clearAllData();
              Alert.alert(
                'Data Cleared',
                'All app data has been cleared. Please restart the app.',
                [{ text: 'OK', onPress: onClose }]
              );
            } catch (error) {
              logger.error('TroubleshootingPanel: Failed to clear data', { error: error.message });
              Alert.alert('Error', 'Failed to clear app data.');
            }
          }
        }
      ]
    );
  };

  if (!visible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Troubleshooting</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          {diagnostics ? (
            <View style={styles.healthGrid}>
              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Storage</Text>
                <View style={styles.healthStatus}>
                  {diagnostics.storageHealth ? (
                    <CheckCircle size={16} color={colors.status.success} />
                  ) : (
                    <AlertTriangle size={16} color={colors.status.error} />
                  )}
                  <Text style={[
                    styles.healthText,
                    { color: diagnostics.storageHealth ? colors.status.success : colors.status.error }
                  ]}>
                    {diagnostics.storageHealth ? 'Healthy' : 'Issues'}
                  </Text>
                </View>
              </View>

              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Network</Text>
                <View style={styles.healthStatus}>
                  {diagnostics.networkConnectivity ? (
                    <CheckCircle size={16} color={colors.status.success} />
                  ) : (
                    <AlertTriangle size={16} color={colors.status.error} />
                  )}
                  <Text style={[
                    styles.healthText,
                    { color: diagnostics.networkConnectivity ? colors.status.success : colors.status.error }
                  ]}>
                    {diagnostics.networkConnectivity ? 'Connected' : 'Offline'}
                  </Text>
                </View>
              </View>

              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Errors</Text>
                <Text style={styles.healthValue}>{diagnostics.errors.length}</Text>
              </View>

              <View style={styles.healthItem}>
                <Text style={styles.healthLabel}>Logs</Text>
                <Text style={styles.healthValue}>{diagnostics.logs.length}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading diagnostics...</Text>
          )}
        </View>

        {/* Issues */}
        {issues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issues Found</Text>
            {issues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <View style={styles.issueHeader}>
                  <AlertTriangle 
                    size={16} 
                    color={
                      issue.severity === 'high' ? colors.status.error :
                      issue.severity === 'medium' ? colors.status.warning :
                      colors.status.info
                    } 
                  />
                  <Text style={styles.issueTitle}>{issue.issue}</Text>
                </View>
                <Text style={styles.issueSolution}>{issue.solution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={runDiagnostics}
            disabled={isRunningDiagnostics}
          >
            <RefreshCw size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              {isRunningDiagnostics ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={performRecovery}
            disabled={isPerformingRecovery}
          >
            <CheckCircle size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>
              {isPerformingRecovery ? 'Performing Recovery...' : 'Perform Recovery'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={exportDiagnostics}>
            <Download size={20} color={colors.primary} />
            <Text style={styles.actionButtonText}>Export Diagnostics</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]} 
            onPress={clearAllData}
          >
            <Trash2 size={20} color={colors.status.error} />
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Troubleshooting Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipItem}>
            <Info size={16} color={colors.status.info} />
            <Text style={styles.tipText}>
              If the app is crashing frequently, try clearing all data and restarting.
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Info size={16} color={colors.status.info} />
            <Text style={styles.tipText}>
              Network issues can cause unexpected errors. Check your connection.
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Info size={16} color={colors.status.info} />
            <Text style={styles.tipText}>
              Export diagnostics to share with support for faster resolution.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  healthItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
  },
  healthLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
    marginBottom: 4,
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healthText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  healthValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    padding: 20,
  },
  issueItem: {
    backgroundColor: colors.background.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    flex: 1,
  },
  issueSolution: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginLeft: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.status.error,
  },
  dangerButtonText: {
    color: colors.status.error,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
});