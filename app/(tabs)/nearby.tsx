import React, { Suspense } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';

// Web component - always available
import WebMapScreen from '@/components/WebMapScreen';

// Native component - lazy loaded only on native platforms
const NativeMapScreen = Platform.OS !== 'web' 
  ? React.lazy(() => import('@/components/NativeMapScreen'))
  : null;

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

  if (!NativeMapScreen) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <NativeMapScreen />
    </Suspense>
  );
}