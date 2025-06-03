import React, { Suspense } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import colors from '@/constants/colors';

// Lazy load components based on platform
const WebMapScreen = React.lazy(() => 
  Platform.OS === 'web' 
    ? import('@/components/WebMapScreen')
    : Promise.resolve({ default: () => null })
);

const NativeMapScreen = React.lazy(() => 
  Platform.OS !== 'web'
    ? import('@/components/NativeMapScreen')
    : Promise.resolve({ default: () => null })
);

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.primary }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function MapScreen() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      {Platform.select({
        web: <WebMapScreen />,
        default: <NativeMapScreen />,
      })}
    </Suspense>
  );
}