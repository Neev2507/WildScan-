import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../hooks/useAuth';
import { signOutUser } from '../services/firebase';
import { THEME, RARITY_COLORS, RARITY_GLOW } from '../utils/constants';
import { mockAnimals } from '../utils/mockAnimalData';

export default function ProfileScreen() {
  const { profile } = useAuth();
  const scannedCount = profile?.animalsScanned ?? 0;
  const recentScans = scannedCount > 0 ? mockAnimals.slice(0, 4) : [];
  const rarestAnimal = recentScans.reduce((best, animal) => {
    if (!best || animal.rarityScore > best.rarityScore) return animal;
    return best;
  }, null);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.headerCard}>
        <View style={styles.avatarRing}>
          {profile?.avatarURL ? (
            <Image source={{ uri: profile.avatarURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>{profile?.displayName?.charAt(0) ?? 'W'}</Text>
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.displayName ?? 'WildScan User'}</Text>
          <Text style={styles.profileRole}>Explorer</Text>
          <Text style={styles.profilePoints}>{profile?.totalPoints ?? 0} pts</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Species Found</Text>
          <Text style={styles.statValue}>{scannedCount}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Rarest Card</Text>
          <Text style={styles.statValue}>{rarestAnimal?.name ?? 'None yet'}</Text>
        </View>
      </View>

      <View style={styles.collectionBanner}>
        <Text style={styles.collectionTitle}>Collection Power</Text>
        <Text style={styles.collectionScore}>+96</Text>
      </View>

      <Text style={styles.sectionTitle}>Scanned Creatures</Text>
      <View style={styles.grid}>
        {recentScans.length > 0 ? (
          recentScans.map((animal) => (
            <View key={animal.name} style={[styles.creatureCard, { borderColor: RARITY_GLOW[animal.rarityTier] || 'rgba(255,255,255,0.08)' }]}> 
              <View style={[styles.creatureBadge, { backgroundColor: RARITY_GLOW[animal.rarityTier] || 'rgba(255,255,255,0.08)' }]}> 
                <Text style={[styles.creatureBadgeText, { color: RARITY_COLORS[animal.rarityTier] || THEME.primary }]}>{animal.rarityTier}</Text>
              </View>
              <View style={styles.creatureArt}>
                <Text style={styles.creatureEmoji}>{animal.icon || '🐾'}</Text>
              </View>
              <Text style={styles.creatureName}>{animal.name}</Text>
              <Text style={styles.creatureScore}>+{animal.points} pts</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyBlock}>
            <Text style={styles.emptyText}>No scanned animals yet. Start your hunt to fill this deck.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOutUser} activeOpacity={0.85}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: THEME.text,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 24,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 28,
    padding: 22,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  avatarRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: THEME.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#11131F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: THEME.primary,
    fontSize: 36,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  profileRole: {
    color: THEME.mutedText,
    fontSize: 13,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  profilePoints: {
    color: THEME.primary,
    fontSize: 28,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: THEME.surfaceStrong,
    borderRadius: 22,
    padding: 18,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statLabel: {
    color: THEME.mutedText,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '700',
  },
  statValue: {
    color: THEME.text,
    fontSize: 22,
    fontWeight: '900',
  },
  collectionBanner: {
    backgroundColor: '#0F1228',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 24,
  },
  collectionTitle: {
    color: THEME.mutedText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '700',
  },
  collectionScore: {
    color: THEME.primary,
    fontSize: 28,
    fontWeight: '900',
  },
  sectionTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  creatureCard: {
    width: '48%',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    backgroundColor: THEME.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  creatureBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  creatureBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  creatureArt: {
    width: 86,
    height: 86,
    borderRadius: 22,
    backgroundColor: '#11131F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatureEmoji: {
    fontSize: 36,
  },
  creatureName: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  creatureScore: {
    color: THEME.mutedText,
    fontSize: 12,
  },
  emptyBlock: {
    width: '100%',
    backgroundColor: THEME.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  emptyText: {
    color: THEME.mutedText,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  signOutButton: {
    backgroundColor: THEME.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#0D0D1A',
    fontWeight: '900',
    fontSize: 16,
  },
});
