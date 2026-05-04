import { useEffect } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

import { signInAsGuest, signInWithGoogleCredential, signInWithGoogleWeb } from '../services/firebase';
import { GOOGLE_AUTH_CONFIG } from '../utils/firebaseConfig';
import ScreenContainer from '../components/ScreenContainer';

export default function AuthScreen() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(GOOGLE_AUTH_CONFIG);

  useEffect(() => {
    if (!response) return;

    if (response.type === 'success' && response.authentication) {
      const { idToken, accessToken } = response.authentication;
      signInWithGoogleCredential({ idToken, accessToken }).catch((error) => {
        Alert.alert('Google sign-in failed', error.message || 'Please try again.');
      });
    } else if (response.type === 'error') {
      Alert.alert('Google sign-in canceled', 'Please try again or sign in as guest.');
    }
  }, [response]);

  const handleGuest = async () => {
    try {
      await signInAsGuest();
    } catch (error) {
      Alert.alert('Guest login failed', error.message || 'Try again later.');
    }
  };

  const handleGoogle = async () => {
    if (Platform.OS === 'web') {
      try {
        await signInWithGoogleWeb();
      } catch (error) {
        Alert.alert('Google sign-in failed', error.message || 'Please try again.');
      }
    } else {
      promptAsync({ useProxy: true, showInRecents: true });
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.logoContainer}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>W</Text>
        </View>
        <Text style={styles.title}>WildScan</Text>
        <Text style={styles.subtitle}>Track wildlife sightings, earn points, and join the leaderboard.</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.guestButton} onPress={handleGuest}>
          <Text style={styles.guestButtonText}>Play as Guest</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.googleButton, (Platform.OS !== 'web' && !request) && styles.disabledButton]}
          onPress={handleGoogle}
          disabled={Platform.OS !== 'web' && !request}
        >
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Sign in once and your progress is saved automatically.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoBadgeText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 12,
  },
  subtitle: {
    color: '#4b5563',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 320,
  },
  actions: {
    marginTop: 56,
  },
  guestButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
  hint: {
    marginTop: 40,
    color: '#6b7280',
    textAlign: 'center',
    fontSize: 14,
  },
});