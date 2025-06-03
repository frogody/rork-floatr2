import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Platform, Text, Alert } from 'react-native';
import { mockCrews } from '@/mocks/crews';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';
import { MapPin, Navigation } from 'lucide-react-native';

// Import react-native-maps with error handling
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
} catch (error) {
  console.warn('react-native-maps not available:', error);
}

const INITIAL_REGION = {
  latitude: 25.7617,
  longitude: -80.1918,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MIAMI_LOCATIONS = [
  { latitude: 25.7617, longitude: -80.1918, name: 'Downtown Miami' },
  { latitude: 25.7907, longitude: -80.1300, name: 'Miami Beach' },
  { latitude: 25.7563, longitude: -80.3774, name: 'Key Biscayne' },
  { latitude: 25.6866, longitude: -80.1756, name: 'Coconut Grove' },
  { latitude: 25.8174, longitude: -80.1289, name: 'North Beach' },
];

export default function NativeMapScreen(): React.ReactElement {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [selectedCrew, setSelectedCrew] = useState<string | null>(null);

  const handleRegionChange = useCallback((newRegion: typeof INITIAL_REGION) => {
    setRegion(newRegion);
  }, []);

  const handleMarkerPress = useCallback((crewId: string, crewName: string) => {
    setSelectedCrew(crewId);
    Alert.alert(
      'Crew Selected',
      `You selected ${crewName}. Would you like to connect?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Connect', onPress: () => console.log('Connecting to crew:', crewId) },
      ]
    );
  }, []);

  const crewMarkers = useMemo(() => {
    return mockCrews.map((crew, index) => {
      const location = MIAMI_LOCATIONS[index % MIAMI_LOCATIONS.length];
      const randomOffset = {
        latitude: (Math.random() - 0.5) * 0.02,
        longitude: (Math.random() - 0.5) * 0.02,
      };
      
      return {
        ...crew,
        coordinate: {
          latitude: location.latitude + randomOffset.latitude,
          longitude: location.longitude + randomOffset.longitude,
        },
      };
    });
  }, []);

  // Fallback for when maps are not available
  if (!MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.fallback}>
          <MapPin size={48} color={colors.primary} />
          <Text style={styles.fallbackTitle}>Map View</Text>
          <Text style={styles.fallbackText}>
            Interactive map is available on mobile devices with Google Maps installed.
          </Text>
          <Button
            title="View Nearby Crews"
            onPress={() => console.log('Navigate to crew list')}
            variant="primary"
            style={styles.fallbackButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        toolbarEnabled={false}
      >
        {crewMarkers.map((crew) => (
          <Marker
            key={crew.id}
            coordinate={crew.coordinate}
            title={crew.name}
            description={`${crew.description} • ${Math.floor(Math.random() * 20 + 5)} members`}
            onPress={() => handleMarkerPress(crew.id, crew.name)}
            pinColor={selectedCrew === crew.id ? colors.secondary : colors.primary}
          />
        ))}
      </MapView>
      
      <View style={styles.mapControls}>
        <Button
          title="Find My Location"
          onPress={() => setRegion(INITIAL_REGION)}
          variant="outline"
          size="small"
          icon={<Navigation size={16} color={colors.primary} />}
          style={styles.locationButton}
        />
      </View>
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
    padding: 24,
  },
  fallbackTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  fallbackText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  fallbackButton: {
    minWidth: 200,
  },
  mapControls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  locationButton: {
    backgroundColor: colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: colors.primary + '40',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];