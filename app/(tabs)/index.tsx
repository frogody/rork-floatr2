import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Discover',
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
        }}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Floatr</Text>
        <Text style={styles.subtitle}>Start exploring nearby boaters</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});