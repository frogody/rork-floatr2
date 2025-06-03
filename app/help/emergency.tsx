import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
  Linking
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Phone, 
  AlertTriangle,
  Navigation,
  Anchor,
  Radio,
  MapPin,
  Share2
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';

interface EmergencyContact {
  id: string;
  title: string;
  number: string;
  icon: React.ReactNode;
}

export default function EmergencyScreen() {
  const handleCall = async (number: string, title: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${title}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          style: 'destructive',
          onPress: () => Linking.openURL(`tel:${number}`),
        },
      ]
    );
  };

  const handleShareLocation = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Share Location',
      'This would share your current location with emergency services.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Share',
          onPress: () => {
            // In a real app, this would trigger location sharing
            Alert.alert('Location Shared', 'Your location has been shared with emergency services.');
          },
        },
      ]
    );
  };

  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'coastguard',
      title: 'U.S. Coast Guard',
      number: '911',
      icon: <Anchor size={24} color={colors.text.primary} />,
    },
    {
      id: 'emergency',
      title: 'Emergency Services',
      number: '911',
      icon: <Phone size={24} color={colors.text.primary} />,
    },
    {
      id: 'marine',
      title: 'Marine Assistance',
      number: '18005551234',
      icon: <Radio size={24} color={colors.text.primary} />,
    },
    {
      id: 'seatow',
      title: 'Sea Tow',
      number: '18007583474',
      icon: <Navigation size={24} color={colors.text.primary} />,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Emergency Assistance',
          headerStyle: {
            backgroundColor: colors.status.error,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <View style={styles.emergencyBanner}>
        <AlertTriangle size={24} color={colors.text.primary} />
        <Text style={styles.emergencyText}>
          If you are in immediate danger, call 911 or your local emergency number immediately.
        </Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          {emergencyContacts.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactItem}
              onPress={() => handleCall(contact.number, contact.title)}
              activeOpacity={0.7}
            >
              <View style={styles.contactIcon}>
                {contact.icon}
              </View>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{contact.title}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              
              <View style={styles.callButton}>
                <Phone size={20} color={colors.text.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Share Your Location</Text>
          <Text style={styles.sectionDescription}>
            Share your current GPS coordinates with emergency services to help them locate you quickly.
          </Text>
          
          <Button
            title="Share My Location"
            onPress={handleShareLocation}
            variant="primary"
            size="large"
            style={styles.shareButton}
            icon={<Share2 size={20} color={colors.text.primary} />}
            iconPosition="left"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Tips</Text>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>Stay with your vessel</Text>
            <Text style={styles.tipDescription}>
              Unless it's unsafe, stay with your boat. It's easier to spot a boat than a person in the water.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>Use visual distress signals</Text>
            <Text style={styles.tipDescription}>
              Use flares, flags, or lights to signal for help if available.
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipTitle}>Conserve energy</Text>
            <Text style={styles.tipDescription}>
              If in the water, adopt the HELP position (Heat Escape Lessening Position) to conserve body heat.
            </Text>
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
  emergencyBanner: {
    backgroundColor: colors.status.error,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    color: colors.text.primary,
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 20,
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: colors.status.info,
  },
  tipItem: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});