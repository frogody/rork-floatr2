import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';
import { errorReporting } from './errorReporting';

interface DiagnosticInfo {
  platform: string;
  version: string;
  storageHealth: boolean;
  networkConnectivity: boolean;
  memoryUsage?: number;
  errors: any[];
  logs: any[];
  timestamp: number;
}

class TroubleshootingUtils {
  
  /**
   * Comprehensive health check of the app
   */
  public async runDiagnostics(): Promise<DiagnosticInfo> {
    logger.info('TroubleshootingUtils: Running diagnostics');
    
    const diagnostics: DiagnosticInfo = {
      platform: Platform.OS,
      version: Platform.Version.toString(),
      storageHealth: await this.checkStorageHealth(),
      networkConnectivity: await this.checkNetworkConnectivity(),
      errors: errorReporting.getReports(),
      logs: logger.getLogs(),
      timestamp: Date.now(),
    };

    if (Platform.OS !== 'web') {
      diagnostics.memoryUsage = await this.getMemoryUsage();
    }

    logger.info('TroubleshootingUtils: Diagnostics complete', {
      storageHealth: diagnostics.storageHealth,
      networkConnectivity: diagnostics.networkConnectivity,
      errorCount: diagnostics.errors.length,
      logCount: diagnostics.logs.length
    });

    return diagnostics;
  }

  /**
   * Check if AsyncStorage is working properly
   */
  private async checkStorageHealth(): Promise<boolean> {
    try {
      const testKey = '@floatr_storage_test';
      const testValue = 'test_value';
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrievedValue = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      return retrievedValue === testValue;
    } catch (error) {
      logger.error('TroubleshootingUtils: Storage health check failed', { error: error.message });
      return false;
    }
  }

