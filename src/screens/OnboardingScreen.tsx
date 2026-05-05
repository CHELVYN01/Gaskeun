import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queries } from '../database/queries';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');

  const handleNext = () => {
    if (step === 1) {
      if (name.trim().length < 2) {
        alert('Nama minimal 2 karakter ya! 😉');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFinish = async () => {
    try {
      const reminderTime = `${hour}:${minute}`;
      await queries.saveUserProfile(name, reminderTime);
      navigation.replace('Home');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal simpan data. Coba lagi ya!');
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>👀</Text>
      <Text style={styles.title}>Hei! Siapa nih yang mau gaskeun?</Text>
      <TextInput
        style={styles.input}
        placeholder="Ketik namamu di sini..."
        placeholderTextColor="#94A3B8"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Lanjut!</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>⏰</Text>
      <Text style={styles.title}>Sip {name}! Mau diingetin jam berapa nih?</Text>
      
      <View style={styles.timePickerContainer}>
        <View style={styles.timeColumn}>
          <TouchableOpacity onPress={() => {
            let h = parseInt(hour);
            h = (h + 1) % 24;
            setHour(h.toString().padStart(2, '0'));
          }}>
            <Text style={styles.timeArrow}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>{hour}</Text>
          <TouchableOpacity onPress={() => {
            let h = parseInt(hour);
            h = (h - 1 + 24) % 24;
            setHour(h.toString().padStart(2, '0'));
          }}>
            <Text style={styles.timeArrow}>▼</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.timeSeparator}>:</Text>
        
        <View style={styles.timeColumn}>
          <TouchableOpacity onPress={() => {
            let m = parseInt(minute);
            m = (m + 5) % 60;
            setMinute(m.toString().padStart(2, '0'));
          }}>
            <Text style={styles.timeArrow}>▲</Text>
          </TouchableOpacity>
          <Text style={styles.timeText}>{minute}</Text>
          <TouchableOpacity onPress={() => {
            let m = parseInt(minute);
            m = (m - 5 + 60) % 60;
            setMinute(m.toString().padStart(2, '0'));
          }}>
            <Text style={styles.timeArrow}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Mantap!</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.title}>Oke siap! Gaskeun yuk!</Text>
      <Text style={styles.description}>
        Kita bakal mulai petualangan habit kamu bareng-bareng. Jangan lupa cek tantangan tiap hari ya!
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleFinish}>
        <Text style={styles.primaryButtonText}>Mulai Petualangan 🚀</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  stepContainer: {
    alignItems: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: COLORS.text,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 32,
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#E2E8F0',
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
  timeArrow: {
    fontSize: 24,
    color: '#94A3B8',
    padding: 10,
  },
  timeSeparator: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
