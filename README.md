# 🚀 Gaskeun — Habit Journey Tracker

> **"Gak perlu sempurna, yang penting gaskeun aja dulu!"** 🔥

Gaskeun adalah aplikasi mobile *habit tracker* yang dirancang dengan pendekatan gamifikasi unik. Berbeda dengan aplikasi habit biasa, Gaskeun mengajak kamu berpetualang melalui peta dunia 3D, di mana setiap level adalah tantangan nyata untuk memperbaiki kualitas hidupmu.

![Gaskeun Banner](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge)
![React Native](https://img.shields.io/badge/React_Native-Expo-blue?style=for-the-badge&logo=react)
![SQLite](https://img.shields.io/badge/Database-SQLite-green?style=for-the-badge&logo=sqlite)

---

## ✨ Fitur Unggulan

### 🗺️ 3D Isometric Journey Map
Visualisasi progres dalam bentuk tangga 3D (Isometric Staircase) dengan tema pastel yang menyejukkan mata. Setiap langkah di peta mewakili level yang telah kamu taklukkan.

### 📅 Weekly Mastery System (1 Level = 7 Hari)
Membangun habit bukan soal satu malam. Di Gaskeun, kamu harus menyelesaikan tantangan yang sama selama **7 hari berturut-turut** sebelum bisa naik ke level berikutnya. Konsistensi adalah kunci!

### 🔒 Anti-Cheating Daily Cooldown
Tombol "Gaskeun!" memiliki fitur hitung mundur (*cooldown*). Kamu hanya bisa menandai satu hari selesai per hari. Jika sudah, tombol akan terkunci dan menampilkan hitung mundur hingga tengah malam.

### 💬 Daily Motivational Quotes
Setiap hari di setiap level, kamu akan mendapatkan kalimat semangat yang berbeda untuk menemani perjuanganmu membangun kebiasaan baru.

### ⚙️ Premium Settings & Onboarding
- **Onboarding Interaktif**: Alur perkenalan yang personal untuk mengambil nama dan waktu pengingat.
- **Custom Time Picker**: Pengatur waktu notifikasi dengan UI panah yang interaktif.
- **Privacy First**: Semua data disimpan secara lokal di perangkatmu menggunakan SQLite. Tidak ada cloud, tidak ada tracking.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Database**: [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (Offline-first)
- **Navigation**: [React Navigation v6](https://reactnavigation.org/)
- **Styling**: Vanilla StyleSheet with Premium Pastel Palette

---

## 🚀 Cara Menjalankan Project

1. **Clone Repository**
   ```bash
   git clone https://github.com/CHELVYN01/Gaskeun.git
   cd Gaskeun
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Jalankan Aplikasi**
   ```bash
   npx expo start
   ```
   *Gunakan aplikasi **Expo Go** di Android/iOS untuk scan QR Code.*

---

## 📂 Struktur Folder
```text
src/
├── components/     # UI Components Reusable
├── screens/        # Halaman Utama (Home, Level, Onboarding, dll)
├── database/       # SQLite Logic (db.ts, schema.ts, queries.ts)
├── data/           # Konten Statis (Levels, Challenges, Quotes)
├── theme/          # Color Palette & Design Tokens
└── navigation/     # App Navigation Configuration
```

---

## 📜 Filosofi Gaskeun
Aplikasi ini dibangun untuk mereka yang seringkali takut memulai karena mengejar kesempurnaan. Gaskeun percaya bahwa **progres kecil yang konsisten jauh lebih baik daripada rencana besar yang tidak pernah dijalankan.**

---

*Made with 🔥 by Gaskeun Team*
