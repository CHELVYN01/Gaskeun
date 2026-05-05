import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../theme/colors';

interface LevelCardProps {
  levelNumber: number;
  title: string;
  progress: number;
  onPress?: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ levelNumber, title, progress, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <Text style={styles.levelLabel}>LEVEL {levelNumber}</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.progressWrapper}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: COLORS.surfaceVariant,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    width: 32,
  },
});

export default LevelCard;
