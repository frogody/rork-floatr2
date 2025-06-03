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
  Platform,
  Pressable
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { MapPin, Search, Anchor, Navigation2, Users, Compass, Coffee } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

export default function NearbyScreen() {
  const [mapView, setMapView] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular Spots');
  
  const filters = ['Popular Spots', 'Anchored', 'Moving', 'Marinas'];
  
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search spots, marinas, crews..."
            placeholderTextColor={colors.text.secondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
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
            {filter === 'Popular Spots' && <Users size={16} color={activeFilter === filter ? colors.text.primary : colors.text.secondary} />}
            {filter === 'Anchored' && <Anchor size={16} color={activeFilter === filter ? colors.text.primary : colors.text.secondary} />}
            {filter === 'Moving' && <Navigation2 size={16} color={activeFilter === filter ? colors.text.primary : colors.text.secondary} />}
            {filter === 'Marinas' && <Coffee size={16} color={activeFilter === filter ? colors.text.primary : colors.text.secondary} />}
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {mapView ? (
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=2100' }} 
            style={styles.mapImage}
            resizeMode="cover"
          />
          
          <View style={styles.mapOverlay}>
            <View style={styles.mapStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Nearby</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Anchored</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>2</Text>
                <Text style={styles.statLabel}>Marinas</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapButton}>
              <Compass size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.mapActionButtons}>
              {mockCrews.slice(0, 3).map((crew) => (
                <Pressable key={crew.id} style={styles.mapMarker}>
                  <Image 
                    source={{ uri: crew.photoUrl }} 
                    style={styles.markerImage}
                  />
                  <View style={styles.markerInfo}>
                    <Text style={styles.markerName}>{crew.name}</Text>
                    <Text style={styles.markerDistance}>{crew.distance} mi</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        >
          {mockCrews.map((crew) => (
            <TouchableOpacity key={crew.id} style={styles.listCard} activeOpacity={0.9}>
              <Image 
                source={{ uri: crew.photoUrl }} 
                style={styles.listCardImage}
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

      <TouchableOpacity 
        style={styles.viewToggle} 
        onPress={toggleView}
      >
        <Text style={styles.viewToggleText}>
          {mapView ? 'Show List' : 'Show Map'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    marginLeft: 8,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
  },
  mapStats: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.primary,
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
  mapActionButtons: {
    gap: 8,
  },
  mapMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 24,
    padding: 8,
    gap: 8,
  },
  markerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  markerInfo: {
    flex: 1,
  },
  markerName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  markerDistance: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  listCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listCardImage: {
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
  viewToggle: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.background.card,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewToggleText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});