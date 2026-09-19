/**
 * Comprehensive Nutrition & Myth Buster Data for Indonesian Expectant Parents
 */

export const BALANCED_PLATE = {
  title: 'Isi Piringku Ibu Hamil (Standar Kemenkes RI)',
  description: 'Porsi gizi seimbang setiap kali makan untuk mencukupi kebutuhan Mama dan perkembangan janin.',
  portions: [
    {
      label: 'Makanan Pokok (Karbohidrat)',
      fraction: '1/3 Piring',
      emoji: '🍚',
      color: '#E0A96D',
      examples: 'Nasi putih/merah, ubi jalar, kentang rebus, oatmeal, jagung manis',
      tips: 'Pilih karbohidrat berserat agar gula darah stabil dan mencegah konstipasi hamil.',
    },
    {
      label: 'Sayuran Aneka Warna',
      fraction: '1/3 Piring',
      emoji: '🥦',
      color: '#7EAEB2',
      examples: 'Bayam, daun katuk, brokoli, labu siam, wortel, kangkung matang',
      tips: 'Sayuran hijau tua kaya asam folat dan zat besi untuk pembentukan sel darah merah.',
    },
    {
      label: 'Lauk Hewani & Nabati (Protein)',
      fraction: '1/6 Piring',
      emoji: '🐟',
      color: '#E8A0BF',
      examples: 'Telur ayam rebus matang, ikan kembung, tempe, tahu, dada ayam, daging sapi tanpa lemak',
      tips: 'Protein adalah zat pembangun utama jaringan tubuh, plasenta, dan sel otak janin.',
    },
    {
      label: 'Buah-buahan Segar',
      fraction: '1/6 Piring',
      emoji: '🍎',
      color: '#F2C97E',
      examples: 'Pepaya matang, pisang ambon, jeruk manis, alpukat, apel',
      tips: 'Kaya vitamin C untuk membantu penyerapan zat besi dan antioksidan alami.',
    },
  ],
};

export const LOCAL_SUPERFOODS = [
  {
    id: 'sf_ikan_kembung',
    name: 'Ikan Kembung',
    badge: 'Kaya DHA & Omega-3',
    emoji: '🐟',
    desc: 'Kandungan Omega-3 dan DHA pada ikan kembung setara atau bahkan lebih tinggi dari salmon, dengan harga terjangkau dan selalu segar di pasar lokal.',
    benefit: 'Mendukung pembentukan jutaan sel saraf dan kecerdasan otak janin.',
  },
  {
    id: 'sf_tempe_tahu',
    name: 'Tempe & Tahu',
    badge: 'Protein & Kalsium Nabati',
    emoji: '🌱',
    desc: 'Fermentasi kedelai pada tempe menghasilkan protein bermutu tinggi yang sangat mudah dicerna oleh lambung ibu hamil yang sensitif.',
    benefit: 'Membantu pembentukan tulang dan gigi janin tanpa kolesterol jahat.',
  },
  {
    id: 'sf_bayam_katuk',
    name: 'Bayam & Daun Katuk',
    badge: 'Zat Besi & Asam Folat',
    emoji: '🥬',
    desc: 'Sayuran berdaun hijau gelap kaya akan zat besi alami pembentuk hemoglobin serta klorofil yang menyegarkan.',
    benefit: 'Mencegah anemia kehamilan dan merangsang produksi ASI menjelang persalinan.',
  },
  {
    id: 'sf_telur',
    name: 'Telur Ayam (Matang Sempurna)',
    badge: 'Kolin & Asam Amino Lengkap',
    emoji: '🥚',
    desc: 'Salah satu makanan paling padat nutrisi di dunia. Kuning telur kaya akan kolin yang penting bagi tabung saraf janin.',
    benefit: 'Menurunkan risiko cacat tabung saraf dan mendukung perkembangan kognitif.',
  },
  {
    id: 'sf_alpukat',
    name: 'Buah Alpukat',
    badge: 'Lemak Sehat & Kalium',
    emoji: '🥑',
    desc: 'Mengandung asam lemak tak jenuh tunggal yang lembut di perut, kaya vitamin B6 yang efektif meredakan morning sickness.',
    benefit: 'Mencegah kram kaki di malam hari berkat kandungan kalium yang tinggi.',
  },
  {
    id: 'sf_kurma',
    name: 'Buah Kurma',
    badge: 'Energi & Serat Alami',
    emoji: '🌴',
    desc: 'Kaya akan fruktosa alami dan serat pangan. Penelitian menunjukkan konsumsi kurma di trimester 3 membantu proses pematangan serviks.',
    benefit: 'Memberikan energi instan saat kontraksi dan memperlancar persalinan.',
  },
];

