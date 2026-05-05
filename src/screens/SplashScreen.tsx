import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';
import { queries } from '../database/queries';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({ navigation }: Props) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Navigate after 2 seconds
    const timer = setTimeout(async () => {
      try {
        const profile = await queries.getUserProfile();
        if (profile && profile.onboarding_completed === 1) {
          navigation.replace('Home');
        } else {
          navigation.replace('Onboarding');
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        navigation.replace('Onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>🚀</Text>
        <Text style={styles.title}>Gaskeun</Text>
        <Text style={styles.subtitle}>Gak perlu sempurna, yang penting gaskeun aja dulu!</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textOnPrimary,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
});

export default SplashScreen;
