import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';

import { signInAsGuest, signInWithGoogleCredential, signInWithGoogleWeb } from '../services/firebase';
import { GOOGLE_AUTH_CONFIG } from '../utils/firebaseConfig';
import ScreenContainer from '../components/ScreenContainer';
import { THEME } from '../utils/constants';

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
      <View style={styles.heroCard}>
        <View style={styles.topRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>WS</Text>
          </View>
          <View style={styles.badgeRow}>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>Boards</Text>
            </View>
            <View style={[styles.badgePill, styles.badgePillAlt]}>
              <Text style={[styles.badgeText, styles.badgeTextAlt]}>Entries</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Enter the wild leaderboard.</Text>
        <Text style={styles.subtitle}>Scan creatures and collect premium cards in a dark, tactical interface built for explorers.</Text>

        <View style={styles.cardSpotlight} />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogle} disabled={Platform.OS !== 'web' && !request} activeOpacity={0.85}>
            <Text style={styles.googleButtonText}>Connect with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.guestButton} onPress={handleGuest} activeOpacity={0.85}>
            <Text style={styles.guestButtonText}>Play as Guest</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>Sign in once and your progress is saved automatically.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    flex: 1,
    backgroundColor: THEME.surfaceStrong,
    borderRadius: 32,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.32,
    shadowRadius: 30,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(0,255,136,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandMarkText: {
    color: THEME.primary,
    fontSize: 20,
    fontWeight: '900',
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badgePill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  badgePillAlt: {
    backgroundColor: 'rgba(123, 47, 255, 0.18)',
    marginLeft: 10,
  },
  badgePillAlt: {
    backgroundColor: 'rgba(123, 47, 255, 0.18)',
  },
  badgeText: {
    color: THEME.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextAlt: {
    color: THEME.secondary,
  },
  title: {
    color: THEME.text,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 44,
    marginBottom: 16,
    maxWidth: 440,
  },
  subtitle: {
    color: THEME.mutedText,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 520,
    marginBottom: 28,
  },
  cardSpotlight: {
    height: 220,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 28,
    shadowColor: 'rgba(123, 47, 255, 0.18)',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 34,
  },
  actions: {
    width: '100%',
  },
  googleButton: {
    backgroundColor: THEME.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#0D0D1A',
    fontSize: 16,
    fontWeight: '900',
  },
  guestButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  guestButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '900',
  },
  hint: {
    marginTop: 30,
    color: THEME.mutedText,
    textAlign: 'center',
    fontSize: 14,
  },
});
