import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const rarityColors = {
  Common: '#6b7280',
  Uncommon: '#10b981',
  Rare: '#3b82f6',
  Epic: '#8b5cf6',
  Legendary: '#f59e0b',
};

const rarityBgColors = {
  Common: '#f3f4f6',
  Uncommon: '#ecfdf5',
  Rare: '#eff6ff',
  Epic: '#f5f3ff',
  Legendary: '#fffbeb',
};

export default function AnimalResultCard({ animal, onDismiss }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, mass: 1, overshootClamping: false });
    opacity.value = withSpring(1, { damping: 10, mass: 1 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (animal.error) {
    return (
      <Animated.View
        entering={FadeInUp.springify().damping(12)}
        exiting={FadeOutDown}
        style={[styles.card, styles.errorCard, animatedStyle]}
      >
        <Text style={styles.errorText}>🔍 {animal.error}</Text>
        <Text style={styles.errorSubtext}>Try capturing a clearer photo of an animal.</Text>
      </Animated.View>
    );
  }

  const tierColor = rarityColors[animal.rarityTier] || '#6b7280';
  const tierBgColor = rarityBgColors[animal.rarityTier] || '#f3f4f6';

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12)}
      exiting={FadeOutDown}
      style={[styles.card, animatedStyle]}
    >
      {/* Animal Name */}
      <Text style={styles.animalName}>{animal.name}</Text>
      <Text style={styles.scientificName}>{animal.scientificName}</Text>

      {/* Rarity Tier Badge */}
      <View style={[styles.rarityBadge, { backgroundColor: tierBgColor }]}>
        <Text style={[styles.rarityText, { color: tierColor }]}>
          {animal.rarityTier} • {animal.rarityScore}/100
        </Text>
      </View>

      {/* Points Earned */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsLabel}>Points Earned</Text>
        <Text style={styles.pointsValue}>+{animal.points}</Text>
      </View>

      {/* Fun Fact */}
      <View style={styles.factContainer}>
        <Text style={styles.factLabel}>🎓 Fun Fact</Text>
        <Text style={styles.factText}>{animal.funFact}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Scan Again Button */}
      <TouchableOpacity style={styles.scanAgainButton} onPress={onDismiss}>
        <Text style={styles.scanAgainButtonText}>Scan Another Animal</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  errorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  animalName: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    color: '#111827',
  },
  scientificName: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  rarityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pointsContainer: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#0369a1',
    fontWeight: '600',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0ea5e9',
  },
  factContainer: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  factLabel: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    marginBottom: 6,
  },
  factText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7f1d1d',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  scanAgainButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
