import React from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';

// Direct imports instead of lazy loading to fix TypeScript errors
import WebMapScreen from '@/components/WebMapScreen';
import NativeMapScreen from '@/components/NativeMapScreen';

function LoadingScreen() {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: colors.background.primary 
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function MapScreen() {
  if (Platform.OS === 'web') {
    return <WebMapScreen />;
  }

  return <NativeMapScreen />;
}