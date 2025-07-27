export const translations = {
  id: {
    // Navigation
    nav: {
      formBuilder: 'FormBuilder',
      dashboard: 'Dashboard',
      settings: 'Pengaturan',
      signOut: 'Keluar',
      createForm: 'Buat Form',
      welcomeBack: 'Selamat datang kembali',
    },
    
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalForms: 'Total Form',
      publishedForms: 'Form Dipublikasi', 
      totalResponses: 'Total Respons',
      totalViews: 'Total Dilihat',
      searchPlaceholder: 'Cari form...',
      allForms: 'Semua Form',
      published: 'Dipublikasi',
      draft: 'Draft',
      noForms: 'Belum Ada Form',
      noFormsDescription: 'Mulai dengan membuat form pertama Anda.',
      createFirstForm: 'Buat Form Pertama',
      loadingDashboard: 'Memuat dashboard Anda...',
    },

    // Form Actions
    form: {
      edit: 'Edit',
      view: 'Lihat',
      share: 'Bagikan',
      delete: 'Hapus',
      publish: 'Publikasikan',
      unpublish: 'Batalkan Publikasi',
      duplicate: 'Duplikasi',
      analytics: 'Analitik',
      responses: 'Respons',
      views: 'Dilihat',
      submissions: 'Pengiriman',
      created: 'Dibuat',
      updated: 'Diperbarui',
    },

    // Form Builder
    builder: {
      title: 'Pembuat Form',
      formTitle: 'Judul Form',
      formDescription: 'Deskripsi Form',
      addField: 'Tambah Field',
      fieldTypes: {
        text: 'Teks',
        textarea: 'Area Teks',
        email: 'Email',
        number: 'Angka',
        select: 'Pilihan',
        checkbox: 'Kotak Centang',
        radio: 'Pilihan Tunggal',
        file: 'File',
        date: 'Tanggal',
        matrix: 'Matriks',
        rating: 'Rating',
        likert: 'Skala Likert',
        section: 'Bagian',
        signature: 'Tanda Tangan',
        heading: 'Judul',
        image: 'Gambar',
      },
      fieldProperties: {
        label: 'Label',
        placeholder: 'Placeholder', 
        required: 'Wajib Diisi',
        description: 'Deskripsi',
        options: 'Pilihan',
        addOption: 'Tambah Pilihan',
      },
      quizSettings: {
        title: 'Pengaturan Kuis',
        enableQuiz: 'Aktifkan Mode Kuis',
        correctAnswer: 'Jawaban Benar',
        keyAnswer: 'Jawaban Kunci',
        keywords: 'Kata Kunci Penting',
        points: 'Poin',
        explanation: 'Penjelasan',
        minWords: 'Minimal Kata',
        maxWords: 'Maksimal Kata',
        passingThreshold: 'Batas Kelulusan (%)',
        gradingType: 'Metode Penilaian',
        gradingTypes: {
          keyword: 'Pencocokan Kata Kunci',
          similarity: 'Kesamaan Konten',
          ai: 'AI Gabungan (Direkomendasikan)',
        }
      },
      save: 'Simpan Form',
      preview: 'Preview',
      publish: 'Publikasikan',
    },

    // Essay Grading
    essay: {
      title: 'Sistem Penilaian Essay AI',
      subtitle: 'Rasakan evaluasi essay cerdas dengan feedback real-time, penilaian, dan analisis detail',
      howItWorks: 'Cara Kerja AI Kami:',
      features: {
        contentAnalysis: 'Analisis Konten: Membandingkan jawaban Anda dengan jawaban referensi menggunakan algoritma kesamaan tingkat lanjut',
        keywordDetection: 'Deteksi Kata Kunci: Mengidentifikasi konsep dan terminologi penting dalam respons Anda',
        instantFeedback: 'Feedback Instan: Dapatkan skor, saran, dan penjelasan detail segera',
        smartScoring: 'Penilaian Cerdas: Menggabungkan beberapa teknik AI untuk evaluasi yang akurat dan adil',
      },
      instructions: {
        title: 'Instruksi:',
        steps: [
          'Pilih jawaban sampel atau tulis respons Anda sendiri untuk setiap pertanyaan',
          'Klik tombol "Nilai Essay" setelah menulis setiap jawaban untuk mendapat feedback AI instan',
          'Tinjau penilaian detail, analisis kesamaan, dan hasil pencocokan kata kunci',
          'Perbaiki jawaban berdasarkan feedback dan nilai ulang untuk melihat perubahan skor',
          'Kirim semua essay ketika puas dengan respons Anda'
        ]
      },
      gradeButton: 'Nilai Essay',
      gradeAnswer: 'Nilai Jawaban',
      wordCount: 'Jumlah kata',
      similarity: 'Kesamaan',
      keywordsFound: 'Kata kunci ditemukan',
      keywordsMissing: 'Kata kunci hilang',
      feedback: 'Umpan balik',
      score: 'Skor',
      passed: 'Lulus',
      failed: 'Gagal',
      sampleAnswers: {
        title: 'Coba Jawaban Sampel:',
        description: 'Muat jawaban yang sudah ditulis untuk melihat bagaimana respon berkualitas berbeda dinilai oleh sistem AI kami.',
        excellent: 'Jawaban Sangat Baik',
        average: 'Jawaban Rata-rata', 
        poor: 'Jawaban Kurang',
        load: 'Muat',
      }
    },

    // Settings
    settings: {
      title: 'Pengaturan Sistem',
      description: 'Kelola pengaturan aplikasi, pengguna, dan kustomisasi tampilan',
      tabs: {
        app: 'Pengaturan Aplikasi',
        users: 'Manajemen User',
        profile: 'Profil Saya',
        super: 'Super Admin',
      },
      app: {
        basicInfo: 'Informasi Dasar',
        appName: 'Nama Aplikasi',
        appDescription: 'Deskripsi Aplikasi',
        primaryColor: 'Warna Utama',
        landingCustomization: 'Kustomisasi Landing Page',
        landingTitle: 'Judul Utama',
        landingSubtitle: 'Sub Judul',
        landingDescription: 'Deskripsi',
        featuresTitle: 'Fitur Unggulan',
        addFeature: 'Tambah Fitur',
        removeFeature: 'Hapus',
        languageAccess: 'Bahasa & Akses',
        defaultLanguage: 'Bahasa Default',
        allowRegistration: 'Izinkan Registrasi Publik',
        requireApproval: 'Butuh Persetujuan Admin',
        saveSettings: 'Simpan Pengaturan',
        saving: 'Menyimpan...',
      },
      users: {
        title: 'Manajemen Pengguna',
        addUser: 'Tambah User',
        name: 'Nama',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        actions: 'Aksi',
        active: 'Aktif',
        pending: 'Pending',
        edit: 'Edit',
        delete: 'Hapus',
        roles: {
          user: 'User',
          admin: 'Admin',
          super_admin: 'Super Admin',
        }
      },
      profile: {
        title: 'Profil Saya',
        displayName: 'Nama Tampilan',
        language: 'Bahasa',
        notifications: 'Terima Notifikasi Email',
        saveProfile: 'Simpan Profil',
      },
      super: {
        title: 'Panel Super Admin',
        totalUsers: 'Total Users',
        totalForms: 'Total Forms',
        responses: 'Respons',
        todayGrowth: 'hari ini',
        actions: 'Aksi Super Admin',
        backup: {
          title: 'Backup Database',
          description: 'Buat backup semua data',
        },
        logs: {
          title: 'System Logs',
          description: 'Lihat log aktivitas sistem',
        },
        maintenance: {
          title: 'Maintenance Mode',
          description: 'Aktifkan mode maintenance',
        },
        reset: {
          title: 'Reset All Data',
          description: 'Hapus semua data (berbahaya!)',
        }
      }
    },

    // Common
    common: {
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Edit',
      view: 'Lihat',
      back: 'Kembali',
      next: 'Selanjutnya',
      previous: 'Sebelumnya',
      submit: 'Kirim',
      loading: 'Memuat...',
      error: 'Terjadi kesalahan',
      success: 'Berhasil',
      confirm: 'Konfirmasi',
      yes: 'Ya',
      no: 'Tidak',
      or: 'atau',
      and: 'dan',
      search: 'Cari',
      filter: 'Filter',
      all: 'Semua',
      none: 'Tidak ada',
      close: 'Tutup',
      open: 'Buka',
      copy: 'Salin',
      paste: 'Tempel',
      cut: 'Potong',
      undo: 'Urungkan',
      redo: 'Ulangi',
    },

    // Messages
    messages: {
      settingsSaved: 'Pengaturan berhasil disimpan!',
      settingsError: 'Gagal menyimpan pengaturan',
      profileSaved: 'Profil berhasil disimpan!',
      profileError: 'Gagal menyimpan profil',
      deleteConfirm: 'Apakah Anda yakin ingin menghapus ini?',
      deleteSuccess: 'Berhasil dihapus',
      deleteError: 'Gagal menghapus',
      publishSuccess: 'Form berhasil dipublikasikan',
      unpublishSuccess: 'Form berhasil dibatalkan publikasinya',
      formSaved: 'Form berhasil disimpan',
      formError: 'Gagal menyimpan form',
    }
  },

  en: {
    // English translations (keep existing ones)
    nav: {
      formBuilder: 'FormBuilder',
      dashboard: 'Dashboard',
      settings: 'Settings',
      signOut: 'Sign Out',
      createForm: 'Create Form',
      welcomeBack: 'Welcome back',
    },
    // ... add English translations as needed
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.id;
