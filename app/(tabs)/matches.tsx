import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, MessageCircle, Star } from 'lucide-react-native';
import colors from '@/constants/colors';
import MatchCard from '@/components/MatchCard'; // Fixed import
import { useMatchStore } from '@/store/matchStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/Button';
import useToast from '@/hooks/useToast'; // Fixed import

// Rest of the file remains unchanged