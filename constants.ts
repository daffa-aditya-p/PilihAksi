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

// --- 4-BIT BINARY CLASSIFICATION SYSTEM (16 TYPES) ---
// We calculate a 4-digit binary code based on whether a stat is High (>50) or Low (<50).
// Order: L - E - K - P (Lingkungan, Ekonomi, Kebahagiaan, Pengetahuan)

export const getPsychologicalProfile = (stats: Stats): PsychologicalProfile => {
    const threshold = 50;
    
    // Create Binary Signature: 1 for High, 0 for Low
    const L = stats.Lingkungan >= threshold ? '1' : '0';
    const E = stats.Ekonomi >= threshold ? '1' : '0';
    const H = stats.Kebahagiaan >= threshold ? '1' : '0'; // K for Kebahagiaan inside key
    const P = stats.Pengetahuan >= threshold ? '1' : '0'; // P for Pengetahuan
    
    const signature = `${L}${E}${H}${P}`;

    // Map 16 Possibilities
    const profiles: Record<string, PsychologicalProfile> = {
        // 0000: Low Everything
        '0000': {
            title: "The Failed State",
            subtitle: "Anarchy & Ruin",
            analysis: "Kota Anda gagal total. Tidak ada uang, alam rusak, rakyat sengsara, dan bodoh. Ini adalah definisi neraka dunia.",
            mbtiMatch: "Unhealthy INTP",
            weakness: "Ketidakmampuan Total",
            color: "from-slate-900 to-black"
        },
        // 0001: Only Knowledge
        '0001': {
            title: "The Ivory Tower",
            subtitle: "Isolated Academia",
            analysis: "Kota penuh ilmuwan jenius yang hidup miskin dan sengsara di lingkungan kumuh. Pintar tapi tidak napak tanah.",
            mbtiMatch: "INTP (Logician)",
            weakness: "Isolasi Sosial",
            color: "from-indigo-900 to-slate-800"
        },
        // 0010: Only Happiness
        '0010': {
            title: "The Slum Party",
            subtitle: "Ignorant Bliss",
            analysis: "Rakyat miskin dan hidup di lingkungan kotor, tapi anehnya mereka bahagia. Pesta pora di tengah kehancuran.",
            mbtiMatch: "ESFP (Entertainer)",
            weakness: "Delusi Kolektif",
            color: "from-pink-900 to-rose-950"
        },
        // 0011: Happiness + Knowledge (No Money/Nature)
        '0011': {
            title: "The Underground Resistance",
            subtitle: "Cyberpunk Rebels",
            analysis: "Masyarakat cerdas dan bahagia yang hidup di bawah tanah tanpa ekonomi formal atau alam. Komunitas hacker anarkis.",
            mbtiMatch: "ENFP (Campaigner)",
            weakness: "Sumber Daya Langka",
            color: "from-purple-900 to-fuchsia-900"
        },
        // 0100: Only Economy
        '0100': {
            title: "The Sweatshop City",
            subtitle: "Industrial Hellscape",
            analysis: "Pabrik mengepul 24 jam. Uang berlimpah, tapi rakyat depresi, bodoh, dan paru-paru mereka hitam.",
            mbtiMatch: "ESTJ (Executive)",
            weakness: "Pemberontakan Buruh",
            color: "from-amber-900 to-orange-950"
        },
        // 0101: Economy + Knowledge (No Nature/Happiness)
        '0101': {
            title: "The Corporate Machine",
            subtitle: "Soulless Efficiency",
            analysis: "Kota super efisien. Teknologi canggih dan ekonomi kuat, tapi warganya robot tanpa jiwa yang bekerja sampai mati.",
            mbtiMatch: "INTJ (Architect)",
            weakness: "Krisis Mentalitas",
            color: "from-slate-700 to-blue-900"
        },
        // 0110: Economy + Happiness (No Nature/Knowledge)
        '0110': {
            title: "The Vegas Syndrome",
            subtitle: "Sin City",
            analysis: "Uang dan hiburan tanpa henti. Alam rusak dan pendidikan nol. Kota yang hidup untuk dosa dan kesenangan sesaat.",
            mbtiMatch: "ESTP (Entrepreneur)",
            weakness: "Dekadensi Moral",
            color: "from-yellow-700 to-red-900"
        },
        // 0111: Eco + Hap + Kno (No Nature) -> Wait, logic check: E,H,P High. L Low.
        '0111': {
            title: "The Metropolis",
            subtitle: "Concrete Jungle",
            analysis: "Puncak peradaban manusia modern. Kaya, pintar, dan bahagia, tapi alam telah punah diganti beton dan hologram.",
            mbtiMatch: "ENTJ (Commander)",
            weakness: "Kiamat Ekologis",
            color: "from-blue-700 to-cyan-900"
        },
        // 1000: Only Nature
        '1000': {
            title: "The Wild Frontier",
            subtitle: "Return to Monke",
            analysis: "Hutan lebat menelan kota. Ekonomi runtuh, manusia kembali ke zaman batu. Alam menang, manusia kalah.",
            mbtiMatch: "ISFP (Adventurer)",
            weakness: "Kepunahan Peradaban",
            color: "from-emerald-900 to-green-950"
        },
        // 1001: Nature + Knowledge
        '1001': {
            title: "The Hermit Sanctuary",
            subtitle: "Monastic Wisdom",
            analysis: "Para bijak yang hidup menyatu dengan alam. Teknologi ada tapi minim. Ekonomi stagnan demi menjaga kesucian alam.",
            mbtiMatch: "INFJ (Advocate)",
            weakness: "Kemiskinan Aset",
            color: "from-teal-800 to-emerald-900"
        },
        // 1010: Nature + Happiness
        '1010': {
            title: "The Hippie Commune",
            subtitle: "Flower Power",
            analysis: "Hidup santai di pantai, makan kelapa, tanpa uang dan tanpa sekolah. Damai, tapi rentan hancur jika badai datang.",
            mbtiMatch: "ISFJ (Defender)",
            weakness: "Kerentanan Fisik",
            color: "from-green-600 to-lime-800"
        },
        // 1011: Nature + Hap + Kno (No Eco)
        '1011': {
            title: "The Solarpunk Utopia",
            subtitle: "Post-Scarcity Society",
            analysis: "Masyarakat pasca-kapitalis. Teknologi hijau canggih, alam lestari, warga bahagia. Uang tidak lagi relevan di sini.",
            mbtiMatch: "ENFJ (Protagonist)",
            weakness: "Isolasi Ekonomi Global",
            color: "from-emerald-500 to-cyan-600"
        },
        // 1100: Nature + Economy
        '1100': {
            title: "The Eco-Capitalist",
            subtitle: "Green Gold",
            analysis: "Anda berhasil memonetisasi alam. Pariwisata mahal dan tambang ramah lingkungan. Kaya dan hijau, tapi rakyat tidak bahagia.",
            mbtiMatch: "ISTJ (Logistician)",
            weakness: "Ketimpangan Sosial",
            color: "from-green-800 to-yellow-800"
        },
        // 1101: Nature + Eco + Kno (No Hap)
        '1101': {
            title: "The Guided Evolution",
            subtitle: "Benevolent Dictatorship",
            analysis: "Semua sempurna di atas kertas: Alam, Uang, Ilmu. Tapi warga dikekang aturan ketat demi menjaga keseimbangan itu.",
            mbtiMatch: "ISTP (Virtuoso)",
            weakness: "Pemberontakan Sipil",
            color: "from-teal-700 to-blue-800"
        },
        // 1110: Nature + Eco + Hap (No Kno)
        '1110': {
            title: "The Traditional Paradise",
            subtitle: "Golden Age Kingdom",
            analysis: "Seperti kerajaan dongeng masa lalu. Makmur, indah, dan damai. Tapi tanpa inovasi, kota ini akan tertinggal zaman.",
            mbtiMatch: "ESFJ (Consul)",
            weakness: "Stagnasi Teknologi",
            color: "from-amber-600 to-green-700"
        },
        // 1111: High Everything
        '1111': {
            title: "The Philosopher King",
            subtitle: "True Utopia",
            analysis: "Pencapaian mustahil. Anda menyeimbangkan segalanya dengan sempurna. Anda bukan politisi, Anda adalah legenda hidup.",
            mbtiMatch: "INFJ (The Rarest)",
            weakness: "Tidak Ada (Sempurna)",
            color: "from-indigo-500 via-purple-500 to-pink-500"
        }
    };

    return profiles[signature] || profiles['0000'];
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