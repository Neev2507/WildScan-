import { StyleSheet, View } from 'react-native';
import { THEME } from '../utils/constants';

export default function ScreenContainer({ children }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.backdrop} />
      <View style={styles.container}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070B17',
  },
  container: {
    flex: 1,
    padding: 22,
    paddingTop: 28,
  },
});
