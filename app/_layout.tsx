import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useColorScheme } from "react-native";
import colors from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  initialRouteName: "index",
};

// Create a client
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.dark,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background.dark,
        },
        // Add smooth transitions for iOS
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
        gestureEnabled: Platform.OS === 'ios', // Enable swipe-back on iOS
        gestureDirection: 'horizontal',
        headerBackTitle: "", // Clean back button on iOS
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="auth/login" 
            options={{ 
              title: "Log In", 
              headerShown: false,
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="auth/signup" 
            options={{ 
              title: "Sign Up", 
              headerShown: false,
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="auth/forgot-password" 
            options={{ 
              title: "Reset Password", 
              headerShown: false,
              animation: 'slide_from_bottom'
            }} 
          />
        </>
      ) : !isOnboarded ? (
        <Stack.Screen 
          name="onboarding/index" 
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent swiping back during onboarding
          }} 
        />
      ) : (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="premium" 
            options={{ 
              title: "Go Premium", 
              presentation: "modal",
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="chat/[id]" 
            options={{ 
              title: "Chat",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="profile/edit" 
            options={{ 
              title: "Edit Profile",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="boat/edit" 
            options={{ 
              title: "Edit Boat",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="settings/index" 
            options={{ 
              title: "Settings",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="settings/account" 
            options={{ 
              title: "Account Settings",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="settings/notifications" 
            options={{ 
              title: "Notifications",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="settings/blocked-users" 
            options={{ 
              title: "Blocked Users",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="help" 
            options={{ 
              title: "Help & Support",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="help/faq" 
            options={{ 
              title: "FAQ",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="help/safety" 
            options={{ 
              title: "Safety Tips",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="privacy" 
            options={{ 
              title: "Privacy & Safety",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="legal/index" 
            options={{ 
              title: "Legal",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="legal/terms" 
            options={{ 
              title: "Terms of Service",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="legal/privacy" 
            options={{ 
              title: "Privacy Policy",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="meetups/create" 
            options={{ 
              title: "Create Meetup", 
              presentation: "modal",
              animation: 'slide_from_bottom'
            }} 
          />
          <Stack.Screen 
            name="meetups/[id]" 
            options={{ 
              title: "Meetup Details",
              headerBackTitle: "",
            }} 
          />
          <Stack.Screen 
            name="who-liked-you" 
            options={{ 
              title: "Who Liked You", 
              presentation: "modal",
              animation: 'slide_from_bottom'
            }} 
          />
        </>
      )}
    </Stack>
  );
}