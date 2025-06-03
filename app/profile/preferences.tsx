import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Heart, MapPin, Anchor, Users, Shield } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function PreferencesScreen() {
  const { user, updateUser } = useAuthStore();
  const colors = getColors(false); // Use light colors
  const [preferences, setPreferences] = React.useState(user?.preferences || {
    ageRange: [21, 35] as [number, number],
    maxDistance: 25,
    showMe: 'everyone' as 'men' | 'women' | 'everyone',
    boatTypes: [] as string[],
    experienceLevel: [] as string[],
    activities: [] as string[],
    onlyVerified: false,
    onlyWithBoats: true,
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleHaptic = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const updatePreference = React.useCallback((key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  }, []);

  const savePreferences = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await updateUser({ preferences });
      await handleHaptic();
      router.back();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences, updateUser, handleHaptic]);

  const showMeOptions = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'everyone', label: 'Everyone' },
  ];

  const boatTypeOptions = [
    'Sailboat', 'Motor Yacht', 'Catamaran', 'Speedboat', 
    'Fishing Boat', 'Pontoon', 'Jet Ski', 'Other'
  ];

  const experienceLevelOptions = [
    'Beginner', 'Intermediate', 'Advanced', 'Professional'
  ];

  const activityOptions = [
    'Sailing', 'Fishing', 'Swimming', 'Diving', 'Water Sports',
    'Sunset Cruises', 'Island Hopping', 'Parties', 'Relaxing'
  ];

  const distanceOptions = [5, 10, 25, 50, 100];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Dating Preferences',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Age Range */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <Heart size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Age Range</Text>
          </View>
          <Text style={[styles.sectionSubtitle, { color: colors.text.secondary }]}>
            {preferences.ageRange[0]} - {preferences.ageRange[1]} years old
          </Text>
          {/* Age range slider would go here - simplified for now */}
        </View>

        {/* Distance */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Maximum Distance</Text>
          </View>
          <View style={styles.optionsGrid}>
            {distanceOptions.map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: preferences.maxDistance === distance 
                      ? colors.primary 
                      : colors.background.primary,
                    borderColor: colors.border.primary,
                  }
                ]}
                onPress={() => {
                  handleHaptic();
                  updatePreference('maxDistance', distance);
                }}
              >
                <Text style={[
                  styles.optionText,
                  {
                    color: preferences.maxDistance === distance 
                      ? colors.background.primary 
                      : colors.text.primary
                  }
                ]}>
                  {distance} mi
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Show Me */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Show Me</Text>
          </View>
          <View style={styles.optionsGrid}>
            {showMeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: preferences.showMe === option.value 
                      ? colors.primary 
                      : colors.background.primary,
                    borderColor: colors.border.primary,
                  }
                ]}
                onPress={() => {
                  handleHaptic();
                  updatePreference('showMe', option.value);
                }}
              >
                <Text style={[
                  styles.optionText,
                  {
                    color: preferences.showMe === option.value 
                      ? colors.background.primary 
                      : colors.text.primary
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Boat Types */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <Anchor size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Preferred Boat Types</Text>
          </View>
          <View style={styles.optionsGrid}>
            {boatTypeOptions.map((boatType) => (
              <TouchableOpacity
                key={boatType}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: preferences.boatTypes.includes(boatType) 
                      ? colors.primary 
                      : colors.background.primary,
                    borderColor: colors.border.primary,
                  }
                ]}
                onPress={() => {
                  handleHaptic();
                  const newBoatTypes = preferences.boatTypes.includes(boatType)
                    ? preferences.boatTypes.filter(type => type !== boatType)
                    : [...preferences.boatTypes, boatType];
                  updatePreference('boatTypes', newBoatTypes);
                }}
              >
                <Text style={[
                  styles.optionText,
                  {
                    color: preferences.boatTypes.includes(boatType) 
                      ? colors.background.primary 
                      : colors.text.primary
                  }
                ]}>
                  {boatType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Activities */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Preferred Activities</Text>
          </View>
          <View style={styles.optionsGrid}>
            {activityOptions.map((activity) => (
              <TouchableOpacity
                key={activity}
                style={[
                  styles.optionChip,
                  {
                    backgroundColor: preferences.activities.includes(activity) 
                      ? colors.primary 
                      : colors.background.primary,
                    borderColor: colors.border.primary,
                  }
                ]}
                onPress={() => {
                  handleHaptic();
                  const newActivities = preferences.activities.includes(activity)
                    ? preferences.activities.filter(act => act !== activity)
                    : [...preferences.activities, activity];
                  updatePreference('activities', newActivities);
                }}
              >
                <Text style={[
                  styles.optionText,
                  {
                    color: preferences.activities.includes(activity) 
                      ? colors.background.primary 
                      : colors.text.primary
                  }
                ]}>
                  {activity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filters */}
        <View style={[styles.section, { backgroundColor: colors.background.secondary }]}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Filters</Text>
          </View>
          
          <View style={styles.filterItem}>
            <View style={styles.filterText}>
              <Text style={[styles.filterTitle, { color: colors.text.primary }]}>
                Only show verified profiles
              </Text>
              <Text style={[styles.filterSubtitle, { color: colors.text.secondary }]}>
                Profiles with verified photos and identity
              </Text>
            </View>
            <Switch
              value={preferences.onlyVerified}
              onValueChange={(value) => {
                handleHaptic();
                updatePreference('onlyVerified', value);
              }}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>

          <View style={styles.filterItem}>
            <View style={styles.filterText}>
              <Text style={[styles.filterTitle, { color: colors.text.primary }]}>
                Only show boat owners
              </Text>
              <Text style={[styles.filterSubtitle, { color: colors.text.secondary }]}>
                People who own or have access to boats
              </Text>
            </View>
            <Switch
              value={preferences.onlyWithBoats}
              onValueChange={(value) => {
                handleHaptic();
                updatePreference('onlyWithBoats', value);
              }}
              trackColor={{ false: colors.border.primary, true: colors.primary }}
              thumbColor={colors.background.primary}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Save Preferences"
            onPress={savePreferences}
            variant="primary"
            size="large"
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  filterText: {
    flex: 1,
    marginRight: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  filterSubtitle: {
    fontSize: 14,
  },
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
});