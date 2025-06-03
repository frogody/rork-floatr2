import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ScrollView,
  Text,
  Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

interface PhotoGalleryProps {
  photos: string[];
  initialIndex?: number;
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function PhotoGallery({ 
  photos, 
  initialIndex = 0, 
  visible, 
  onClose 
}: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNext = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handleClose = async () => {
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: currentIndex * width, y: 0 }}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
        >
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <Image source={{ uri: photo }} style={styles.photo} resizeMode="contain" />
            </View>
          ))}
        </ScrollView>
        
        {photos.length > 1 && (
          <>
            <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
              <ChevronLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={handleNext}>
              <ChevronRight size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <View style={styles.indicator}>
              <Text style={styles.indicatorText}>
                {currentIndex + 1} of {photos.length}
              </Text>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: width - 40,
    height: height - 200,
  },
  navButton: {
    position: 'absolute',
    left: 20,
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    left: undefined,
    right: 20,
  },
  indicator: {
    position: 'absolute',
    bottom: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  indicatorText: {
    color: colors.text.primary,
    fontSize: 14,
  },
});