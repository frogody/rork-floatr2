import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import colors from '@/constants/colors';

export default function IndexScreen() {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log('IndexScreen: Auth state changed', { isAuthenticated, isInitialized });
    
    if (!isInitialized) {
      console.log('IndexScreen: Not initialized yet, waiting...');
      return;
    }

    if (isAuthenticated) {
      console.log('IndexScreen: User authenticated, redirecting to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('IndexScreen: User not authenticated, redirecting to login');
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}