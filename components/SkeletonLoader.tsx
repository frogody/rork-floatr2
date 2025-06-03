import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'profile';
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
  const renderCardSkeleton = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardSkeleton}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmer}
        />
      </View>
    </View>
  );

  const renderListSkeleton = () => (
    <View style={styles.listContainer}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <View style={styles.avatar} />
          <View style={styles.listContent}>
            <View style={styles.titleSkeleton} />
            <View style={styles.subtitleSkeleton} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderProfileSkeleton = () => (
    <View style={styles.profileContainer}>
      <View style={styles.profileImage} />
      <View style={styles.profileName} />
      <View style={styles.profileBio} />
    </View>
  );

  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    default:
      return renderCardSkeleton();
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
  },
  cardSkeleton: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background.card,
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  titleSkeleton: {
    height: 16,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    marginBottom: 8,
    width: '70%',
  },
  subtitleSkeleton: {
    height: 12,
    backgroundColor: colors.background.card,
    borderRadius: 6,
    width: '50%',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.card,
    marginBottom: 16,
  },
  profileName: {
    height: 24,
    width: 150,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileBio: {
    height: 16,
    width: 200,
    backgroundColor: colors.background.card,
    borderRadius: 8,
  },
});