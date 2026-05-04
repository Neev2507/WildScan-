import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './hooks/useAuth';
import AuthScreen from './screens/AuthScreen';
import ScanScreen from './screens/ScanScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScreenContainer from './components/ScreenContainer';

const Tab = createBottomTabNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Scan"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'ellipse';

            if (route.name === 'Scan') {
              iconName = 'camera';
            } else if (route.name === 'Leaderboard') {
              iconName = 'trophy';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1a73e8',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function AppContent() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <ScreenContainer>
        <Text style={{ fontSize: 18, color: '#374151', textAlign: 'center', marginTop: 48 }}>
          Loading WildScan…
        </Text>
      </ScreenContainer>
    );
  }

  return user ? <AppNavigation /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

