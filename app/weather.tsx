import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  useColorScheme,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Cloud, 
  Sun, 
  Wind, 
  Waves,
  Thermometer,
  Eye,
  Droplets,
  Navigation2
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

const weatherData = {
  current: {
    temperature: 78,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NE',
    waveHeight: 2.1,
    visibility: 10,
    humidity: 68,
    uvIndex: 6,
  },
  forecast: [
    { time: '12 PM', temp: 78, condition: 'sunny', windSpeed: 12, waves: 2.1 },
    { time: '1 PM', temp: 80, condition: 'sunny', windSpeed: 14, waves: 2.3 },
    { time: '2 PM', temp: 82, condition: 'partly-cloudy', windSpeed: 16, waves: 2.5 },
    { time: '3 PM', temp: 81, condition: 'partly-cloudy', windSpeed: 15, waves: 2.4 },
    { time: '4 PM', temp: 79, condition: 'cloudy', windSpeed: 13, waves: 2.2 },
    { time: '5 PM', temp: 77, condition: 'cloudy', windSpeed: 11, waves: 2.0 },
  ],
};

export default function WeatherScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={24} color={colors.primary} />;
      case 'partly-cloudy':
        return <Cloud size={24} color={colors.text.secondary} />;
      case 'cloudy':
        return <Cloud size={24} color={colors.text.secondary} />;
      default:
        return <Sun size={24} color={colors.primary} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return colors.primary;
      case 'partly-cloudy':
        return colors.accent;
      case 'cloudy':
        return colors.text.secondary;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Weather',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Weather */}
        <View style={[styles.currentWeatherCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.currentHeader}>
            <View>
              <Text style={[styles.location, { color: colors.text.primary }]}>
                Miami, FL
              </Text>
              <Text style={[styles.currentTime, { color: colors.text.secondary }]}>
                Current Conditions
              </Text>
            </View>
            <Sun size={48} color={colors.primary} />
          </View>
          
          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, { color: colors.text.primary }]}>
              {weatherData.current.temperature}°F
            </Text>
            <Text style={[styles.condition, { color: colors.text.secondary }]}>
              {weatherData.current.condition}
            </Text>
          </View>
        </View>

        {/* Marine Conditions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Marine Conditions
          </Text>
          
          <View style={styles.conditionsGrid}>
            <View style={[styles.conditionCard, { backgroundColor: colors.surface.primary }]}>
              <Wind size={24} color={colors.primary} />
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                {weatherData.current.windSpeed} mph
              </Text>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Wind {weatherData.current.windDirection}
              </Text>
            </View>

            <View style={[styles.conditionCard, { backgroundColor: colors.surface.primary }]}>
              <Waves size={24} color={colors.accent} />
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                {weatherData.current.waveHeight} ft
              </Text>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Wave Height
              </Text>
            </View>

            <View style={[styles.conditionCard, { backgroundColor: colors.surface.primary }]}>
              <Eye size={24} color={colors.secondary} />
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                {weatherData.current.visibility} mi
              </Text>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Visibility
              </Text>
            </View>

            <View style={[styles.conditionCard, { backgroundColor: colors.surface.primary }]}>
              <Droplets size={24} color={colors.primary} />
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                {weatherData.current.humidity}%
              </Text>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Humidity
              </Text>
            </View>
          </View>
        </View>

        {/* Hourly Forecast */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Hourly Forecast
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.forecastContainer}
          >
            {weatherData.forecast.map((hour, index) => (
              <View 
                key={index} 
                style={[styles.forecastCard, { backgroundColor: colors.surface.primary }]}
              >
                <Text style={[styles.forecastTime, { color: colors.text.secondary }]}>
                  {hour.time}
                </Text>
                
                <View style={styles.forecastIcon}>
                  {getWeatherIcon(hour.condition)}
                </View>
                
                <Text style={[styles.forecastTemp, { color: colors.text.primary }]}>
                  {hour.temp}°
                </Text>
                
                <View style={styles.forecastDetails}>
                  <View style={styles.forecastDetail}>
                    <Wind size={12} color={colors.text.secondary} />
                    <Text style={[styles.forecastDetailText, { color: colors.text.secondary }]}>
                      {hour.windSpeed}
                    </Text>
                  </View>
                  
                  <View style={styles.forecastDetail}>
                    <Waves size={12} color={colors.text.secondary} />
                    <Text style={[styles.forecastDetailText, { color: colors.text.secondary }]}>
                      {hour.waves}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Safety Notice */}
        <View style={[styles.safetyCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.safetyHeader}>
            <Navigation2 size={20} color={colors.primary} />
            <Text style={[styles.safetyTitle, { color: colors.text.primary }]}>
              Boating Conditions
            </Text>
          </View>
          <Text style={[styles.safetyText, { color: colors.text.secondary }]}>
            Good conditions for boating. Light to moderate winds with calm seas. 
            Perfect for recreational activities and fishing.
          </Text>
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
    padding: 20,
  },
  currentWeatherCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentTime: {
    fontSize: 14,
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  condition: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  conditionValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  conditionLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  forecastContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  forecastCard: {
    width: 80,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
  },
  forecastTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  forecastIcon: {
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  forecastDetails: {
    gap: 4,
  },
  forecastDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  forecastDetailText: {
    fontSize: 10,
  },
  safetyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  safetyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});