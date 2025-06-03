import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import { 
  Cloud, 
  Sun, 
  Wind,
  Waves,
  Thermometer,
  Eye,
  ArrowLeft,
  CloudRain,
  Navigation
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

const weatherData = {
  current: {
    temperature: 78,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'NE',
    waveHeight: 2.1,
    visibility: 8.5,
    humidity: 68,
    uvIndex: 6,
  },
  forecast: [
    { time: '12 PM', temp: 78, condition: 'sunny', windSpeed: 12, waves: 2.1 },
    { time: '1 PM', temp: 79, condition: 'partly-cloudy', windSpeed: 14, waves: 2.3 },
    { time: '2 PM', temp: 80, condition: 'partly-cloudy', windSpeed: 15, waves: 2.5 },
    { time: '3 PM', temp: 81, condition: 'cloudy', windSpeed: 16, waves: 2.8 },
    { time: '4 PM', temp: 79, condition: 'rain', windSpeed: 18, waves: 3.2 },
    { time: '5 PM', temp: 77, condition: 'rain', windSpeed: 20, waves: 3.5 },
  ],
  marine: {
    tideHigh: '2:34 PM',
    tideLow: '8:47 PM',
    sunrise: '6:42 AM',
    sunset: '7:28 PM',
    moonPhase: 'Waxing Crescent',
  }
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
      case 'rain':
        return <CloudRain size={24} color={colors.accent} />;
      default:
        return <Sun size={24} color={colors.primary} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return colors.primary;
      case 'partly-cloudy':
        return colors.text.secondary;
      case 'cloudy':
        return colors.text.secondary;
      case 'rain':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Marine Weather',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Conditions */}
        <View style={[styles.currentWeatherCard, { backgroundColor: colors.surface.primary }]}>
          <View style={styles.currentHeader}>
            <View>
              <Text style={[styles.temperature, { color: colors.text.primary }]}>
                {weatherData.current.temperature}°F
              </Text>
              <Text style={[styles.condition, { color: colors.text.secondary }]}>
                {weatherData.current.condition}
              </Text>
            </View>
            <Cloud size={64} color={colors.text.secondary} />
          </View>
          
          <View style={styles.currentDetails}>
            <View style={styles.detailItem}>
              <Wind size={16} color={colors.text.secondary} />
              <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                {weatherData.current.windSpeed} mph {weatherData.current.windDirection}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Waves size={16} color={colors.text.secondary} />
              <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                {weatherData.current.waveHeight} ft waves
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Eye size={16} color={colors.text.secondary} />
              <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                {weatherData.current.visibility} mi visibility
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
            style={styles.forecastScroll}
          >
            {weatherData.forecast.map((hour, index) => (
              <View 
                key={index} 
                style={[styles.hourlyCard, { backgroundColor: colors.surface.primary }]}
              >
                <Text style={[styles.hourTime, { color: colors.text.secondary }]}>
                  {hour.time}
                </Text>
                {getWeatherIcon(hour.condition)}
                <Text style={[styles.hourTemp, { color: colors.text.primary }]}>
                  {hour.temp}°
                </Text>
                <View style={styles.hourDetails}>
                  <View style={styles.hourDetailItem}>
                    <Wind size={12} color={colors.text.secondary} />
                    <Text style={[styles.hourDetailText, { color: colors.text.secondary }]}>
                      {hour.windSpeed}
                    </Text>
                  </View>
                  <View style={styles.hourDetailItem}>
                    <Waves size={12} color={colors.text.secondary} />
                    <Text style={[styles.hourDetailText, { color: colors.text.secondary }]}>
                      {hour.waves}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Marine Conditions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Marine Conditions
          </Text>
          <View style={[styles.marineCard, { backgroundColor: colors.surface.primary }]}>
            <View style={styles.marineGrid}>
              <View style={styles.marineItem}>
                <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>
                  High Tide
                </Text>
                <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                  {weatherData.marine.tideHigh}
                </Text>
              </View>
              <View style={styles.marineItem}>
                <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>
                  Low Tide
                </Text>
                <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                  {weatherData.marine.tideLow}
                </Text>
              </View>
              <View style={styles.marineItem}>
                <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>
                  Sunrise
                </Text>
                <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                  {weatherData.marine.sunrise}
                </Text>
              </View>
              <View style={styles.marineItem}>
                <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>
                  Sunset
                </Text>
                <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                  {weatherData.marine.sunset}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety Alert */}
        <View style={[styles.alertCard, { backgroundColor: colors.surface.primary, borderLeftColor: colors.primary }]}>
          <Text style={[styles.alertTitle, { color: colors.text.primary }]}>
            Boating Conditions
          </Text>
          <Text style={[styles.alertText, { color: colors.text.secondary }]}>
            Good conditions for boating. Light winds and moderate waves. 
            Be aware of afternoon thunderstorms possible after 4 PM.
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
    padding: 20,
    marginBottom: 24,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
  },
  currentDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  forecastScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  hourlyCard: {
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  hourTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  hourTemp: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  hourDetails: {
    gap: 4,
    alignItems: 'center',
  },
  hourDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hourDetailText: {
    fontSize: 10,
  },
  marineCard: {
    borderRadius: 16,
    padding: 20,
  },
  marineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  marineItem: {
    flex: 1,
    minWidth: '45%',
  },
  marineLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  marineValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  alertCard: {
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
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