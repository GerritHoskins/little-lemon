import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export function BrandMark({ size = 'large' }: { size?: 'large' | 'small' }) {
  const small = size === 'small';
  return (
    <View style={[styles.lockup, small && styles.lockupSmall]}>
      <View style={[styles.lemon, small && styles.lemonSmall]}>
        <Text style={[styles.lemonLetter, small && styles.lemonLetterSmall]}>L</Text>
      </View>
      <View>
        <Text style={[styles.name, small && styles.nameSmall]}>Little Lemon</Text>
        <Text style={[styles.caption, small && styles.captionSmall]}>CHICAGO · EST. 2005</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lockupSmall: { gap: 8 },
  lemon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lemon, alignItems: 'center', justifyContent: 'center' },
  lemonSmall: { width: 32, height: 32, borderRadius: 16 },
  lemonLetter: { color: colors.darkGreen, fontSize: 25, fontWeight: '900' },
  lemonLetterSmall: { fontSize: 17 },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  nameSmall: { fontSize: 13 },
  caption: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  captionSmall: { fontSize: 7, letterSpacing: 1.1, marginTop: 1 },
});
