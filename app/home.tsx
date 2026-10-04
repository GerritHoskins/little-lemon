import { useMemo, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppShell } from '../src/components/AppShell';
import { useAppData } from '../src/context/AppDataContext';
import type { Category, MenuItem } from '../src/types';
import { colors, spacing } from '../src/theme';

type Filter = 'all' | Category;

const categories: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'starters', label: 'Starters' },
  { value: 'mains', label: 'Mains' },
  { value: 'desserts', label: 'Desserts' },
];

export default function HomeScreen() {
  const { menu, profile } = useAppData();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [bagCount, setBagCount] = useState(0);

  const visibleMenu = useMemo(() => {
    const term = query.trim().toLowerCase();
    return menu.filter(item =>
      (filter === 'all' || item.category === filter) &&
      (!term || `${item.name} ${item.description}`.toLowerCase().includes(term)),
    );
  }, [filter, menu, query]);

  return (
    <AppShell active="home">
      <FlatList
        data={visibleMenu}
        keyExtractor={item => String(item.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Good food, {profile?.firstName || 'friend'}.</Text>
              <Pressable accessibilityRole="button" accessibilityLabel={`${bagCount} items in your bag`} onPress={() => Alert.alert(bagCount ? `Your bag · ${bagCount} ${bagCount === 1 ? 'dish' : 'dishes'}` : 'Your bag is empty', bagCount ? 'Your selected dishes are ready for a pickup order.' : 'Add a dish from the menu and it will show up here.')} style={styles.bagButton}>
                <Text style={styles.bagIcon}>♧</Text>
                <Text style={styles.bagCount}>{bagCount}</Text>
              </Pressable>
            </View>
            <View style={styles.hero}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>A LITTLE SUNSHINE IN CHICAGO</Text>
                <Text style={styles.heroTitle}>Little Lemon</Text>
                <Text style={styles.heroText}>Mediterranean favorites, made fresh and shared with love.</Text>
              </View>
              <View style={styles.lemonArt}><Text style={styles.lemonEmoji}>🍋</Text><Text style={styles.lemonLeaf}>✦</Text></View>
              <Text style={styles.location}>⌖  Chicago, Illinois</Text>
            </View>
            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                accessibilityLabel="Search the menu"
                value={query}
                onChangeText={setQuery}
                placeholder="Find something delicious"
                placeholderTextColor="#8C9690"
                style={styles.searchInput}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>
            <View style={styles.sectionHeadingRow}>
              <View><Text style={styles.sectionTitle}>Order for delivery</Text><Text style={styles.sectionCaption}>A few favorites from our kitchen</Text></View>
              <Text style={styles.itemCount}>{visibleMenu.length} DISHES</Text>
            </View>
            <View style={styles.chips}>
              {categories.map(category => {
                const selected = filter === category.value;
                return (
                  <Pressable key={category.value} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => setFilter(category.value)} style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{category.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        }
        renderItem={({ item }) => <MenuRow item={item} onAdd={() => setBagCount(current => current + 1)} />}
        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Nothing on the menu yet</Text><Text style={styles.emptyText}>Try another search or category.</Text></View>}
        ListFooterComponent={<Text style={styles.footer}>MADE FRESH IN CHICAGO · GOOD FOOD, GOOD COMPANY</Text>}
      />
    </AppShell>
  );
}

function MenuRow({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <View style={styles.menuRow}>
      <View style={styles.menuCopy}>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceLine}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.dishCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.imageColumn}>
        {imageFailed ? (
          <View style={[styles.dishImage, styles.imageFallback]}><Text style={styles.imageEmoji}>🍋</Text></View>
        ) : (
          <Image source={{ uri: item.image }} onError={() => setImageFailed(true)} style={styles.dishImage} accessibilityLabel={`${item.name} menu photo`} />
        )}
        <Pressable accessibilityRole="button" accessibilityLabel={`Add ${item.name} to order`} onPress={onAdd} style={styles.addButton}><Text style={styles.addButtonText}>+</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: spacing.page, paddingBottom: 25, maxWidth: 720, width: '100%', alignSelf: 'center' },
  greetingRow: { minHeight: 61, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  bagButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: colors.paper, borderRadius: 12, borderWidth: 1, borderColor: colors.line },
  bagIcon: { color: colors.green, fontSize: 17 },
  bagCount: { color: colors.green, fontSize: 12, fontWeight: '800' },
  hero: { minHeight: 180, position: 'relative', overflow: 'hidden', backgroundColor: colors.green, borderRadius: 22, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 17 },
  heroCopy: { maxWidth: '73%', zIndex: 1 },
  heroEyebrow: { color: colors.lemon, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  heroTitle: { color: colors.paper, fontSize: 30, fontWeight: '800', letterSpacing: -0.9, marginTop: 9 },
  heroText: { color: '#E2E9E4', fontSize: 13, lineHeight: 19, marginTop: 6 },
  lemonArt: { position: 'absolute', right: -2, top: 21, width: 110, height: 110, borderRadius: 55, backgroundColor: '#66786F', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-18deg' }] },
  lemonEmoji: { fontSize: 58 },
  lemonLeaf: { position: 'absolute', color: colors.lemon, fontSize: 25, right: 22, top: 1 },
  location: { color: '#E4EBE7', fontSize: 11, fontWeight: '600', marginTop: 15 },
  searchWrap: { height: 49, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10, backgroundColor: colors.paper, borderRadius: 15, borderWidth: 1, borderColor: colors.line, marginTop: 14 },
  searchIcon: { color: colors.green, fontSize: 24, lineHeight: 28 },
  searchInput: { flex: 1, height: 47, color: colors.ink, fontSize: 14 },
  sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 25, marginBottom: 14 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  sectionCaption: { color: colors.muted, fontSize: 12, marginTop: 4 },
  itemCount: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 5 },
  chip: { paddingHorizontal: 14, height: 35, justifyContent: 'center', borderRadius: 18, backgroundColor: '#ECEAE2' },
  chipSelected: { backgroundColor: colors.green },
  chipText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  chipTextSelected: { color: colors.paper },
  menuRow: { minHeight: 134, flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 15 },
  menuCopy: { flex: 1, alignSelf: 'stretch', justifyContent: 'center' },
  dishName: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  dishDescription: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  priceLine: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 9 },
  price: { color: colors.green, fontSize: 13, fontWeight: '800' },
  dot: { color: '#A1A7A2' },
  dishCategory: { color: colors.muted, fontSize: 10, textTransform: 'capitalize' },
  imageColumn: { width: 93, height: 94, position: 'relative' },
  dishImage: { width: 93, height: 86, borderRadius: 16, backgroundColor: colors.softGreen },
  imageFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.peach },
  imageEmoji: { fontSize: 33 },
  addButton: { position: 'absolute', right: -4, bottom: -1, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.lemon, alignItems: 'center', justifyContent: 'center', borderColor: colors.paper, borderWidth: 2 },
  addButtonText: { color: colors.darkGreen, fontSize: 20, fontWeight: '700', marginTop: -2 },
  rowSeparator: { height: 1, backgroundColor: colors.line },
  empty: { alignItems: 'center', padding: 26 },
  emptyTitle: { color: colors.ink, fontWeight: '800', fontSize: 16 },
  emptyText: { color: colors.muted, marginTop: 5, fontSize: 12 },
  footer: { textAlign: 'center', color: colors.muted, fontSize: 9, letterSpacing: 1, fontWeight: '700', paddingTop: 25 },
});
