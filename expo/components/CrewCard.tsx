import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { MapPin, Users, Star, Anchor, Info } from 'lucide-react-native';
import { getColors } from '@/constants/colors';
import { Crew } from '@/mocks/crews';

interface CrewCardProps {
  crew: Crew;
  onInfoPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const CrewCard: React.FC<CrewCardProps> = ({ crew, onInfoPress }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface.primary }]}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: crew.imageUrl }} style={styles.image} />
        
        {/* Overlay Info */}
        <View style={styles.overlay}>
          <View style={styles.topRow}>
            <View style={styles.distanceContainer}>
              <MapPin size={12} color={colors.text.primary} />
              <Text style={[styles.distanceText, { color: colors.text.primary }]}>
                {crew.distance} mi away
              </Text>
            </View>
            
            {onInfoPress && (
              <TouchableOpacity 
                style={[styles.infoButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                onPress={onInfoPress}
              >
                <Info size={16} color={colors.text.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={[styles.name, { color: colors.text.primary }]}>{crew.name}</Text>
            {crew.verified && (
              <Star size={16} color={colors.primary} fill={colors.primary} />
            )}
          </View>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Anchor size={14} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {crew.boatType || 'Boat'}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Users size={14} color={colors.text.secondary} />
              <Text style={[styles.metaText, { color: colors.text.secondary }]}>
                {crew.memberCount} people
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.description, { color: colors.text.secondary }]} numberOfLines={3}>
          {crew.description}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {crew.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.background.secondary }]}>
              <Text style={[styles.tagText, { color: colors.text.secondary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: CARD_WIDTH,
    alignSelf: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});