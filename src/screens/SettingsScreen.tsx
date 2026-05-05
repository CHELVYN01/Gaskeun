import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queries, UserProfile } from '../database/queries';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await queries.getUserProfile();
    if (data) {
      setProfile(data);
      setName(data.name);
      const [h, m] = data.reminder_time.split(':');
      setHour(h || '08');
      setMinute(m || '00');
      setNotifEnabled(data.notification_enabled === 1);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (name.trim().length < 2) {
        alert('Nama minimal 2 karakter ya!');
        return;
      }
      const newReminderTime = `${hour}:${minute}`;
      await queries.updateUserProfile(name, newReminderTime, notifEnabled);
      setShowSuccess(true);
      // Sembunyikan otomatis setelah 2 detik
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal simpan data.');
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      "⚠ Reset Progress?",
      "Semua level dan log harianmu akan dihapus secara permanen. Kamu yakin mau mulai dari nol lagi?",
      [
        { text: "Jangan!", style: "cancel" },
        { 
          text: "Ya, Reset", 
          style: "destructive",
          onPress: async () => {
            await queries.resetProgress();
            alert('Progress berhasil direset. Gaskeun dari awal! 🚀');
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan</Text>
        <TouchableOpacity onPress={handleSaveProfile} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Simpan</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROFIL & REMINDER</Text>
          <SettingItem label="Ganti Nama">
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nickname kamu"
            />
          </SettingItem>
          <SettingItem label="Waktu Notif">
            <TouchableOpacity 
              style={styles.timeValueBox}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeValueText}>{hour}:{minute}</Text>
            </TouchableOpacity>
          </SettingItem>
        </View>

        {/* Notification Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFIKASI</Text>
          <SettingItem label="Matikan Notif">
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.secondary }}
              thumbColor={notifEnabled ? COLORS.surface : '#f4f3f4'}
            />
          </SettingItem>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>ZONA BAHAYA</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleResetProgress}>
            <Text style={styles.dangerButtonText}>Reset Semua Progress</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TENTANG</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutBrand}>Gaskeun v1.0.0</Text>
            <Text style={styles.aboutText}>
              Gaskeun adalah aplikasi habit journey yang fokus pada aksi nyata, bukan sekadar rencana. 
              Dibuat untuk kamu yang ingin mulai perubahan kecil setiap harinya.
            </Text>
            <Text style={styles.philosophyTitle}>Filosofi Gaskeun:</Text>
            <Text style={styles.aboutText}>
              "Gak perlu sempurna, yang penting gaskeun aja dulu!" 🚀
            </Text>
          </View>
        </View>

        <Text style={styles.footerText}>Made with 🔥 by Gaskeun Team</Text>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal transparent visible={showTimePicker} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.timePickerCard}>
            <Text style={styles.modalTitle}>Set Waktu Notif</Text>
            <View style={styles.timePickerRow}>
              <View style={styles.timeColumn}>
                <TouchableOpacity onPress={() => {
                  let h = parseInt(hour);
                  h = (h + 1) % 24;
                  setHour(h.toString().padStart(2, '0'));
                }}><Text style={styles.arrowIcon}>▲</Text></TouchableOpacity>
                <Text style={styles.timeText}>{hour}</Text>
                <TouchableOpacity onPress={() => {
                  let h = parseInt(hour);
                  h = (h - 1 + 24) % 24;
                  setHour(h.toString().padStart(2, '0'));
                }}><Text style={styles.arrowIcon}>▼</Text></TouchableOpacity>
              </View>
              <Text style={styles.timeSeparator}>:</Text>
              <View style={styles.timeColumn}>
                <TouchableOpacity onPress={() => {
                  let m = parseInt(minute);
                  m = (m + 5) % 60;
                  setMinute(m.toString().padStart(2, '0'));
                }}><Text style={styles.arrowIcon}>▲</Text></TouchableOpacity>
                <Text style={styles.timeText}>{minute}</Text>
                <TouchableOpacity onPress={() => {
                  let m = parseInt(minute);
                  m = (m - 5 + 60) % 60;
                  setMinute(m.toString().padStart(2, '0'));
                }}><Text style={styles.arrowIcon}>▼</Text></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeModalBtn} 
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.closeModalBtnText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>L</Text> 
              {/* L diputar 45 derajat atau pake emoji centang ✅ */}
              <Text style={{ fontSize: 40 }}>✅</Text>
            </View>
            <Text style={styles.successText}>Berhasil Disimpan!</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  saveBtnText: {
    color: COLORS.textOnPrimary,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 16,
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  timeValueBox: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  timePickerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 32,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 24,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  timeColumn: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 10,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#94A3B8',
    padding: 10,
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginHorizontal: 15,
  },
  closeModalBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: COLORS.textOnPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  dangerButtonText: {
    color: '#B91C1C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  aboutCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aboutBrand: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  philosophyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: COLORS.surface,
    padding: 32,
    borderRadius: 32,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7', // Light green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    display: 'none', // Sembunyikan placeholder L, pake emoji aja biar simpel & cantik
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

const SettingItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingLabel}>{label}</Text>
    {children}
  </View>
);

export default SettingsScreen;
