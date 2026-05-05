import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState, useRef } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Level, LEVELS } from '../data/levels';
import { queries, UserStats, UserProfile } from '../database/queries';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Label hari untuk ilustrasi mingguan
const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const DAY_EMOJIS = ['🌱', '🌿', '🌳', '💪', '🔥', '⭐', '🏆'];

// Hitung sisa waktu sampai tengah malam
const getTimeUntilMidnight = (): { hours: number; minutes: number; seconds: number; totalMs: number } => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    totalMs: diff,
  };
};

const HomeScreen = ({ navigation }: Props) => {
  const [currentLevelData, setCurrentLevelData] = useState<Level | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'confirm' | 'success' | 'levelup'>('confirm');
  const [completedToday, setCompletedToday] = useState(false);
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  // Countdown timer
  useEffect(() => {
    if (completedToday) {
      timerRef.current = setInterval(() => {
        const time = getTimeUntilMidnight();
        setCountdown(time);
        // Kalau sudah lewat tengah malam, reset
        if (time.totalMs <= 0) {
          setCompletedToday(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [completedToday]);

  const loadUserData = async () => {
    try {
      const stats = await queries.getUserStats();
      setUserStats(stats);

      const profile = await queries.getUserProfile();
      setUserProfile(profile);

      const levelId = stats?.current_level || 1;
      const level = LEVELS.find(l => l.id === levelId);
      setCurrentLevelData(level || LEVELS[0]);

      // Cek apakah hari ini sudah Gaskeun
      const done = await queries.hasCompletedToday();
      setCompletedToday(done);
      if (done) {
        setCountdown(getTimeUntilMidnight());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleCompleteChallenge = () => {
    if (completedToday) return; // Safety guard
    setModalType('confirm');
    setIsModalVisible(true);
  };

  const confirmCompleteDay = async () => {
    try {
      const result = await queries.completeDay();
      setIsModalVisible(false);
      setCompletedToday(true);
      setCountdown(getTimeUntilMidnight());

      // Tampilkan modal sukses
      setTimeout(() => {
        if (result.leveledUp) {
          setModalType('levelup');
        } else {
          setModalType('success');
        }
        setIsModalVisible(true);
        loadUserData();
      }, 300);
    } catch (error) {
      console.error('Error completing day:', error);
    }
  };

  const daysCompleted = userStats?.days_completed ?? 0;
  const currentQuote = currentLevelData?.dailyQuotes?.[daysCompleted] || 'Gaskeun aja dulu! 🔥';

  // Format countdown
  const countdownText = `${String(countdown.hours).padStart(2, '0')}:${String(countdown.minutes).padStart(2, '0')}:${String(countdown.seconds).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.greeting}>Halo, {userProfile?.name || 'Temen'}!</Text>
            <Text style={styles.quote}>"{currentQuote}"</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.profileEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Level Card */}
        <TouchableOpacity
          style={styles.levelCard}
          onPress={() => navigation.navigate('Level', { levelId: userStats?.current_level || 1 })}
        >
          <Text style={styles.levelLabel}>PROGRESS PERJALANAN</Text>
          <Text style={styles.levelTitle}>{currentLevelData?.emoji} {currentLevelData?.title}: {currentLevelData?.theme}</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${((userStats?.current_level || 1) / 10) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>Level {userStats?.current_level || 1} dari 10 Level</Text>
        </TouchableOpacity>

        {/* Weekly Tracker */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Progress Minggu Ini</Text>
          <Text style={styles.sectionSubtitle}>Hari ke-{daysCompleted + 1} dari 7</Text>
        </View>

        <View style={styles.weeklyCard}>
          <View style={styles.daysRow}>
            {DAY_LABELS.map((label, index) => {
              const isCompleted = index < daysCompleted;
              const isCurrent = index === daysCompleted;
              const isLocked = index > daysCompleted;

              return (
                <View key={index} style={styles.dayItem}>
                  <View style={[
                    styles.dayCircle,
                    isCompleted && styles.dayCompleted,
                    isCurrent && styles.dayCurrent,
                    isLocked && styles.dayLocked,
                  ]}>
                    <Text style={[
                      styles.dayEmoji,
                      isLocked && { opacity: 0.3 },
                    ]}>
                      {isCompleted ? '✅' : DAY_EMOJIS[index]}
                    </Text>
                  </View>
                  <Text style={[
                    styles.dayLabel,
                    isCurrent && styles.dayLabelCurrent,
                  ]}>{label}</Text>
                  {isCurrent && <View style={styles.currentDot} />}
                </View>
              );
            })}
          </View>

          <View style={styles.weeklyProgressContainer}>
            <View style={[styles.weeklyProgressBar, { width: `${(daysCompleted / 7) * 100}%` }]} />
          </View>
          <Text style={styles.weeklyProgressText}>
            {daysCompleted === 0 ? 'Belum mulai minggu ini' :
             daysCompleted < 7 ? `${daysCompleted}/7 hari selesai` :
             'Minggu ini selesai! 🎉'}
          </Text>
        </View>

        {/* Challenge Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tantangan Hari Ini</Text>
        </View>

        {currentLevelData && (
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <View style={styles.iconCircle}>
                <Text style={styles.challengeIcon}>{currentLevelData.emoji}</Text>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTheme}>{currentLevelData.theme}</Text>
                <Text style={styles.challengeText}>{currentLevelData.challenge}</Text>
              </View>
            </View>

            {/* Tombol Gaskeun / Countdown */}
            {completedToday ? (
              <View style={styles.cooldownContainer}>
                <View style={styles.cooldownBadge}>
                  <Text style={styles.cooldownCheck}>✅</Text>
                  <Text style={styles.cooldownDoneText}>Hari ini sudah selesai!</Text>
                </View>
                <View style={styles.countdownBox}>
                  <Text style={styles.countdownLabel}>Tantangan berikutnya dalam</Text>
                  <Text style={styles.countdownTimer}>{countdownText}</Text>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleCompleteChallenge}
              >
                <Text style={styles.completeButtonText}>Gaskeun! 🔥</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Selesaikan tantangan ini selama 7 hari berturut-turut untuk naik level! 🚀
          </Text>
        </View>
      </ScrollView>

      {/* === MODALS === */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === 'confirm' && (
              <>
                <Text style={styles.modalEmoji}>✊</Text>
                <Text style={styles.modalTitle}>Hari ke-{daysCompleted + 1} Selesai?</Text>
                <Text style={styles.modalDescription}>
                  Kamu yakin sudah menyelesaikan tantangan hari ini?
                </Text>
                <TouchableOpacity style={styles.modalPrimaryButton} onPress={confirmCompleteDay}>
                  <Text style={styles.modalPrimaryButtonText}>Gaskeun! 🔥</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSecondaryButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalSecondaryButtonText}>Nanti Dulu</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === 'success' && (
              <>
                <View style={styles.successCircle}>
                  <Text style={{ fontSize: 40 }}>✅</Text>
                </View>
                <Text style={styles.modalTitle}>Mantap!</Text>
                <Text style={styles.modalDescription}>
                  {currentLevelData?.dailyQuotes?.[(userStats?.days_completed ?? 1) - 1] || 'Kamu hebat! Gaskeun lagi besok!'}
                </Text>
                <TouchableOpacity style={styles.modalPrimaryButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalPrimaryButtonText}>Oke! 👍</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === 'levelup' && (
              <>
                <Text style={styles.modalEmoji}>🎉</Text>
                <Text style={styles.modalTitle}>LEVEL UP!</Text>
                <Text style={styles.modalDescription}>
                  7 hari penuh! Kamu berhasil naik ke Level {(userStats?.current_level || 1)}! Siap tantangan baru? 🚀
                </Text>
                <TouchableOpacity style={styles.modalPrimaryButton} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalPrimaryButtonText}>Gaskeun Level Baru! 🔥</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  quote: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
    maxWidth: 280,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileEmoji: {
    fontSize: 22,
  },
  levelCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  levelLabel: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  levelTitle: {
    color: COLORS.textOnPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 16,
  },
  progressContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    color: COLORS.textOnPrimary,
    fontSize: 12,
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  weeklyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayItem: {
    alignItems: 'center',
    flex: 1,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: COLORS.surfaceVariant,
  },
  dayCompleted: {
    backgroundColor: '#DCFCE7',
  },
  dayCurrent: {
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  dayLocked: {
    backgroundColor: '#F1F5F9',
  },
  dayEmoji: {
    fontSize: 18,
  },
  dayLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  dayLabelCurrent: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  currentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 2,
  },
  weeklyProgressContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  weeklyProgressBar: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 3,
  },
  weeklyProgressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  challengeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  challengeIcon: {
    fontSize: 28,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTheme: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  challengeText: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 4,
  },
  completeButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- Cooldown / Countdown ---
  cooldownContainer: {
    alignItems: 'center',
  },
  cooldownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  cooldownCheck: {
    fontSize: 18,
    marginRight: 8,
  },
  cooldownDoneText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
  },
  countdownBox: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  countdownLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  countdownTimer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },

  // --- Footer ---
  footer: {
    marginTop: 32,
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },

  // --- Modals ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  modalPrimaryButton: {
    backgroundColor: COLORS.secondary,
    width: '100%',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalPrimaryButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSecondaryButton: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default HomeScreen;
