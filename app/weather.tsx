import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  Cloud, 
  Sun, 
  CloudRain,
  Wind,
  Waves,
  Thermometer,
  Eye,
  Droplets,
  Navigation,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    windSpeed: number;
    windDirection: string;
    humidity: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
  };
  marine: {
    waveHeight: number;
    waveDirection: string;
    waterTemp: number;
    tideStatus: string;
    nextTide: string;
    swellHeight: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    windSpeed: number;
    waveHeight: number;
  }>;
}

const mockWeatherData: WeatherData = {
  current: {
    temperature: 78,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'SE',
    humidity: 68,
    visibility: 10,
    pressure: 30.15,
    uvIndex: 7,
  },
  marine: {
    waveHeight: 2.3,
    waveDirection: 'E',
    waterTemp: 76,
    tideStatus: 'Rising',
    nextTide: 'High at 3:24 PM',
    swellHeight: 1.8,
  },
  forecast: [
    { day: 'Today', high: 82, low: 74, condition: 'Partly Cloudy', windSpeed: 12, waveHeight: 2.3 },
    { day: 'Tomorrow', high: 84, low: 76, condition: 'Sunny', windSpeed: 8, waveHeight: 1.8 },
    { day: 'Wednesday', high: 79, low: 72, condition: 'Scattered Showers', windSpeed: 15, waveHeight: 3.1 },
    { day: 'Thursday', high: 81, low: 75, condition: 'Partly Cloudy', windSpeed: 10, waveHeight: 2.0 },
    { day: 'Friday', high: 83, low: 77, condition: 'Sunny', windSpeed: 6, waveHeight: 1.5 },
  ]
};

export default function WeatherScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'current' | 'marine' | 'forecast'>('current');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={24} color={colors.primary} />;
      case 'partly cloudy':
        return <Cloud size={24} color={colors.text.secondary} />;
      case 'scattered showers':
      case 'rain':
        return <CloudRain size={24} color={colors.accent} />;
      default:
        return <Sun size={24} color={colors.primary} />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp size={12} color={colors.success} />;
    if (current < previous) return <TrendingDown size={12} color={colors.error} />;
    return <Minus size={12} color={colors.text.secondary} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Weather Conditions',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'current', label: 'Current' },
          { key: 'marine', label: 'Marine' },
          { key: 'forecast', label: 'Forecast' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              {
                backgroundColor: selectedTab === tab.key ? colors.primary : colors.surface.primary,
              }
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === tab.key ? colors.text.primary : colors.text.secondary }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {selectedTab === 'current' && (
          <View style={styles.section}>
            {/* Current Temperature */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <View style={styles.currentWeather}>
                <View style={styles.tempContainer}>
                  <Text style={[styles.temperature, { color: colors.text.primary }]}>
                    {weatherData.current.temperature}°F
                  </Text>
                  <Text style={[styles.condition, { color: colors.text.secondary }]}>
                    {weatherData.current.condition}
                  </Text>
                </View>
                {getWeatherIcon(weatherData.current.condition)}
              </View>
            </View>

            {/* Current Conditions Grid */}
            <View style={styles.grid}>
              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Wind size={20} color={colors.primary} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Wind</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.current.windSpeed} mph {weatherData.current.windDirection}
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Droplets size={20} color={colors.accent} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Humidity</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.current.humidity}%
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Eye size={20} color={colors.secondary} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Visibility</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.current.visibility} mi
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Thermometer size={20} color={colors.error} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>UV Index</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.current.uvIndex}
                </Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'marine' && (
          <View style={styles.section}>
            {/* Marine Conditions */}
            <View style={styles.grid}>
              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Waves size={20} color={colors.primary} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Wave Height</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.marine.waveHeight} ft
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Navigation size={20} color={colors.accent} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Wave Direction</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.marine.waveDirection}
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <Thermometer size={20} color={colors.secondary} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Water Temp</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.marine.waterTemp}°F
                </Text>
              </View>

              <View style={[styles.gridItem, { backgroundColor: colors.surface.primary }]}>
                <TrendingUp size={20} color={colors.success} />
                <Text style={[styles.gridLabel, { color: colors.text.secondary }]}>Tide</Text>
                <Text style={[styles.gridValue, { color: colors.text.primary }]}>
                  {weatherData.marine.tideStatus}
                </Text>
              </View>
            </View>

            {/* Tide Information */}
            <View style={[styles.card, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Tide Information</Text>
              <Text style={[styles.tideInfo, { color: colors.text.secondary }]}>
                {weatherData.marine.nextTide}
              </Text>
              <Text style={[styles.swellInfo, { color: colors.text.secondary }]}>
                Swell: {weatherData.marine.swellHeight} ft
              </Text>
            </View>
          </View>
        )}

        {selectedTab === 'forecast' && (
          <View style={styles.section}>
            {weatherData.forecast.map((day, index) => (
              <View key={index} style={[styles.forecastItem, { backgroundColor: colors.surface.primary }]}>
                <View style={styles.forecastDay}>
                  <Text style={[styles.dayLabel, { color: colors.text.primary }]}>{day.day}</Text>
                  {getWeatherIcon(day.condition)}
                </View>
                
                <View style={styles.forecastDetails}>
                  <Text style={[styles.forecastTemp, { color: colors.text.primary }]}>
                    {day.high}° / {day.low}°
                  </Text>
                  <Text style={[styles.forecastCondition, { color: colors.text.secondary }]}>
                    {day.condition}
                  </Text>
                </View>

                <View style={styles.forecastMarine}>
                  <View style={styles.forecastMetric}>
                    <Wind size={14} color={colors.text.secondary} />
                    <Text style={[styles.metricText, { color: colors.text.secondary }]}>
                      {day.windSpeed} mph
                    </Text>
                  </View>
                  <View style={styles.forecastMetric}>
                    <Waves size={14} color={colors.text.secondary} />
                    <Text style={[styles.metricText, { color: colors.text.secondary }]}>
                      {day.waveHeight} ft
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentWeather: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 4,
  },
  condition: {
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  gridLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tideInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  swellInfo: {
    fontSize: 14,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forecastDay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 80,
  },
  forecastDetails: {
    flex: 1,
    alignItems: 'center',
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  forecastCondition: {
    fontSize: 12,
  },
  forecastMarine: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  forecastMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
  },
});