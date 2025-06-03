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
  Alert,
  TextInput
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
  Plus,
  Minus,
  Crosshair,
  Layers,
  Search,
  Filter,
  Zap,
  Waves
} from 'lucide-react-native';
import { WebView } from 'react-native-webview';
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
  const [mapZoom, setMapZoom] = useState(12);
  const [showSatellite, setShowSatellite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // Mock crew locations with realistic San Francisco Bay coordinates
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
    setTimeout(() => setIsLoading(false), 2000);
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
    const newZoom = Math.min(mapZoom + 1, 18);
    setMapZoom(newZoom);
    
    // Send zoom command to map
    const script = `
      if (window.map) {
        window.map.setZoom(${newZoom});
      }
    `;
    webViewRef.current?.postMessage(script);
  };

  const handleZoomOut = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newZoom = Math.max(mapZoom - 1, 1);
    setMapZoom(newZoom);
    
    // Send zoom command to map
    const script = `
      if (window.map) {
        window.map.setZoom(${newZoom});
      }
    `;
    webViewRef.current?.postMessage(script);
  };

  const handleCenterLocation = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const lat = userLocation?.coords.latitude || 37.7749;
    const lng = userLocation?.coords.longitude || -122.4194;
    
    const script = `
      if (window.map) {
        window.map.setCenter({lat: ${lat}, lng: ${lng}});
        window.map.setZoom(14);
      }
    `;
    webViewRef.current?.postMessage(script);
  };

  const toggleMapType = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowSatellite(!showSatellite);
    
    const mapType = showSatellite ? 'roadmap' : 'satellite';
    const script = `
      if (window.map) {
        window.map.setMapTypeId('${mapType}');
      }
    `;
    webViewRef.current?.postMessage(script);
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

  // Generate HTML for the map
  const generateMapHTML = () => {
    const userLat = userLocation?.coords.latitude || 37.7749;
    const userLng = userLocation?.coords.longitude || -122.4194;
    
    const crewMarkersJS = crewLocations.map(crew => `
      {
        id: '${crew.id}',
        lat: ${crew.latitude},
        lng: ${crew.longitude},
        name: '${crew.name}',
        status: '${crew.status}',
        photoUrl: '${crew.photoUrl}',
        crewSize: ${crew.crewSize},
        boatType: '${crew.boatType}',
        distance: ${crew.distance}
      }
    `).join(',');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html { margin: 0; padding: 0; height: 100%; }
          #map { height: 100%; width: 100%; }
          .crew-marker {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            border: 3px solid #fff;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            position: relative;
          }
          .crew-marker.anchored { border-color: #10B981; }
          .crew-marker.moving { border-color: #3B82F6; }
          .crew-marker.docked { border-color: #EC4899; }
          .crew-marker::after {
            content: '';
            position: absolute;
            bottom: -3px;
            right: -3px;
            width: 16px;
            height: 16px;
            border-radius: 8px;
            border: 2px solid #fff;
          }
          .crew-marker.anchored::after { background-color: #10B981; }
          .crew-marker.moving::after { background-color: #3B82F6; }
          .crew-marker.docked::after { background-color: #EC4899; }
          .user-marker {
            width: 20px;
            height: 20px;
            border-radius: 10px;
            background-color: #3B82F6;
            border: 3px solid #fff;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let map;
          let userMarker;
          let crewMarkers = [];
          
          function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
              center: { lat: ${userLat}, lng: ${userLng} },
              zoom: ${mapZoom},
              mapTypeId: '${showSatellite ? 'satellite' : 'roadmap'}',
              styles: [
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
              ],
              disableDefaultUI: true,
              zoomControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: false
            });
            
            // Add user marker
            const userMarkerDiv = document.createElement('div');
            userMarkerDiv.className = 'user-marker';
            
            userMarker = new google.maps.marker.AdvancedMarkerElement({
              map: map,
              position: { lat: ${userLat}, lng: ${userLng} },
              content: userMarkerDiv,
              title: 'Your Location'
            });
            
            // Add crew markers
            const crews = [${crewMarkersJS}];
            
            crews.forEach(crew => {
              const markerDiv = document.createElement('div');
              markerDiv.className = \`crew-marker \${crew.status}\`;
              markerDiv.style.backgroundImage = \`url(\${crew.photoUrl})\`;
              
              const marker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: { lat: crew.lat, lng: crew.lng },
                content: markerDiv,
                title: crew.name
              });
              
              marker.addListener('click', () => {
                window.ReactNativeWebView?.postMessage(JSON.stringify({
                  type: 'crewSelected',
                  crew: crew
                }));
              });
              
              crewMarkers.push(marker);
            });
            
            window.map = map;
          }
          
          // Listen for messages from React Native
          window.addEventListener('message', function(event) {
            try {
              eval(event.data);
            } catch (e) {
              console.error('Error executing script:', e);
            }
          });
        </script>
        <script async defer
          src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=marker&callback=initMap">
        </script>
      </body>
      </html>
    `;
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'crewSelected') {
        setSelectedCrew(data.crew);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
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
      
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations, marinas..."
            placeholderTextColor={colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Map */}
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: generateMapHTML() }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />

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
            style={[styles.controlButton, showSatellite && styles.controlButtonActive]} 
            onPress={toggleMapType}
          >
            <Layers size={20} color={showSatellite ? colors.primary : colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Map Info */}
        <View style={styles.mapInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{crewLocations.length} crews nearby</Text>
            <Text style={styles.infoSubtitle}>Zoom: {mapZoom}x</Text>
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
                `${selectedCrew.boatType} • ${selectedCrew.crewSize} crew members\n${selectedCrew.distance} miles away\nStatus: ${selectedCrew.status}\nLast seen: ${selectedCrew.lastSeen}`,
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
  searchHeader: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
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
  webView: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
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
  controlButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: colors.primary,
  },
  mapInfo: {
    position: 'absolute',
    top: 16,
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