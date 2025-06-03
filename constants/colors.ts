// Color palette for Floatr app
const colors = {
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
    blue: ["#3B82F6", "#2563EB"] as readonly [string, string],
    purple: ["#8B5CF6", "#6D28D9"] as readonly [string, string],
    pink: ["#EC4899", "#DB2777"] as readonly [string, string],
    sunset: ["#F59E0B", "#EC4899"] as readonly [string, string],
    ocean: ["#0EA5E9", "#3B82F6"] as readonly [string, string],
  },
};

export default colors;