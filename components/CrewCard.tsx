import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crew } from '@/types';
import colors from '@/constants/colors';
import { MapPin, Users, Ruler, Ship } from 'lucide-react-native';

interface CrewCardProps {
  crew: Crew;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function CrewCard({ crew, onPress }: CrewCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image 
        source={{ uri: crew.photoUrls[0] }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{crew.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.text.primary} />
              <Text style={styles.location}>{crew.location} • {crew.distance} mi</Text>
            </View>
          </View>
          
          <Text style={styles.bio} numberOfLines={2}>{crew.bio}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Users size={14} color={colors.text.primary} />
              <Text style={styles.detailText}>{crew.memberCount} crew</Text>
            </View>
            <View style={styles.detail}>
              <Ship size={14} color={colors.text.primary} />
              <Text style={styles.detailText}>{crew.boatType}</Text>
            </View>
            <View style={styles.detail}>
              <Ruler size={14} color={colors.text.primary} />
              <Text style={styles.detailText}>{crew.boatLength}ft</Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {crew.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  infoContainer: {
    gap: 8,
  },
  header: {
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  bio: {
    fontSize: 16,
    color: colors.text.primary,
    opacity: 0.9,
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.text.primary,
    opacity: 0.9,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
});