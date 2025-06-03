import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Plus, X, Camera } from 'lucide-react-native';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;

interface PhotoGalleryProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  editable?: boolean;
}

export default function PhotoGallery({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6,
  editable = true 
}: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleAddPhoto = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      'Add Photo',
      'Choose how you would like to add a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Camera', 
          onPress: () => {
            // In a real app, this would open the camera
            const newPhoto = `https://images.unsplash.com/photo-${Date.now()}?q=80&w=1000`;
            onPhotosChange([...photos, newPhoto]);
          }
        },
        { 
          text: 'Photo Library', 
          onPress: () => {
            // In a real app, this would open the photo library
            const newPhoto = `https://images.unsplash.com/photo-${Date.now()}?q=80&w=1000`;
            onPhotosChange([...photos, newPhoto]);
          }
        },
      ]
    );
  };

  const handleRemovePhoto = async (index: number) => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const renderPhotoSlot = (index: number) => {
    const photo = photos[index];
    const isEmpty = !photo;
    const canAdd = isEmpty && photos.length < maxPhotos && editable;

    if (canAdd) {
      return (
        <TouchableOpacity 
          key={`add-${index}`}
          style={styles.addPhotoSlot}
          onPress={handleAddPhoto}
        >
          <Plus size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      );
    }

    if (isEmpty) {
      return (
        <View key={`empty-${index}`} style={styles.emptySlot} />
      );
    }

    return (
      <View key={`photo-${index}`} style={styles.photoContainer}>
        <Image source={{ uri: photo }} style={styles.photo} />
        {editable && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemovePhoto(index)}
          >
            <X size={16} color={colors.text.primary} />
          </TouchableOpacity>
        )}
        {index === 0 && (
          <View style={styles.primaryBadge}>
            <Camera size={12} color={colors.text.primary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gallery}
      >
        <View style={styles.grid}>
          {Array.from({ length: maxPhotos }, (_, index) => renderPhotoSlot(index))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  gallery: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
  },
  addPhotoSlot: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});