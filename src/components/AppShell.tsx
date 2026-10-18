import { useState, type PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, type Href } from 'expo-router';
import { useAppData } from '../context/AppDataContext';
import { colors, spacing } from '../theme';
import { BrandMark } from './BrandMark';

type Props = PropsWithChildren<{
  active: 'home' | 'profile';
  title?: string;
  showBack?: boolean;
}>;

export function AppShell({ children, active, title, showBack = false }: Props) {
  const { profile, logout } = useAppData();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const initials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : 'LL';

  const navigate = (href: Href) => {
    setDrawerOpen(false);
    router.push(href);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel={showBack ? 'Go back' : 'Open navigation menu'} style={styles.headerIcon} onPress={() => showBack ? (router.canGoBack() ? router.back() : router.replace('/home')) : setDrawerOpen(true)}>
          <Text style={styles.headerIconText}>{showBack ? '‹' : '☰'}</Text>
        </Pressable>
        <View style={styles.brandLockup}>
          <BrandMark size="small" />
          {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" style={styles.avatar} onPress={() => navigate('/profile')}>
          <Text style={styles.avatarText}>{initials}</Text>
        </Pressable>
      </View>
      <View style={styles.body}>{children}</View>

      <Modal visible={drawerOpen} animationType="fade" transparent onRequestClose={() => setDrawerOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable accessibilityLabel="Close navigation menu" style={styles.scrim} onPress={() => setDrawerOpen(false)} />
          <SafeAreaView style={styles.drawer} edges={['top', 'bottom', 'left']}>
            <View style={styles.drawerBrand}>
              <View style={styles.lemonMark}><Text style={styles.lemonMarkText}>L</Text></View>
              <View>
                <Text style={styles.drawerBrandTitle}>Little Lemon</Text>
                <Text style={styles.drawerBrandCaption}>Chicago · Est. 2005</Text>
              </View>
            </View>
            <Text style={styles.drawerSection}>YOUR TABLE</Text>
            <DrawerItem label="Home" icon="⌂" selected={active === 'home'} onPress={() => active === 'home' ? setDrawerOpen(false) : navigate('/home')} />
            <DrawerItem label="Profile" icon="◉" selected={active === 'profile'} onPress={() => active === 'profile' ? setDrawerOpen(false) : navigate('/profile')} />
            <View style={styles.drawerDivider} />
            <Text style={styles.drawerSection}>GOOD TO KNOW</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>A little taste of the Mediterranean</Text>
              <Text style={styles.aboutText}>Fresh ingredients, family recipes and a sunny welcome in the heart of Chicago.</Text>
            </View>
            <View style={styles.drawerFooter}>
              <Text style={styles.drawerFooterText}>Table for one? Always welcome.</Text>
              <Pressable accessibilityRole="button" onPress={async () => { setDrawerOpen(false); await logout(); }} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DrawerItem({ label, icon, selected, onPress }: { label: string; icon: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.drawerItem, selected && styles.drawerItemSelected]}>
      <Text style={[styles.drawerItemIcon, selected && styles.drawerItemIconSelected]}>{icon}</Text>
      <Text style={[styles.drawerItemText, selected && styles.drawerItemTextSelected]}>{label}</Text>
      {selected ? <Text style={styles.drawerChevron}>›</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.page, gap: 12, backgroundColor: colors.paper, borderBottomWidth: 1, borderBottomColor: colors.line },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  headerIconText: { color: colors.green, fontSize: 24, lineHeight: 28, fontWeight: '700' },
  brandLockup: { flex: 1, gap: 1 },
  headerTitle: { color: colors.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.1 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.lemon, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.paper },
  avatarText: { color: colors.darkGreen, fontSize: 14, fontWeight: '800' },
  body: { flex: 1 },
  modalRoot: { flex: 1, flexDirection: 'row' },
  scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(22, 30, 27, 0.48)' },
  drawer: { width: '82%', maxWidth: 340, height: '100%', backgroundColor: colors.paper, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 16, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 20, elevation: 16 },
  drawerBrand: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingBottom: 26, borderBottomWidth: 1, borderBottomColor: colors.line },
  lemonMark: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.lemon, alignItems: 'center', justifyContent: 'center' },
  lemonMarkText: { fontSize: 25, fontWeight: '900', color: colors.darkGreen },
  drawerBrandTitle: { fontSize: 18, fontWeight: '800', color: colors.ink },
  drawerBrandCaption: { marginTop: 2, color: colors.muted, fontSize: 12 },
  drawerSection: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 24, marginBottom: 10 },
  drawerItem: { minHeight: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderRadius: 14, gap: 13 },
  drawerItemSelected: { backgroundColor: colors.softGreen },
  drawerItemIcon: { width: 22, color: colors.muted, fontSize: 19, textAlign: 'center' },
  drawerItemIconSelected: { color: colors.green },
  drawerItemText: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '600' },
  drawerItemTextSelected: { color: colors.darkGreen, fontWeight: '800' },
  drawerChevron: { color: colors.green, fontSize: 22, fontWeight: '600' },
  drawerDivider: { height: 1, backgroundColor: colors.line, marginTop: 22 },
  aboutCard: { borderRadius: 18, backgroundColor: colors.canvas, padding: 17 },
  aboutTitle: { color: colors.green, fontSize: 14, fontWeight: '800', lineHeight: 20 },
  aboutText: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 7 },
  drawerFooter: { marginTop: 'auto', paddingTop: 20 },
  drawerFooterText: { color: colors.muted, fontSize: 12, marginBottom: 13 },
  logoutButton: { height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  logoutText: { color: colors.red, fontWeight: '800', fontSize: 14 },
});
