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
import { Camera, Save } from 'lucide-react-native';
import Button from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateUser({
      displayName: name,
      bio: bio,
    });
    
    setLoading(false);
    
    Alert.alert('Success', 'Profile updated successfully!', [
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          title: 'Edit Profile',
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
              source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000' }} 
              style={styles.profileImage}
            />
            <View style={styles.cameraOverlay}>
              <Camera size={24} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell others about yourself and your boating style..."
              placeholderTextColor={colors.text.secondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{bio.length}/200</Text>
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
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  bioInput: {
    height: 100,
    paddingTop: 16,
  },
  characterCount: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'right',
  },
});