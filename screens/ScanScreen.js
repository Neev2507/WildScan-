import { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  withRepeat,
  withTiming,
  Easing,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import ScreenContainer from '../components/ScreenContainer';
import AnimalResultCard from '../components/AnimalResultCard';
import { getRandomMockAnimal } from '../utils/mockAnimalData';
import usePermissions from '../hooks/usePermissions';
import { THEME } from '../utils/constants';

function ScanPulseButton({ onPress, disabled }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.08, {
        duration: 1300,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    shadowColor: THEME.primary,
    shadowOpacity: 0.45,
    shadowRadius: 24,
  }));

  return (
    <Animated.View style={[styles.scanActionWrapper, animatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.scanButton, disabled && styles.scanButtonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <View style={styles.scanInner} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ScanScreen() {
  const { cameraPermission, mediaPermission } = usePermissions();
  const cameraRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animalResult, setAnimalResult] = useState(null);

  const processImageBase64 = async (base64) => {
    try {
      setIsLoading(true);
      setAnimalResult(null);

      if (!base64) {
        throw new Error('Failed to get image data');
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = getRandomMockAnimal();
      setAnimalResult(result);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Scan Error', error.message || 'Failed to identify animal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      setIsLoading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      await processImageBase64(photo.base64);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Camera Error', 'Failed to capture photo. Please try again.');
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;
      if (!result.assets || !result.assets[0]) {
        throw new Error('No image selected');
      }

      const asset = result.assets[0];
      let base64Data = asset.base64;

      if (!base64Data && asset.uri) {
        setIsLoading(true);
        setAnimalResult(null);
        try {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result.split(',')[1];
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (fetchError) {
          console.error('Error converting image to base64:', fetchError);
          throw new Error('Failed to process image. Please try again.');
        }
      }

      await processImageBase64(base64Data);
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Upload Error', error.message || 'Failed to pick image. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setAnimalResult(null);
  };

  if (cameraPermission === null || mediaPermission === null) {
    return (
      <ScreenContainer>
        <Text style={styles.statusText}>Requesting permissions...</Text>
      </ScreenContainer>
    );
  }

  if (cameraPermission === false && Platform.OS !== 'web') {
    return (
      <ScreenContainer>
        <Text style={styles.statusText}>Camera access is required to scan animals.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.pageContent}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Scan Deck</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Ranked</Text>
          </View>
        </View>

        <View style={styles.filterRow}>
          {['All', 'Wild', 'Legends', 'Epic'].map((item) => (
            <View key={item} style={[styles.filterChip, item === 'All' && styles.filterChipActive]}>
              <Text style={[styles.filterText, item === 'All' && styles.filterTextActive]}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            <Text style={styles.scanCardLabel}>Scan mission</Text>
            <Text style={styles.scanCardMetric}>+47 pts</Text>
          </View>
          <Text style={styles.scanCardTitle}>Identify the next rare creature.</Text>
          <Text style={styles.scanCardDescription}>Use your camera or upload a found image to reveal rewards, stats, and rarity tiers.</Text>

          <View style={styles.scanButtonWrapper}>
            <ScanPulseButton onPress={handleTakePhoto} disabled={isLoading} />
          </View>

          <View style={styles.scanHelperRow}>
            <Text style={styles.scanHelperText}>{isLoading ? 'Scanning the wild...' : 'Tap the core to start.'}</Text>
            <TouchableOpacity style={styles.smallAction} onPress={handleUploadImage} activeOpacity={0.85}>
              <Text style={styles.smallActionText}>Upload photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!animalResult && (
          <View style={styles.infoGrid}>
            <View style={styles.infoPanel}>
              <Text style={styles.infoLabel}>Power</Text>
              <Text style={styles.infoValue}>+65%</Text>
            </View>
            <View style={styles.infoPanel}>
              <Text style={styles.infoLabel}>Coverage</Text>
              <Text style={styles.infoValue}>3 regions</Text>
            </View>
            <View style={styles.infoPanelWide}>
              <Text style={styles.infoLabel}>Last scan</Text>
              <Text style={styles.infoValue}>Minutes ago</Text>
            </View>
          </View>
        )}

        {animalResult && <AnimalResultCard animal={animalResult} onDismiss={handleRetry} />}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    paddingBottom: 28,
  },
  statusText: {
    color: THEME.text,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    color: THEME.text,
    fontSize: 32,
    fontWeight: '900',
  },
  statusPill: {
    backgroundColor: 'rgba(0,255,136,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  statusPillText: {
    color: THEME.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginRight: 10,
    marginBottom: 10,
  },
  filterChipActive: {
    backgroundColor: THEME.surfaceSoft,
    borderColor: 'rgba(0,255,136,0.25)',
  },
  filterText: {
    color: THEME.mutedText,
    fontWeight: '800',
  },
  filterTextActive: {
    color: THEME.text,
  },
  scanCard: {
    backgroundColor: THEME.surface,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: THEME.shadow,
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.28,
    shadowRadius: 34,
    marginBottom: 22,
  },
  scanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  scanCardLabel: {
    color: THEME.mutedText,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  scanCardMetric: {
    color: THEME.primary,
    fontWeight: '900',
  },
  scanCardTitle: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 10,
  },
  scanCardDescription: {
    color: THEME.mutedText,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },
  scanButtonWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scanActionWrapper: {
    borderRadius: 999,
  },
  scanButton: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: '#07101F',
    borderWidth: 2,
    borderColor: 'rgba(0,255,136,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonDisabled: {
    opacity: 0.65,
  },
  scanInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(0,255,136,0.12)',
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  scanHelperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanHelperText: {
    color: THEME.mutedText,
    fontWeight: '700',
  },
  smallAction: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  smallActionText: {
    color: THEME.primary,
    fontWeight: '800',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoPanel: {
    width: '48%',
    backgroundColor: THEME.surfaceStrong,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 14,
  },
  infoPanelWide: {
    width: '100%',
    backgroundColor: THEME.surfaceStrong,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  infoLabel: {
    color: THEME.mutedText,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '700',
  },
  infoValue: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: '900',
  },
});
