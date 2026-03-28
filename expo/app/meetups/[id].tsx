import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  MessageCircle,
  Share,
  Flag,
  Check,
  X
} from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

interface Meetup {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  maxAttendees?: number;
  currentAttendees: number;
  tags: string[];
  organizer: {
    id: string;
    name: string;
    avatar: string;
  };
  attendees: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  isAttending: boolean;
}

export default function MeetupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setMeetup({
        id: id || '1',
        title: 'Sunset Raft-up at Marina Bay',
        description: 'Join us for a relaxing evening on the water! We will be anchoring near the marina for a beautiful sunset view. Bring snacks and drinks to share. All boat types welcome!',
        location: 'Marina Bay, San Francisco',
        date: 'June 15, 2024',
        time: '5:00 PM',
        maxAttendees: 12,
        currentAttendees: 7,
        tags: ['Raft-up', 'Sunset', 'Chill', 'Family-friendly'],
        organizer: {
          id: '1',
          name: 'Sarah & Mike',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000',
        },
        attendees: [
          { id: '1', name: 'Sarah & Mike', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000' },
          { id: '2', name: 'The Johnsons', avatar: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1000' },
          { id: '3', name: 'Captain Dave', avatar: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000' },
        ],
        isAttending: false,
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleRSVP = async () => {
    if (!meetup) return;
    
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const newAttendingStatus = !meetup.isAttending;
    
    setMeetup(prev => prev ? {
      ...prev,
      isAttending: newAttendingStatus,
      currentAttendees: newAttendingStatus 
        ? prev.currentAttendees + 1 
        : prev.currentAttendees - 1
    } : null);

    Alert.alert(
      newAttendingStatus ? 'RSVP Confirmed!' : 'RSVP Cancelled',
      newAttendingStatus 
        ? 'You are now attending this meetup. See you on the water!'
        : 'You are no longer attending this meetup.',
      [{ text: 'OK' }]
    );
  };

  const handleMessage = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    router.push(`/chat/${meetup?.organizer.id}`);
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert('Share Meetup', 'This would open the share sheet to share this meetup.');
  };

  const handleReport = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      'Report Meetup',
      'Report this meetup for inappropriate content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive' },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading meetup details...</Text>
        </View>
      </View>
    );
  }

  if (!meetup) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Meetup not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Meetup Details',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Share size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleReport}>
                <Flag size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{meetup.title}</Text>
          
          <View style={styles.tagsContainer}>
            {meetup.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.detailText}>{meetup.date}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Clock size={20} color={colors.primary} />
            <Text style={styles.detailText}>{meetup.time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <MapPin size={20} color={colors.primary} />
            <Text style={styles.detailText}>{meetup.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={20} color={colors.primary} />
            <Text style={styles.detailText}>
              {meetup.currentAttendees}
              {meetup.maxAttendees && ` / ${meetup.maxAttendees}`} attending
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{meetup.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organizer</Text>
          <TouchableOpacity style={styles.organizer} onPress={handleMessage}>
            <Image source={{ uri: meetup.organizer.avatar }} style={styles.organizerAvatar} />
            <View style={styles.organizerInfo}>
              <Text style={styles.organizerName}>{meetup.organizer.name}</Text>
              <Text style={styles.organizerLabel}>Meetup Organizer</Text>
            </View>
            <MessageCircle size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendees ({meetup.currentAttendees})</Text>
          <View style={styles.attendeesGrid}>
            {meetup.attendees.map(attendee => (
              <View key={attendee.id} style={styles.attendee}>
                <Image source={{ uri: attendee.avatar }} style={styles.attendeeAvatar} />
                <Text style={styles.attendeeName}>{attendee.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={meetup.isAttending ? 'Cancel RSVP' : 'RSVP to Attend'}
          onPress={handleRSVP}
          variant={meetup.isAttending ? 'outline' : 'primary'}
          size="large"
          gradient={!meetup.isAttending}
          icon={meetup.isAttending ? <X size={16} color={colors.primary} /> : <Check size={16} color={colors.text.primary} />}
          style={styles.rsvpButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
  },
  details: {
    padding: 16,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  organizerLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  attendeesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  attendee: {
    alignItems: 'center',
    width: 80,
  },
  attendeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 8,
  },
  attendeeName: {
    fontSize: 12,
    color: colors.text.primary,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  rsvpButton: {
    width: '100%',
  },
});