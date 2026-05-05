export const SCHEMA = `
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT CHECK(status IN ('completed', 'skipped')) NOT NULL,
    FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_stats (
    id INTEGER PRIMARY KEY,
    current_level INTEGER DEFAULT 1,
    total_exp INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    days_completed INTEGER DEFAULT 0,
    last_active_date TEXT
  );

  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL,
    reminder_time TEXT DEFAULT '08:00',
    notification_enabled INTEGER DEFAULT 1,
    onboarding_completed INTEGER DEFAULT 0
  );

  -- Pastikan ada data awal untuk id 1
  INSERT OR IGNORE INTO user_stats (id, current_level, total_exp, weekly_points) 
  VALUES (1, 1, 0, 0);
`;

export const TABLE_NAMES = {
  HABITS: 'habits',
  HABIT_LOGS: 'habit_logs',
  USER_STATS: 'user_stats',
  USER_PROFILE: 'user_profile',
};
