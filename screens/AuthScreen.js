import { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
  withRepeat,
  withTiming,
  Easing,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { signInAsGuest, signInWithGoogleCredential, signInWithGoogleWeb } from '../services/firebase';
import { GOOGLE_AUTH_CONFIG } from '../utils/firebaseConfig';
import ScreenContainer from '../components/ScreenContainer';
import { THEME } from '../utils/constants';

export default function AuthScreen() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(GOOGLE_AUTH_CONFIG);
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(-10, { duration: 2800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

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
      <View style={styles.screen}>

        {/* Top: brand + headline */}
        <View>
          <Animated.View entering={FadeInDown.delay(80).springify().damping(14)} style={styles.header}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>WS</Text>
            </View>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>Boards</Text>
              </View>
              <View style={[styles.chip, styles.chipAlt]}>
                <Text style={[styles.chipText, styles.chipTextAlt]}>Entries</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.Text entering={FadeInUp.delay(180).springify().damping(14)} style={styles.title}>
            {'Enter the\nwild leaderboard.'}
          </Animated.Text>
          <Animated.Text entering={FadeInUp.delay(280).springify().damping(14)} style={styles.subtitle}>
            Scan creatures. Collect rare cards. Dominate the board.
          </Animated.Text>
        </View>

        {/* Middle: floating card fan */}
        <Animated.View entering={FadeInUp.delay(360).springify().damping(12)} style={styles.fanZone}>
          <View style={styles.cardFanRow}>
            <Animated.View
              entering={ZoomIn.delay(440).springify().damping(14)}
              style={[styles.previewCard, {
                borderColor: '#3B82F688',
                transform: [{ rotate: '-11deg' }, { translateY: 20 }],
                zIndex: 1,
                marginRight: -28,
              }]}
            >
              <Text style={styles.previewEmoji}>🦅</Text>
              <Text style={[styles.previewRarityText, { color: '#3B82F6' }]}>RARE</Text>
            </Animated.View>

            <Animated.View
              entering={ZoomIn.delay(300).springify().damping(12)}
              style={[styles.centerCard, { borderColor: '#FACC15BB' }, floatStyle]}
            >
              <View style={styles.centerCardSheen} />
              <Text style={styles.centerEmoji}>🦁</Text>
              <Text style={[styles.previewRarityText, { color: '#FACC15', fontSize: 10, letterSpacing: 1.8 }]}>
                LEGENDARY
              </Text>
            </Animated.View>

            <Animated.View
              entering={ZoomIn.delay(520).springify().damping(14)}
              style={[styles.previewCard, {
                borderColor: '#7B2FFFAA',
                transform: [{ rotate: '11deg' }, { translateY: 20 }],
                zIndex: 2,
                marginLeft: -28,
              }]}
            >
              <Text style={styles.previewEmoji}>🐋</Text>
              <Text style={[styles.previewRarityText, { color: '#7B2FFF' }]}>EPIC</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Bottom: divider + buttons + hint */}
        <View>
          <Animated.View entering={FadeInUp.delay(480).duration(500)} style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>START YOUR HUNT</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(560).springify().damping(14)} style={styles.actions}>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogle}
              disabled={Platform.OS !== 'web' && !request}
              activeOpacity={0.82}
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guestButton} onPress={handleGuest} activeOpacity={0.82}>
              <Text style={styles.guestButtonText}>Play as Guest</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.Text entering={FadeInUp.delay(660).duration(500)} style={styles.hint}>
            Sign in to save your progress across devices.
          </Animated.Text>
        </View>

      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(0,255,136,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
  },
  brandMarkText: {
    color: THEME.primary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipAlt: {
    backgroundColor: 'rgba(123, 47, 255, 0.14)',
    borderColor: 'rgba(123, 47, 255, 0.32)',
    marginLeft: 10,
  },
  chipText: {
    color: THEME.mutedText,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextAlt: {
    color: THEME.secondary,
  },
  title: {
    color: THEME.text,
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 46,
    marginBottom: 14,
  },
  subtitle: {
    color: THEME.mutedText,
    fontSize: 15,
    lineHeight: 23,
  },
  fanZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  cardFanRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  previewCard: {
    width: 86,
    height: 126,
    borderRadius: 18,
    backgroundColor: '#0B1024',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 8,
  },
  centerCard: {
    width: 102,
    height: 152,
    borderRadius: 22,
    backgroundColor: '#0F1430',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    zIndex: 3,
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 14,
    overflow: 'hidden',
  },
  centerCardSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 55,
    backgroundColor: 'rgba(250, 204, 21, 0.07)',
  },
  previewEmoji: {
    fontSize: 34,
    marginBottom: 10,
  },
  centerEmoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  previewRarityText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerLabel: {
    color: THEME.mutedText,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginHorizontal: 14,
  },
  actions: {
    marginBottom: 14,
  },
  googleButton: {
    backgroundColor: THEME.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 8,
  },
  googleButtonText: {
    color: '#060812',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  guestButton: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  guestButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  hint: {
    color: THEME.mutedText,
    textAlign: 'center',
    fontSize: 13,
  },
});
