export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  warning: string;
  error: string;
  success: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  overlay: {
    light: string;
    medium: string;
    dark: string;
  };
}

const lightColors: ColorScheme = {
  primary: '#007AFF',
  secondary: '#5AC8FA',
  accent: '#FF9500',
  warning: '#FF9500',
  error: '#FF3B30',
  success: '#34C759',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
    tertiary: '#E5E5EA',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F9F9F9',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#000000',
    secondary: '#6D6D80',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  border: {
    primary: '#E5E5EA',
    secondary: '#D1D1D6',
    focus: '#007AFF',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.6)',
  },
};

const darkColors: ColorScheme = {
  primary: '#0A84FF',
  secondary: '#64D2FF',
  accent: '#FF9F0A',
  warning: '#FF9F0A',
  error: '#FF453A',
  success: '#30D158',
  background: {
    primary: '#000000',
    secondary: '#1C1C1E',
    tertiary: '#2C2C2E',
  },
  surface: {
    primary: '#1C1C1E',
    secondary: '#2C2C2E',
    elevated: '#3A3A3C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    disabled: '#48484A',
    inverse: '#000000',
  },
  border: {
    primary: '#38383A',
    secondary: '#48484A',
    focus: '#0A84FF',
  },
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.3)',
    dark: 'rgba(255, 255, 255, 0.6)',
  },
};

export function getColors(isDark: boolean): ColorScheme {
  return isDark ? darkColors : lightColors;
}

// Legacy export for backward compatibility
const colors = lightColors;
export default colors;