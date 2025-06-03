import React, { useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { mockCrews } from '@/mocks/crews';
import colors from '@/constants/colors';

// Import react-native-maps normally - Metro config will handle web exclusion
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 25.7617,
  longitude: -80.1918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function NativeMapScreen(): React.ReactElement {
  const [region, setRegion] = useState(INITIAL_REGION);

  // This should only run on native platforms due to lazy loading
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.fallback}>
          <Text style={styles.fallbackText}>
            Map not available on web
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={mapStyle}
      >
        {mockCrews.map((crew) => (
          <Marker
            key={crew.id}
            coordinate={{
              latitude: 25.7617 + Math.random() * 0.1 - 0.05,
              longitude: -80.1918 + Math.random() * 0.1 - 0.05,
            }}
            title={crew.name}
            description={crew.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    color: colors.text.primary,
    fontSize: 16,
  },
});

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: colors.map.land,
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: colors.text.primary,
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: colors.background.primary,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colors.map.water,
      },
    ],
  },
];