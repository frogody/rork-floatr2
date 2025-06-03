import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }}
            style={styles.logo}
          />
          <Text style={styles.title}>Floatr</Text>
          <Text style={styles.subtitle}>Meet on the Water</Text>
          <Text style={styles.description}>
            Connect with nearby boaters, raft-up, and share amazing experiences on the water
          </Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    marginHorizontal: 20,
    lineHeight: 24,
  },
  buttons: {
    gap: 16,
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  secondaryButtonText: {
    color: '#fff',
  },
});