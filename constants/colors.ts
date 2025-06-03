// Modern color scheme inspired by Linear and Notion
// With proper dark/light mode support
// Using semantic color naming
import { useColorScheme } from 'react-native';

const lightColors = {
  primary: '#2563EB',
  secondary: '#EC4899',
  accent: '#10B981',
  error: '#EF4444',

  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    dark: '#0F172A',
  },

  surface: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
  },

  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    disabled: '#94A3B8',
  },

  border: {
    primary: '#E2E8F0',
    secondary: '#F1F5F9',
    focus: '#2563EB',
  },

  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
  },

  gradient: {
    primary: ['#2563EB', '#1D4ED8'],
    secondary: ['#EC4899', '#DB2777'],
    accent: ['#10B981', '#059669'],
    surface: ['#F8FAFC', '#F1F5F9'],
  },
} as const;

const darkColors = {
  primary: '#3B82F6',
  secondary: '#EC4899',
  accent: '#10B981',
  error: '#EF4444',

  background: {
    primary: '#0A0A0A',
    secondary: '#18181B',
    tertiary: '#27272A',
    dark: '#000000',
  },

  surface: {
    primary: '#18181B',
    secondary: '#27272A',
    tertiary: '#3F3F46',
  },

  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    tertiary: '#94A3B8',
    disabled: '#64748B',
  },

  border: {
    primary: '#27272A',
    secondary: '#3F3F46',
    focus: '#3B82F6',
  },

  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
  },

  gradient: {
    primary: ['#3B82F6', '#2563EB'],
    secondary: ['#EC4899', '#DB2777'],
    accent: ['#10B981', '#059669'],
    surface: ['#18181B', '#27272A'],
  },
} as const;

export const useColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'light' ? lightColors : darkColors;
};

// Export dark theme by default
export default darkColors;