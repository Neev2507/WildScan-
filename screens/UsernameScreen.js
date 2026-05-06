import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import ScreenContainer from '../components/ScreenContainer';
import { updateUsername } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { THEME } from '../utils/constants';

export default function UsernameScreen() {
  const { user, refreshProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = username.trim();
    if (trimmed.length < 2) {
      Alert.alert('Too short', 'Username must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 20) {
      Alert.alert('Too long', 'Username must be 20 characters or fewer.');
      return;
    }
    try {
      setSaving(true);
      await updateUsername(user.uid, trimmed);
      await refreshProfile();
    } catch {
      Alert.alert('Error', 'Failed to save username. Please try again.');
      setSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.screen}>
        <Animated.View entering={FadeInDown.delay(80).springify().damping(14)}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>WS</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).springify().damping(14)} style={styles.content}>
          <Text style={styles.title}>Choose your hunter name</Text>
          <Text style={styles.subtitle}>
            This is how you'll appear on the leaderboard. Pick something legendary.
          </Text>

          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="e.g. WildHunter42"
            placeholderTextColor={THEME.mutedText}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={20}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          <Text style={styles.charCount}>{username.trim().length}/20</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(280).springify().damping(14)}>
          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Enter the wild'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: THEME.text,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 42,
    marginBottom: 12,
  },
  subtitle: {
    color: THEME.mutedText,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 36,
  },
  input: {
    backgroundColor: THEME.surface,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(0,255,136,0.3)',
    marginBottom: 8,
  },
  charCount: {
    color: THEME.mutedText,
    fontSize: 12,
    textAlign: 'right',
  },
  button: {
    backgroundColor: THEME.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#060812',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
