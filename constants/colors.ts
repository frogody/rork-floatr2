import { useColorScheme } from 'react-native';

// Color palette for Floatr app with dark mode support
const lightColors = {
  // Core colors
  primary: "#3B82F6", // Blue
  secondary: "#EC4899", // Pink
  accent: "#10B981", // Teal

  // UI colors
  background: {
    dark: "#F8FAFC", // Light gray for light mode
    card: "#FFFFFF", // White cards
    light: "#F1F5F9", // Lighter gray
  },
  text: {
    primary: "#0F172A", // Dark text
    secondary: "#64748B", // Gray text
    dark: "#0F172A",
  },

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Gradient colors - properly typed as readonly tuples
  gradient: {
    blue: ["#3B82F6", "#2563EB"] as const,
    purple: ["#8B5CF6", "#6D28D9"] as const,
    pink: ["#EC4899", "#DB2777"] as const,
    sunset: ["#F59E0B", "#EC4899"] as const,
    ocean: ["#0EA5E9", "#3B82F6"] as const,
  },
} as const;

const darkColors = {
  // Core colors
  primary: "#3B82F6", // Blue
  secondary: "#EC4899", // Pink
  accent: "#10B981", // Teal

  // UI colors
  background: {
    dark: "#0F172A", // Navy blue
    card: "#1E293B", // Slate
    light: "#F8FAFC", // Light gray
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#94A3B8",
    dark: "#0F172A",
  },

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  // Gradient colors - properly typed as readonly tuples
  gradient: {
    blue: ["#3B82F6", "#2563EB"] as const,
    purple: ["#8B5CF6", "#6D28D9"] as const,
    pink: ["#EC4899", "#DB2777"] as const,
    sunset: ["#F59E0B", "#EC4899"] as const,
    ocean: ["#0EA5E9", "#3B82F6"] as const,
  },
} as const;

// Hook to get colors based on current color scheme
export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'light' ? lightColors : darkColors;
};

// Default export for backward compatibility (dark theme)
const colors = darkColors;

export default colors;