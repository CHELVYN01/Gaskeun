import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/database/db';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize Database (Rule #3)
        await initDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.warn('Initialization error:', e);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
