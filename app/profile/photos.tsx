import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { router, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Plus, X, Camera, Image as ImageIcon, Move } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { getColors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 16) / 3; // 3 photos per row with margins

export default function ManagePhotosScreen() {
  const { user, updateUser } = useAuthStore();
  const colors = getColors(false); // Use light colors
  const [photos, setPhotos] = React.useState<string[]>(user?.photos || []);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleHaptic = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        console.warn('Haptics not available:', error);
      }
    }
  }, []);

  const requestPermissions = React.useCallback(async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to add photos to your profile.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  }, []);

  const pickImage = React.useCallback(async () => {
    await handleHaptic();
    
    if (photos.length >= 6) {
      Alert.alert('Maximum Photos', 'You can add up to 6 photos to your profile.');
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = result.assets[0].uri;
        setPhotos(prev => [...prev, newPhoto]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, [handleHaptic, photos.length, requestPermissions]);

  const takePhoto = React.useCallback(async () => {
    await handleHaptic();
    
    if (photos.length >= 6) {
      Alert.alert('Maximum Photos', 'You can add up to 6 photos to your profile.');
      return;
    }

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your camera to take photos.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto = result.assets[0].uri;
        setPhotos(prev => [...prev, newPhoto]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  }, [handleHaptic, photos.length]);

  const removePhoto = React.useCallback(async (index: number) => {
    await handleHaptic();
    
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  }, [handleHaptic]);

  const movePhoto = React.useCallback(async (fromIndex: number, toIndex: number) => {
    await handleHaptic();
    
    setPhotos(prev => {
      const newPhotos = [...prev];
      const [movedPhoto] = newPhotos.splice(fromIndex, 1);
      newPhotos.splice(toIndex, 0, movedPhoto);
      return newPhotos;
    });
  }, [handleHaptic]);

  const savePhotos = React.useCallback(async () => {
    if (photos.length === 0) {
      Alert.alert('No Photos', 'Please add at least one photo to your profile.');
      return;
    }

    setIsLoading(true);
    try {
      await updateUser({ photos });
      await handleHaptic();
      router.back();
    } catch (error) {
      console.error('Error saving photos:', error);
      Alert.alert('Error', 'Failed to save photos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [photos, updateUser, handleHaptic]);

  const showAddPhotoOptions = React.useCallback(() => {
    Alert.alert(
      'Add Photo',
      'Choose how you would like to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Library', onPress: pickImage },
      ]
    );
  }, [takePhoto, pickImage]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Manage Photos',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Your Photos</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Add up to 6 photos. Your first photo will be your main profile picture.
          </Text>
        </View>

        <View style={styles.photosGrid}>
          {Array.from({ length: 6 }).map((_, index) => {
            const photo = photos[index];
            const isEmpty = !photo;

            return (
              <View key={index} style={styles.photoSlot}>
                {isEmpty ? (
                  <TouchableOpacity
                    style={[styles.addPhotoButton, { backgroundColor: colors.background.secondary }]}
                    onPress={showAddPhotoOptions}
                    accessibilityLabel={`Add photo ${index + 1}`}
                  >
                    <Plus size={24} color={colors.text.tertiary} />
                    <Text style={[styles.addPhotoText, { color: colors.text.tertiary }]}>
                      Add Photo
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    
                    {index === 0 && (
                      <View style={[styles.mainPhotoBadge, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.mainPhotoText, { color: colors.background.primary }]}>
                          Main
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: colors.error }]}
                      onPress={() => removePhoto(index)}
                      accessibilityLabel={`Remove photo ${index + 1}`}
                    >
                      <X size={16} color={colors.background.primary} />
                    </TouchableOpacity>
                    
                    {index > 0 && (
                      <TouchableOpacity
                        style={[styles.moveButton, { backgroundColor: colors.background.primary }]}
                        onPress={() => movePhoto(index, 0)}
                        accessibilityLabel={`Make photo ${index + 1} main photo`}
                      >
                        <Move size={16} color={colors.text.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={[styles.tipsTitle, { color: colors.text.primary }]}>Photo Tips</Text>
          <View style={styles.tipsList}>
            <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
              • Use high-quality, well-lit photos
            </Text>
            <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
              • Show yourself clearly in your main photo
            </Text>
            <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
              • Include photos of you on or near boats
            </Text>
            <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
              • Smile and look approachable
            </Text>
            <Text style={[styles.tipItem, { color: colors.text.secondary }]}>
              • Avoid group photos as your main picture
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Save Photos"
            onPress={savePhotos}
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={photos.length === 0}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 8,
  },
  photoSlot: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.25,
    marginBottom: 8,
  },
  addPhotoButton: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mainPhotoText: {
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moveButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContainer: {
    margin: 24,
    marginTop: 32,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  saveButton: {
    width: '100%',
  },
});