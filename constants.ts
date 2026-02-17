import { GameEvent, Stats, Achievement, LevelConfig, PsychologicalProfile, Avatar } from './types';

// HARD MODE: Lower initial stats to make crises more frequent
export const INITIAL_STATS: Stats = {
  Lingkungan: 50,
  Ekonomi: 50,
  Kebahagiaan: 50,
  Pengetahuan: 50,
};

export const TOTAL_EVENTS = 20;

// AVATARS
export const AVATARS: Avatar[] = [
  {
    id: 'cool',
    name: 'Budi Santuy',
    role: 'Walikota Gaul',
    image: '😎',
    color: 'bg-purple-500',
    perk: 'Mulai dengan Kebahagiaan +10'
  },
  {
    id: 'nerd',
    name: 'Siti Pintar',
    role: 'Teknokrat Muda',
    image: '🤓',
    color: 'bg-indigo-500',
    perk: 'Mulai dengan Pengetahuan +10'
  },
  {
    id: 'rich',
    name: 'Bos Darmawan',
    role: 'Pengusaha Sukses',
    image: '🤑',
    color: 'bg-amber-500',
    perk: 'Mulai dengan Ekonomi +10'
  },
  {
    id: 'nature',
    name: 'Dewi Lestari',
    role: 'Aktivis Alam',
    image: '🌿',
    color: 'bg-emerald-500',
    perk: 'Mulai dengan Lingkungan +10'
  }
];

// Leveling System
export const LEVELS: LevelConfig[] = [
  { level: 1, title: "Warga Biasa", xpThreshold: 0 },
  { level: 2, title: "Ketua RT", xpThreshold: 300 },
  { level: 3, title: "Lurah Idaman", xpThreshold: 800 },
  { level: 4, title: "Camat Teladan", xpThreshold: 1500 },
  { level: 5, title: "Walikota Hits", xpThreshold: 2500 },
  { level: 6, title: "Gubernur Legend", xpThreshold: 4000 },
  { level: 7, title: "Presiden Dunia", xpThreshold: 6000 },
  { level: 8, title: "Penguasa Galaksi", xpThreshold: 9000 },
];

// MASSIVE ACHIEVEMENTS LIST
export const ACHIEVEMENTS: Achievement[] = [
  // --- STAT MASTERY ---
  {
    id: 'eco_god',
    title: 'Sultan Mah Bebas',
    description: 'Ekonomi tembus 90. Uang bukan masalah!',
    icon: 'DollarSign',
    rarity: 'rare',
    condition: (stats) => stats.Ekonomi >= 90
  },
  {
    id: 'happy_nation',
    title: 'Idola Emak-Emak',
    description: 'Kebahagiaan tembus 90. Semua orang sayang kamu.',
    icon: 'Heart',
    rarity: 'rare',
    condition: (stats) => stats.Kebahagiaan >= 90
  },
  {
    id: 'big_brain',
    title: 'Profesor Gila',
    description: 'Pengetahuan tembus 90. Kota rasa laboratorium.',
    icon: 'BookOpen',
    rarity: 'rare',
    condition: (stats) => stats.Pengetahuan >= 90
  },
  {
    id: 'nature_lover',
    title: 'Teman Pohon',
    description: 'Lingkungan tembus 90. Tarzan pun bangga.',
    icon: 'Leaf',
    rarity: 'rare',
    condition: (stats) => stats.Lingkungan >= 90
  },
  
  // --- STREAK & SKILL ---
  {
    id: 'balance_master',
    title: 'Jagoan Imbang',
    description: 'Menjaga Streak Keseimbangan selama 5 turn.',
    icon: 'Scale',
    rarity: 'common',
    condition: (stats, i, h, streak) => streak >= 5
  },
  {
    id: 'balance_god',
    title: 'Dewa Keseimbangan',
    description: 'Menjaga Streak Keseimbangan selama 10 turn!',
    icon: 'Zap',
    rarity: 'legendary',
    condition: (stats, i, h, streak) => streak >= 10
  },
  
  // --- SITUATIONAL ---
  {
    id: 'crisis_manager',
    title: 'Nyaris Lengser',
    description: 'Salah satu stat menyentuh angka 5, tapi masih bertahan.',
    icon: 'AlertTriangle',
    rarity: 'common',
    condition: (stats) => Object.values(stats).some(v => v <= 5 && v > 0)
  },
  {
    id: 'perfect_utopia',
    title: 'Utopia Nyata',
    description: 'Semua statistik di atas 60 secara bersamaan.',
    icon: 'Star',
    rarity: 'legendary',
    condition: (stats) => Object.values(stats).every(v => v >= 60)
  },
  {
    id: 'chaos_enjoyer',
    title: 'Raja Kekacauan',
    description: 'Semua statistik di bawah 30. Kamu niat jadi Walikota gak sih?',
    icon: 'Skull',
    rarity: 'common',
    condition: (stats) => Object.values(stats).every(v => v <= 30)
  },
  {
    id: 'comeback',
    title: 'Epic Comeback',
    description: 'Menyelesaikan game setelah pernah krisis parah.',
    icon: 'Activity',
    rarity: 'rare',
    condition: (stats, index, history) => {
      const historyIsCritical = history.some(h => Object.values(h).some(val => val <= 10));
      return historyIsCritical && index >= 19; 
    }
  }
];

