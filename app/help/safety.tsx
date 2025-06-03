import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { AlertTriangle, Phone, MapPin, Radio, Anchor, Users, Shield, Zap } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Button } from '@/components/Button';
import EmergencyButton from '@/components/EmergencyButton'; // Fixed import

// Rest of the file remains unchanged