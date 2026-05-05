import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';
import { queries } from '../database/queries';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_QUOTES = [
  "Oi, hp-nya udah kebuka, berarti bisa gaskeun dong?",
  "Eh masih hidup? Bagus, yuk ngapa-ngapain dikit!",
  "Bukan TikTok, tapi lebih seru kok... promise! 😉",
  "Halo bestie, yuk gerak dikit biar gak karatan!",
  "Udah mandi belum? Jangan jawab kalau belum 😂",
  "Santai, gak ada yang judge di sini!",
  "Pelan-pelan gapapa, yang penting gaskeun!",
  "Hari ini cukup lakuin 1 hal aja, itu udah keren!",
  "Kamu buka app ini = udah lebih baik dari kemarin!",
  "Yok, kita gaskeun bareng — gak sendirian kok!",
  "Pssst... tempat tidurnya belum dirapiin ya? 👀",
  "Gaskeun bukan soal sempurna, tapi soal konsisten!",
  "Bismillah dulu, baru gaskeun!",
  "Versi kamu yang lebih baik cuma butuh 5 menit hari ini!",
  "Gak usah overthinking, lakuin aja dulu!",
  "Kalau bukan sekarang, kapan? Kalau bukan kamu, siapa?",
  "Hai! Temenmu (app ini) kangen kamu gaskeun 😄",
  "Hari ini adalah hari yang tepat untuk mulai!",
  "Progress kecil tetap progress. Ayo gaskeun!",
  "Kamu lebih tangguh dari yang kamu kira. Gaskeun!"
];

const SplashScreen = ({ navigation }: Props) => {
  const [randomQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * SPLASH_QUOTES.length);
    return SPLASH_QUOTES[randomIndex];
  });

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Animasi muncul
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(async () => {
      try {
        const profile = await queries.getUserProfile();
        if (profile && profile.onboarding_completed === 1) {
          navigation.replace('Home');
        } else {
          navigation.replace('Onboarding');
        }
      } catch (error) {
        console.error('Splash error:', error);
        navigation.replace('Onboarding');
      }
    }, 3000); // 3 detik biar sempat baca quote

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>🚀</Text>
        <Text style={styles.appName}>GASKEUN</Text>
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteText}>{randomQuote}</Text>
        </View>
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
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textOnPrimary,
    letterSpacing: 4,
    marginBottom: 40,
  },
  quoteContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quoteText: {
    fontSize: 16,
    color: COLORS.textOnPrimary,
    textAlign: 'center',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default SplashScreen;