// NEW AI PROFILES - The "Oracle" Logic v2.0 (More granular)
export const getPsychologicalProfile = (stats: Stats): PsychologicalProfile => {
    const { Lingkungan, Ekonomi, Kebahagiaan, Pengetahuan } = stats;
    const total = Lingkungan + Ekonomi + Kebahagiaan + Pengetahuan;
    const variance = Math.max(Lingkungan, Ekonomi, Kebahagiaan, Pengetahuan) - Math.min(Lingkungan, Ekonomi, Kebahagiaan, Pengetahuan);

    // 1. The Machiavellian (High Eco, Low Hap, Low Env)
    if (Ekonomi > 80 && Kebahagiaan < 40) {
        return {
            title: "The Ruthless Pragmatist",
            subtitle: "Machiavellian Sovereign",
            analysis: "Anda adalah definisi 'tujuan menghalalkan cara'. Empati bagi Anda adalah kelemahan struktural. Anda membangun imperium emas di atas tulang belulang warga yang 'kurang produktif'. Efisien, namun menakutkan.",
            mbtiMatch: "ENTJ-A (Commander)",
            weakness: "Revolusi berdarah dari kelas bawah.",
            color: "from-amber-800 to-red-950"
        };
    }

    // 2. The Tech-Accelerationist (High Kno + Eco, Very Low Env + Hap)
    if (Pengetahuan > 80 && Ekonomi > 60 && Lingkungan < 30) {
        return {
            title: "The Silicon Despot",
            subtitle: "Post-Human Architect",
            analysis: "Anda telah meninggalkan kemanusiaan demi kemajuan. Bagi Anda, kota ini bukan rumah, tapi laboratorium raksasa. Anda melihat manusia sebagai komponen yang bisa diganti oleh algoritma.",
            mbtiMatch: "INTJ (Architect)",
            weakness: "Kematian jiwa dan ekosistem.",
            color: "from-indigo-700 to-violet-950"
        };
    }

    // 3. The Eco-Fanatic (High Env, Low Eco + Kno)
    if (Lingkungan > 80 && Ekonomi < 40) {
        return {
            title: "The Gaia Zealot",
            subtitle: "Return to Monke",
            analysis: "Anda membenci peradaban modern. Visi Anda adalah mengembalikan kota menjadi hutan rimba, meskipun itu berarti kemiskinan dan kelaparan massal. Idealisme Anda berbahaya bagi perut rakyat.",
            mbtiMatch: "INFP-T (Mediator Extreme)",
            weakness: "Runtuhnya rantai pasok logistik.",
            color: "from-emerald-600 to-teal-900"
        };
    }

    // 4. The Populist Demagogue (High Hap, Low Kno + Eco)
    if (Kebahagiaan > 85 && Pengetahuan < 40) {
        return {
            title: "The Charismatic Deceiver",
            subtitle: "Bread & Circus King",
            analysis: "Anda membius rakyat dengan hiburan dan subsidi palsu. Mereka mencintai Anda karena Anda memberi gula, bukan obat. Anda menciptakan bangsa yang bahagia namun bodoh dan miskin.",
            mbtiMatch: "ESFP (Entertainer)",
            weakness: "Pembodohan massal jangka panjang.",
            color: "from-rose-500 to-pink-800"
        };
    }

    // 5. The Perfect Balancer (High Total, Low Variance)
    if (total > 300 && variance < 20) {
        return {
            title: "The Philosopher King",
            subtitle: "Enlightened Grandmaster",
            analysis: "Sangat langka. AI kesulitan menemukan celah psikologis Anda. Anda menyeimbangkan profit dan moralitas dengan presisi bedah. Anda bukan politisi, Anda adalah fenomena sejarah.",
            mbtiMatch: "ENFJ (Protagonist)",
            weakness: "Perfeksionisme yang melelahkan.",
            color: "from-cyan-500 to-blue-700"
        };
    }

    // 6. The Totalitarian Control (High Kno + Eco, Low Hap)
    if (Pengetahuan > 70 && Ekonomi > 70 && Kebahagiaan < 40) {
        return {
            title: "The Big Brother",
            subtitle: "Surveillance State Architect",
            analysis: "Anda percaya bahwa kebebasan adalah sumber kekacauan. Anda menciptakan masyarakat yang aman, kaya, dan pintar, namun hidup dalam ketakutan dan kontrol absolut.",
            mbtiMatch: "ISTJ (Logistician)",
            weakness: "Hilangnya kreativitas dan kebebasan individu.",
            color: "from-slate-700 to-gray-900"
        };
    }

    // 7. The Failed Administrator (Low Everything)
    if (total < 150) {
        return {
            title: "The Chaos Agent",
            subtitle: "Unintentional Destroyer",
            analysis: "Pola neural Anda menunjukkan keraguan kronis. Setiap keputusan yang Anda ambil menjadi bumerang. Kota ini terbakar bukan karena Anda jahat, tapi karena Anda tidak kompeten.",
            mbtiMatch: "Unhealthy INTP",
            weakness: "Ketidakmampuan mengambil resiko.",
            color: "from-red-900 to-black"
        };
    }

    // Default: The Moderate
    return {
        title: "The Gray Bureaucrat",
        subtitle: "Status Quo Keeper",
        analysis: "Anda bermain aman. Terlalu aman. Anda tidak membuat sejarah, Anda hanya mengisi formulir. Kota Anda bertahan, tapi tidak berkembang. Anda adalah manajer, bukan visioner.",
        mbtiMatch: "ISFJ (Defender)",
        weakness: "Mediokritas.",
        color: "from-slate-500 to-gray-600"
    };
};

