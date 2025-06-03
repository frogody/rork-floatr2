export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
  };
  surface: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

const lightColors: ColorScheme = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  accent: '#34C759',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    inverse: '#FFFFFF',
  },
  border: {
    primary: '#E5E5EA',
    secondary: '#D1D1D6',
  },
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
};

const darkColors: ColorScheme = {
  primary: '#0A84FF',
  secondary: '#64D2FF',
  accent: '#30D158',
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
  },
  surface: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    inverse: '#000000',
  },
  border: {
    primary: '#38383A',
    secondary: '#48484A',
  },
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
};

export const getColors = (isDark: boolean): ColorScheme => {
  return isDark ? darkColors : lightColors;
};

// Legacy export for backward compatibility
const colors = lightColors;
export default colors;