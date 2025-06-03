import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Pressable,
  Dimensions,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { 
  Search, 
  MapPin, 
  Navigation2, 
  Users, 
  Filter,
  Compass,
  Anchor,
  Waves
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

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
}

export default function NearbyScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Mock crew locations based on mockCrews
  const [crewLocations] = useState<CrewLocation[]>([
    {
      id: '1',
      name: 'Sunset Sailors',
      latitude: 37.7849,
      longitude: -122.4094,
      distance: 1.2,
      photoUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070',
      crewSize: 4,
      boatType: 'Sailboat',
      status: 'anchored'
    },
    {
      id: '2',
      name: 'Ocean Explorers',
      latitude: 37.7649,
      longitude: -122.4294,
      distance: 2.8,
      photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
      crewSize: 6,
      boatType: 'Yacht',
      status: 'moving'
    },
    {
      id: '3',
      name: 'Bay Cruisers',
      latitude: 37.7949,
      longitude: -122.3994,
      distance: 0.8,
      photoUrl: 'https://images.unsplash.com/photo-1566024287286-457247b70310?q=80&w=2070',
      crewSize: 3,
      boatType: 'Catamaran',
      status: 'docked'
    },
    {
      id: '4',
      name: 'Wind Riders',
      latitude: 37.7549,
      longitude: -122.4394,
      distance: 3.5,
      photoUrl: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070',
      crewSize: 5,
      boatType: 'Sailboat',
      status: 'moving'
    }
  ]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'web') {
      // Use web geolocation API
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
            setMapRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
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
          setMapRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.log('Location permission error:', error);
      }
    }
  };

  const handleFilterPress = async (filter: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedFilter(filter);
  };

  const handleCrewPress = async (crew: CrewLocation) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert(
      crew.name,
      `${crew.boatType} • ${crew.crewSize} crew members\n${crew.distance} miles away\nStatus: ${crew.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Message', onPress: () => console.log('Message crew') },
        { text: 'View Profile', onPress: () => console.log('View profile') }
      ]
    );
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

  const filteredCrews = crewLocations.filter(crew => {
    if (selectedFilter === 'all') return true;
    return crew.status === selectedFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'transparent']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Nearby Crews</Text>
            <Text style={styles.headerSubtitle}>Discover sailors around you</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations, crews..."
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {[
          { id: 'all', label: 'All', icon: Users },
          { id: 'anchored', label: 'Anchored', icon: Anchor },
          { id: 'moving', label: 'Moving', icon: Navigation2 },
          { id: 'docked', label: 'Docked', icon: MapPin },
        ].map((filter) => {
          const Icon = filter.icon;
          return (
            <TouchableOpacity 
              key={filter.id}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && styles.activeFilterTab
              ]}
              onPress={() => handleFilterPress(filter.id)}
            >
              <Icon 
                size={18} 
                color={selectedFilter === filter.id ? colors.text.primary : colors.text.secondary} 
              />
              <Text style={[
                styles.filterText,
                selectedFilter === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.mapBackground}
        />
        <LinearGradient
          colors={['rgba(10,10,10,0.3)', 'rgba(10,10,10,0.7)']}
          style={styles.mapOverlay}
        >
          {/* Map Pins */}
          {filteredCrews.map((crew, index) => {
            const StatusIcon = getStatusIcon(crew.status);
            return (
              <TouchableOpacity
                key={crew.id}
                style={[
                  styles.mapPin,
                  {
                    left: `${20 + (index * 15)}%`,
                    top: `${30 + (index * 10)}%`,
                  }
                ]}
                onPress={() => handleCrewPress(crew)}
              >
                <View style={[styles.pinContainer, { borderColor: getStatusColor(crew.status) }]}>
                  <Image source={{ uri: crew.photoUrl }} style={styles.pinImage} />
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(crew.status) }]}>
                    <StatusIcon size={12} color={colors.text.primary} />
                  </View>
                </View>
                <View style={styles.pinLabel}>
                  <Text style={styles.pinLabelText}>{crew.name}</Text>
                  <Text style={styles.pinDistance}>{crew.distance} mi</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* User Location */}
          <View style={styles.userLocation}>
            <View style={styles.userLocationPing}>
              <Compass size={16} color={colors.text.primary} />
            </View>
            <Text style={styles.userLocationText}>You</Text>
          </View>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlButton}>
              <Navigation2 size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Waves size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Crew List */}
      <View style={styles.crewListContainer}>
        <Text style={styles.crewListTitle}>
          {filteredCrews.length} crews nearby
        </Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.crewList}
        >
          {filteredCrews.map((crew) => {
            const StatusIcon = getStatusIcon(crew.status);
            return (
              <TouchableOpacity
                key={crew.id}
                style={styles.crewCard}
                onPress={() => handleCrewPress(crew)}
              >
                <Image source={{ uri: crew.photoUrl }} style={styles.crewCardImage} />
                <View style={styles.crewCardContent}>
                  <Text style={styles.crewCardName}>{crew.name}</Text>
                  <View style={styles.crewCardDetails}>
                    <StatusIcon size={14} color={getStatusColor(crew.status)} />
                    <Text style={styles.crewCardDistance}>{crew.distance} mi</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    opacity: 0.9,
  },
  searchContainer: {
    padding: 16,
    marginTop: -20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.card,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.text.primary,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  pinImage: {
    width: '100%',
    height: '100%',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  pinLabel: {
    marginTop: 4,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pinLabelText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  pinDistance: {
    color: colors.text.secondary,
    fontSize: 10,
  },
  userLocation: {
    position: 'absolute',
    bottom: '40%',
    left: '45%',
    alignItems: 'center',
  },
  userLocationPing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.text.primary,
  },
  userLocationText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crewListContainer: {
    padding: 16,
    paddingTop: 8,
  },
  crewListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  crewList: {
    gap: 12,
  },
  crewCard: {
    width: 120,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  crewCardImage: {
    width: '100%',
    height: 80,
  },
  crewCardContent: {
    padding: 12,
  },
  crewCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  crewCardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  crewCardDistance: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});