import { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { getLeaderboard } from '../services/firebase';
import { THEME } from '../utils/constants';

function displayName(player) {
  return player.username || player.displayName || 'Hunter';
}

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getLeaderboard()
        .then((data) => { if (isMounted) setLeaderboard(data); })
        .catch(() => { if (isMounted) setLeaderboard([]); });
      return () => { isMounted = false; };
    }, [])
  );

  const topPlayers = leaderboard.slice(0, 3);
  const otherPlayers = leaderboard.slice(3);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Boards</Text>
            <Text style={styles.subtitle}>Explore top-ranked animal hunters.</Text>
          </View>
          <View style={styles.walletCard}>
            <Text style={styles.walletBalance}>800.000</Text>
            <Text style={styles.walletLabel}>Credits</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {['Global', 'Weekly', 'Friends', 'Legendary'].map((option) => (
            <TouchableOpacity key={option} style={styles.filterChip} activeOpacity={0.85}>
              <Text style={styles.filterText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.podiumRow}>
          <View style={[styles.podiumCard, styles.podiumSecond]}>
            <Text style={styles.podiumLabel}>2</Text>
            <Text style={styles.podiumName}>{topPlayers[1] ? displayName(topPlayers[1]) : 'Player 2'}</Text>
            <Text style={styles.podiumScore}>{topPlayers[1]?.totalPoints ?? 0} pts</Text>
          </View>
          <View style={[styles.podiumCard, styles.podiumFirst]}>
            <Text style={styles.podiumCrown}>👑</Text>
            <Text style={styles.podiumLabel}>1</Text>
            <Text style={styles.podiumName}>{topPlayers[0] ? displayName(topPlayers[0]) : 'Champion'}</Text>
            <Text style={styles.podiumScore}>{topPlayers[0]?.totalPoints ?? 0} pts</Text>
          </View>
          <View style={[styles.podiumCard, styles.podiumThird]}>
            <Text style={styles.podiumLabel}>3</Text>
            <Text style={styles.podiumName}>{topPlayers[2] ? displayName(topPlayers[2]) : 'Player 3'}</Text>
            <Text style={styles.podiumScore}>{topPlayers[2]?.totalPoints ?? 0} pts</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Bonuses</Text>
            <Text style={styles.summarySubtitle}>2 stars · 38 potions</Text>
          </View>
          <View style={styles.summaryCardAlt}>
            <Text style={styles.summaryTitle}>Tournament</Text>
            <Text style={styles.summarySubtitle}>Start a new match</Text>
          </View>
        </View>

        {otherPlayers.length === 0 ? (
          <Text style={styles.emptyText}>No leaderboard entries yet.</Text>
        ) : (
          otherPlayers.map((item, index) => (
            <View key={item.id} style={styles.listCard}>
              <View style={styles.rankCircle}>
                <Text style={styles.rankCircleText}>{index + 4}</Text>
              </View>
              <View style={styles.rankMeta}>
                <Text style={styles.playerName}>{displayName(item)}</Text>
                <Text style={styles.playerPoints}>{item.totalPoints ?? 0} pts</Text>
              </View>
              <Text style={styles.rankTag}>#{index + 4}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: THEME.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: THEME.mutedText,
    marginTop: 6,
  },
  walletCard: {
    backgroundColor: THEME.surfaceStrong,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  walletBalance: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '900',
  },
  walletLabel: {
    color: THEME.mutedText,
    marginTop: 4,
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterText: {
    color: THEME.mutedText,
    fontWeight: '700',
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  podiumCard: {
    flex: 1,
    borderRadius: 26,
    padding: 18,
    backgroundColor: THEME.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 6,
  },
  podiumFirst: {
    transform: [{ translateY: -12 }],
    borderColor: THEME.primary,
  },
  podiumSecond: {
    transform: [{ translateY: 6 }],
  },
  podiumThird: {
    transform: [{ translateY: 12 }],
  },
  podiumCrown: {
    fontSize: 20,
    marginBottom: 4,
  },
  podiumLabel: {
    color: THEME.primary,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  podiumName: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },
  podiumScore: {
    color: THEME.mutedText,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: THEME.surfaceStrong,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 12,
  },
  summaryCardAlt: {
    flex: 1,
    backgroundColor: THEME.primary,
    borderRadius: 24,
    padding: 18,
    justifyContent: 'center',
  },
  summaryTitle: {
    color: THEME.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 10,
  },
  summarySubtitle: {
    color: THEME.mutedText,
    fontSize: 13,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  rankCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#101326',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankCircleText: {
    color: THEME.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  rankMeta: {
    flex: 1,
  },
  playerName: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '900',
  },
  playerPoints: {
    color: THEME.mutedText,
    marginTop: 4,
  },
  rankTag: {
    color: THEME.primary,
    fontWeight: '900',
  },
  emptyText: {
    color: THEME.mutedText,
    marginTop: 24,
    textAlign: 'center',
  },
});
