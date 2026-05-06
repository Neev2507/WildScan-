import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthScreen from './screens/AuthScreen';
import UsernameScreen from './screens/UsernameScreen';
import ScanScreen from './screens/ScanScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScreenContainer from './components/ScreenContainer';
import { THEME, TABS } from './utils/constants';

const Tab = createBottomTabNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: THEME.background,
    card: THEME.surface,
    text: THEME.text,
    border: THEME.border,
  },
};

function AppNavigation() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        initialRouteName={TABS.SCAN}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';

            if (route.name === TABS.SCAN) {
              iconName = 'camera';
            } else if (route.name === TABS.LEADERBOARD) {
              iconName = 'trophy';
            } else if (route.name === TABS.PROFILE) {
              iconName = 'person';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: THEME.primary,
          tabBarInactiveTintColor: THEME.mutedText,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: 14,
            height: 72,
            borderRadius: 24,
            backgroundColor: THEME.surfaceStrong,
            borderTopWidth: 0,
            shadowColor: THEME.shadow,
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.24,
            shadowRadius: 30,
            elevation: 12,
          },
          tabBarItemStyle: {
            marginTop: 8,
          },
        })}
      >
        <Tab.Screen name={TABS.SCAN} component={ScanScreen} />
        <Tab.Screen name={TABS.LEADERBOARD} component={LeaderboardScreen} />
        <Tab.Screen name={TABS.PROFILE} component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

function AppContent() {
  const { user, initializing, needsUsername } = useAuth();

  if (initializing) {
    return (
      <ScreenContainer>
        <Text style={{ fontSize: 18, color: THEME.mutedText, textAlign: 'center', marginTop: 48 }}>
          Loading WildScan…
        </Text>
      </ScreenContainer>
    );
  }

  if (!user) return <AuthScreen />;
  if (needsUsername) return <UsernameScreen />;
  return <AppNavigation />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
