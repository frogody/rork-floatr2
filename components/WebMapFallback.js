import React from 'react';
import { View, Text } from 'react-native';

// Fallback components for react-native-maps on web
const MapView = ({ children, style, ...props }) => {
  return (
    <View style={[{ backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center' }, style]}>
      <Text style={{ color: '#9CA3AF', fontSize: 16 }}>Map not available on web</Text>
      {children}
    </View>
  );
};

const Marker = ({ children, ...props }) => {
  return <View>{children}</View>;
};

const PROVIDER_GOOGLE = 'google';

export default MapView;
export { Marker, PROVIDER_GOOGLE };