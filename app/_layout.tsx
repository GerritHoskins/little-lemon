import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from '../src/context/AppDataContext';
import { initializeDatabase } from '../src/storage/database';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="little_lemon.db" onInit={initializeDatabase}>
        <AppDataProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas }, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="home" />
            <Stack.Screen name="profile" />
          </Stack>
        </AppDataProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
