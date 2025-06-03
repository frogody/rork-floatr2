import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, useColorScheme } from 'react-native';
import { getColors } from '@/constants/colors';

interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'profile' | 'detail';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  
  const currentColors = getColors(isDark);
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);
  
  const renderCardSkeleton = () => (
    <View style={[styles.cardContainer, { backgroundColor: currentColors.surface.primary }]}>
      <Animated.View 
        style={[
          styles.cardImage, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <View style={styles.cardContent}>
        <Animated.View 
          style={[
            styles.cardTitle, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.cardSubtitle, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <View style={styles.cardTags}>
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
            ]} 
          />
        </View>
      </View>
    </View>
  );
  
  const renderListSkeleton = () => (
    <View style={styles.listContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={[styles.listItem, { borderBottomColor: currentColors.border.primary }]}>
          <Animated.View 
            style={[
              styles.listAvatar, 
              { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
            ]} 
          />
          <View style={styles.listContent}>
            <Animated.View 
              style={[
                styles.listTitle, 
                { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
              ]} 
            />
            <Animated.View 
              style={[
                styles.listSubtitle, 
                { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
  
  const renderProfileSkeleton = () => (
    <View style={styles.profileContainer}>
      <Animated.View 
        style={[
          styles.profileAvatar, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <Animated.View 
        style={[
          styles.profileName, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <Animated.View 
        style={[
          styles.profileBio, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <View style={styles.profileStats}>
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
      </View>
      <View style={styles.profileButtons}>
        <Animated.View 
          style={[
            styles.profileButton, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileButton, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
      </View>
    </View>
  );
  
  const renderDetailSkeleton = () => (
    <View style={styles.detailContainer}>
      <Animated.View 
        style={[
          styles.detailImage, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailTitle, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailSubtitle, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <View style={styles.detailInfo}>
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
          ]} 
        />
      </View>
      <Animated.View 
        style={[
          styles.detailDescription, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailButton, 
          { opacity: fadeAnim, backgroundColor: currentColors.surface.secondary }
        ]} 
      />
    </View>
  );
  
  switch (type) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'profile':
      return renderProfileSkeleton();
    case 'detail':
      return renderDetailSkeleton();
    default:
      return renderCardSkeleton();
  }
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Card Skeleton
  cardContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    height: height * 0.5,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  cardSubtitle: {
    height: 16,
    borderRadius: 4,
    marginBottom: 16,
    width: '50%',
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardTag: {
    height: 24,
    width: 80,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  
  // List Skeleton
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  listAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  listSubtitle: {
    height: 14,
    borderRadius: 4,
    width: '80%',
  },
  
  // Profile Skeleton
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
    width: 150,
  },
  profileBio: {
    height: 16,
    borderRadius: 4,
    marginBottom: 24,
    width: 200,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  profileStat: {
    height: 40,
    width: 80,
    borderRadius: 8,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  profileButton: {
    height: 48,
    width: 150,
    borderRadius: 24,
  },
  
  // Detail Skeleton
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailImage: {
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailTitle: {
    height: 28,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  detailSubtitle: {
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
    width: '50%',
  },
  detailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailInfoItem: {
    height: 60,
    width: '30%',
    borderRadius: 8,
  },
  detailDescription: {
    height: 100,
    borderRadius: 8,
    marginBottom: 24,
  },
  detailButton: {
    height: 48,
    borderRadius: 24,
  },
});