import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { MessageSquare, Star, Check } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useToast } from '@/hooks/useToast';

export default function FeedbackScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'other'>('suggestion');
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (feedback.trim().length < 10) {
      showToast({
        type: 'error',
        message: 'Please provide more detailed feedback',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    showToast({
      type: 'success',
      message: 'Thank you for your feedback!',
    });
    
    // Reset form
    setFeedback('');
    setRating(0);
    
    // Navigate back after a short delay
    setTimeout(() => {
      router.back();
    }, 1000);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: "Send Feedback",
        }}
      />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MessageSquare size={32} color={colors.text.primary} />
            </View>
            <Text style={styles.title}>We Value Your Feedback</Text>
            <Text style={styles.subtitle}>
              Help us improve Floatr by sharing your thoughts and experiences
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>What type of feedback do you have?</Text>
            
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  feedbackType === 'suggestion' && styles.typeButtonActive,
                ]}
                onPress={() => setFeedbackType('suggestion')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    feedbackType === 'suggestion' && styles.typeButtonTextActive,
                  ]}
                >
                  Suggestion
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  feedbackType === 'bug' && styles.typeButtonActive,
                ]}
                onPress={() => setFeedbackType('bug')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    feedbackType === 'bug' && styles.typeButtonTextActive,
                  ]}
                >
                  Bug Report
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  feedbackType === 'other' && styles.typeButtonActive,
                ]}
                onPress={() => setFeedbackType('other')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    feedbackType === 'other' && styles.typeButtonTextActive,
                  ]}
                >
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionTitle}>How would you rate your experience?</Text>
            
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={32}
                    color={star <= rating ? colors.status.warning : colors.text.tertiary}
                    fill={star <= rating ? colors.status.warning : 'none'}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
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
            
            <Button
              title="Submit Feedback"
              onPress={handleSubmit}
              variant="primary"
              loading={isSubmitting}
              style={styles.submitButton}
            />
          </View>
          
          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: colors.surface.secondary,
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
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
  },
  typeButtonTextActive: {
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  starButton: {
    padding: 8,
  },
  textInput: {
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.primary,
    minHeight: 150,
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  spacer: {
    height: 40,
  },
});