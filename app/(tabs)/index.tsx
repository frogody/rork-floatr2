import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';
import { CrewCard } from '@/components/CrewCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { useSwipeStore } from '@/store/swipeStore';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Filter, Bell } from 'lucide-react-native';
import { Button } from '@/components/Button';
import useToast from '@/hooks/useToast'; // Fixed import

// Rest of the file remains unchanged