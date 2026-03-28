import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Switch,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Users, 
  MapPin,
  Calendar,
  AlertTriangle,
  Volume2
} from 'lucide-react-native';
import colors from '@/constants/colors';

export default function NotificationSettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [matches, setMatches] = useState(true);
  const [messages, setMessages] = useState(true);
  const [meetups, setMeetups] = useState(true);
  const [nearby, setNearby] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [safety, setSafety] = useState(true);
  const [sounds, setSounds] = useState(true);

  const handleToggle = async (setter: (value: boolean) => void, currentValue: boolean) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setter(!currentValue);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Enable Push Notifications</Text>
              <Text style={styles.settingDescription}>Allow Floatr to send you notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={() => handleToggle(setPushEnabled, pushEnabled)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Heart size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>New Matches</Text>
              <Text style={styles.settingDescription}>When someone waves back at you</Text>
            </View>
            <Switch
              value={matches}
              onValueChange={() => handleToggle(setMatches, matches)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MessageCircle size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>New Messages</Text>
              <Text style={styles.settingDescription}>When you receive a message</Text>
            </View>
            <Switch
              value={messages}
              onValueChange={() => handleToggle(setMessages, messages)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Users size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Meetup Updates</Text>
              <Text style={styles.settingDescription}>Changes to planned meetups</Text>
            </View>
            <Switch
              value={meetups}
              onValueChange={() => handleToggle(setMeetups, meetups)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <MapPin size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Nearby Boaters</Text>
              <Text style={styles.settingDescription}>When new crews are nearby</Text>
            </View>
            <Switch
              value={nearby}
              onValueChange={() => handleToggle(setNearby, nearby)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Calendar size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Meetup Reminders</Text>
              <Text style={styles.settingDescription}>Remind me before scheduled meetups</Text>
            </View>
            <Switch
              value={reminders}
              onValueChange={() => handleToggle(setReminders, reminders)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <AlertTriangle size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Safety Alerts</Text>
              <Text style={styles.settingDescription}>Weather warnings and safety updates</Text>
            </View>
            <Switch
              value={safety}
              onValueChange={() => handleToggle(setSafety, safety)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
              thumbColor={colors.text.primary}
              disabled={!pushEnabled}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sound & Vibration</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Volume2 size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notification Sounds</Text>
              <Text style={styles.settingDescription}>Play sounds with notifications</Text>
            </View>
            <Switch
              value={sounds}
              onValueChange={() => handleToggle(setSounds, sounds)}
              trackColor={{ false: colors.text.secondary, true: colors.primary }}
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
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background.card,
    marginHorizontal: 16,
    marginBottom: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});