import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import colors from '@/constants/colors';

interface WebMapScreenProps {
  crews: any[];
  onCrewPress: (crew: any) => void;
}

export default function WebMapScreen({ crews, onCrewPress }: WebMapScreenProps) {
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={24} color={colors.primary} />
        <Text style={styles.title}>Nearby Crews</Text>
      </View>
      <Text style={styles.subtitle}>
        Map view is not available on web. Here are the nearby crews:
      </Text>
      <View style={styles.crewList}>
        {crews.map((crew, index) => (
          <View key={crew.id || index} style={styles.crewItem}>
            <Text style={styles.crewName}>{crew.name}</Text>
            <Text style={styles.crewDistance}>{crew.distance}km away</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 12,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  crewList: {
    gap: 12,
  },
  crewItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  crewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  crewDistance: {
    fontSize: 14,
    color: '#666',
  },
});