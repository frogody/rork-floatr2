import { useColorScheme } from 'react-native';

const lightColors = {
  primary: "#2563EB",
  secondary: "#EC4899",
  accent: "#10B981",

  background: {
    dark: "#FFFFFF",
    card: "#F8FAFC",
    light: "#F1F5F9",
  },
  text: {
    primary: "#0F172A",
    secondary: "#64748B",
    dark: "#0F172A",
    disabled: "#94A3B8",
  },

  success: "#10B981",
  warning: "#F59E0B", 
  error: "#EF4444",

  gradient: {
    blue: ["#3B82F6", "#2563EB"],
    purple: ["#8B5CF6", "#6D28D9"],
    pink: ["#EC4899", "#DB2777"],
    sunset: ["#F59E0B", "#EC4899"],
    ocean: ["#0EA5E9", "#3B82F6"],
  },
} as const;

const darkColors = {
  primary: "#3B82F6",
  secondary: "#EC4899",
  accent: "#10B981",

  background: {
    dark: "#000000",
    card: "#111111",
    light: "#1E1E1E",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#A1A1AA",
    dark: "#18181B",
    disabled: "#52525B",
  },

  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  gradient: {
    blue: ["#3B82F6", "#2563EB"],
    purple: ["#8B5CF6", "#6D28D9"],
    pink: ["#EC4899", "#DB2777"],
    sunset: ["#F59E0B", "#EC4899"],
    ocean: ["#0EA5E9", "#3B82F6"],
  },
} as const;

export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'light' ? lightColors : darkColors;
};

const colors = darkColors;

export default colors;