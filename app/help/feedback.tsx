import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { 
  Send,
  Star,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';

export default function FeedbackScreen() {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'experience' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRating = async (value: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRating(value);
  };

  const handleFeedbackType = async (type: 'bug' | 'feature' | 'experience') => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFeedbackType(type);
  };

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Error', 'Please enter your feedback before submitting.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Error', 'Please rate your experience before submitting.');
      return;
    }

    if (!feedbackType) {
      Alert.alert('Error', 'Please select a feedback type before submitting.');
      return;
    }

    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedback('');
              setRating(0);
              setFeedbackType(null);
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Send Feedback',
          headerStyle: {
            backgroundColor: colors.background.dark,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>We Value Your Feedback</Text>
          <Text style={styles.subtitle}>
            Help us improve Floatr by sharing your thoughts and experiences
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.starButton,
                  rating >= value && styles.starButtonActive,
                ]}
                onPress={() => handleRating(value)}
                activeOpacity={0.7}
              >
                <Star
                  size={28}
                  color={rating >= value ? colors.secondary : colors.text.tertiary}
                  fill={rating >= value ? colors.secondary : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 ? 'Tap to rate' : 
             rating === 1 ? 'Poor' :
             rating === 2 ? 'Fair' :
             rating === 3 ? 'Good' :
             rating === 4 ? 'Very Good' : 'Excellent'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What type of feedback do you have?</Text>
          <View style={styles.feedbackTypeContainer}>
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                feedbackType === 'bug' && styles.feedbackTypeButtonActive,
              ]}
              onPress={() => handleFeedbackType('bug')}
              activeOpacity={0.7}
            >
              <Frown
                size={24}
                color={feedbackType === 'bug' ? colors.text.primary : colors.text.tertiary}
              />
              <Text style={[
                styles.feedbackTypeText,
                feedbackType === 'bug' && styles.feedbackTypeTextActive,
              ]}>
                Report a Bug
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                feedbackType === 'feature' && styles.feedbackTypeButtonActive,
              ]}
              onPress={() => handleFeedbackType('feature')}
              activeOpacity={0.7}
            >
              <ThumbsUp
                size={24}
                color={feedbackType === 'feature' ? colors.text.primary : colors.text.tertiary}
              />
              <Text style={[
                styles.feedbackTypeText,
                feedbackType === 'feature' && styles.feedbackTypeTextActive,
              ]}>
                Suggest a Feature
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                feedbackType === 'experience' && styles.feedbackTypeButtonActive,
              ]}
              onPress={() => handleFeedbackType('experience')}
              activeOpacity={0.7}
            >
              <Smile
                size={24}
                color={feedbackType === 'experience' ? colors.text.primary : colors.text.tertiary}
              />
              <Text style={[
                styles.feedbackTypeText,
                feedbackType === 'experience' && styles.feedbackTypeTextActive,
              ]}>
                Share Experience
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tell us more</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Share your thoughts, ideas, or report issues..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            loading={isSubmitting}
            icon={<Send size={20} color={colors.text.primary} />}
            iconPosition="right"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  starButton: {
    padding: 8,
    marginHorizontal: 4,
  },
  starButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  ratingText: {
    textAlign: 'center',
    color: colors.text.secondary,
    fontSize: 16,
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  feedbackTypeButton: {
    width: '30%',
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  feedbackTypeText: {
    color: colors.text.tertiary,
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  feedbackTypeTextActive: {
    color: colors.text.primary,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    padding: 16,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 150,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
});