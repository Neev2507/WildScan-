import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { getLeaderboard } from '../services/firebase';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getLeaderboard().then((data) => {
      if (isMounted) setLeaderboard(data);
    }).catch(() => {
      if (isMounted) setLeaderboard([]);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.name}>{item.displayName || 'Guest'}</Text>
              <Text style={styles.points}>{item.totalPoints ?? 0} pts</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No leaderboard entries yet.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rank: {
    width: 28,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '700',
  },
  itemInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  points: {
    color: '#6b7280',
    marginTop: 4,
  },
  empty: {
    color: '#6b7280',
    marginTop: 20,
    textAlign: 'center',
  },
});