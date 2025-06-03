import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  Modal, 
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, Filter } from 'lucide-react-native';
import { Button } from '@/components/Button';
import colors from '@/constants/colors';

const boatTypes = [
  'Sailboat',
  'Center Console',
  'Motor Yacht',
  'Sport Fisherman',
  'Bowrider',
  'Catamaran',
  'Pontoon',
  'Cabin Cruiser',
  'Trawler',
  'Speedboat'
] as const;

type BoatType = typeof boatTypes[number];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  distance: number;
  boatTypes: BoatType[];
  crewSize: { min: number; max: number };
  tags: string[];
}

const availableTags = [
  'Chill', 'Party', 'Fishing', 'Adventure', 'Sunset', 'Music', 
  'Social', 'Drinks', 'Swimming', 'Explore', 'Relaxed', 'Luxury'
] as const;

type Tag = typeof availableTags[number];

const distanceOptions = [1, 5, 10, 25, 50, 100] as const;
type Distance = typeof distanceOptions[number];

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [distance, setDistance] = useState<Distance>(25);
  const [selectedBoatTypes, setSelectedBoatTypes] = useState<BoatType[]>([]);
  const [crewSize, setCrewSize] = useState({ min: 1, max: 12 });
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleBoatTypeToggle = async (boatType: BoatType) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedBoatTypes(prev => 
      prev.includes(boatType) 
        ? prev.filter((t: BoatType) => t !== boatType)
        : [...prev, boatType]
    );
  };

  const handleTagToggle = async (tag: Tag) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter((t: Tag) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDistanceSelect = async (dist: Distance) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setDistance(dist);
  };

  const handleApply = () => {
    onApply({
      distance,
      boatTypes: selectedBoatTypes,
      crewSize,
      tags: selectedTags,
    });
    onClose();
  };

  const handleClearAll = () => {
    setDistance(25);
    setSelectedBoatTypes([]);
    setCrewSize({ min: 1, max: 12 });
    setSelectedTags([]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <View style={styles.distanceOptions}>
              {distanceOptions.map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[
                    styles.distanceOption,
                    distance === dist && styles.selectedOption
                  ]}
                  onPress={() => handleDistanceSelect(dist)}
                >
                  <Text style={[
                    styles.distanceText,
                    distance === dist && styles.selectedOptionText
                  ]}>
                    {dist} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Boat Types</Text>
            <View style={styles.optionsGrid}>
              {boatTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionChip,
                    selectedBoatTypes.includes(type) && styles.selectedChip
                  ]}
                  onPress={() => handleBoatTypeToggle(type)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedBoatTypes.includes(type) && styles.selectedChipText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.optionsGrid}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.optionChip,
                    selectedTags.includes(tag) && styles.selectedChip
                  ]}
                  onPress={() => handleTagToggle(tag)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedTags.includes(tag) && styles.selectedChipText
                  ]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Apply Filters"
            onPress={handleApply}
            variant="primary"
            size="large"
            icon={<Filter size={16} color={colors.text.primary} />}
            style={styles.applyButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  clearText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  distanceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  distanceOption: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  distanceText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  selectedChipText: {
    color: colors.primary,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  applyButton: {
    width: '100%',
  },
});