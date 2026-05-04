import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../hooks/useAuth';
import { signOutUser } from '../services/firebase';

export default function ProfileScreen() {
  const { profile } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profileCard}>
        {profile?.avatarURL ? (
          <Image source={{ uri: profile.avatarURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{profile?.displayName?.charAt(0) ?? 'W'}</Text>
          </View>
        )}
        <Text style={styles.name}>{profile?.displayName ?? 'WildScan User'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total Points</Text>
        <Text style={styles.value}>{profile?.totalPoints ?? 0}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Animals Scanned</Text>
        <Text style={styles.value}>{profile?.animalsScanned ?? 0}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={signOutUser}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarPlaceholderText: {
    color: '#1d4ed8',
    fontSize: 38,
    fontWeight: '800',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});