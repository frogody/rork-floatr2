import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  PanGestureHandler,
  Animated,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { 
  MapPin, 
  Navigation2, 
  Users, 
  Compass,
  Anchor,
  Waves,
  Plus,
  Minus,
  Crosshair,
  Layers,
  Zap
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

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

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<CrewLocation | null>(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [showSatellite, setShowSatellite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const mapTranslateX = useRef(new Animated.Value(0)).current;
  const mapTranslateY = useRef(new Animated.Value(0)).current;
  const zoomScale = useRef(new Animated.Value(1)).current;

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
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const requestLocationPermission = async () => {
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
          },
          (error) => console.log('Location error:', error)
        );
      }
    } else {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (error) {
        console.log('Location permission error:', error);
      }
    }
  };

  const handleZoomIn = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newZoom = Math.min(mapZoom + 0.5, 3);
    setMapZoom(newZoom);
    Animated.spring(zoomScale, {
      toValue: newZoom,
      useNativeDriver: true,
    }).start();
  };

  const handleZoomOut = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newZoom = Math.max(mapZoom - 0.5, 0.5);
    setMapZoom(newZoom);
    Animated.spring(zoomScale, {
      toValue: newZoom,
      useNativeDriver: true,
    }).start();
  };

  const handleCrewPress = async (crew: CrewLocation) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedCrew(crew);
  };

  const handleCenterLocation = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.parallel([
      Animated.spring(mapTranslateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(mapTranslateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
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

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar style="light" />
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}>
            <Compass size={32} color={colors.primary} />
          </View>
          <Text style={styles.loadingText}>Loading map...</Text>
          <Text style={styles.loadingSubtext}>Finding crews near you</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Interactive Map */}
      <View style={styles.mapContainer}>
        <Animated.View 
          style={[
            styles.mapContent,
            {
              transform: [
                { translateX: mapTranslateX },
                { translateY: mapTranslateY },
                { scale: zoomScale }
              ]
            }
          ]}
        >
          {/* Map Background */}
          <Image 
            source={{ 
              uri: showSatellite 
                ? 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=2000'
                : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2000'
            }}
            style={styles.mapBackground}
          />
          
          {/* Map Grid Overlay */}
          <View style={styles.mapGrid} />
          
          {/* User Location */}
          <View style={styles.userLocationContainer}>
            <View style={styles.userLocationPulse}>
              <View style={styles.userLocationDot}>
                <Compass size={16} color={colors.text.primary} />
              </View>
            </View>
          </View>

          {/* Crew Pins */}
          {crewLocations.map((crew, index) => {
            const StatusIcon = getStatusIcon(crew.status);
            return (
              <TouchableOpacity
                key={crew.id}
                style={[
                  styles.crewPin,
                  {
                    left: `${25 + (index * 12)}%`,
                    top: `${20 + (index * 15)}%`,
                  }
                ]}
                onPress={() => handleCrewPress(crew)}
              >
                <View style={[styles.pinContainer, { borderColor: getStatusColor(crew.status) }]}>
                  <Image source={{ uri: crew.photoUrl }} style={styles.pinImage} />
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(crew.status) }]}>
                    <StatusIcon size={10} color={colors.text.primary} />
                  </View>
                </View>
                {crew.status === 'moving' && (
                  <View style={styles.movingIndicator}>
                    <View style={styles.movingDot} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.View>

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
            style={styles.controlButton} 
            onPress={() => setShowSatellite(!showSatellite)}
          >
            <Layers size={20} color={showSatellite ? colors.primary : colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Map Info */}
        <View style={styles.mapInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{crewLocations.length} crews nearby</Text>
            <Text style={styles.infoSubtitle}>Zoom: {mapZoom.toFixed(1)}x</Text>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapContent: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  userLocationContainer: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userLocationDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text.primary,
  },
  crewPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.text.primary,
  },
  pinImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.text.primary,
  },
  movingIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  movingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  mapControls: {
    position: 'absolute',
    top: 60,
    right: 16,
    gap: 8,
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
  mapInfo: {
    position: 'absolute',
    top: 60,
    left: 16,
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
  crewDetails: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
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