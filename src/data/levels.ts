export interface Level {
  id: number;
  title: string;
  theme: string;
  emoji: string;
  challenge: string;
  dailyQuotes: string[]; // 7 kalimat semangat, satu untuk setiap hari
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  levels: Level[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Chapter 1: Fondasi Diri",
    description: "Membangun kebiasaan dasar untuk hidup yang lebih tertata.",
    levels: [
      {
        id: 1, title: "Level 1", theme: "Tidur Bersih", emoji: "🌙",
        challenge: "Matikan lampu kamar mandi sebelum tidur",
        dailyQuotes: [
          "Langkah pertama selalu yang paling berani. Kamu sudah mulai! 💪",
          "Hari ke-2, kamu masih di sini. Itu sudah luar biasa!",
          "Setengah minggu sudah lewat. Keep going! 🔥",
          "Hari ke-4, kebiasaan mulai terbentuk nih!",
          "5 hari berturut-turut! Kamu konsisten banget!",
          "Tinggal 2 hari lagi. Kamu pasti bisa! ⭐",
          "LUAR BIASA! 7 hari penuh! Level Up! 🎉🚀",
        ]
      },
      {
        id: 2, title: "Level 2", theme: "Pagi Rapi", emoji: "☀️",
        challenge: "Bereskan tempat tidur setiap bangun pagi",
        dailyQuotes: [
          "Pagi baru, semangat baru! Gaskeun! ☀️",
          "Hari ke-2, rapiin kasur = rapiin hidup!",
          "3 hari! Tubuhmu mulai terbiasa nih 💪",
          "Setengah perjalanan, kamu keren banget!",
          "5 hari! Ini bukan kebetulan, ini komitmen! 🔥",
          "Besok terakhir! Tahan sedikit lagi! ⭐",
          "SEMPURNA! Kamu Master Pagi Rapi! 🎉🚀",
        ]
      },
      {
        id: 3, title: "Level 3", theme: "Rawat Diri", emoji: "💧",
        challenge: "Minum 1 gelas air putih setelah bangun",
        dailyQuotes: [
          "Satu gelas air = satu langkah sehat! 💧",
          "Hari ke-2 minum air! Badanmu berterima kasih!",
          "3 hari berturut-turut! Sel tubuhmu happy! 🌊",
          "Sudah jadi kebiasaan belum? Hampir! 💪",
          "5 hari! Kulit dan tubuhmu makin fresh! ✨",
          "Satu hari lagi menuju kemenangan!",
          "7 HARI! Tubuhmu sekarang sudah terprogram! 🎉🚀",
        ]
      },
      {
        id: 4, title: "Level 4", theme: "Rumah Bersih", emoji: "🗑️",
        challenge: "Buang sampah setiap sore (jam 17.00)",
        dailyQuotes: [
          "Rumah bersih, pikiran jernih! Mulai hari ini 🏠",
          "Hari ke-2! Semakin rajin nih!",
          "3 hari! Tetangga pasti iri sama kebersihanmu 😄",
          "Setengah minggu, sudah auto pilot! 🚀",
          "5 hari konsisten! Lingkunganmu jadi lebih nyaman!",
          "Hampir sampai! Besok kita rayakan! ⭐",
          "MANTAP! Rumah bersih master unlocked! 🎉🏆",
        ]
      },
      {
        id: 5, title: "Level 5", theme: "Makan Teratur", emoji: "🍽️",
        challenge: "Sarapan setiap pagi sebelum jam 9",
        dailyQuotes: [
          "Sarapan = bahan bakar otak! Ayo mulai! 🍳",
          "2 hari sarapan! Perutmu senang! 😋",
          "3 hari! Energimu pasti lebih stabil!",
          "Setengah jalan! Tubuhmu mulai terbiasa! 💪",
          "5 hari sarapan teratur! Kamu keren! 🔥",
          "Satu hari lagi! Jangan menyerah! ⭐",
          "JUARA! Sarapan teratur sudah jadi bagian hidupmu! 🎉🚀",
        ]
      },
      {
        id: 6, title: "Level 6", theme: "Spiritual", emoji: "🙏",
        challenge: "Berdoa pagi dan malam hari",
        dailyQuotes: [
          "Mulai hari dengan hati yang tenang 🙏",
          "Hari ke-2, koneksimu makin kuat!",
          "3 hari! Ketenangan mulai terasa di hati ✨",
          "Setengah minggu dalam kedamaian! 🕊️",
          "5 hari! Jiwamu makin kuat dan tenang!",
          "Hampir sampai! Kamu luar biasa! 💫",
          "INDAH! Spiritualmu naik level! 🎉🌟",
        ]
      },
      {
        id: 7, title: "Level 7", theme: "Bersih Rutin", emoji: "🧹",
        challenge: "Sapu atau pel lantai minimal sekali sehari",
        dailyQuotes: [
          "Lantai bersih, langkah ringan! Gaskeun! 🧹",
          "Hari ke-2! Rajin banget kamu!",
          "3 hari berturut-turut! Rumahmu pasti kinclong! ✨",
          "Setengah perjalanan! Sudah jadi rutinitas! 🏠",
          "5 hari! Kamu bukan lagi coba-coba, ini nyata! 💪",
          "Satu langkah lagi menuju kemenangan! ⭐",
          "HEBAT! Kamu adalah Master Kebersihan! 🎉🏆",
        ]
      },
      {
        id: 8, title: "Level 8", theme: "Bebas Gadget", emoji: "📵",
        challenge: "Taruh HP 30 menit sebelum tidur",
        dailyQuotes: [
          "Lepaskan HP, peluk kebebasan! 📵",
          "Hari ke-2 tanpa scroll sebelum tidur! Tidurmu pasti lebih nyenyak!",
          "3 hari! Otakmu berterima kasih! 🧠",
          "Setengah minggu! Kamu lebih kuat dari dopamine! 💪",
          "5 hari! Kualitas tidurmu pasti naik drastis! 😴",
          "Besok terakhir! Kamu warrior digital! ⚔️",
          "LEGEND! Kamu menguasai gadgetmu, bukan sebaliknya! 🎉🚀",
        ]
      },
      {
        id: 9, title: "Level 9", theme: "Koneksi Nyata", emoji: "🤝",
        challenge: "Hubungi 1 orang yang kamu sayangi hari ini",
        dailyQuotes: [
          "Satu pesan bisa bikin hari seseorang! 💌",
          "Hari ke-2! Siapa yang kamu hubungi hari ini?",
          "3 hari menyebar kebaikan! Kamu hebat! 🌸",
          "Setengah minggu penuh koneksi nyata! 🤝",
          "5 hari! Hubunganmu pasti makin hangat! ❤️",
          "Hampir selesai! Teruslah terhubung! 🌟",
          "AMAZING! Kamu master koneksi manusia! 🎉💫",
        ]
      },
      {
        id: 10, title: "Level 10", theme: "Master Habits", emoji: "🌟",
        challenge: "Semua kebiasaan sebelumnya dijalankan!",
        dailyQuotes: [
          "Level terakhir! Ini puncak perjalananmu! 🏔️",
          "Hari ke-2! Semua habit dijalankan sekaligus! Wow! 🔥",
          "3 hari jadi Master! Kamu bukan orang biasa! 💎",
          "Setengah minggu menguasai segalanya! 👑",
          "5 hari! Kamu adalah definisi konsistensi! 💪",
          "Besok hari terakhir! GASKEUN SAMPAI AKHIR! ⚡",
          "🏆 SELAMAT! Kamu telah menyelesaikan Chapter 1! Kamu luar biasa! 🎉🚀🌟",
        ]
      },
    ]
  }
];

// Flat list helper for easier access
export const LEVELS = CHAPTERS.flatMap(chapter => chapter.levels);
