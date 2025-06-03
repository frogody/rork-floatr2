import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';
import { AlertTriangle, Phone, Radio, Navigation, MapPin, LifeBuoy } from 'lucide-react-native';
import { Button } from '@/components/Button';

export default function EmergencyServicesScreen() {
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      Alert.alert('Error', 'Could not open phone app');
    });
  };
  
  const emergencyContacts = [
    {
      id: '1',
      name: 'Coast Guard Emergency',
      number: '911',
      description: 'For life-threatening emergencies on the water',
      icon: <AlertTriangle size={24} color={colors.status.error} />,
    },
    {
      id: '2',
      name: 'Coast Guard Non-Emergency',
      number: '1-800-368-5647',
      description: 'For non-emergency assistance and information',
      icon: <LifeBuoy size={24} color={colors.primary} />,
    },
    {
      id: '3',
      name: 'Sea Tow',
      number: '1-800-473-2869',
      description: 'For on-water towing and assistance',
      icon: <Navigation size={24} color={colors.status.warning} />,
    },
    {
      id: '4',
      name: 'BoatUS',
      number: '1-800-391-4869',
      description: 'For boat towing and marine assistance',
      icon: <Navigation size={24} color={colors.status.warning} />,
    },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Emergency Services",
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={32} color={colors.status.error} />
          </View>
          <Text style={styles.title}>Emergency Services</Text>
          <Text style={styles.subtitle}>
            Important contacts for emergency situations on the water
          </Text>
        </View>
        
        <View style={styles.emergencyButton}>
          <Button
            title="Call 911 Emergency"
            onPress={() => handleCall('911')}
            variant="primary"
            icon={<Phone size={20} color={colors.text.primary} />}
            style={{ backgroundColor: colors.status.error }}
          />
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Radio size={24} color={colors.status.info} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>VHF Radio Emergency</Text>
            <Text style={styles.infoDescription}>
              Use VHF Channel 16 (156.8 MHz) for distress calls. State "MAYDAY, MAYDAY, MAYDAY" followed by your vessel name, position, nature of emergency, and assistance needed.
            </Text>
          </View>
        </View>
        
        <View style={styles.contactsContainer}>
          <Text style={styles.sectionTitle}>Important Contacts</Text>
          
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleCall(contact.number.replace(/-/g, ''))}
              activeOpacity={0.7}
            >
              <View style={styles.contactIconContainer}>
                {contact.icon}
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
              </View>
              <View style={styles.contactNumberContainer}>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Phone size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Emergency Tips</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Share Your Location</Text>
            <Text style={styles.tipDescription}>
              Always know your exact location. Use GPS coordinates, nearby landmarks, or the Floatr app's location sharing feature to communicate your position to rescuers.
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Stay With Your Vessel</Text>
            <Text style={styles.tipDescription}>
              If your boat is disabled but not sinking, stay with it. A boat is easier to spot than a person in the water, and it provides some shelter and flotation.
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Use Visual Distress Signals</Text>
            <Text style={styles.tipDescription}>
              Use flares, orange smoke, or signal mirrors during daylight. At night, use electric distress lights or flares to attract attention.
            </Text>
          </View>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  emergencyButton: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  contactsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
  },
  contactNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contactNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
    marginRight: 8,
  },
  tipsContainer: {
    padding: 16,
  },
  tipCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 20,
  },
  spacer: {
    height: 40,
  },
});