import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import colors from '@/constants/colors';
import { MapPin, Anchor, Users, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CrewCardProps {
  crew: {
    id: string;
    name: string;
    description: string;
    location: string;
    distance: number;
    photoUrl: string;
    photoUrls?: string[];
    tags: string[];
    crewSize: number;
    boatType: string;
    boatLength: number;
  };
}

const { width, height } = Dimensions.get('window');

export const CrewCard: React.FC<CrewCardProps> = ({ crew }) => {
  const [showInfo, setShowInfo] = useState(false);
  const infoAnim = React.useRef(new Animated.Value(0)).current;
  
  const toggleInfo = () => {
    if (showInfo) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowInfo(false));
    } else {
      setShowInfo(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: crew.photoUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{crew.name}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.location}>
                {crew.location} • {crew.distance} mi away
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.infoButton}
            onPress={toggleInfo}
            activeOpacity={0.7}
          >
            <Info size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Anchor size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {crew.boatType}, {crew.boatLength}ft
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Users size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {crew.crewSize} {crew.crewSize === 1 ? 'person' : 'people'}
            </Text>
          </View>
        </View>
        
        <View style={styles.tags}>
          {crew.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {showInfo && (
        <Animated.View 
          style={[
            styles.infoPanel,
            {
              opacity: infoAnim,
              transform: [
                {
                  translateY: infoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.infoPanelTitle}>About {crew.name}</Text>
          <Text style={styles.infoPanelDescription}>{crew.description}</Text>
          
          <View style={styles.infoPanelDetails}>
            <View style={styles.infoPanelDetailItem}>
              <Text style={styles.infoPanelDetailLabel}>Boat Type</Text>
              <Text style={styles.infoPanelDetailValue}>{crew.boatType}</Text>
            </View>
            
            <View style={styles.infoPanelDetailItem}>
              <Text style={styles.infoPanelDetailLabel}>Length</Text>
              <Text style={styles.infoPanelDetailValue}>{crew.boatLength}ft</Text>
            </View>
            
            <View style={styles.infoPanelDetailItem}>
              <Text style={styles.infoPanelDetailLabel}>Crew Size</Text>
              <Text style={styles.infoPanelDetailValue}>{crew.crewSize}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleInfo}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface.primary,
    height: height * 0.7,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    marginLeft: 4,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.text.secondary,
    marginLeft: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: colors.text.primary,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px -3px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  infoPanelTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoPanelDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoPanelDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoPanelDetailItem: {
    alignItems: 'center',
  },
  infoPanelDetailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.text.tertiary,
    marginBottom: 4,
  },
  infoPanelDetailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.text.primary,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.primary,
  },
});