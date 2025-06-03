import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mockCrews } from '@/mocks/crews';
import colors from '@/constants/colors';

const INITIAL_REGION = {
  latitude: 25.7617,
  longitude: -80.1918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function NativeMapScreen() {
  const [region, setRegion] = useState(INITIAL_REGION);

  // Add your map logic here
  // This is just a basic implementation
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