import React from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  useColorScheme,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { 
  User, 
  Bell, 
  Shield, 
  Eye, 
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Database
} from 'lucide-react-native';
import { getColors } from '@/constants/colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = getColors(isDark);

  const [darkMode, setDarkMode] = React.useState(isDark);
  const [notifications, setNotifications] = React.useState(true);
  const [locationSharing, setLocationSharing] = React.useState(true);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          icon: User,
          route: '/profile/edit',
          type: 'navigation' as const,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          route: '/settings/notifications',
          type: 'navigation' as const,
        },
        {
          id: 'privacy',
          title: 'Privacy & Safety',
          icon: Shield,
          route: '/settings/privacy',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          icon: Moon,
          type: 'toggle' as const,
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'location',
          title: 'Location Sharing',
          icon: Globe,
          type: 'toggle' as const,
          value: locationSharing,
          onToggle: setLocationSharing,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help & Support',
          icon: HelpCircle,
          route: '/help',
          type: 'navigation' as const,
        },
        {
          id: 'analytics',
          title: 'Data & Analytics',
          icon: Database,
          route: '/settings/analytics',
          type: 'navigation' as const,
        },
      ],
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const handleLogout = () => {
    // In a real app, this would handle logout
    console.log('Logout');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
        }} 
      />
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              {section.title}
            </Text>
            
            <View style={[styles.sectionContent, { backgroundColor: colors.surface.primary }]}>
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                const isLast = itemIndex === section.items.length - 1;
                
                if (item.type === 'toggle') {
                  return (
                    <View 
                      key={item.id}
                      style={[
                        styles.settingItem,
                        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.primary }
                      ]}
                    >
                      <View style={styles.settingLeft}>
                        <IconComponent size={20} color={colors.text.secondary} />
                        <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                          {item.title}
                        </Text>
                      </View>
                      
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border.primary, true: colors.primary }}
                        thumbColor={colors.text.primary}
                      />
                    </View>
                  );
                }
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.settingItem,
                      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border.primary }
                    ]}
                    onPress={() => handleNavigation(item.route!)}
                  >
                    <View style={styles.settingLeft}>
                      <IconComponent size={20} color={colors.text.secondary} />
                      <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
                        {item.title}
                      </Text>
                    </View>
                    
                    <ChevronRight size={16} color={colors.text.secondary} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.surface.primary }]}
            onPress={handleLogout}
          >
            <LogOut size={20} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.text.secondary }]}>
            Floatr v1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
  },
});