import { StyleSheet, View } from 'react-native';
import { THEME } from '../utils/constants';

export default function ScreenContainer({ children }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />
      <View style={styles.container}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  glowTopRight: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(0, 255, 136, 0.038)',
    top: -130,
    right: -130,
  },
  glowBottomLeft: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(123, 47, 255, 0.048)',
    bottom: 30,
    left: -130,
  },
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 28,
  },
});