// Reuse previous massive event pool
export const GAME_EVENTS_POOL: GameEvent[] = [
  // --- KATEGORI: INFRASTRUKTUR & TEKNOLOGI (10) ---
  {
    id: 'tech_ai_surveillance',
    title: 'Sistem Pengawas Wajah Total',
    category: 'Infrastruktur',
    description: 'Perusahaan AI menawarkan pemasangan CCTV pendeteksi wajah di setiap sudut kota. Kriminalitas diprediksi turun 80%, tapi privasi warga hilang total.',
    imagePlaceholder: 'cctv',
    choices: [
      {
        label: 'Pasang Demi Keamanan Absolut',
        xpReward: 300,
        impact: { Ekonomi: 10, Pengetahuan: 25, Kebahagiaan: -30, Lingkungan: 0 },
        feedback: "Kriminalitas lenyap. Warga hidup dalam ketakutan diawasi Big Brother."
      },
      {
        label: 'Tolak Demi Hak Privasi',
        xpReward: 150,
        impact: { Kebahagiaan: 20, Ekonomi: -10, Pengetahuan: -10, Lingkungan: 0 },
        feedback: "Privasi terjaga, namun copet dan begal masih merajalela."
      }
    ]
  },
  {
    id: 'tech_gene_editing',
    title: 'Klinik Desainer Bayi',
    category: 'Infrastruktur',
    description: 'Rumah sakit elit ingin membuka layanan rekayasa genetika. Orang kaya bisa "mendesain" anak jenius & kebal penyakit. Kesenjangan sosial biologis?',
    imagePlaceholder: 'dna',
    choices: [
      {
        label: 'Izinkan (Evolusi Manusia)',
        xpReward: 400,
        impact: { Pengetahuan: 40, Ekonomi: 20, Kebahagiaan: -25, Lingkungan: 0 },
        feedback: "Generasi super lahir. Kaum miskin semakin tertinggal secara biologis."
      },
      {
        label: 'Larang (Etika Moral)',
        xpReward: 100,
        impact: { Kebahagiaan: 15, Pengetahuan: -20, Ekonomi: -10, Lingkungan: 0 },
        feedback: "Kesetaraan terjaga. Kota kehilangan potensi ilmuwan super."
      }
    ]
  },
  {
    id: 'tech_automation',
    title: 'Otomatisasi Pabrik Total',
    category: 'Ekonomi',
    description: 'Pabrik-pabrik ingin mengganti 90% buruh manusia dengan robot AI. Efisiensi naik 300%, tapi pengangguran massal mengancam.',
    imagePlaceholder: 'robot_arm',
    choices: [
      {
        label: 'Dukung Otomatisasi Penuh',
        xpReward: 350,
        impact: { Ekonomi: 40, Pengetahuan: 20, Kebahagiaan: -40, Lingkungan: 10 },
        feedback: "Keuntungan perusahaan meroket. Ribuan buruh demo kelaparan."
      },
      {
        label: 'Batasi Robot Demi Pekerja',
        xpReward: 150,
        impact: { Kebahagiaan: 25, Ekonomi: -25, Pengetahuan: -15, Lingkungan: -5 },
        feedback: "Pekerjaan selamat. Investor teknologi kabur ke negara lain."
      }
    ]
  },
  {
    id: 'infra_nuclear',
    title: 'Pembangkit Nuklir Kota',
    category: 'Infrastruktur',
    description: 'Solusi krisis listrik bersih dan murah. Namun, lokasinya hanya berjarak 10km dari pemukiman padat. Resiko kebocoran kecil tapi fatal.',
    imagePlaceholder: 'nuclear',
    choices: [
      {
        label: 'Bangun PLTN',
        xpReward: 300,
        impact: { Ekonomi: 30, Pengetahuan: 20, Lingkungan: 10, Kebahagiaan: -20 },
        feedback: "Listrik melimpah. Harga properti di sekitar PLTN anjlok karena panik."
      },
      {
        label: 'Tetap Pakai Batu Bara & Gas',
        xpReward: 50,
        impact: { Lingkungan: -25, Ekonomi: 5, Kebahagiaan: 5, Pengetahuan: -5 },
        feedback: "Warga tenang, tapi polusi udara perlahan membunuh mereka."
      }
    ]
  },
  {
    id: 'infra_flood_tunnel',
    title: 'Terowongan Raksasa Anti-Banjir',
    category: 'Infrastruktur',
    description: 'Proyek mega-struktur untuk meniadakan banjir selamanya. Harus menggusur situs sejarah berusia 200 tahun.',
    imagePlaceholder: 'tunnel',
    choices: [
      {
        label: 'Gusur Situs Sejarah',
        xpReward: 200,
        impact: { Ekonomi: 15, Lingkungan: 20, Kebahagiaan: -15, Pengetahuan: -20 },
        feedback: "Kota bebas banjir. Identitas budaya kota hilang selamanya."
      },
      {
        label: 'Batalkan Proyek',
        xpReward: 100,
        impact: { Kebahagiaan: 10, Pengetahuan: 10, Ekonomi: -10, Lingkungan: -20 },
        feedback: "Sejarah selamat. Banjir tahunan tetap menenggelamkan rumah warga."
      }
    ]
  },

  // --- KATEGORI: SOSIAL & MORAL (10) ---
  {
    id: 'soc_elderly',
    title: 'Euthanasia Sukarela',
    category: 'Sosial',
    description: 'Populasi lansia membludak, membebani BPJS. Kelompok radikal mengusulkan legalisasi "Akhir Bahagia" (bunuh diri medis) bagi lansia > 80 tahun.',
    imagePlaceholder: 'hospital_bed',
    choices: [
      {
        label: 'Legalisasi Euthanasia',
        xpReward: 500,
        impact: { Ekonomi: 35, Kebahagiaan: -30, Pengetahuan: 10, Lingkungan: 5 },
        feedback: "Beban anggaran turun drastis. Kota dicap sebagai 'Kota Kematian'."
      },
      {
        label: 'Tolak Keras',
        xpReward: 200,
        impact: { Kebahagiaan: 20, Ekonomi: -30, Pengetahuan: 0, Lingkungan: 0 },
        feedback: "Kemanusiaan menang. Anggaran kesehatan jebol."
      }
    ]
  },
  {
    id: 'soc_censorship',
    title: 'UU Anti Berita Palsu',
    category: 'Sosial',
    description: 'Hoax menyebar liar memicu kerusuhan. Dewan kota mengusulkan algoritma sensor otomatis untuk semua chat warga.',
    imagePlaceholder: 'censored',
    choices: [
      {
        label: 'Aktifkan Sensor Total',
        xpReward: 250,
        impact: { Kebahagiaan: -20, Pengetahuan: -15, Ekonomi: 10, Lingkungan: 0 },
        feedback: "Situasi tenang. Oposisi politik bungkam karena 'dianggap hoax'."
      },
      {
        label: 'Biarkan Kebebasan Berbicara',
        xpReward: 150,
        impact: { Kebahagiaan: 10, Pengetahuan: 15, Ekonomi: -10, Lingkungan: 0 },
        feedback: "Demokrasi hidup. Kerusuhan akibat provokasi terus terjadi."
      }
    ]
  },
  {
    id: 'soc_drug_zone',
    title: 'Zona Bebas Narkotika',
    category: 'Sosial',
    description: 'Perang melawan narkoba gagal. Usulan radikal: Buat satu distrik legal narkoba (seperti Hamsterdam) untuk mengontrol penyebaran.',
    imagePlaceholder: 'slum',
    choices: [
      {
        label: 'Buat Distrik Merah Legal',
        xpReward: 300,
        impact: { Ekonomi: 15, Kebahagiaan: -25, Pengetahuan: 10, Lingkungan: -5 },
        feedback: "Kriminalitas di kota turun, tapi distrik itu jadi neraka dunia."
      },
      {
        label: 'Perketat Hukuman Mati',
        xpReward: 100,
        impact: { Kebahagiaan: 10, Ekonomi: -10, Pengetahuan: -5, Lingkungan: 0 },
        feedback: "Penjara penuh sesak. Perdagangan gelap makin ganas."
      }
    ]
  },
  {
    id: 'soc_religion',
    title: 'Wajib Belajar Agama',
    category: 'Sosial',
    description: 'Kelompok konservatif menuntut kurikulum agama ditambah 10 jam/minggu, mengurangi jam sains.',
    imagePlaceholder: 'book',
    choices: [
      {
        label: 'Turuti Tuntutan (Prioritas Iman)',
        xpReward: 150,
        impact: { Kebahagiaan: 20, Pengetahuan: -30, Ekonomi: -5, Lingkungan: 0 },
        feedback: "Masyarakat religius senang. Nilai PISA sains siswa anjlok."
      },
      {
        label: 'Tolak (Prioritas Sains)',
        xpReward: 200,
        impact: { Pengetahuan: 25, Kebahagiaan: -30, Ekonomi: 10, Lingkungan: 0 },
        feedback: "Generasi cerdas terbentuk. Demo berjilid-jilid mengepung kantor Anda."
      }
    ]
  },
  {
    id: 'soc_refugee',
    title: 'Gelombang Pengungsi Perang',
    category: 'Sosial',
    description: 'Ribuan pengungsi internasional tiba di perbatasan. Mereka butuh makan dan tempat tinggal.',
    imagePlaceholder: 'refugee',
    choices: [
      {
        label: 'Terima Atas Dasar Kemanusiaan',
        xpReward: 250,
        impact: { Kebahagiaan: -20, Ekonomi: -25, Pengetahuan: 10, Lingkungan: -5 },
        feedback: "Dunia memuji Anda. Warga lokal marah karena persaingan kerja."
      },
      {
        label: 'Tolak & Bangun Tembok',
        xpReward: 100,
        impact: { Kebahagiaan: 15, Ekonomi: 5, Pengetahuan: -10, Lingkungan: 0 },
        feedback: "Warga lokal merasa aman. Citra internasional hancur."
      }
    ]
  },

  // --- KATEGORI: EKONOMI & POLITIK (10) ---
  {
    id: 'eco_crypto',
    title: 'Kota Berbasis Cryptocurrency',
    category: 'Ekonomi',
    description: 'Tech-bro menyarankan mengganti mata uang kota dengan Crypto baru yang volatil tapi potensial.',
    imagePlaceholder: 'bitcoin',
    choices: [
      {
        label: 'Adopsi Penuh Crypto',
        xpReward: 400,
        impact: { Ekonomi: 40, Pengetahuan: 20, Kebahagiaan: -15, Lingkungan: -20 },
        feedback: "Orang kaya makin kaya. Orang tua kehilangan tabungan pensiun karena crash."
      },
      {
        label: 'Larang Transaksi Crypto',
        xpReward: 100,
        impact: { Ekonomi: -10, Kebahagiaan: 5, Pengetahuan: -5, Lingkungan: 5 },
        feedback: "Ekonomi stabil membosankan. Inovator finansial pergi."
      }
    ]
  },
  {
    id: 'eco_tax_haven',
    title: 'Surga Pajak Korporat',
    category: 'Ekonomi',
    description: 'Jadikan kota sebagai "Tax Haven" (Pajak 0%) untuk menarik kantor pusat perusahaan multinasional.',
    imagePlaceholder: 'skyscraper',
    choices: [
      {
        label: 'Nol-kan Pajak Korporasi',
        xpReward: 350,
        impact: { Ekonomi: 50, Kebahagiaan: -20, Lingkungan: -15, Pengetahuan: 10 },
        feedback: "Gedung pencakar langit tumbuh jamur. Ketimpangan kaya-miskin ekstrem."
      },
      {
        label: 'Pajak Progresif Tinggi',
        xpReward: 150,
        impact: { Kebahagiaan: 25, Ekonomi: -30, Lingkungan: 5, Pengetahuan: 0 },
        feedback: "Layanan publik gratis dan bagus. Pengusaha besar kabur."
      }
    ]
  },
  {
    id: 'pol_nepotism',
    title: 'Penunjukan Kepala Polisi',
    category: 'Politik',
    description: 'Ada 2 kandidat: Saudara kandung Anda yang loyal tapi bodoh, atau Jenderal kompeten yang kritis terhadap Anda.',
    imagePlaceholder: 'police',
    choices: [
      {
        label: 'Pilih Saudara (Loyalitas)',
        xpReward: 50,
        impact: { Kebahagiaan: -15, Pengetahuan: -15, Ekonomi: -5, Lingkungan: 0 },
        feedback: "Posisi Anda aman. Kinerja kepolisian jadi lelucon."
      },
      {
        label: 'Pilih Jenderal Kompeten',
        xpReward: 300,
        impact: { Pengetahuan: 20, Kebahagiaan: 10, Ekonomi: 5, Lingkungan: 0 },
        feedback: "Polisi profesional. Jenderal itu mulai menyelidiki korupsi masa lalu Anda."
      }
    ]
  },
  {
    id: 'eco_casino',
    title: 'Megaproyek Kasino Terapung',
    category: 'Ekonomi',
    description: 'Investor Macau ingin membangun kasino terbesar di atas laut reklamasi.',
    imagePlaceholder: 'casino',
    choices: [
      {
        label: 'Izinkan (Pajak Judi)',
        xpReward: 300,
        impact: { Ekonomi: 40, Lingkungan: -20, Kebahagiaan: -10, Pengetahuan: -5 },
        feedback: "Kas daerah banjir uang. Angka perceraian dan bunuh diri naik."
      },
      {
        label: 'Tolak (Moralitas)',
        xpReward: 100,
        impact: { Kebahagiaan: 10, Ekonomi: -20, Lingkungan: 5, Pengetahuan: 5 },
        feedback: "Moral terjaga. Kota kehilangan potensi wisata triliunan."
      }
    ]
  },
  {
    id: 'pol_term_limit',
    title: 'Amandemen Masa Jabatan',
    category: 'Politik',
    description: 'Partai pendukung ingin mengubah UU agar Anda bisa menjabat seumur hidup (Dinasti Politik).',
    imagePlaceholder: 'parliament',
    choices: [
      {
        label: 'Dukung Amandemen',
        xpReward: 500,
        impact: { Ekonomi: 20, Kebahagiaan: -40, Pengetahuan: -20, Lingkungan: -10 },
        feedback: "Anda menjadi Raja kecil. Demokrasi mati suri."
      },
      {
        label: 'Tolak Tegas',
        xpReward: 1000,
        impact: { Kebahagiaan: 30, Pengetahuan: 20, Ekonomi: -5, Lingkungan: 0 },
        feedback: "Anda akan pensiun terhormat. Partai Anda marah besar."
      }
    ]
  },

  // --- KATEGORI: LINGKUNGAN & ALAM (10) ---
  {
    id: 'env_plastic',
    title: 'Larangan Total Plastik',
    category: 'Lingkungan',
    description: 'Melarang semua jenis plastik sekali pakai, termasuk kemasan makanan dan medis murah.',
    imagePlaceholder: 'plastic_ocean',
    choices: [
      {
        label: 'Larang Total Sekarang',
        xpReward: 250,
        impact: { Lingkungan: 35, Ekonomi: -25, Kebahagiaan: -15, Pengetahuan: 5 },
        feedback: "Sungai jadi jernih. Harga makanan naik 50%, rakyat menjerit."
      },
      {
        label: 'Bertahap 10 Tahun',
        xpReward: 100,
        impact: { Ekonomi: 5, Lingkungan: -10, Kebahagiaan: 5, Pengetahuan: 0 },
        feedback: "Bisnis berjalan lancar. Tumpukan sampah plastik makin tinggi."
      }
    ]
  },
  {
    id: 'env_smog',
    title: 'Pajak Karbon Kendaraan',
    category: 'Lingkungan',
    description: 'Kualitas udara buruk. Solusi: Pajak gila-gilaan untuk pemilik mobil bensin & motor.',
    imagePlaceholder: 'smog',
    choices: [
      {
        label: 'Terapkan Pajak 300%',
        xpReward: 200,
        impact: { Lingkungan: 30, Ekonomi: -15, Kebahagiaan: -30, Pengetahuan: 5 },
        feedback: "Langit biru kembali. Kelas menengah jatuh miskin tidak bisa kerja."
      },
      {
        label: 'Subsidi BBM Saja',
        xpReward: 50,
        impact: { Kebahagiaan: 15, Ekonomi: -15, Lingkungan: -25, Pengetahuan: -5 },
        feedback: "Rakyat senang bensin murah. Anak-anak batuk darah karena ISPA."
      }
    ]
  },
  {
    id: 'env_zoo',
    title: 'Penutupan Kebun Binatang',
    category: 'Lingkungan',
    description: 'Aktivis menuntut penutupan kebun binatang kota yang kumuh. Hewan akan dilepasliarkan, lahan jadi mall.',
    imagePlaceholder: 'zoo',
    choices: [
      {
        label: 'Tutup & Jual Lahan ke Mall',
        xpReward: 200,
        impact: { Ekonomi: 25, Lingkungan: -10, Kebahagiaan: 5, Pengetahuan: -10 },
        feedback: "Mall baru megah. Hewan mati karena gagal adaptasi di alam liar."
      },
      {
        label: 'Renovasi Pakai APBD',
        xpReward: 150,
        impact: { Lingkungan: 15, Pengetahuan: 15, Ekonomi: -20, Kebahagiaan: 5 },
        feedback: "Jadi pusat edukasi konservasi. Anggaran kota defisit."
      }
    ]
  },
  {
    id: 'env_water',
    title: 'Privatisasi Air Minum',
    category: 'Lingkungan',
    description: 'PDAM bangkrut. Perusahaan swasta multinasional menawarkan pengelolaan air bersih dengan harga pasar.',
    imagePlaceholder: 'water_drop',
    choices: [
      {
        label: 'Privatisasi Penuh',
        xpReward: 200,
        impact: { Ekonomi: 30, Pengetahuan: 10, Kebahagiaan: -25, Lingkungan: -5 },
        feedback: "Layanan air lancar dan jernih. Orang miskin tidak mampu mandi."
      },
      {
        label: 'Hutang untuk Subsidi PDAM',
        xpReward: 100,
        impact: { Kebahagiaan: 10, Ekonomi: -20, Lingkungan: 5, Pengetahuan: 0 },
        feedback: "Air murah untuk rakyat. Kualitas air tetap keruh dan sering mati."
      }
    ]
  },
  {
    id: 'env_trash_island',
    title: 'Ekspor Sampah ke Pulau Terpencil',
    category: 'Lingkungan',
    description: 'TPA penuh. Solusi cepat: Kirim sampah ke pulau tak berpenghuni di wilayah tetangga.',
    imagePlaceholder: 'garbage',
    choices: [
      {
        label: 'Kirim Diam-diam',
        xpReward: 150,
        impact: { Ekonomi: 10, Lingkungan: -5, Kebahagiaan: 10, Pengetahuan: 0 },
        feedback: "Kota bersih. Lautan tercemar mikroplastik yang akan kembali ke piring kita."
      },
      {
        label: 'Bangun Incinerator (Bakar Sampah)',
        xpReward: 250,
        impact: { Pengetahuan: 15, Ekonomi: -20, Lingkungan: -15, Kebahagiaan: -5 },
        feedback: "Sampah musnah jadi energi. Asap pembakaran mengandung dioksin."
      }
    ]
  }
];