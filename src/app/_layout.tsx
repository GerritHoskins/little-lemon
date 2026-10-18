import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider, useAppData } from '../context/AppDataContext';
import { initializeDatabase } from '../storage/database';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="little_lemon.db" onInit={initializeDatabase}>
        <AppDataProvider>
          <StatusBar style="dark" />
          <AppNavigator />
        </AppDataProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}

function AppNavigator() {
  const { profile } = useAppData();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas }, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={profile === null}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Protected guard={profile !== null}>
        <Stack.Screen name="home" />
        <Stack.Screen name="profile" />
      </Stack.Protected>
    </Stack>
  );
}
