import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeInUp,
  FadeOutDown,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RARITY_COLORS, RARITY_GLOW, THEME } from '../utils/constants';

export default function AnimalResultCard({ animal, onDismiss }) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 11, mass: 1 });
    opacity.value = withSpring(1, { damping: 11, mass: 1 });
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

  const tierColor = RARITY_COLORS[animal.rarityTier] || RARITY_COLORS.Common;
  const tierGlow = RARITY_GLOW[animal.rarityTier] || RARITY_GLOW.Common;
  const animalIcon = animal.icon || '🐾';

  return (
    <Animated.View
      entering={FadeInUp.springify().damping(12)}
      exiting={FadeOutDown}
      style={[styles.card, { borderColor: tierColor, shadowColor: tierGlow }, animatedStyle]}
    >
      <View style={[styles.rarityStripe, { backgroundColor: tierColor }]} />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{animal.name}</Text>
          <Text style={styles.subtitle}>{animal.scientificName}</Text>
        </View>
        <View style={[styles.rarityBadge, { backgroundColor: tierGlow }]}> 
          <Text style={[styles.rarityText, { color: tierColor }]}>{animal.rarityTier}</Text>
        </View>
      </View>

      <View style={[styles.artBackdrop, { backgroundColor: tierGlow }]}> 
        <Text style={styles.artEmoji}>{animalIcon}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Score</Text>
          <Text style={[styles.valueText, { color: tierColor }]}>{animal.rarityScore}</Text>
        </View>
        <View style={styles.valueBlock}> 
          <Text style={styles.valueLabel}>Points</Text>
          <Text style={[styles.valueText, { color: THEME.primary }]}>+{animal.points}</Text>
        </View>
      </View>

      <View style={styles.factContainer}>
        <Text style={styles.factHeader}>Trait</Text>
        <Text style={styles.factText}>{animal.funFact}</Text>
      </View>

      <TouchableOpacity style={styles.scanAgainButton} onPress={onDismiss} activeOpacity={0.85}>
        <Text style={styles.scanAgainButtonText}>Scan Another</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.surface,
    borderRadius: 32,
    padding: 24,
    paddingTop: 30,
    marginBottom: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.24,
    shadowRadius: 32,
    elevation: 14,
    overflow: 'hidden',
  },
  rarityStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  errorCard: {
    borderColor: '#EF4444',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: THEME.mutedText,
    fontSize: 13,
  },
  rarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  artBackdrop: {
    width: '100%',
    height: 220,
    borderRadius: 28,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 26,
  },
  artEmoji: {
    fontSize: 92,
    textShadowColor: 'rgba(0,0,0,0.24)',
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  valueBlock: {
    flex: 1,
    backgroundColor: '#0B1024',
    borderRadius: 22,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  valueLabel: {
    color: THEME.mutedText,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '700',
  },
  valueText: {
    fontSize: 28,
    fontWeight: '900',
  },
  factContainer: {
    backgroundColor: '#0B1024',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 22,
  },
  factHeader: {
    color: THEME.mutedText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  factText: {
    color: THEME.text,
    fontSize: 14,
    lineHeight: 22,
  },
  scanAgainButton: {
    backgroundColor: THEME.primary,
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
  },
  scanAgainButtonText: {
    color: '#0D0D1A',
    fontSize: 15,
    fontWeight: '900',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#FCA5A5',
  },
});
