import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import COLORS from '../theme/colors';
import { CHAPTERS, Level } from '../data/levels';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TILE_SIZE = width * 0.4; // Ukuran kotak tangga

type Props = NativeStackScreenProps<RootStackParamList, 'Level'>;

const LevelScreen = ({ navigation, route }: Props) => {
  const { levelId } = route.params;
  const currentChapter = CHAPTERS[0];

  // Pola arah tangga: Kiri -> Tengah -> Kanan -> Tengah -> Kiri
  const getAlignment = (index: number) => {
    const pattern = ['flex-start', 'center', 'flex-end', 'center'];
    return pattern[index % pattern.length] as 'flex-start' | 'center' | 'flex-end';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backButtonText}>← Kembali</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.chapterTitle}>{currentChapter.title}</Text>
          <Text style={styles.chapterDesc}>{currentChapter.description}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.mapContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Render dari bawah ke atas */}
        {currentChapter.levels.slice().reverse().map((level, reversedIndex) => {
          const originalIndex = currentChapter.levels.length - 1 - reversedIndex;
          
          const isUnlocked = level.id <= levelId;
          const isCurrent = level.id === levelId;
          const isLocked = level.id > levelId;
          const isCompleted = level.id < levelId;

          const alignment = getAlignment(originalIndex);
          // Pola warna catur (selang-seling) tapi sangat halus (Soft Pastel)
          const isDarkSquare = originalIndex % 2 === 0;

          // Menentukan warna ubin berdasarkan status
          let topColor = isDarkSquare ? '#E0E7FF' : '#D1FAE5'; // Soft Indigo vs Soft Emerald
          let sideColor = isDarkSquare ? '#C7D2FE' : '#A7F3D0'; // Bayangan 3D yang lembut
          let textColor = isDarkSquare ? '#3730A3' : '#064E3B'; // Teks gelap

          if (isLocked) {
            topColor = '#F1F5F9';
            sideColor = '#CBD5E1';
            textColor = COLORS.textMuted;
          }

          if (isCurrent) {
            topColor = '#FEF3C7'; // Pastel Amber
            sideColor = '#FBBF24'; // Bayangan Amber
            textColor = '#92400E'; // Teks Amber gelap
          }

          return (
            <View 
              key={level.id} 
              style={[
                styles.stepWrapper, 
                { alignItems: alignment }
              ]}
            >
              <TouchableOpacity
                style={styles.stairBlock}
                onPress={() => isUnlocked && console.log('Level:', level.id)}
                disabled={isLocked}
                activeOpacity={0.9}
              >
                {/* 3D Depth (Sisi Bawah Tangga) */}
                <View style={[styles.stairDepth, { backgroundColor: sideColor }]} />
                
                {/* Permukaan Tangga (Top Surface) */}
                <View style={[
                  styles.stairSurface, 
                  { backgroundColor: topColor },
                  isCurrent && styles.stairSurfaceCurrent
                ]}>
                  {/* Efek Catur: Garis pinggir tipis */}
                  <View style={styles.chessBorder}>
                    <Text style={[styles.stepEmoji, isLocked && { opacity: 0.4 }]}>
                      {isCompleted ? '⭐' : (isLocked ? '🔒' : level.emoji)}
                    </Text>
                    
                    <Text style={[styles.stepNumber, { color: textColor }]}>
                      Level {level.id}
                    </Text>
                    
                    <Text style={[styles.stepTheme, { color: textColor }]} numberOfLines={2}>
                      {level.theme}
                    </Text>
                    
                    {isCurrent && (
                      <View style={styles.pinIndicator}>
                        <Text style={styles.pinText}>📍</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Landasan Mulai */}
        <View style={styles.startPlatform}>
          <Text style={styles.startPlatformText}>LANTAI DASAR</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Latar belakang putih bersih/halus
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  backButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  chapterDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  mapContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 80,
  },
  stepWrapper: {
    width: '100%',
    marginBottom: -15, // Negative margin agar ujung tangga terlihat menumpuk (efek 3D)
    zIndex: 1, // Z-index akan diatur otomatis dari urutan render
  },
  stairBlock: {
    width: TILE_SIZE,
    height: TILE_SIZE,
  },
  stairDepth: {
    position: 'absolute',
    top: 15, // Menggeser bayangan ke bawah untuk efek ketebalan 3D
    left: 0,
    right: 0,
    bottom: -15,
    borderRadius: 16,
  },
  stairSurface: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 4,
  },
  stairSurfaceCurrent: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chessBorder: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)', // Garis putih halus di atas warna pastel
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  stepEmoji: {
    fontSize: 38,
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  stepTheme: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
  },
  pinIndicator: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: '#FFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4,
  },
  pinText: {
    fontSize: 16,
  },
  startPlatform: {
    marginTop: 60,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 16,
    borderBottomWidth: 6,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  startPlatformText: {
    color: '#94A3B8',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
});

export default LevelScreen;
