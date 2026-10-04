import type { SQLiteDatabase } from 'expo-sqlite';
import fallbackData from '../data/fallback-menu.json';
import type { GuestProfile, MenuItem } from '../types';

export const MENU_API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const menuImageUrl = (filename: string) =>
  `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${encodeURIComponent(filename)}?raw=true`;

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      order_updates INTEGER NOT NULL DEFAULT 1,
      special_offers INTEGER NOT NULL DEFAULT 0
    );
  `);
}

function normalizeMenu(payload: unknown): Omit<MenuItem, 'id'>[] {
  if (!payload || typeof payload !== 'object' || !('menu' in payload)) {
    throw new Error('The menu response did not include a menu list.');
  }

  const records = (payload as { menu?: unknown }).menu;
  if (!Array.isArray(records)) throw new Error('The menu list was not an array.');

  return records.flatMap((record): Omit<MenuItem, 'id'>[] => {
    if (!record || typeof record !== 'object') return [];
    const item = record as Record<string, unknown>;
    if (
      typeof item.name !== 'string' ||
      typeof item.price !== 'number' ||
      typeof item.description !== 'string' ||
      typeof item.image !== 'string' ||
      !['starters', 'mains', 'desserts'].includes(String(item.category))
    ) {
      return [];
    }

    return [{
      name: item.name,
      price: item.price,
      description: item.description,
      image: menuImageUrl(item.image),
      category: item.category as MenuItem['category'],
    }];
  });
}

async function fetchMenuFromServer(): Promise<Omit<MenuItem, 'id'>[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(MENU_API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`Menu request failed (${response.status}).`);
    const menu = normalizeMenu(await response.json());
    if (menu.length === 0) throw new Error('The menu service returned no usable items.');
    return menu;
  } finally {
    clearTimeout(timeout);
  }
}

async function saveMenu(db: SQLiteDatabase, menu: Omit<MenuItem, 'id'>[]) {
  await db.withTransactionAsync(async () => {
    for (const item of menu) {
      await db.runAsync(
        'INSERT OR REPLACE INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
        item.name,
        item.price,
        item.description,
        item.image,
        item.category,
      );
    }
  });
}

export async function loadMenu(db: SQLiteDatabase): Promise<MenuItem[]> {
  const cachedMenu = await db.getAllAsync<MenuItem>(
    'SELECT id, name, price, description, image, category FROM menu ORDER BY id',
  );
  if (cachedMenu.length > 0) return cachedMenu;

  const fallback = normalizeMenu(fallbackData);
  try {
    const remoteMenu = await fetchMenuFromServer();
    await saveMenu(db, remoteMenu);
  } catch {
    await saveMenu(db, fallback);
  }

  return db.getAllAsync<MenuItem>(
    'SELECT id, name, price, description, image, category FROM menu ORDER BY id',
  );
}

type ProfileRow = {
  first_name: string;
  last_name: string;
  email: string;
  order_updates: number;
  special_offers: number;
};

export async function readProfile(db: SQLiteDatabase): Promise<GuestProfile | null> {
  const row = await db.getFirstAsync<ProfileRow>(
    'SELECT first_name, last_name, email, order_updates, special_offers FROM user_profile WHERE id = 1',
  );
  if (!row) return null;
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    orderUpdates: row.order_updates === 1,
    specialOffers: row.special_offers === 1,
  };
}

export async function writeProfile(db: SQLiteDatabase, profile: GuestProfile) {
  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile
      (id, first_name, last_name, email, order_updates, special_offers)
     VALUES (1, ?, ?, ?, ?, ?)` ,
    profile.firstName.trim(),
    profile.lastName.trim(),
    profile.email.trim().toLowerCase(),
    Number(profile.orderUpdates),
    Number(profile.specialOffers),
  );
}

export async function clearProfile(db: SQLiteDatabase) {
  await db.runAsync('DELETE FROM user_profile WHERE id = 1');
}
