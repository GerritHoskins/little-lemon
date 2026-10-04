import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAppData } from '../src/context/AppDataContext';
import { BrandMark } from '../src/components/BrandMark';
import { colors } from '../src/theme';

export default function IndexScreen() {
  const { ready, profile } = useAppData();

  useEffect(() => {
    if (ready) router.replace(profile ? '/home' : '/onboarding');
  }, [ready, profile]);

  return (
    <View style={styles.container}>
      <BrandMark />
      <ActivityIndicator style={styles.spinner} color={colors.green} />
      <Text style={styles.caption}>Setting the table…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas, padding: 24 },
  spinner: { marginTop: 30 },
  caption: { color: colors.muted, marginTop: 10, fontSize: 13 },
});
