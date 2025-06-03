const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
    card: '#1C1C1E',
  },
  
  surface: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    tertiary: '#3A3A3C',
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    tertiary: '#48484A',
    disabled: '#48484A',
  },
  
  border: {
    primary: '#38383A',
    secondary: '#48484A',
  },
  
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Semantic colors
  like: '#34C759',
  superLike: '#007AFF',
  pass: '#FF3B30',
  
  // Gradients
  gradients: {
    primary: ['#007AFF', '#5856D6'],
    secondary: ['#FF9500', '#FF3B30'],
    success: ['#34C759', '#30D158'],
    premium: ['#FFD700', '#FFA500'],
  },
};

// Light theme colors
const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#FFFFFF',
    card: '#FFFFFF',
  },
  
  surface: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#8E8E93',
  },
  
  border: {
    primary: '#C6C6C8',
    secondary: '#E5E5EA',
  },
  
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Semantic colors
  like: '#34C759',
  superLike: '#007AFF',
  pass: '#FF3B30',
  
  // Gradients
  gradients: {
    primary: ['#007AFF', '#5856D6'],
    secondary: ['#FF9500', '#FF3B30'],
    success: ['#34C759', '#30D158'],
    premium: ['#FFD700', '#FFA500'],
  },
};

// Export both dark and light colors with the same structure
export default colors;
export { lightColors };

// Helper function to get colors based on theme
export const getColors = (isDark: boolean) => {
  return isDark ? colors : lightColors;
};