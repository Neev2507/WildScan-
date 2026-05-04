import { useState, useRef } from 'react';
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
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { CameraView } from 'expo-camera';

import ScreenContainer from '../components/ScreenContainer';
import AnimalResultCard from '../components/AnimalResultCard';
import { getRandomMockAnimal } from '../utils/mockAnimalData';
import usePermissions from '../hooks/usePermissions';

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

      // Simulate API call delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get random mock animal for testing
      const result = getRandomMockAnimal();
      setAnimalResult(result);
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert(
        'Scan Error',
        error.message || 'Failed to identify animal. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      setIsLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

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

      // On web, expo-image-picker may not return base64, so we need to fetch and convert
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
        <Text>Requesting permissions...</Text>
      </ScreenContainer>
    );
  }

  if (cameraPermission === false && Platform.OS !== 'web') {
    return (
      <ScreenContainer>
        <Text>Camera access is required to scan animals.</Text>
      </ScreenContainer>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <ScreenContainer>
        <ScrollView style={styles.webContainer} contentContainerStyle={styles.webContent}>
          <View style={styles.webHeader}>
            <Text style={styles.webTitle}>🔍 Wildlife Scanner</Text>
            <Text style={styles.webSubtitle}>
              Upload a photo of an animal to identify the species and earn points!
            </Text>
          </View>

          <View style={styles.uploadSection}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a73e8" />
                <Text style={styles.loadingText}>Identifying animal...</Text>
              </View>
            ) : (
              <>
                <View style={styles.uploadPlaceholder}>
                  <Text style={styles.uploadIcon}>📸</Text>
                  <Text style={styles.uploadText}>Select an image from your computer</Text>
                </View>
                <TouchableOpacity
                  style={[styles.uploadButton, isLoading && styles.uploadButtonDisabled]}
                  onPress={handleUploadImage}
                  disabled={isLoading}
                >
                  <Text style={styles.uploadButtonText}>Choose Image</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {animalResult && (
            <AnimalResultCard animal={animalResult} onDismiss={handleRetry} />
          )}
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <View style={styles.topBar}>
            <Text style={styles.cameraTitle}>Point at an animal</Text>
          </View>

          <View style={styles.centerContent}>
            <View style={styles.scanFrame} />
            <Text style={styles.scanHint}>Keep the animal in the frame</Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.shutterButton, isLoading && styles.shutterButtonDisabled]}
              onPress={handleTakePhoto}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <View style={styles.shutterInner} />
              )}
            </TouchableOpacity>
            <Text style={styles.shutterHint}>
              {isLoading ? 'Scanning...' : 'Press to scan'}
            </Text>
          </View>
        </View>
      </CameraView>

      {animalResult && (
        <View style={styles.resultOverlay}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleRetry}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <ScrollView style={styles.resultContainer}>
            <AnimalResultCard animal={animalResult} onDismiss={handleRetry} />
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webContainer: {
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  topBar: {
    paddingTop: 16,
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#3b82f6',
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  scanHint: {
    color: '#e5e7eb',
    fontSize: 14,
    marginTop: 16,
    fontWeight: '500',
  },
  bottomBar: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shutterButtonDisabled: {
    opacity: 0.6,
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a73e8',
  },
  shutterHint: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    maxHeight: '80%',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '700',
  },
  webContainer: {
    flex: 1,
  },
  webContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  webTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
    color: '#111827',
  },
  webSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 24,
  },
  uploadSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#1a73e8',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: '#1a73e8',
    fontWeight: '600',
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});