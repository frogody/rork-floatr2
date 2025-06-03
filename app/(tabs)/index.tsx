import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
      <Text style={styles.text}>Welcome to Floatr!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  text: {
    fontSize: 24,
    color: colors.text.primary,
    fontFamily: 'Inter-SemiBold',
  },
});