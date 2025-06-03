import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { 
  Cloud, 
  Sun, 
  Wind, 
  Waves, 
  Thermometer,
  Eye,
  Droplets,
  Navigation
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

export default function WeatherScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const currentWeather = {
    temperature: 78,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NE',
    waveHeight: 2.1,
    visibility: 10,
    humidity: 68,
    uvIndex: 7,
  };

  const forecast = [
    { time: '12 PM', temp: 78, condition: 'sunny', waves: 2.1 },
    { time: '1 PM', temp: 79, condition: 'sunny', waves: 2.3 },
    { time: '2 PM', temp: 80, condition: 'cloudy', waves: 2.5 },
    { time: '3 PM', temp: 79, condition: 'cloudy', waves: 2.4 },
    { time: '4 PM', temp: 77, condition: 'sunny', waves: 2.2 },
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun size={24} color={colors.accent} />;
      case 'cloudy': return <Cloud size={24} color={colors.text.secondary} />;
      default: return <Sun size={24} color={colors.accent} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen options={{ title: 'Weather Conditions' }} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Conditions */}
        <View style={[styles.currentWeather, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.currentHeader}>
            <Text style={[styles.location, { color: colors.text.primary }]}>Miami, FL</Text>
            <Text style={[styles.lastUpdated, { color: colors.text.secondary }]}>
              Updated 5 min ago
            </Text>
          </View>
          
          <View style={styles.currentMain}>
            <View style={styles.tempContainer}>
              <Text style={[styles.temperature, { color: colors.text.primary }]}>
                {currentWeather.temperature}°
              </Text>
              <Text style={[styles.condition, { color: colors.text.secondary }]}>
                {currentWeather.condition}
              </Text>
            </View>
            <Sun size={64} color={colors.accent} />
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface.primary }]}>
            <Wind size={24} color={colors.primary} />
            <Text style={[styles.metricValue, { color: colors.text.primary }]}>
              {currentWeather.windSpeed} mph
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
              Wind {currentWeather.windDirection}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface.primary }]}>
            <Waves size={24} color={colors.secondary} />
            <Text style={[styles.metricValue, { color: colors.text.primary }]}>
              {currentWeather.waveHeight} ft
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
              Wave Height
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface.primary }]}>
            <Eye size={24} color={colors.success} />
            <Text style={[styles.metricValue, { color: colors.text.primary }]}>
              {currentWeather.visibility} mi
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
              Visibility
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface.primary }]}>
            <Droplets size={24} color={colors.info} />
            <Text style={[styles.metricValue, { color: colors.text.primary }]}>
              {currentWeather.humidity}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
              Humidity
            </Text>
          </View>
        </View>

        {/* Hourly Forecast */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Hourly Forecast
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastContainer}>
            {forecast.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={[styles.forecastTime, { color: colors.text.secondary }]}>
                  {item.time}
                </Text>
                {getWeatherIcon(item.condition)}
                <Text style={[styles.forecastTemp, { color: colors.text.primary }]}>
                  {item.temp}°
                </Text>
                <View style={styles.waveInfo}>
                  <Waves size={12} color={colors.secondary} />
                  <Text style={[styles.forecastWaves, { color: colors.text.secondary }]}>
                    {item.waves}ft
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Marine Conditions */}
        <View style={[styles.section, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Marine Conditions
          </Text>
          
          <View style={styles.marineConditions}>
            <View style={styles.conditionRow}>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Sea State
              </Text>
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                Slight (2-3 ft)
              </Text>
            </View>
            
            <View style={styles.conditionRow}>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Water Temperature
              </Text>
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                82°F
              </Text>
            </View>
            
            <View style={styles.conditionRow}>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                Tide
              </Text>
              <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                High at 3:24 PM
              </Text>
            </View>
            
            <View style={styles.conditionRow}>
              <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                UV Index
              </Text>
              <Text style={[styles.conditionValue, { color: colors.warning }]}>
                {currentWeather.uvIndex} (High)
              </Text>
            </View>
          </View>
        </View>

        {/* Safety Alert */}
        <View style={[styles.alertCard, { backgroundColor: colors.surface.secondary }]}>
          <Text style={[styles.alertTitle, { color: colors.warning }]}>
            Boating Conditions: Good
          </Text>
          <Text style={[styles.alertText, { color: colors.text.secondary }]}>
            Ideal conditions for recreational boating. Light winds and calm seas expected.
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
  currentWeather: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  currentHeader: {
    marginBottom: 16,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
  },
  currentMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  forecastTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  waveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  forecastWaves: {
    fontSize: 10,
  },
  marineConditions: {
    gap: 12,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 14,
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    lineHeight: 20,
  },
});