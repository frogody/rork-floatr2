import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

export default function WebMapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view is not available on web</Text>
      <Text style={styles.subtext}>Please use our mobile app for the full experience</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  text: {
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});