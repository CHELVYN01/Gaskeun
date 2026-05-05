/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Mengecek apakah sebuah tanggal adalah hari ini
 */
export const isToday = (dateString: string): boolean => {
  const today = getTodayString();
  return dateString === today;
};

/**
 * Mendapatkan daftar tanggal dalam minggu ini (Senin - Minggu)
 */
export const getCurrentWeekDates = (): string[] => {
  const today = new Date();
  const day = today.getDay(); // 0 (Minggu) - 6 (Sabtu)
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Penyesuaian ke Senin
  
  const monday = new Date(today.setDate(diff));
  const weekDates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    weekDates.push(nextDay.toISOString().split('T')[0]);
  }
  
  return weekDates;
};

/**
 * Helper untuk nama hari dalam Bahasa Indonesia
 */
export const getDayName = (dateString: string): string => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const date = new Date(dateString);
  return days[date.getDay()];
};
