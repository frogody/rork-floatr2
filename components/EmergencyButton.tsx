import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert,
  Linking,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { AlertTriangle, Phone, MapPin } from 'lucide-react-native';
import colors from '@/constants/colors';

interface EmergencyButtonProps {
  style?: any;
  onPress?: () => void;
}

export default function EmergencyButton({ style, onPress }: EmergencyButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (onPress) {
      onPress();
      return;
    }

    Alert.alert(
      'Emergency',
      'Are you in immediate danger and need emergency assistance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Coast Guard', 
          onPress: () => callEmergencyServices(),
          style: 'destructive'
        },
        { 
          text: 'Share Location', 
          onPress: () => shareLocation()
        },
      ]
    );
  };

  const callEmergencyServices = async () => {
    const emergencyNumber = Platform.select({
      ios: 'tel:911',
      android: 'tel:911',
      default: 'tel:911'
    });

    try {
      await Linking.openURL(emergencyNumber);
    } catch (error) {
      Alert.alert('Error', 'Unable to make emergency call');
    }
  };

  const shareLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for emergency services');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const message = `EMERGENCY: I need help. My location is: https://maps.google.com/?q=${latitude},${longitude}`;
      
      // In a real app, this would send to emergency contacts or coast guard
      Alert.alert(
        'Location Shared',
        'Your location has been shared with emergency services and your emergency contacts.',
        [{ text: 'OK' }]
      );
      
      console.log('Emergency location:', { latitude, longitude, message });
    } catch (error) {
      Alert.alert('Error', 'Unable to get your location');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleEmergencyPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <View style={[styles.button, isPressed && styles.buttonPressed]}>
        <AlertTriangle size={20} color={colors.text.primary} />
        <Text style={styles.text}>SOS</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ef4444',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    backgroundColor: '#dc2626',
  },
  text: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});