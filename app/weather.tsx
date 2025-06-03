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
  Sun, 
  Cloud, 
  CloudRain,
  Wind,
  Waves,
  Eye,
  Thermometer,
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
    waveHeight: number;
    visibility: number;
    humidity: number;
    uvIndex: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    windSpeed: number;
    waveHeight: number;
    chanceOfRain: number;
  }>;
  marine: {
    tideHigh: string;
    tideLow: string;
    sunrise: string;
    sunset: string;
    moonPhase: string;
  };
}

const mockWeatherData: WeatherData = {
  current: {
    temperature: 82,
    condition: 'Partly Cloudy',
    windSpeed: 12,
    windDirection: 'SE',
    waveHeight: 2.5,
    visibility: 10,
    humidity: 68,
    uvIndex: 7,
  },
  forecast: [
    { day: 'Today', high: 84, low: 76, condition: 'Partly Cloudy', windSpeed: 12, waveHeight: 2.5, chanceOfRain: 20 },
    { day: 'Tomorrow', high: 86, low: 78, condition: 'Sunny', windSpeed: 8, waveHeight: 1.8, chanceOfRain: 10 },
    { day: 'Wednesday', high: 83, low: 75, condition: 'Scattered Showers', windSpeed: 15, waveHeight: 3.2, chanceOfRain: 60 },
    { day: 'Thursday', high: 81, low: 73, condition: 'Partly Cloudy', windSpeed: 10, waveHeight: 2.1, chanceOfRain: 30 },
    { day: 'Friday', high: 85, low: 77, condition: 'Sunny', windSpeed: 6, waveHeight: 1.5, chanceOfRain: 5 },
  ],
  marine: {
    tideHigh: '2:34 PM',
    tideLow: '8:47 PM',
    sunrise: '6:42 AM',
    sunset: '7:28 PM',
    moonPhase: 'Waxing Crescent',
  },
};

