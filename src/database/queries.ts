import { getDbConnection } from './db';
import { TABLE_NAMES } from './schema';

export interface Habit {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface UserStats {
  id: number;
  current_level: number;
  total_exp: number;
  weekly_points: number;
  days_completed: number;
  last_active_date?: string;
}

export interface UserProfile {
  id: number;
  name: string;
  reminder_time: string;
  notification_enabled: number;
  onboarding_completed: number;
}

export const queries = {
  // --- HABITS ---
  addHabit: async (title: string, description: string, icon: string, color: string) => {
    try {
      const db = await getDbConnection();
      const result = await db.runAsync(
        `INSERT INTO ${TABLE_NAMES.HABITS} (title, description, icon, color) VALUES (?, ?, ?, ?)`,
        [title, description, icon, color]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  },

  getAllHabits: async (): Promise<Habit[]> => {
    try {
      const db = await getDbConnection();
      return await db.getAllAsync<Habit>(`SELECT * FROM ${TABLE_NAMES.HABITS}`);
    } catch (error) {
      console.error('Error getting habits:', error);
      return [];
    }
  },

  // --- LOGS ---
  logHabit: async (habitId: number, date: string, status: 'completed' | 'skipped') => {
    try {
      const db = await getDbConnection();
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLE_NAMES.HABIT_LOGS} (habit_id, date, status) VALUES (?, ?, ?)`,
        [habitId, date, status]
      );
    } catch (error) {
      console.error('Error logging habit:', error);
      throw error;
    }
  },

  getWeeklyLogs: async (startDate: string, endDate: string) => {
    try {
      const db = await getDbConnection();
      return await db.getAllAsync(
        `SELECT * FROM ${TABLE_NAMES.HABIT_LOGS} WHERE date BETWEEN ? AND ?`,
        [startDate, endDate]
      );
    } catch (error) {
      console.error('Error getting weekly logs:', error);
      return [];
    }
  },

  // --- STATS ---
  getUserStats: async (): Promise<UserStats | null> => {
    try {
      const db = await getDbConnection();
      return await db.getFirstAsync<UserStats>(`SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1`);
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  },

  updateUserStats: async (points: number, exp: number) => {
    try {
      const db = await getDbConnection();
      await db.runAsync(
        `UPDATE ${TABLE_NAMES.USER_STATS} SET weekly_points = weekly_points + ?, total_exp = total_exp + ? WHERE id = 1`,
        [points, exp]
      );
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  // Menyelesaikan 1 hari. Jika sudah 7 hari, otomatis naik level.
  // Returns: { leveledUp: boolean, newDaysCompleted: number }
  completeDay: async (): Promise<{ leveledUp: boolean; newDaysCompleted: number }> => {
    try {
      const db = await getDbConnection();
      const stats = await db.getFirstAsync<UserStats>(`SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1`);
      const currentDays = stats?.days_completed ?? 0;
      const newDays = currentDays + 1;
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

      if (newDays >= 7) {
        // Level up! Reset days ke 0
        await db.runAsync(
          `UPDATE ${TABLE_NAMES.USER_STATS} SET days_completed = 0, current_level = current_level + 1, total_exp = total_exp + 100, last_active_date = ? WHERE id = 1`,
          [today]
        );
        return { leveledUp: true, newDaysCompleted: 0 };
      } else {
        // Increment hari saja
        await db.runAsync(
          `UPDATE ${TABLE_NAMES.USER_STATS} SET days_completed = ?, total_exp = total_exp + 10, last_active_date = ? WHERE id = 1`,
          [newDays, today]
        );
        return { leveledUp: false, newDaysCompleted: newDays };
      }
    } catch (error) {
      console.error('Error completing day:', error);
      throw error;
    }
  },

  // Cek apakah hari ini sudah Gaskeun
  hasCompletedToday: async (): Promise<boolean> => {
    try {
      const db = await getDbConnection();
      const stats = await db.getFirstAsync<UserStats>(`SELECT * FROM ${TABLE_NAMES.USER_STATS} WHERE id = 1`);
      const today = new Date().toISOString().split('T')[0];
      return stats?.last_active_date === today;
    } catch (error) {
      console.error('Error checking today completion:', error);
      return false;
    }
  },

  // --- PROFILE ---
  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      const db = await getDbConnection();
      return await db.getFirstAsync<UserProfile>(`SELECT * FROM ${TABLE_NAMES.USER_PROFILE} WHERE id = 1`);
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  saveUserProfile: async (name: string, reminderTime: string) => {
    try {
      const db = await getDbConnection();
      await db.runAsync(
        `INSERT OR REPLACE INTO ${TABLE_NAMES.USER_PROFILE} (id, name, reminder_time, notification_enabled, onboarding_completed) VALUES (1, ?, ?, 1, 1)`,
        [name, reminderTime]
      );
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (name: string, reminderTime: string, notificationEnabled: boolean) => {
    try {
      const db = await getDbConnection();
      await db.runAsync(
        `UPDATE ${TABLE_NAMES.USER_PROFILE} SET name = ?, reminder_time = ?, notification_enabled = ? WHERE id = 1`,
        [name, reminderTime, notificationEnabled ? 1 : 0]
      );
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  resetProgress: async () => {
    try {
      const db = await getDbConnection();
      // Reset stats
      await db.runAsync(`UPDATE ${TABLE_NAMES.USER_STATS} SET current_level = 1, total_exp = 0, weekly_points = 0, days_completed = 0 WHERE id = 1`);
      // Clear logs
      await db.runAsync(`DELETE FROM ${TABLE_NAMES.HABIT_LOGS}`);
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }
};
