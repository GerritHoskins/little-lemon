import { Image, StyleSheet, View } from 'react-native';

export function BrandMark({ size = 'large' }: { size?: 'large' | 'small' }) {
  const small = size === 'small';
  return (
    <View style={[styles.lockup, small && styles.lockupSmall]}>
      <Image source={require('../../assets/logo.png')} accessibilityLabel="Little Lemon" resizeMode="contain" style={[styles.logo, small && styles.logoSmall]} />
    </View>
  );
}

const styles = StyleSheet.create({
  lockup: { alignItems: 'center', justifyContent: 'center' },
  lockupSmall: { alignItems: 'flex-start' },
  logo: { width: 180, height: 48 },
  logoSmall: { width: 140, height: 38 },
});
