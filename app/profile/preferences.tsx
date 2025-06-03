import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Platform,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  MapPin, 
  Users, 
  Calendar, 
  Anchor,
  Heart,
  Filter,
  Save
} from 'lucide-react-native';
import Button from '@/components/Button';
import { getColors } from '@/constants/colors';

export default function PreferencesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  
  const [ageRange, setAgeRange] = useState([25, 45]);
  const [distance, setDistance] = useState(50);
  const [showMe, setShowMe] = useState('everyone');
  const [boatTypes, setBoatTypes] = useState(['Sailboat', 'Motorboat']);
  const [experienceLevel, setExperienceLevel] = useState(['Intermediate', 'Advanced']);
  const [activities, setActivities] = useState(['Sailing', 'Fishing', 'Swimming']);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithBoats, setOnlyWithBoats] = useState(false);
  const [loading, setLoading] = useState(false);

  const showMeOptions = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
  ];

  const boatTypeOptions = [
    'Sailboat', 'Motorboat', 'Yacht', 'Catamaran', 'Pontoon', 
    'Fishing Boat', 'Speedboat', 'Kayak', 'Jet Ski'
  ];

  const experienceOptions = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  const activityOptions = [
    'Sailing', 'Fishing', 'Swimming', 'Diving', 'Water Sports',
    'Sunset Cruises', 'Island Hopping', 'Racing', 'Anchoring'
  ];

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
    router.back();
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Preferences',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <Button
              title="Save"
              onPress={handleSave}
              variant="text"
              size="small"
              loading={loading}
              icon={<Save size={16} color={colors.primary} />}
            />
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Discovery Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Discovery Settings</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceHeader}>
              <MapPin size={20} color={colors.text.secondary} />
              <Text style={[styles.preferenceTitle, { color: colors.text.primary }]}>
                Maximum Distance
              </Text>
            </View>
            <Text style={[styles.preferenceValue, { color: colors.text.secondary }]}>
              {distance} miles
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceHeader}>
              <Calendar size={20} color={colors.text.secondary} />
              <Text style={[styles.preferenceTitle, { color: colors.text.primary }]}>
                Age Range
              </Text>
            </View>
            <Text style={[styles.preferenceValue, { color: colors.text.secondary }]}>
              {ageRange[0]} - {ageRange[1]} years
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceHeader}>
              <Users size={20} color={colors.text.secondary} />
              <Text style={[styles.preferenceTitle, { color: colors.text.primary }]}>
                Show Me
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              {showMeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: showMe === option.value ? colors.primary : colors.background.secondary,
                      borderColor: colors.border.primary 
                    }
                  ]}
                  onPress={() => setShowMe(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: showMe === option.value ? colors.text.primary : colors.text.secondary }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Boat Preferences */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Boat Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <View style={styles.preferenceHeader}>
              <Anchor size={20} color={colors.text.secondary} />
              <Text style={[styles.preferenceTitle, { color: colors.text.primary }]}>
                Boat Types
              </Text>
            </View>
            <Text style={[styles.preferenceDescription, { color: colors.text.secondary }]}>
              Select the types of boats you are interested in
            </Text>
            <View style={styles.optionsContainer}>
              {boatTypeOptions.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: boatTypes.includes(type) ? colors.primary : colors.background.secondary,
                      borderColor: colors.border.primary 
                    }
                  ]}
                  onPress={() => toggleArrayItem(boatTypes, setBoatTypes, type)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: boatTypes.includes(type) ? colors.text.primary : colors.text.secondary }
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Experience Level */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Experience Level</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceDescription, { color: colors.text.secondary }]}>
              Select experience levels you are comfortable with
            </Text>
            <View style={styles.optionsContainer}>
              {experienceOptions.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: experienceLevel.includes(level) ? colors.primary : colors.background.secondary,
                      borderColor: colors.border.primary 
                    }
                  ]}
                  onPress={() => toggleArrayItem(experienceLevel, setExperienceLevel, level)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: experienceLevel.includes(level) ? colors.text.primary : colors.text.secondary }
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Activities */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Preferred Activities</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceDescription, { color: colors.text.secondary }]}>
              Select activities you enjoy on the water
            </Text>
            <View style={styles.optionsContainer}>
              {activityOptions.map((activity) => (
                <TouchableOpacity
                  key={activity}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: activities.includes(activity) ? colors.primary : colors.background.secondary,
                      borderColor: colors.border.primary 
                    }
                  ]}
                  onPress={() => toggleArrayItem(activities, setActivities, activity)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: activities.includes(activity) ? colors.text.primary : colors.text.secondary }
                  ]}>
                    {activity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Advanced Filters */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Advanced Filters</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Only Verified Profiles
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Show only users with verified accounts
              </Text>
            </View>
            <Switch
              value={onlyVerified}
              onValueChange={setOnlyVerified}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
          
          <View style={styles.switchItem}>
            <View style={styles.switchContent}>
              <Text style={[styles.switchTitle, { color: colors.text.primary }]}>
                Only Users with Boats
              </Text>
              <Text style={[styles.switchDescription, { color: colors.text.secondary }]}>
                Show only users who have added boat information
              </Text>
            </View>
            <Switch
              value={onlyWithBoats}
              onValueChange={setOnlyWithBoats}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceItem: {
    marginBottom: 20,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceValue: {
    fontSize: 14,
    marginLeft: 28,
  },
  preferenceDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 16,
  },
  switchContent: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});