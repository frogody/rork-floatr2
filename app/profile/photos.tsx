import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  useColorScheme
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Camera, Plus, X, Star, Move } from 'lucide-react-native';
import Button from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function ManagePhotosScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);
  const { user, updateUser } = useAuthStore();
  
  const [photos, setPhotos] = useState([
    { id: '1', url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1000', isMain: true },
    { id: '2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000', isMain: false },
    { id: '3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000', isMain: false },
  ]);

  const maxPhotos = 6;

  const handleAddPhoto = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (photos.length >= maxPhotos) {
      Alert.alert('Photo Limit', `You can only have up to ${maxPhotos} photos.`);
      return;
    }
    
    Alert.alert(
      'Add Photo',
      'Choose how you would like to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: () => handleCameraAction('camera') },
        { text: 'Photo Library', onPress: () => handleCameraAction('library') },
      ]
    );
  };

  const handleCameraAction = (type: 'camera' | 'library') => {
    // In a real app, this would open camera or photo library
    Alert.alert('Photo Action', `In a real app, this would open the ${type}.`);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const photo = photos.find(p => p.id === photoId);
    if (photo?.isMain) {
      Alert.alert('Cannot Delete', 'You cannot delete your main photo. Set another photo as main first.');
      return;
    }
    
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPhotos(photos.filter(p => p.id !== photoId));
          }
        },
      ]
    );
  };

  const handleSetMainPhoto = async (photoId: string) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setPhotos(photos.map(photo => ({
      ...photo,
      isMain: photo.id === photoId
    })));
    
    const mainPhoto = photos.find(p => p.id === photoId);
    if (mainPhoto) {
      updateUser({ avatarUrl: mainPhoto.url });
    }
  };

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const mainPhoto = photos.find(p => p.isMain);
    if (mainPhoto) {
      updateUser({ avatarUrl: mainPhoto.url });
    }
    
    Alert.alert('Success', 'Photos updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Manage Photos',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerRight: () => (
            <Button
              title="Save"
              onPress={handleSave}
              variant="text"
              size="small"
            />
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoCard, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.infoTitle, { color: colors.text.primary }]}>Photo Tips</Text>
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            • Add up to {maxPhotos} photos to show your personality{'\n'}
            • Your first photo will be your main profile picture{'\n'}
            • Include photos of you on the water for best results{'\n'}
            • Clear, well-lit photos get more matches
          </Text>
        </View>
        
        <View style={[styles.photosContainer, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Your Photos ({photos.length}/{maxPhotos})
          </Text>
          
          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={photo.id} style={styles.photoContainer}>
                <Image source={{ uri: photo.url }} style={styles.photo} />
                
                {photo.isMain && (
                  <View style={styles.mainBadge}>
                    <Star size={12} color={colors.text.primary} />
                    <Text style={[styles.mainBadgeText, { color: colors.text.primary }]}>MAIN</Text>
                  </View>
                )}
                
                <View style={styles.photoActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeletePhoto(photo.id)}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  {!photo.isMain && (
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.starButton]}
                      onPress={() => handleSetMainPhoto(photo.id)}
                    >
                      <Star size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  )}
                </View>
                
                <View style={styles.photoNumber}>
                  <Text style={styles.photoNumberText}>{index + 1}</Text>
                </View>
              </View>
            ))}
            
            {photos.length < maxPhotos && (
              <TouchableOpacity style={styles.addPhotoContainer} onPress={handleAddPhoto}>
                <Plus size={32} color={colors.text.secondary} />
                <Text style={[styles.addPhotoText, { color: colors.text.secondary }]}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={[styles.guidelinesContainer, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Photo Guidelines</Text>
          
          <View style={styles.guideline}>
            <Text style={[styles.guidelineTitle, { color: colors.text.primary }]}>✅ Good Photos</Text>
            <Text style={[styles.guidelineText, { color: colors.text.secondary }]}>
              • Clear face shots with good lighting{'\n'}
              • Photos of you enjoying water activities{'\n'}
              • Genuine smiles and natural poses{'\n'}
              • Recent photos (within 2 years)
            </Text>
          </View>
          
          <View style={styles.guideline}>
            <Text style={[styles.guidelineTitle, { color: colors.error }]}>❌ Avoid</Text>
            <Text style={[styles.guidelineText, { color: colors.text.secondary }]}>
              • Group photos where you cannot be identified{'\n'}
              • Heavily filtered or edited photos{'\n'}
              • Photos with inappropriate content{'\n'}
              • Screenshots or low-quality images
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  photosContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    width: '48%',
    aspectRatio: 3/4,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  mainBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mainBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  photoActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  starButton: {
    backgroundColor: 'rgba(255, 204, 0, 0.9)',
  },
  photoNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addPhotoContainer: {
    width: '48%',
    aspectRatio: 3/4,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    fontWeight: '500',
  },
  guidelinesContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  guideline: {
    marginBottom: 16,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    lineHeight: 20,
  },
});