export const MEDICAL_RESTRICTIONS = [
  {
    id: 'res_raw_meat',
    title: 'Daging, Telur & Seafood Mentah / Setengah Matang',
    riskLevel: 'Bahaya Tinggi',
    emoji: '🥩',
    danger: 'Risiko parasit Toksoplasmosis, bakteri Salmonella, dan Listeria.',
    guide: 'Pastikan daging steak dimasak well done, sate dibakar matang sempurna hingga ke dalam, dan telur rebus hingga kuningnya padat.',
  },
  {
    id: 'res_unwashed_veggies',
    title: 'Lalapan & Sayuran Mentah yang Tidak Dicuci Bersih',
    riskLevel: 'Perhatian Khusus',
    emoji: '🥗',
    danger: 'Kista Toxoplasma gondii sering menempel pada tanah dan debu di sayuran.',
    guide: 'Jika makan di luar, pilih sayuran yang sudah ditumis/direbus matang. Jika di rumah, cuci di bawah air mengalir yang bersih.',
  },
  {
    id: 'res_high_mercury',
    title: 'Ikan Laut Dalam Tinggi Merkuri',
    riskLevel: 'Bahaya Tinggi',
    emoji: '🦈',
    danger: 'Merkuri dapat menembus plasenta dan merusak sistem saraf otak bayi.',
    guide: 'Hindari ikan hiu, pedang (swordfish), makerel raja, dan batasi tuna steak. Pilih ikan kembung, lele, mujair, gurame, atau salmon.',
  },
  {
    id: 'res_unpasteurized',
    title: 'Susu & Keju Tanpa Pasteurisasi',
    riskLevel: 'Bahaya Tinggi',
    emoji: '🥛',
    danger: 'Bakteri Listeria monocytogenes dapat memicu keguguran atau infeksi berat pada bayi.',
    guide: 'Selalu periksa label kemasan: pastikan tertera tulisan "Susu Dipasteurisasi" atau "UHT". Hindari susu murni mentah yang tidak dimasak mendidih.',
  },
  {
    id: 'res_excess_caffeine',
    title: 'Kafein Berlebihan (> 200 mg / hari)',
    riskLevel: 'Perhatian Sedang',
    emoji: '☕',
    danger: 'Kafein berlebih dapat mempercepat detak jantung janin dan meningkatkan risiko berat badan lahir rendah (BBLR).',
    guide: 'Batasi maksimal 1 cangkir kopi kecil sehari (~150-200ml) dan perhatikan kandungan kafein pada teh pekat, boba, atau cokelat.',
  },
  {
    id: 'res_unprescribed_meds',
    title: 'Obat Bebas & Jamu Tradisional Tanpa Izin Sp.OG',
    riskLevel: 'Bahaya Tinggi',
    emoji: '💊',
    danger: 'Banyak zat aktif herbal belum teruji klinis keamanannya terhadap organ janin.',
    guide: 'Jangan meminum jamu pelancar haid, jamu pegal linu, atau obat flu/pereda nyeri tanpa konfirmasi dokter kandungan atau bidan.',
  },
];

export const MYTHS_AND_FACTS = [
  {
    id: 'myth_1',
    myth: 'Makan buah nanas saat hamil bisa menyebabkan keguguran?',
    isMyth: true,
    verdict: 'MITOS (Aman jika matang & porsi wajar)',
    explanation:
      'Nanas segar matang kaya vitamin C dan serat. Enzim bromelain yang konon melunakkan leher rahim hanya terkonsentrasi di bagian bonggol/inti nanas mentah dalam jumlah sangat besar (harus makan 7-10 buah nanas utuh sekaligus). Makan beberapa potong nanas manis matang sangat aman dan menyegarkan.',
    tag: 'Buah & Makanan',
  },
  {
    id: 'myth_2',
    myth: 'Minum air es atau air dingin bikin ukuran bayi besar di dalam kandungan?',
    isMyth: true,
    verdict: 'MITOS',
    explanation:
      'Air putih dingin memiliki 0 kalori! Suhu air akan langsung menyesuaikan dengan suhu hangat tubuh manusia begitu masuk ke lambung. Yang membuat bayi besar (makrosomia) adalah gula dan pemanis tambahan yang dicampurkan ke dalam es (misal: es sirup, es teh manis, boba, cendol).',
    tag: 'Minuman',
  },
  {
    id: 'myth_3',
    myth: 'Minum air kelapa muda bikin kulit bayi putih dan bersih saat lahir?',
    isMyth: true,
    verdict: 'MITOS (Tapi tetap sangat sehat)',
    explanation:
      'Warna kulit dan ketebalan rambut bayi 100% ditentukan oleh faktor genetika kedua orang tua. Namun, air kelapa muda sangat disarankan karena mengandung elektrolit alami (kalium, magnesium) yang membantu rehidrasi cairan tubuh dan meredakan dehidrasi pada ibu hamil.',
    tag: 'Minuman',
  },
  {
    id: 'myth_4',
    myth: 'Bentuk perut bulat tandanya perempuan, lancip tandanya laki-laki?',
    isMyth: true,
    verdict: 'MITOS',
    explanation:
      'Bentuk perut hamil ditentukan oleh kekuatan otot dinding perut ibu, postur tubuh ibu, jumlah air ketuban, dan posisi punggung janin. Satu-satunya cara akurat melihat jenis kelamin adalah melalui pemeriksaan USG oleh dokter mulai minggu ke-16 ke atas.',
    tag: 'Fisik & Penampilan',
  },
  {
    id: 'myth_5',
    myth: 'Ibu hamil harus makan porsi 2 orang dewasa?',
    isMyth: true,
    verdict: 'MITOS (Makan untuk dua orang, bukan porsi dua orang)',
    explanation:
      'Tambahan kalori yang dibutuhkan janin tidak sebanyak yang dibayangkan: Trimester 1 (hampir 0 kkal tambahan), Trimester 2 (+300 kkal), dan Trimester 3 (+450 kkal) — setara 1 mangkuk oatmeal + telur rebus. Yang terpenting adalah kepadatan gizi (kualitas), bukan kuantitas berlebih yang memicu diabetes kehamilan.',
    tag: 'Pola Makan',
  },
  {
    id: 'myth_6',
    myth: 'Ibu hamil tidak boleh potong rambut atau menjahit pakaian?',
    isMyth: true,
    verdict: 'MITOS MURNI',
    explanation:
      'Ini adalah mitos budaya tradisional tanpa korelasi medis sama sekali. Memotong rambut tidak memengaruhi perkembangan janin. Menjahit pakaian pun aman selama posisi duduk ergonomis dan tidak membuat punggung Mama pegal berlebihan.',
    tag: 'Budaya & Kebiasaan',
  },
];
