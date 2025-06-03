import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Navigation, Users } from 'lucide-react-native';
import colors from '@/constants/colors';
import { mockCrews } from '@/mocks/crews';

export default function WebMapScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={48} color={colors.primary} />
        <Text style={styles.title}>Nearby Crews</Text>
        <Text style={styles.subtitle}>
          Interactive map is available on mobile. Here are crews in your area:
        </Text>
      </View>
      
      <ScrollView style={styles.crewList} showsVerticalScrollIndicator={false}>
        {mockCrews.map((crew) => (
          <View key={crew.id} style={styles.crewCard}>
            <View style={styles.crewHeader}>
              <View style={styles.crewInfo}>
                <Text style={styles.crewName}>{crew.name}</Text>
                <Text style={styles.crewDescription}>{crew.description}</Text>
              </View>
              <View style={styles.locationBadge}>
                <Navigation size={16} color={colors.primary} />
                <Text style={styles.distance}>
                  {Math.floor(Math.random() * 5 + 1)} mi
                </Text>
              </View>
            </View>
            
            <View style={styles.crewStats}>
              <View style={styles.stat}>
                <Users size={16} color={colors.text.secondary} />
                <Text style={styles.statText}>
                  {Math.floor(Math.random() * 20 + 5)} members
                </Text>
              </View>
            </View>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  crewList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  crewCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  crewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  crewInfo: {
    flex: 1,
    marginRight: 12,
  },
  crewName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  crewDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  crewStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});