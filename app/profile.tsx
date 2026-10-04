import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppShell } from '../src/components/AppShell';
import { useAppData } from '../src/context/AppDataContext';
import type { GuestProfile } from '../src/types';
import { colors, spacing } from '../src/theme';

export default function ProfileScreen() {
  const { profile, saveProfile } = useAppData();
  const [draft, setDraft] = useState<GuestProfile | null>(() => profile ? { ...profile } : null);
  const [saved, setSaved] = useState(false);

  if (!draft) return null;
  const update = <K extends keyof GuestProfile>(key: K, value: GuestProfile[K]) => {
    setDraft(current => current ? { ...current, [key]: value } : current);
    setSaved(false);
  };

  async function saveChanges() {
    if (!draft) return;
    await saveProfile(draft);
    setSaved(true);
  }

  const valid = draft.firstName.trim().length > 0 && draft.lastName.trim().length > 0 && /^\S+@\S+\.\S+$/.test(draft.email.trim());
  const initials = `${draft.firstName.charAt(0)}${draft.lastName.charAt(0)}`.toUpperCase();

  return (
    <AppShell active="profile" title="Your profile" showBack>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
          <View style={styles.profileHero}>
            <View style={styles.avatarLarge}><Text style={styles.avatarInitials}>{initials}</Text></View>
            <View style={styles.profileIntro}>
              <Text style={styles.eyebrow}>YOUR LITTLE LEMON ACCOUNT</Text>
              <Text style={styles.name}>{draft.firstName} {draft.lastName}</Text>
              <Text style={styles.email}>{draft.email}</Text>
            </View>
          </View>
          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Personal details</Text><Text style={styles.sectionHint}>EDIT ANYTIME</Text></View>
          <View style={styles.card}>
            <ProfileField label="FIRST NAME" value={draft.firstName} onChangeText={value => update('firstName', value)} autoCapitalize="words" />
            <View style={styles.fieldDivider} />
            <ProfileField label="LAST NAME" value={draft.lastName} onChangeText={value => update('lastName', value)} autoCapitalize="words" />
            <View style={styles.fieldDivider} />
            <ProfileField label="EMAIL ADDRESS" value={draft.email} onChangeText={value => update('email', value)} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={[styles.sectionHeader, styles.notificationHeading]}><Text style={styles.sectionTitle}>Keep me in the loop</Text><Text style={styles.sectionHint}>PREFERENCES</Text></View>
          <View style={styles.card}>
            <PreferenceRow title="Order updates" description="A little note when your order is ready." value={draft.orderUpdates} onPress={() => update('orderUpdates', !draft.orderUpdates)} />
            <View style={styles.fieldDivider} />
            <PreferenceRow title="Special offers" description="Seasonal menus and something sweet." value={draft.specialOffers} onPress={() => update('specialOffers', !draft.specialOffers)} />
          </View>
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: !valid }} disabled={!valid} onPress={saveChanges} style={[styles.saveButton, !valid && styles.disabledButton]}>
            <Text style={styles.saveButtonText}>{saved ? 'Changes saved ✓' : 'Save changes'}</Text>
            {!saved ? <Text style={styles.saveArrow}>→</Text> : null}
          </Pressable>
          <Text style={styles.privacyNote}>Your profile is saved locally on this device.</Text>
          <Text style={styles.footer}>GOOD FOOD, GOOD MOOD, GOOD COMPANY.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}

function ProfileField({ label, value, onChangeText, ...inputProps }: { label: string; value: string; onChangeText: (value: string) => void } & Omit<React.ComponentProps<typeof TextInput>, 'value' | 'onChangeText'>) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput value={value} onChangeText={onChangeText} style={styles.input} placeholderTextColor="#9AA19E" autoCorrect={false} {...inputProps} /></View>;
}

function PreferenceRow({ title, description, value, onPress }: { title: string; description: string; value: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value }} onPress={onPress} style={styles.preferenceRow}>
      <View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>{title}</Text><Text style={styles.preferenceDescription}>{description}</Text></View>
      <View style={[styles.switchTrack, value && styles.switchTrackOn]}><View style={[styles.switchThumb, value && styles.switchThumbOn]} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  page: { paddingHorizontal: spacing.page, paddingTop: 22, paddingBottom: 32, maxWidth: 640, width: '100%', alignSelf: 'center' },
  profileHero: { flexDirection: 'row', alignItems: 'center', paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: colors.line },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.lemon, alignItems: 'center', justifyContent: 'center', borderWidth: 5, borderColor: colors.paper },
  avatarInitials: { color: colors.darkGreen, fontSize: 22, fontWeight: '900' },
  profileIntro: { marginLeft: 15, flex: 1 },
  eyebrow: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.3 },
  name: { color: colors.ink, fontSize: 21, fontWeight: '800', marginTop: 5 },
  email: { color: colors.muted, fontSize: 12, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 22, marginBottom: 11 },
  notificationHeading: { marginTop: 22 },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  sectionHint: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  card: { paddingHorizontal: 16, backgroundColor: colors.paper, borderRadius: 20, borderWidth: 1, borderColor: colors.line },
  field: { paddingTop: 14, paddingBottom: 7 },
  fieldLabel: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  input: { color: colors.ink, fontSize: 15, height: 39, paddingHorizontal: 0 },
  fieldDivider: { height: 1, backgroundColor: colors.line },
  preferenceRow: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12 },
  preferenceCopy: { flex: 1 },
  preferenceTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  preferenceDescription: { color: colors.muted, fontSize: 11, marginTop: 4 },
  switchTrack: { width: 43, height: 25, borderRadius: 13, backgroundColor: '#DADDD9', padding: 3, justifyContent: 'center' },
  switchTrackOn: { backgroundColor: colors.green },
  switchThumb: { width: 19, height: 19, borderRadius: 10, backgroundColor: colors.paper },
  switchThumbOn: { alignSelf: 'flex-end' },
  saveButton: { minHeight: 54, borderRadius: 16, paddingHorizontal: 19, backgroundColor: colors.lemon, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 21 },
  disabledButton: { backgroundColor: '#E6E3D7' },
  saveButtonText: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
  saveArrow: { color: colors.darkGreen, fontSize: 21, fontWeight: '600' },
  privacyNote: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 12 },
  footer: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.4, textAlign: 'center', marginTop: 21 },
});
