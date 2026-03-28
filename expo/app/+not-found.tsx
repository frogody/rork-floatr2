import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { getColors } from '@/constants/colors';
import { Anchor } from 'lucide-react-native';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  return (
    <>
      <Stack.Screen options={{ 
        title: "Not Found",
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
      }} />
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface.primary }]}>
          <Anchor size={32} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          This screen doesn't exist.
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          The page you're looking for couldn't be found.
        </Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Go back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});