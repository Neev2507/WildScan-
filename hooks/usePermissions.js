import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function usePermissions() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaPermission, setMediaPermission] = useState(null);

  useEffect(() => {
    (async () => {
      let cameraGranted = false;
      if (Platform.OS !== 'web') {
        const cameraRequest = await Camera.requestCameraPermissionsAsync();
        cameraGranted = cameraRequest.status === 'granted';
      }
      const mediaRequest = await ImagePicker.requestMediaLibraryPermissionsAsync();

      setCameraPermission(cameraGranted);
      setMediaPermission(mediaRequest.status === 'granted');
    })();
  }, []);

  return {
    cameraPermission,
    mediaPermission,
  };
}