export default function WeatherScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [weatherData, setWeatherData] = useState<WeatherData>(mockWeatherData);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('current');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const iconColor = colors.primary;
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun size={size} color={iconColor} />;
      case 'partly cloudy':
        return <Cloud size={size} color={iconColor} />;
      case 'scattered showers':
      case 'rain':
        return <CloudRain size={size} color={iconColor} />;
      default:
        return <Sun size={size} color={iconColor} />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return colors.accent;
      case 'partly cloudy': return colors.text.secondary;
      case 'scattered showers': return colors.primary;
      default: return colors.text.secondary;
    }
  };

  const getWaveCondition = (height: number) => {
    if (height < 2) return { text: 'Calm', color: colors.success };
    if (height < 4) return { text: 'Moderate', color: colors.accent };
    return { text: 'Rough', color: colors.error };
  };

  const getTrendIcon = (current: number, next: number) => {
    if (next > current) return <TrendingUp size={12} color={colors.success} />;
    if (next < current) return <TrendingDown size={12} color={colors.error} />;
    return <Minus size={12} color={colors.text.secondary} />;
  };

  const tabs = [
    { id: 'current', label: 'Current' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'marine', label: 'Marine' },
  ];

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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const isSelected = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { 
                  backgroundColor: isSelected ? colors.primary : colors.surface.primary,
                  borderColor: isSelected ? colors.primary : colors.border.primary,
                }
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { color: isSelected ? colors.text.primary : colors.text.secondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
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
          <View style={styles.currentWeather}>
            {/* Main Weather Card */}
            <View style={[styles.weatherCard, { backgroundColor: colors.surface.primary }]}>
              <View style={styles.mainWeatherInfo}>
                <View style={styles.temperatureContainer}>
                  <Text style={[styles.temperature, { color: colors.text.primary }]}>
                    {weatherData.current.temperature}°
                  </Text>
                  <View style={styles.conditionContainer}>
                    {getWeatherIcon(weatherData.current.condition, 32)}
                    <Text style={[styles.condition, { color: colors.text.secondary }]}>
                      {weatherData.current.condition}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={[styles.detailCard, { backgroundColor: colors.surface.primary }]}>
                <Wind size={20} color={colors.primary} />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Wind</Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {weatherData.current.windSpeed} mph
                </Text>
                <Text style={[styles.detailSubvalue, { color: colors.text.secondary }]}>
                  {weatherData.current.windDirection}
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface.primary }]}>
                <Waves size={20} color={colors.accent} />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Waves</Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {weatherData.current.waveHeight} ft
                </Text>
                <Text style={[styles.detailSubvalue, { color: getWaveCondition(weatherData.current.waveHeight).color }]}>
                  {getWaveCondition(weatherData.current.waveHeight).text}
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface.primary }]}>
                <Eye size={20} color={colors.secondary} />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Visibility</Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {weatherData.current.visibility} mi
                </Text>
              </View>

              <View style={[styles.detailCard, { backgroundColor: colors.surface.primary }]}>
                <Droplets size={20} color={colors.primary} />
                <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Humidity</Text>
                <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                  {weatherData.current.humidity}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'forecast' && (
          <View style={styles.forecastContainer}>
            {weatherData.forecast.map((day, index) => (
              <View key={index} style={[styles.forecastCard, { backgroundColor: colors.surface.primary }]}>
                <View style={styles.forecastHeader}>
                  <Text style={[styles.forecastDay, { color: colors.text.primary }]}>
                    {day.day}
                  </Text>
                  <View style={styles.forecastCondition}>
                    {getWeatherIcon(day.condition, 20)}
                    <Text style={[styles.forecastConditionText, { color: colors.text.secondary }]}>
                      {day.condition}
                    </Text>
                  </View>
                </View>

                <View style={styles.forecastDetails}>
                  <View style={styles.forecastTemp}>
                    <Text style={[styles.forecastHigh, { color: colors.text.primary }]}>
                      {day.high}°
                    </Text>
                    <Text style={[styles.forecastLow, { color: colors.text.secondary }]}>
                      {day.low}°
                    </Text>
                    {index < weatherData.forecast.length - 1 && (
                      <View style={styles.trendContainer}>
                        {getTrendIcon(day.high, weatherData.forecast[index + 1].high)}
                      </View>
                    )}
                  </View>

                  <View style={styles.forecastMeta}>
                    <View style={styles.forecastMetaItem}>
                      <Wind size={14} color={colors.text.secondary} />
                      <Text style={[styles.forecastMetaText, { color: colors.text.secondary }]}>
                        {day.windSpeed} mph
                      </Text>
                    </View>
                    <View style={styles.forecastMetaItem}>
                      <Waves size={14} color={colors.text.secondary} />
                      <Text style={[styles.forecastMetaText, { color: colors.text.secondary }]}>
                        {day.waveHeight} ft
                      </Text>
                    </View>
                    <View style={styles.forecastMetaItem}>
                      <CloudRain size={14} color={colors.text.secondary} />
                      <Text style={[styles.forecastMetaText, { color: colors.text.secondary }]}>
                        {day.chanceOfRain}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'marine' && (
          <View style={styles.marineContainer}>
            <View style={[styles.marineCard, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.marineTitle, { color: colors.text.primary }]}>
                Tides & Astronomy
              </Text>
              
              <View style={styles.marineGrid}>
                <View style={styles.marineItem}>
                  <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>High Tide</Text>
                  <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                    {weatherData.marine.tideHigh}
                  </Text>
                </View>
                
                <View style={styles.marineItem}>
                  <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>Low Tide</Text>
                  <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                    {weatherData.marine.tideLow}
                  </Text>
                </View>
                
                <View style={styles.marineItem}>
                  <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>Sunrise</Text>
                  <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                    {weatherData.marine.sunrise}
                  </Text>
                </View>
                
                <View style={styles.marineItem}>
                  <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>Sunset</Text>
                  <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                    {weatherData.marine.sunset}
                  </Text>
                </View>
                
                <View style={styles.marineItem}>
                  <Text style={[styles.marineLabel, { color: colors.text.secondary }]}>Moon Phase</Text>
                  <Text style={[styles.marineValue, { color: colors.text.primary }]}>
                    {weatherData.marine.moonPhase}
                  </Text>
                </View>
              </View>
            </View>

            {/* Boating Conditions */}
            <View style={[styles.marineCard, { backgroundColor: colors.surface.primary }]}>
              <Text style={[styles.marineTitle, { color: colors.text.primary }]}>
                Boating Conditions
              </Text>
              
              <View style={styles.conditionsContainer}>
                <View style={[styles.conditionItem, { borderLeftColor: colors.success }]}>
                  <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                    Overall
                  </Text>
                  <Text style={[styles.conditionValue, { color: colors.success }]}>
                    Good
                  </Text>
                </View>
                
                <View style={[styles.conditionItem, { borderLeftColor: colors.accent }]}>
                  <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                    Small Craft Advisory
                  </Text>
                  <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                    None
                  </Text>
                </View>
                
                <View style={[styles.conditionItem, { borderLeftColor: colors.primary }]}>
                  <Text style={[styles.conditionLabel, { color: colors.text.secondary }]}>
                    UV Index
                  </Text>
                  <Text style={[styles.conditionValue, { color: colors.text.primary }]}>
                    {weatherData.current.uvIndex} - High
                  </Text>
                </View>
              </View>
            </View>
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  currentWeather: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  weatherCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainWeatherInfo: {
    alignItems: 'center',
  },
  temperatureContainer: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 64,
    fontWeight: '200',
    marginBottom: 8,
  },
  conditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  condition: {
    fontSize: 18,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailSubvalue: {
    fontSize: 12,
    marginTop: 2,
  },
  forecastContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  forecastCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  forecastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  forecastDay: {
    fontSize: 16,
    fontWeight: '600',
  },
  forecastCondition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  forecastConditionText: {
    fontSize: 14,
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forecastTemp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  forecastHigh: {
    fontSize: 18,
    fontWeight: '600',
  },
  forecastLow: {
    fontSize: 16,
  },
  trendContainer: {
    marginLeft: 4,
  },
  forecastMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  forecastMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  forecastMetaText: {
    fontSize: 12,
  },
  marineContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  marineCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  marineTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  marineGrid: {
    gap: 12,
  },
  marineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  marineLabel: {
    fontSize: 14,
  },
  marineValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  conditionsContainer: {
    gap: 12,
  },
  conditionItem: {
    paddingLeft: 16,
    paddingVertical: 12,
    borderLeftWidth: 3,
  },
  conditionLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});