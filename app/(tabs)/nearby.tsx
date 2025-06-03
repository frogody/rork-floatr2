// Using Platform.select to handle web differently
import { Platform } from 'react-native';

// Web map component
const WebMapScreen = React.lazy(() => import('@/components/WebMapScreen'));

// Native map screen (existing code)
const NativeMapScreen = React.lazy(() => import('@/components/NativeMapScreen'));

export default function MapScreen() {
  return Platform.select({
    web: <WebMapScreen />,
    default: <NativeMapScreen />,
  });
}