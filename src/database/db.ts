import * as SQLite from 'expo-sqlite';
import { SCHEMA } from './schema';

const DATABASE_NAME = 'gaskeun.db';
let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDbConnection = async () => {
  if (dbInstance) return dbInstance;
  
  dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return dbInstance;
};

export const initDatabase = async () => {
  try {
    const db = await getDbConnection();
    
    // Gunakan execAsync untuk menjalankan seluruh skema sekaligus
    await db.execAsync(SCHEMA);
    
    // Migrasi: Tambahkan kolom notification_enabled jika belum ada
    try {
      await db.execAsync('ALTER TABLE user_profile ADD COLUMN notification_enabled INTEGER DEFAULT 1;');
      console.log('Migration: Added notification_enabled column 🛠️');
    } catch (e) {
      // Abaikan jika kolom sudah ada
    }

    // Migrasi: Tambahkan kolom days_completed untuk tracking mingguan
    try {
      await db.execAsync('ALTER TABLE user_stats ADD COLUMN days_completed INTEGER DEFAULT 0;');
      console.log('Migration: Added days_completed column 🛠️');
    } catch (e) {
      // Abaikan jika kolom sudah ada
    }
    
    console.log('Database initialized successfully 🚀');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};
