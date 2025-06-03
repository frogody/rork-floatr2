import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { MapPin, Anchor, Navigation, Search } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function NearbyScreen() {
  const [mapView, setMapView] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Anchored', 'Moving'];
  
  const toggleView = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMapView(!mapView);
  };

  const handleFilterPress = async (filter: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  };

  const handleMapButtonPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Boaters</Text>
        <TouchableOpacity style={styles.viewToggle} onPress={toggleView}>
          <Text style={styles.viewToggleText}>
            {mapView ? 'List View' : 'Map View'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilter
              ]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {mapView ? (
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000' }} 
            style={styles.mapImage}
            resizeMode="cover"
          />
          
          <View style={styles.mapOverlay}>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>
              In the full app, this would show a real map with boater locations
            </Text>
          </View>
          
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapButton} onPress={handleMapButtonPress}>
              <Navigation size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton} onPress={handleMapButtonPress}>
              <Anchor size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        >
          {mockCrews.map((crew) => (
            <TouchableOpacity key={crew.id} style={styles.card} activeOpacity={0.9}>
              <Image 
                source={{ uri: crew.photoUrls?.[0] || crew.photoUrl }} 
                style={styles.cardImage}
                resizeMode="cover"
              />
              
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{crew.name}</Text>
                  <View style={styles.cardLocation}>
                    <MapPin size={14} color={colors.text.primary} />
                    <Text style={styles.cardLocationText}>
                      {crew.location} • {crew.distance} mi
                    </Text>
                  </View>
                  
                  <View style={styles.cardStatus}>
                    <Anchor size={14} color={colors.primary} />
                    <Text style={styles.cardStatusText}>Anchored</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  viewToggle: {
    backgroundColor: colors.background.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewToggleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.card,
  },
  filterText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  activeFilterText: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mapText: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mapSubtext: {
    color: colors.text.primary,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 12,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    paddingRight: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLocationText: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  cardStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardStatusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});