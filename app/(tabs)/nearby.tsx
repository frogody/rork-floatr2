import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Alert,
  Image,
  Animated
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import MapView, { 
  Marker, 
  PROVIDER_GOOGLE, 
  Region, 
  Circle,
  Callout 
} from 'react-native-maps';
import { 
  Search, 
  Filter, 
  Plus, 
  Minus, 
  Crosshair, 
  Layers,
  Navigation2,
  Anchor,
  MapPin,
  Users,
  Waves,
  Zap
} from 'lucide-react-native';
import colors from '@/constants/colors';
import FilterModal, { FilterOptions } from '@/components/FilterModal';

const { width, height } = Dimensions.get('window');

interface CrewLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  photoUrl: string;
  crewSize: number;
  boatType: string;
  status: 'anchored' | 'moving' | 'docked';
  lastSeen: string;
}

interface SurpriseSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  type: 'marina' | 'anchorage' | 'scenic';
}

const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<CrewLocation | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [isLoading, setIsLoading] = useState(true);
  const [surpriseSpots, setSurpriseSpots] = useState<SurpriseSpot[]>([]);
  
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Mock crew locations with realistic coordinates
  const [crewLocations] = useState<CrewLocation[]>([
    {
      id: '1',
      name: 'Sunset Sailors',
      latitude: 37.7849,
      longitude: -122.4094,
      distance: 1.2,
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400',
      crewSize: 4,
      boatType: 'Sailboat',
      status: 'anchored',
      lastSeen: '2 min ago'
    },
    {
      id: '2',
      name: 'Ocean Explorers',
      latitude: 37.7649,
      longitude: -122.4294,
      distance: 2.8,
      photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=400',
      crewSize: 6,
      boatType: 'Yacht',
      status: 'moving',
      lastSeen: 'now'
    },
    {
      id: '3',
      name: 'Bay Cruisers',
      latitude: 37.7949,
      longitude: -122.3994,
      distance: 0.8,
      photoUrl: 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=400',
      crewSize: 3,
      boatType: 'Catamaran',
      status: 'docked',
      lastSeen: '5 min ago'
    },
    {
      id: '4',
      name: 'Wind Riders',
      latitude: 37.7549,
      longitude: -122.4394,
      distance: 3.5,
      photoUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=400',
      crewSize: 5,
      boatType: 'Sailboat',
      status: 'moving',
      lastSeen: '1 min ago'
    },
    {
      id: '5',
      name: 'Marina Masters',
      latitude: 37.8049,
      longitude: -122.4194,
      distance: 1.9,
      photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400',
      crewSize: 7,
      boatType: 'Motor Yacht',
      status: 'docked',
      lastSeen: '10 min ago'
    }
  ]);

  useEffect(() => {
    requestLocationPermission();
    generateSurpriseSpots();
    startPulseAnimation();
    
    // Generate new surprise spots every 60 minutes
    const interval = setInterval(generateSurpriseSpots, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const generateSurpriseSpots = () => {
    const spots: SurpriseSpot[] = [
      {
        id: 'spot1',
        name: 'Hidden Cove',
        latitude: 37.7749 + (Math.random() - 0.5) * 0.02,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.02,
        description: 'Perfect for sunset watching',
        type: 'scenic'
      },
      {
        id: 'spot2',
        name: 'Secret Anchorage',
        latitude: 37.7749 + (Math.random() - 0.5) * 0.02,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.02,
        description: 'Sheltered waters, great for swimming',
        type: 'anchorage'
      }
    ];
    setSurpriseSpots(spots);
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const location = {
                coords: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  altitude: position.coords.altitude,
                  accuracy: position.coords.accuracy,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                },
                timestamp: position.timestamp,
              } as Location.LocationObject;
              setUserLocation(location);
              setIsLoading(false);
            },
            (error) => {
              console.log('Location error:', error);
              setIsLoading(false);
            }
          );
        }
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
          
          // Update map region to user location
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Location permission error:', error);
      setIsLoading(false);
    }
  };

  const handleZoomIn = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newRegion = {
      ...region,
      latitudeDelta: region.latitudeDelta * 0.5,
      longitudeDelta: region.longitudeDelta * 0.5,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleZoomOut = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newRegion = {
      ...region,
      latitudeDelta: Math.min(region.latitudeDelta * 2, 1),
      longitudeDelta: Math.min(region.longitudeDelta * 2, 1),
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 300);
  };

  const handleCenterLocation = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (userLocation) {
      const newRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 500);
    }
  };

  const toggleMapType = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'anchored': return colors.accent;
      case 'moving': return colors.primary;
      case 'docked': return colors.secondary;
      default: return colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'anchored': return Anchor;
      case 'moving': return Navigation2;
      case 'docked': return MapPin;
      default: return MapPin;
    }
  };

  const handleCrewPress = (crew: CrewLocation) => {
    setSelectedCrew(crew);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSurpriseSpotPress = (spot: SurpriseSpot) => {
    Alert.alert(
      spot.name,
      spot.description,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sail Here', 
          onPress: () => {
            // Deep link to maps app
            const url = Platform.select({
              ios: `maps:0,0?q=${spot.latitude},${spot.longitude}`,
              android: `geo:0,0?q=${spot.latitude},${spot.longitude}`,
              default: `https://maps.google.com/?q=${spot.latitude},${spot.longitude}`
            });
            console.log('Navigate to:', url);
          }
        }
      ]
    );
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    console.log('Applied filters:', filters);
    // TODO: Filter crew locations based on filters
  };

  const customMapStyle = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: colors.map.water }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: colors.map.land }]
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <Animated.View style={[styles.loadingSpinner, { transform: [{ scale: pulseAnim }] }]}>
            <Waves size={32} color={colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading map...</Text>
          <Text style={styles.loadingSubtext}>Finding crews near you</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search marinas, spots..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          mapType={mapType}
          region={region}
          onRegionChangeComplete={setRegion}
          customMapStyle={customMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          rotateEnabled={true}
          pitchEnabled={true}
        >
          {/* User Location Circle */}
          {userLocation && (
            <Circle
              center={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              radius={100}
              fillColor="rgba(59, 130, 246, 0.1)"
              strokeColor={colors.primary}
              strokeWidth={2}
            />
          )}

          {/* Crew Markers */}
          {crewLocations.map((crew) => (
            <Marker
              key={crew.id}
              coordinate={{
                latitude: crew.latitude,
                longitude: crew.longitude,
              }}
              onPress={() => handleCrewPress(crew)}
            >
              <View style={[styles.crewMarker, { borderColor: getStatusColor(crew.status) }]}>
                <Image source={{ uri: crew.photoUrl }} style={styles.crewMarkerImage} />
                <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(crew.status) }]} />
              </View>
              <Callout tooltip>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{crew.name}</Text>
                  <Text style={styles.calloutSubtitle}>
                    {crew.boatType} • {crew.crewSize} crew • {crew.distance} mi
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {/* Surprise Spots */}
          {surpriseSpots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{
                latitude: spot.latitude,
                longitude: spot.longitude,
              }}
              onPress={() => handleSurpriseSpotPress(spot)}
            >
              <Animated.View style={[styles.surpriseSpot, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.buoyMarker}>
                  <Text style={styles.buoyEmoji}>⚓</Text>
                </View>
              </Animated.View>
            </Marker>
          ))}
        </MapView>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
            <Plus size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
            <Minus size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleCenterLocation}>
            <Crosshair size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlButton, mapType === 'satellite' && styles.controlButtonActive]} 
            onPress={toggleMapType}
          >
            <Layers size={20} color={mapType === 'satellite' ? colors.primary : colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Map Info */}
        <View style={styles.mapInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{crewLocations.length} crews nearby</Text>
            <Text style={styles.infoSubtitle}>{surpriseSpots.length} surprise spots</Text>
          </View>
        </View>
      </View>

      {/* Selected Crew Details */}
      {selectedCrew && (
        <View style={styles.crewDetails}>
          <TouchableOpacity 
            style={styles.crewDetailsCard}
            onPress={() => {
              Alert.alert(
                selectedCrew.name,
                `${selectedCrew.boatType} • ${selectedCrew.crewSize} crew members
${selectedCrew.distance} miles away
Status: ${selectedCrew.status}
Last seen: ${selectedCrew.lastSeen}`,
                [
                  { text: 'Close', onPress: () => setSelectedCrew(null) },
                  { text: 'Message', onPress: () => console.log('Message crew') },
                  { text: 'View Profile', onPress: () => console.log('View profile') }
                ]
              );
            }}
          >
            <Image source={{ uri: selectedCrew.photoUrl }} style={styles.crewDetailsImage} />
            <View style={styles.crewDetailsContent}>
              <View style={styles.crewDetailsHeader}>
                <Text style={styles.crewDetailsName}>{selectedCrew.name}</Text>
                <TouchableOpacity onPress={() => setSelectedCrew(null)}>
                  <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.crewDetailsInfo}>
                {selectedCrew.boatType} • {selectedCrew.crewSize} crew • {selectedCrew.distance} mi
              </Text>
              <View style={styles.crewDetailsStatus}>
                {React.createElement(getStatusIcon(selectedCrew.status), {
                  size: 14,
                  color: getStatusColor(selectedCrew.status)
                })}
                <Text style={[styles.statusText, { color: getStatusColor(selectedCrew.status) }]}>
                  {selectedCrew.status} • {selectedCrew.lastSeen}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Users size={20} color={colors.text.primary} />
          <Text style={styles.actionText}>Find Crew</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Waves size={20} color={colors.text.primary} />
          <Text style={styles.actionText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Zap size={20} color={colors.text.primary} />
          <Text style={styles.actionText}>Live</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
    zIndex: 1000,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  filterButton: {
    padding: 4,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
    zIndex: 1000,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: colors.primary,
  },
  mapInfo: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1000,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  infoSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  crewMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  crewMarkerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  surpriseSpot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buoyMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  buoyEmoji: {
    fontSize: 20,
  },
  callout: {
    backgroundColor: colors.background.card,
    borderRadius: 8,
    padding: 12,
    minWidth: 150,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  crewDetails: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  crewDetailsCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  crewDetailsImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  crewDetailsContent: {
    flex: 1,
  },
  crewDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  crewDetailsName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    fontSize: 24,
    color: colors.text.secondary,
    fontWeight: '300',
  },
  crewDetailsInfo: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  crewDetailsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
    zIndex: 1000,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
});