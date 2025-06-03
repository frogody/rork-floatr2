import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Camera, Save, ChevronDown } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { boatTypes } from '@/mocks/crews';

export default function EditBoatScreen() {
  const { boat, updateBoat } = useAuthStore();
  const [name, setName] = useState(boat?.name || '');
  const [type, setType] = useState(boat?.type || boatTypes[0]);
  const [length, setLength] = useState(boat?.length?.toString() || '');
  const [capacity, setCapacity] = useState(boat?.capacity?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!name || !type || !length || !capacity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateBoat({
      name,
      type,
      length: parseInt(length),
      capacity: parseInt(capacity),
      photoUrl: boat?.photoUrl || 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000',
    });
    
    setLoading(false);
    
    Alert.alert('Success', 'Boat information updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handlePhotoPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      'Change Photo',
      'In a real app, this would open the camera or photo library.',
      [{ text: 'OK' }]
    );
  };

  const handleTypeSelect = async (selectedType: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setType(selectedType);
    setShowTypePicker(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Edit Boat',
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
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoPress}>
            <Image 
              source={{ uri: boat?.photoUrl || 'https://images.unsplash.com/photo-1564762861003-0e8c17d1dab7?q=80&w=1000' }} 
              style={styles.boatImage}
            />
            <View style={styles.cameraOverlay}>
              <Camera size={24} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Boat Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your boat's name"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Boat Type</Text>
            <TouchableOpacity 
              style={styles.picker}
              onPress={() => setShowTypePicker(!showTypePicker)}
            >
              <Text style={styles.pickerText}>{type}</Text>
              <ChevronDown size={20} color={colors.text.secondary} />
            </TouchableOpacity>
            
            {showTypePicker && (
              <View style={styles.pickerOptions}>
                {boatTypes.map((boatType) => (
                  <TouchableOpacity
                    key={boatType}
                    style={styles.pickerOption}
                    onPress={() => handleTypeSelect(boatType)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      type === boatType && styles.selectedOption
                    ]}>
                      {boatType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Length (ft)</Text>
              <TextInput
                style={styles.input}
                placeholder="24"
                placeholderTextColor={colors.text.secondary}
                value={length}
                onChangeText={setLength}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                placeholder="8"
                placeholderTextColor={colors.text.secondary}
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  boatImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background.dark,
  },
  photoHint: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
  },
  picker: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  pickerOptions: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
  },
  pickerOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  pickerOptionText: {
    color: colors.text.primary,
    fontSize: 16,
  },
  selectedOption: {
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
});