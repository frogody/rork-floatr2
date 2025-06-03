const colors = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  accent: '#FF9500',
  
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },
  
  surface: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    tertiary: '#3A3A3C',
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
    tertiary: '#EBEBF599',
    inverse: '#000000',
  },
  
  border: {
    primary: '#38383A',
    secondary: '#48484A',
  },
  
  status: {
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#007AFF',
  },
} as const;

export default colors;