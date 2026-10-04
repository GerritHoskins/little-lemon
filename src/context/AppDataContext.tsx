import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import type { PropsWithChildren } from 'react';
import type { GuestProfile, MenuItem } from '../types';
import { clearProfile, loadMenu, readProfile, writeProfile } from '../storage/database';

type AppDataValue = {
  ready: boolean;
  profile: GuestProfile | null;
  menu: MenuItem[];
  saveProfile: (profile: GuestProfile) => Promise<void>;
  logout: () => Promise<void>;
};

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<GuestProfile | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    let mounted = true;
    async function hydrate() {
      try {
        const [storedProfile, storedMenu] = await Promise.all([readProfile(db), loadMenu(db)]);
        if (mounted) {
          setProfile(storedProfile);
          setMenu(storedMenu);
        }
      } finally {
        if (mounted) setReady(true);
      }
    }
    void hydrate();
    return () => { mounted = false; };
  }, [db]);

  const saveProfile = useCallback(async (nextProfile: GuestProfile) => {
    await writeProfile(db, nextProfile);
    setProfile({
      ...nextProfile,
      firstName: nextProfile.firstName.trim(),
      lastName: nextProfile.lastName.trim(),
      email: nextProfile.email.trim().toLowerCase(),
    });
  }, [db]);

  const logout = useCallback(async () => {
    await clearProfile(db);
    setProfile(null);
  }, [db]);

  const value = useMemo(() => ({ ready, profile, menu, saveProfile, logout }), [ready, profile, menu, saveProfile, logout]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) throw new Error('useAppData must be used inside AppDataProvider.');
  return value;
}
