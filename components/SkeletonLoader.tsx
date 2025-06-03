import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import colors from '@/constants/colors';

interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'profile' | 'detail';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  
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
    <View style={styles.cardContainer}>
      <Animated.View 
        style={[
          styles.cardImage, 
          { opacity: fadeAnim }
        ]} 
      />
      <View style={styles.cardContent}>
        <Animated.View 
          style={[
            styles.cardTitle, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.cardSubtitle, 
            { opacity: fadeAnim }
          ]} 
        />
        <View style={styles.cardTags}>
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cardTag, 
              { opacity: fadeAnim }
            ]} 
          />
        </View>
      </View>
    </View>
  );
  
  const renderListSkeleton = () => (
    <View style={styles.listContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.listItem}>
          <Animated.View 
            style={[
              styles.listAvatar, 
              { opacity: fadeAnim }
            ]} 
          />
          <View style={styles.listContent}>
            <Animated.View 
              style={[
                styles.listTitle, 
                { opacity: fadeAnim }
              ]} 
            />
            <Animated.View 
              style={[
                styles.listSubtitle, 
                { opacity: fadeAnim }
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
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.profileName, 
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.profileBio, 
          { opacity: fadeAnim }
        ]} 
      />
      <View style={styles.profileStats}>
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileStat, 
            { opacity: fadeAnim }
          ]} 
        />
      </View>
      <View style={styles.profileButtons}>
        <Animated.View 
          style={[
            styles.profileButton, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.profileButton, 
            { opacity: fadeAnim }
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
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailTitle, 
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailSubtitle, 
          { opacity: fadeAnim }
        ]} 
      />
      <View style={styles.detailInfo}>
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim }
          ]} 
        />
        <Animated.View 
          style={[
            styles.detailInfoItem, 
            { opacity: fadeAnim }
          ]} 
        />
      </View>
      <Animated.View 
        style={[
          styles.detailDescription, 
          { opacity: fadeAnim }
        ]} 
      />
      <Animated.View 
        style={[
          styles.detailButton, 
          { opacity: fadeAnim }
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
    backgroundColor: colors.surface.primary,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    height: height * 0.5,
    backgroundColor: colors.surface.secondary,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    height: 24,
    backgroundColor: colors.surface.secondary,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  cardSubtitle: {
    height: 16,
    backgroundColor: colors.surface.secondary,
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
    backgroundColor: colors.surface.secondary,
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
    borderBottomColor: colors.border.primary,
  },
  listAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface.secondary,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    height: 18,
    backgroundColor: colors.surface.secondary,
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  listSubtitle: {
    height: 14,
    backgroundColor: colors.surface.secondary,
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
    backgroundColor: colors.surface.secondary,
    marginBottom: 16,
  },
  profileName: {
    height: 24,
    backgroundColor: colors.surface.secondary,
    borderRadius: 4,
    marginBottom: 8,
    width: 150,
  },
  profileBio: {
    height: 16,
    backgroundColor: colors.surface.secondary,
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
    backgroundColor: colors.surface.secondary,
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
    backgroundColor: colors.surface.secondary,
    borderRadius: 24,
  },
  
  // Detail Skeleton
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  detailImage: {
    height: 200,
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailTitle: {
    height: 28,
    backgroundColor: colors.surface.secondary,
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  detailSubtitle: {
    height: 20,
    backgroundColor: colors.surface.secondary,
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
    backgroundColor: colors.surface.secondary,
    borderRadius: 8,
  },
  detailDescription: {
    height: 100,
    backgroundColor: colors.surface.secondary,
    borderRadius: 8,
    marginBottom: 24,
  },
  detailButton: {
    height: 48,
    backgroundColor: colors.surface.secondary,
    borderRadius: 24,
  },
});