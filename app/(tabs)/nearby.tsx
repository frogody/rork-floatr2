import React, { useState } from 'react';
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
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Search, Anchor, Navigation2, Users, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export default function NearbyScreen() {
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [searchText, setSearchText] = useState('');
  
  const filters = [
    { id: 'popular', label: 'Popular', icon: Users },
    { id: 'anchored', label: 'Anchored', icon: Anchor },
    { id: 'moving', label: 'Moving', icon: Navigation2 },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const handleFilterPress = async (filter: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?q=80&w=3270&auto=format&fit=crop' }}
          style={styles.headerImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Nearby Crews</Text>
          <Text style={styles.headerSubtitle}>Connect with fellow sailors</Text>
        </LinearGradient>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search crews, locations..."
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
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <TouchableOpacity 
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.label && styles.activeFilter
              ]}
              onPress={() => handleFilterPress(filter.label)}
            >
              <Icon 
                size={20} 
                color={activeFilter === filter.label ? colors.text.primary : colors.text.secondary} 
              />
              <Text style={[
                styles.filterText,
                activeFilter === filter.label && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.crewsContainer}
      >
        {mockCrews.map((crew) => (
          <Pressable 
            key={crew.id} 
            style={styles.crewCard}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
          >
            <Image 
              source={{ uri: crew.photoUrl }} 
              style={styles.crewImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardContent}>
                <Text style={styles.crewName}>{crew.name}</Text>
                <View style={styles.crewDetails}>
                  <View style={styles.crewStatus}>
                    <Anchor size={16} color={colors.primary} />
                    <Text style={styles.crewStatusText}>
                      {crew.distance} miles away
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.messageButton}
                    onPress={() => {
                      if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                  >
                    <MessageCircle size={20} color={colors.text.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    height: 200,
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
    padding: 20,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 32,
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
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.background.card,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.text.primary,
  },
  crewsContainer: {
    padding: 16,
    gap: 16,
  },
  crewCard: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
  },
  crewImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  cardContent: {
    gap: 8,
  },
  crewName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  crewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  crewStatusText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});