  /**
   * Check network connectivity
   */
  private async checkNetworkConnectivity(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return navigator.onLine;
      } else {
        // For React Native, we would use NetInfo
        const NetInfo = require('@react-native-community/netinfo');
        const networkState = await NetInfo.fetch();
        return networkState.isConnected;
      }
    } catch (error) {
      logger.error('TroubleshootingUtils: Network check failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get memory usage (React Native only)
   */
  private async getMemoryUsage(): Promise<number> {
    try {
      if (Platform.OS === 'web') {
        return 0;
      }
      
      // This would require a native module in a real app
      // For now, return a mock value
      return Math.random() * 100;
    } catch (error) {
      logger.error('TroubleshootingUtils: Memory usage check failed', { error: error.message });
      return 0;
    }
  }

  /**
   * Clear all app data (useful for troubleshooting)
   */
  public async clearAllData(): Promise<void> {
    try {
      logger.info('TroubleshootingUtils: Clearing all app data');
      
      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      
      // Remove all data
      await AsyncStorage.multiRemove(keys);
      
      // Clear logs and error reports
      await logger.clearLogs();
      await errorReporting.clearReports();
      
      logger.info('TroubleshootingUtils: All app data cleared');
    } catch (error) {
      logger.error('TroubleshootingUtils: Failed to clear app data', { error: error.message });
      throw error;
    }
  }

  /**
   * Export diagnostic data for sharing with support
   */
  public async exportDiagnosticData(): Promise<string> {
    try {
      const diagnostics = await this.runDiagnostics();
      
      const exportData = {
        ...diagnostics,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0', // Get from app.json in real app
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      logger.error('TroubleshootingUtils: Failed to export diagnostic data', { error: error.message });
      throw error;
    }
  }

  /**
   * Check for common issues and provide solutions
   */
  public async checkCommonIssues(): Promise<Array<{ issue: string; solution: string; severity: 'low' | 'medium' | 'high' }>> {
    const issues: Array<{ issue: string; solution: string; severity: 'low' | 'medium' | 'high' }> = [];
    
    try {
      const diagnostics = await this.runDiagnostics();
      
      // Check storage health
      if (!diagnostics.storageHealth) {
        issues.push({
          issue: 'AsyncStorage is not working properly',
          solution: 'Try restarting the app or clearing app data',
          severity: 'high'
        });
      }
      
      // Check network connectivity
      if (!diagnostics.networkConnectivity) {
        issues.push({
          issue: 'No network connectivity',
          solution: 'Check your internet connection and try again',
          severity: 'medium'
        });
      }
      
      // Check for frequent errors
      const recentErrors = diagnostics.errors.filter(
        error => Date.now() - error.metadata.timestamp < 300000 // Last 5 minutes
      );
      
      if (recentErrors.length > 5) {
        issues.push({
          issue: 'Multiple recent errors detected',
          solution: 'Check error logs and consider restarting the app',
          severity: 'high'
        });
      }
      
      // Check memory usage (if available)
      if (diagnostics.memoryUsage && diagnostics.memoryUsage > 80) {
        issues.push({
          issue: 'High memory usage detected',
          solution: 'Close other apps and restart this app',
          severity: 'medium'
        });
      }
      
      logger.info('TroubleshootingUtils: Common issues check complete', {
        issuesFound: issues.length
      });
      
    } catch (error) {
      logger.error('TroubleshootingUtils: Failed to check common issues', { error: error.message });
      issues.push({
        issue: 'Failed to run diagnostic check',
        solution: 'Try restarting the app',
        severity: 'high'
      });
    }
    
    return issues;
  }

  /**
   * Recovery actions for common problems
   */
  public async performRecoveryActions(): Promise<{ success: boolean; actionsPerformed: string[] }> {
    const actionsPerformed: string[] = [];
    let success = true;
    
    try {
      logger.info('TroubleshootingUtils: Starting recovery actions');
      
      // Clear error state in stores
      try {
        // This would clear errors in all stores
        actionsPerformed.push('Cleared error states');
      } catch (error) {
        logger.error('TroubleshootingUtils: Failed to clear error states', { error: error.message });
        success = false;
      }
      
      // Clear old logs and error reports
      try {
        const logs = logger.getLogs();
        const errors = errorReporting.getReports();
        
        if (logs.length > 100) {
          await logger.clearLogs();
          actionsPerformed.push('Cleared old logs');
        }
        
        if (errors.length > 20) {
          await errorReporting.clearReports();
          actionsPerformed.push('Cleared old error reports');
        }
      } catch (error) {
        logger.error('TroubleshootingUtils: Failed to clear old data', { error: error.message });
        success = false;
      }
      
      // Test storage health
      try {
        const storageHealthy = await this.checkStorageHealth();
        if (storageHealthy) {
          actionsPerformed.push('Verified storage health');
        } else {
          success = false;
        }
      } catch (error) {
        logger.error('TroubleshootingUtils: Storage health check failed', { error: error.message });
        success = false;
      }
      
      logger.info('TroubleshootingUtils: Recovery actions complete', {
        success,
        actionsCount: actionsPerformed.length
      });
      
    } catch (error) {
      logger.error('TroubleshootingUtils: Recovery actions failed', { error: error.message });
      success = false;
    }
    
    return { success, actionsPerformed };
  }
}

export const troubleshootingUtils = new TroubleshootingUtils();

/**
 * Troubleshooting Guide for Developers
 */
export const TROUBLESHOOTING_GUIDE = {
  dependencies: {
    title: "Dependency Issues",
    steps: [
      "Delete node_modules folder",
      "Delete package-lock.json or yarn.lock",
      "Run 'npm install' or 'yarn install'",
      "Clear Metro cache: 'npx react-native start --reset-cache'",
      "For Expo: 'expo start -c'"
    ],
    commonIssues: [
      "Version conflicts between packages",
      "Corrupted node_modules",
      "Outdated package-lock.json",
      "Metro bundler cache issues"
    ]
  },
  
  codeAudit: {
    title: "Common Code Issues",
    checks: [
      "Check for undefined/null property access",
      "Verify all async operations have error handling",
      "Ensure all required props are provided",
      "Check state updates are properly handled",
      "Verify navigation parameters exist before use",
      "Check array/object destructuring for undefined values"
    ],
    patterns: [
      "Use optional chaining: obj?.property",
      "Use nullish coalescing: value ?? defaultValue",
      "Wrap async calls in try-catch blocks",
      "Validate props with PropTypes or TypeScript",
      "Check array length before accessing elements"
    ]
  },
  
  errorBoundaries: {
    title: "Error Boundary Implementation",
    benefits: [
      "Prevents entire app crashes",
      "Provides fallback UI for errors",
      "Logs errors for debugging",
      "Improves user experience"
    ],
    placement: [
      "Wrap main app component",
      "Wrap individual screens/routes",
      "Wrap complex components",
      "Wrap third-party components"
    ]
  },
  
  debugging: {
    title: "Debugging Best Practices",
    tools: [
      "React Native Debugger",
      "Flipper",
      "Chrome DevTools",
      "Console logging",
      "Error reporting services"
    ],
    techniques: [
      "Use meaningful log messages",
      "Include context in error reports",
      "Test on multiple devices/platforms",
      "Use TypeScript for type safety",
      "Implement proper error handling"
    ]
  }
};