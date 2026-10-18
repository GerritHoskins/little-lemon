import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BrandMark } from '../components/BrandMark';
import { useAppData } from '../context/AppDataContext';
import type { GuestProfile } from '../types';
import { colors, spacing } from '../theme';

export default function OnboardingScreen() {
  const { profile, saveProfile } = useAppData();
  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const valid = firstName.trim().length > 0 && lastName.trim().length > 0 && /^\S+@\S+\.\S+$/.test(email.trim());

  async function continueToMenu() {
    if (!valid) return;
    const nextProfile: GuestProfile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      orderUpdates: true,
      specialOffers: false,
    };
    await saveProfile(nextProfile);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.topline}><BrandMark size="small" /><Text style={styles.step}>01 / 01</Text></View>
        <View style={styles.intro}>
          <View style={styles.eyebrow}><View style={styles.eyebrowDot} /><Text style={styles.eyebrowText}>A SEAT AT OUR TABLE</Text></View>
          <Text style={styles.title}>Your table is{ '\n' }waiting.</Text>
          <Text style={styles.description}>A few details help us make your Little Lemon experience feel like yours.</Text>
        </View>
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>FIRST NAME</Text>
          <TextInput value={firstName} onChangeText={setFirstName} placeholder="e.g. Alex" placeholderTextColor="#9AA19E" style={styles.input} autoCapitalize="words" autoComplete="given-name" returnKeyType="next" />
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>LAST NAME</Text>
          <TextInput value={lastName} onChangeText={setLastName} placeholder="e.g. Morgan" placeholderTextColor="#9AA19E" style={styles.input} autoCapitalize="words" autoComplete="family-name" returnKeyType="next" />
          <View style={styles.fieldDivider} />
          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor="#9AA19E" style={styles.input} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" returnKeyType="done" onSubmitEditing={continueToMenu} />
        </View>
        <View style={styles.privacyNote}><Text style={styles.lock}>▣</Text><Text style={styles.privacyText}>Your details stay on this device. You can update or clear them any time in Profile.</Text></View>
        <Pressable accessibilityRole="button" accessibilityState={{ disabled: !valid }} disabled={!valid} onPress={continueToMenu} style={[styles.button, !valid && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Next</Text><Text style={styles.buttonArrow}>→</Text>
        </Pressable>
        <Text style={styles.footer}>GOOD FOOD, GOOD MOOD, GOOD COMPANY.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.canvas },
  page: { flexGrow: 1, paddingHorizontal: spacing.page, paddingTop: 25, paddingBottom: 28, maxWidth: 640, width: '100%', alignSelf: 'center' },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { color: colors.muted, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  intro: { marginTop: 44, marginBottom: 27 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  eyebrowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lemon },
  eyebrowText: { color: colors.green, fontWeight: '800', fontSize: 10, letterSpacing: 1.7 },
  title: { color: colors.ink, fontSize: 37, lineHeight: 42, fontWeight: '800', letterSpacing: -1.2 },
  description: { maxWidth: 370, color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 13 },
  formCard: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.line, borderRadius: 22, paddingHorizontal: 18, paddingTop: 17, paddingBottom: 7 },
  fieldLabel: { color: colors.green, fontSize: 10, letterSpacing: 1.2, fontWeight: '800', marginTop: 4 },
  input: { height: 49, color: colors.ink, fontSize: 16, paddingHorizontal: 0 },
  fieldDivider: { height: 1, backgroundColor: colors.line, marginBottom: 15 },
  privacyNote: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 17, marginBottom: 25, paddingHorizontal: 3 },
  lock: { color: colors.green, fontSize: 14, fontWeight: '800' },
  privacyText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
  button: { minHeight: 56, borderRadius: 16, paddingHorizontal: 20, backgroundColor: colors.lemon, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  buttonDisabled: { backgroundColor: '#E6E3D7' },
  buttonText: { color: colors.darkGreen, fontSize: 15, fontWeight: '800' },
  buttonArrow: { color: colors.darkGreen, fontSize: 22, fontWeight: '600' },
  footer: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.6, textAlign: 'center', marginTop: 24 },
});
