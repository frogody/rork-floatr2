import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Calendar, Clock, MapPin, Users, Tag } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';

export default function CreateMeetupScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableTags = [
    'Raft-up', 'Fishing', 'Swimming', 'Sunset', 'Party', 'Chill', 'Adventure', 'Family-friendly'
  ];

  const handleTagToggle = async (tag: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCreate = async () => {
    if (!title || !location || !date || !time) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Meetup Created!',
        'Your meetup has been created and other boaters can now see it.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create meetup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Create Meetup',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meetup Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Sunset Raft-up at Marina Bay"
              placeholderTextColor={colors.text.secondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell others what to expect..."
              placeholderTextColor={colors.text.secondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When & Where</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.inputText}
                placeholder="Marina, coordinates, or landmark"
                placeholderTextColor={colors.text.secondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Date *</Text>
              <View style={styles.inputWithIcon}>
                <Calendar size={20} color={colors.text.secondary} />
                <TextInput
                  style={styles.inputText}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor={colors.text.secondary}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Time *</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color={colors.text.secondary} />
                <TextInput
                  style={styles.inputText}
                  placeholder="3:00 PM"
                  placeholderTextColor={colors.text.secondary}
                  value={time}
                  onChangeText={setTime}
                />
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendees</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Max Attendees</Text>
            <View style={styles.inputWithIcon}>
              <Users size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.inputText}
                placeholder="Leave empty for unlimited"
                placeholderTextColor={colors.text.secondary}
                value={maxAttendees}
                onChangeText={setMaxAttendees}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <Text style={styles.sectionDescription}>
            Help others find your meetup by adding relevant tags
          </Text>
          
          <View style={styles.tagsContainer}>
            {availableTags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  tags.includes(tag) && styles.selectedTag
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                  styles.tagText,
                  tags.includes(tag) && styles.selectedTagText
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <Button
          title="Create Meetup"
          onPress={handleCreate}
          variant="primary"
          size="large"
          loading={isLoading}
          gradient
          style={styles.createButton}
        />
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  inputText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.background.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTag: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  selectedTagText: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  createButton: {
    marginTop: 16,
    marginBottom: 32,
  },
});