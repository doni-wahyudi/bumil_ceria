/**
 * BumpBuddy — Panduan Klinis & Ensiklopedia USG / Kesehatan Ibu
 * Berdasarkan Pedoman Buku KIA Kemenkes RI, POGI & Standar Obstetri Internasional (WHO / ISUOG)
 */

export const USG_INDICATORS = [
  {
    id: 'crl',
    code: 'CRL',
    name: 'Crown-Rump Length',
    indonesianName: 'Panjang Puncak Kepala ke Bokong',
    trimester: 'Trimester 1 (Minggu 6 – 14)',
    normalRange: 'Sesuai usia (misal: Mg 8 ~16 mm, Mg 12 ~54 mm)',
    unit: 'mm',
    description: 'Ukuran jarak dari puncak kepala hingga ujung bokong janin, tidak termasuk kaki atau kantung kuning telur.',
    clinicalMeaning: 'Merupakan standar emas (gold standard) paling akurat dalam menentukan usia kehamilan nyata dan mengoreksi HPL.',
    mitigation: 'Jika ukuran CRL berbeda > 5–7 hari dari tanggal HPHT, dokter obgyn biasanya akan memperbarui HPL resmi mengikuti hasil USG ini karena pertumbuhan janin di T1 sangat seragam.',
    badge: 'Penentu HPL',
  },
  {
    id: 'gs',
    code: 'GS',
    name: 'Gestational Sac',
    indonesianName: 'Diameter Kantung Kehamilan',
    trimester: 'Trimester 1 Awal (Minggu 4 – 7)',
    normalRange: 'Mulai terlihat mg 5 (~5–10 mm), bertambah ~1 mm/hari',
    unit: 'mm',
    description: 'Kantung cairan di dalam rahim tempat embrio berkembang pertama kali sebelum janin terlihat jelas.',
    clinicalMeaning: 'Memastikan kehamilan berada di dalam rongga rahim (intrauterin) dan menyingkirkan kehamilan di luar rahim (ektopik).',
    mitigation: 'Jika GS > 25 mm namun embrio belum tampak, dokter akan menjadwalkan USG ulang 1–2 minggu berikutnya untuk mengevaluasi perkembangan kutub janin.',
    badge: 'Deteksi Awal',
  },
  {
    id: 'bpd',
    code: 'BPD',
    name: 'Biparietal Diameter',
    indonesianName: 'Diameter Pelipis Kepala Janin',
    trimester: 'Trimester 2 & 3 (Minggu 14 – 40)',
    normalRange: 'Mg 20 ~47 mm, Mg 28 ~71 mm, Mg 36 ~88 mm',
    unit: 'mm',
    description: 'Jarak melintang antara dua tulang pelipis kiri dan kanan kepala janin.',
    clinicalMeaning: 'Mengukur perkembangan ukuran tulang tengkorak dan otak janin secara bertahap.',
    mitigation: 'Jika BPD jauh lebih kecil dari usia kehamilan, dokter akan memeriksa HC dan AC untuk membedakan variasi bentuk kepala alami (dolikosefali) dengan hambatan pertumbuhan (IUGR).',
    badge: 'Kepala & Otak',
  },
  {
    id: 'hc',
    code: 'HC',
    name: 'Head Circumference',
    indonesianName: 'Lingkar Kepala Janin',
    trimester: 'Trimester 2 & 3',
    normalRange: 'Sesuai persentil pertumbuhan kepala Hadlock',
    unit: 'mm',
    description: 'Keliling lingkar terluar kepala janin diukur melingkar.',
    clinicalMeaning: 'Menilai pertumbuhan volume kepala janin secara lebih akurat daripada BPD saja, tidak terpengaruh oleh bentuk kepala yang lonjong atau bulat.',
    mitigation: 'Dibandingkan dengan lingkar perut (AC). Jika kepala normal namun perut kecil, dicurigai IUGR asimetris akibat penurunan aliran darah plasenta.',
    badge: 'Proporsi Kepala',
  },
  {
    id: 'ac',
    code: 'AC',
    name: 'Abdominal Circumference',
    indonesianName: 'Lingkar Perut Janin',
    trimester: 'Trimester 2 & 3',
    normalRange: 'Sesuai kurva persentil berat Hadlock',
    unit: 'mm',
    description: 'Keliling lingkar perut janin setinggi organ hati dan vena umbilikalis.',
    clinicalMeaning: 'Indikator paling sensitif terhadap status gizi janin dan cadangan lemak hati janin. Paling menentukan taksiran berat janin (TBJ).',
    mitigation: 'Jika AC < persentil 10: indikasi janin kurang nutrisi. Ibu disarankan meningkatkan asupan protein tinggi (telur, daging, ikan, susu) dan istirahat miring ke kiri untuk memaksimalkan sirkulasi rahim.',
    badge: 'Status Gizi Janin',
  },
  {
    id: 'fl',
    code: 'FL',
    name: 'Femur Length',
    indonesianName: 'Panjang Tulang Paha Janin',
    trimester: 'Trimester 2 & 3',
    normalRange: 'Mg 20 ~32 mm, Mg 28 ~53 mm, Mg 36 ~68 mm',
    unit: 'mm',
    description: 'Panjang tulang paha janin dari ujung proksimal ke distal.',
    clinicalMeaning: 'Mencerminkan pertumbuhan tulang panjang dan estimasi tinggi/panjang janin kelak saat dilahirkan.',
    mitigation: 'Jika FL sangat pendek di bawah persentil 5, dokter akan mengevaluasi faktor genetik orang tua (apakah mama/papa berpostur pendek) serta menyingkirkan kelainan tulang bawaan.',
    badge: 'Tulang Panjang',
  },
  {
    id: 'efw',
    code: 'TBJ / EFW',
    name: 'Estimated Fetal Weight',
    indonesianName: 'Taksiran Berat Janin',
    trimester: 'Trimester 2 & 3',
    normalRange: 'Mg 24 ~600g, Mg 28 ~1000g, Mg 32 ~1800g, Mg 36 ~2600g, Mg 40 ~3200g',
    unit: 'gram',
    description: 'Perkiraan berat badan janin yang dihitung otomatis oleh mesin USG menggunakan algoritma matematis dari BPD, HC, AC, dan FL.',
    clinicalMeaning: 'Menilai apakah pertumbuhan janin berada dalam batas wajar (10%–90%) atau mengalami hambatan pertumbuhan / kelebihan bobot.',
    mitigation: 'Jika TBJ kecil: tingkatkan asupan kalori & protein berkualitas, tidur miring kiri. Jika TBJ terlalu besar (> 4000g di aterm): evaluasi risiko diabetes kehamilan dan persiapkan jalan lahir.',
    badge: 'Taksiran Berat',
  },
  {
    id: 'djj',
    code: 'DJJ / FHR',
    name: 'Fetal Heart Rate',
    indonesianName: 'Denyut Jantung Janin',
    trimester: 'Semua Trimester (Mulai Mg 6)',
    normalRange: '110 – 160 denyut/menit (bpm)',
    unit: 'bpm',
    description: 'Frekuensi detak jantung janin per menit.',
    clinicalMeaning: 'Indikator utama pasokan oksigen dan kesejahteraan janin di dalam rahim.',
    mitigation: '< 110 bpm menetap: waspada gawat janin (fetal distress) -> SEGERA KE IGD! > 160 bpm: waspada takikardia akibat demam ibu, dehidrasi, atau infeksi cairan ketuban.',
    badge: 'Kesejahteraan Janin',
  },
  {
    id: 'afi',
    code: 'AFI',
    name: 'Amniotic Fluid Index',
    indonesianName: 'Indeks Cairan Ketuban',
    trimester: 'Trimester 2 & 3',
    normalRange: '5 – 24 cm (Ideal: 8 – 18 cm)',
    unit: 'cm',
    description: 'Volume cairan ketuban diukur dari jumlah kedalaman 4 kuadran rahim.',
    clinicalMeaning: 'Melindungi janin dari benturan luar, membantu pematangan paru janin, dan mencegah jepitan tali pusat.',
    mitigation: 'AFI < 5 cm (Oligohidramnion): Minum air putih 2.5–3 liter/hari, istirahat berbaring, waspadai rembesan ketuban. AFI > 24 cm (Polihidramnion): Skrining diabetes dan USG organ cerna janin.',
    badge: 'Air Ketuban',
  },
  {
    id: 'placenta',
    code: 'Plasenta',
    name: 'Placenta Location & Grade',
    indonesianName: 'Letak & Derajat Maturasi Plasenta',
    trimester: 'Trimester 2 & 3',
    normalRange: 'Letak: Fundus / Korpus Anterior / Posterior. Derajat: Grade 0 s/d Grade III',
    unit: '',
    description: 'Posisi melekatnya ari-ari pada dinding rahim dan tingkat kematangan kalsifikasinya.',
    clinicalMeaning: 'Organ utama pemasok nutrisi dan oksigen dari tubuh ibu ke pembuluh darah janin.',
    mitigation: 'Plasenta Letak Rendah / Previa (< 2 cm dari mulut rahim): DILARANG berhubungan seksual, hindari angkat beban berat, dilarang pijat perut, siapkan persalinan sesar jika menutup jalan lahir hingga aterm.',
    badge: 'Posisi Ari-ari',
  },
];

/**
 * Indikator Kesehatan Vital Ibu (Standar Buku KIA Kemenkes RI)
 */
export const MATERNAL_VITAL_GUIDELINES = {
  bloodPressure: {
    name: 'Tekanan Darah (Tensi)',
    unit: 'mmHg',
    normal: '< 120/80 mmHg',
    description: 'Pemeriksaan tensi untuk mendeteksi dini risiko preeklampsia (keracunan kehamilan) yang dapat menyebabkan kejang dan gangguan aliran darah ke plasenta.',
    levels: [
      { maxSys: 119, maxDia: 79, status: 'normal', label: 'Normal', color: 'success', advice: 'Tekanan darah bagus! Pertahankan pola makan seimbang dan istirahat teratur.' },
      { maxSys: 139, maxDia: 89, status: 'warning', label: 'Pra-Hipertensi', color: 'warning', advice: 'Tensi mulai meningkat. Kurangi makanan asin/gurih, kelola stres, dan perbanyak istirahat miring ke kiri.' },
      { maxSys: 159, maxDia: 109, status: 'danger', label: 'Waspada Preeklampsia', color: 'danger', advice: 'Tensi tinggi (≥ 140/90). Segera konsultasi ke dokter kandungan, periksa protein urine di laboratorium, dan istirahat total.' },
      { maxSys: 999, maxDia: 999, status: 'critical', label: 'Krisis Hipertensi Darurat', color: 'danger', advice: 'Tensi sangat tinggi (≥ 160/110). SEGERA KE IGD RUMAH SAKIT terdekat! Waspada pusing berputar, pandangan kabur, atau nyeri ulu hati.' },
    ],
  },
  lila: {
    name: 'Lingkar Lengan Atas (LiLA)',
    unit: 'cm',
    cutoff: 23.5,
    description: 'Standar nasional Buku KIA untuk menilai status gizi ibu dan cadangan energi jangka panjang.',
    levels: [
      { min: 23.5, status: 'normal', label: 'Gizi Cukup (Normal)', color: 'success', advice: 'Status gizi ibu baik (≥ 23.5 cm). Pertahankan asupan makanan bergizi seimbang.' },
      { min: 0, status: 'danger', label: 'Risiko KEK (Kurang Energi Kronis)', color: 'danger', advice: 'LiLA di bawah 23.5 cm berisiko melahirkan bayi BBLR (< 2500g) dan stunting. Program Mitigasi: Konsumsi 2 butir telur/hari, susu hamil, tempe/tahu, dan makanan tambahan (PMT) tinggi protein.' },
    ],
  },
  hemoglobin: {
    name: 'Kadar Hemoglobin (Hb Darah)',
    unit: 'g/dL',
    description: 'Mengukur kecukupan sel darah merah pengangkut oksigen untuk ibu dan pertumbuhan janin.',
    levels: [
      { min: 11.0, status: 'normal', label: 'Normal (Hb Cukup)', color: 'success', advice: 'Kadar Hb baik (≥ 11.0 g/dL). Lanjutkan minum Tablet Tambah Darah (TTD) harian secara teratur.' },
      { min: 10.0, status: 'warning', label: 'Anemia Ringan (10.0–10.9)', color: 'warning', advice: 'Anemia ringan. Minum TTD rutin sebelum tidur dengan air jeruk (kaya vit C). HINDARI minum teh, kopi, atau susu 2 jam sebelum/sesudah TTD.' },
      { min: 8.0, status: 'danger', label: 'Anemia Sedang (8.0–9.9)', color: 'danger', advice: 'Anemia sedang. Konsultasikan ke dokter untuk evaluasi dosis suplemen zat besi, konsumsi hati ayam, daging merah, dan sayuran hijau tua.' },
      { min: 0, status: 'critical', label: 'Anemia Berat (< 8.0)', color: 'danger', advice: 'Hb sangat rendah. Bahaya perdarahan saat melahirkan! Segera ke dokter spesialis untuk kemungkinan terapi infus zat besi atau transfusi darah.' },
    ],
  },
  bloodSugar: {
    name: 'Gula Darah Sewaktu (GDS)',
    unit: 'mg/dL',
    description: 'Skrining risiko Diabetes Melitus Gestasional (kencing manis saat hamil) di trimester 2–3.',
    levels: [
      { max: 139, status: 'normal', label: 'Normal (< 140)', color: 'success', advice: 'Kadar gula darah stabil dalam batas aman.' },
      { max: 199, status: 'warning', label: 'Perlu Perhatian (140–199)', color: 'warning', advice: 'Kadar gula darah di atas batas optimal. Batasi konsumsi minuman manis, sirup, camilan tinggi gula, dan perbanyak serat sayuran.' },
      { max: 9999, status: 'danger', label: 'Waspada Diabetes Gestasional (≥ 200)', color: 'danger', advice: 'Gula darah tinggi dapat membuat janin tumbuh terlalu besar (makrosomia > 4kg). Wajib konsultasi ke dokter untuk tes TTGO.' },
    ],
  },
};

/**
 * Tanda Bahaya Kehamilan (Red Flags) Buku KIA
 */
export const PREGNANCY_RED_FLAGS = [
  {
    id: 'bleeding',
    title: 'Perdarahan dari Jalan Lahir',
    desc: 'Keluar bercak darah segar atau gumpalan darah merah, baik disertai nyeri perut maupun tidak.',
    urgency: 'Segera ke IGD RSIA terdekat. Jangan berhubungan seksual atau memijat perut.',
  },
  {
    id: 'fluid_leak',
    title: 'Keluar Cairan Ketuban (Ketuban Pecah Dini)',
    desc: 'Cairan bening/kekuningan merembes atau menyembur tanpa bisa ditahan, berbau amis khas.',
    urgency: 'Gunakan pembalut bersih dan segera ke RS! Bahaya infeksi dan tali pusat menumbung jika cairan habis.',
  },
  {
    id: 'headache_vision',
    title: 'Pusing Hebat, Mata Kabur & Nyeri Ulu Hati',
    desc: 'Sakit kepala tidak mereda dengan istirahat, pandangan berkunang-kunang, dan rasa perih di bawah tulang dada.',
    urgency: 'Gejala utama ancaman preeklampsia berat / eklampsia (kejang). Wajib penanganan medis segera.',
  },
  {
    id: 'fetal_movement_drop',
    title: 'Gerakan Janin Berkurang Drastis',
    desc: 'Janin bergerak kurang dari 10 kali dalam rentang waktu 2 jam atau 12 jam berturut-turut.',
    urgency: 'Rangsang dengan minum air dingin/manis dan tidur miring kiri. Jika tetap diam, segera cek DJJ di RS!',
  },
  {
    id: 'high_fever',
    title: 'Demam Tinggi (> 38°C) & Menggigil',
    desc: 'Suhu tubuh tinggi dapat memicu dehidrasi dan takikardia (detak jantung berlebih) pada janin.',
    urgency: 'Kompres hangat, perbanyak minum air putih, dan segera periksakan ke dokter/Puskesmas.',
  },
  {
    id: 'severe_vomiting',
    title: 'Mual Muntah Hebat (Hiperemesis Gravidarum)',
    desc: 'Muntah terus-menerus hingga tidak ada makanan/cairan yang bisa masuk sama sekali.',
    urgency: 'Waspada dehidrasi dan ketosis. Memerlukan bantuan cairan infus di klinik atau faskes.',
  },
];

/**
 * Helper Evaluasi Status Tekanan Darah
 */
export function evaluateBloodPressure(systolic, diastolic) {
  const sys = parseInt(systolic, 10);
  const dia = parseInt(diastolic, 10);
  if (!sys || !dia || Number.isNaN(sys) || Number.isNaN(dia)) return null;

  if (sys >= 160 || dia >= 110) {
    return MATERNAL_VITAL_GUIDELINES.bloodPressure.levels[3];
  }
  if (sys >= 140 || dia >= 90) {
    return MATERNAL_VITAL_GUIDELINES.bloodPressure.levels[2];
  }
  if (sys >= 120 || dia >= 80) {
    return MATERNAL_VITAL_GUIDELINES.bloodPressure.levels[1];
  }
  return MATERNAL_VITAL_GUIDELINES.bloodPressure.levels[0];
}

/**
 * Helper Evaluasi Status LiLA
 */
export function evaluateLila(lilaVal) {
  const num = parseFloat(lilaVal);
  if (!num || Number.isNaN(num)) return null;
  return num >= 23.5
    ? MATERNAL_VITAL_GUIDELINES.lila.levels[0]
    : MATERNAL_VITAL_GUIDELINES.lila.levels[1];
}

/**
 * Helper Evaluasi Status Hb
 */
export function evaluateHb(hbVal) {
  const num = parseFloat(hbVal);
  if (!num || Number.isNaN(num)) return null;
  if (num >= 11.0) return MATERNAL_VITAL_GUIDELINES.hemoglobin.levels[0];
  if (num >= 10.0) return MATERNAL_VITAL_GUIDELINES.hemoglobin.levels[1];
  if (num >= 8.0) return MATERNAL_VITAL_GUIDELINES.hemoglobin.levels[2];
  return MATERNAL_VITAL_GUIDELINES.hemoglobin.levels[3];
}

/**
 * Helper Evaluasi DJJ Janin
 */
export function evaluateDJJ(djjVal) {
  const num = parseInt(djjVal, 10);
  if (!num || Number.isNaN(num)) return null;
  if (num >= 110 && num <= 160) {
    return {
      status: 'normal',
      label: 'Normal (110–160 bpm)',
      color: 'success',
      advice: 'Denyut jantung janin dalam rentang normal dan stabil.',
    };
  }
  if (num < 110) {
    return {
      status: 'critical',
      label: 'Bradikardia (< 110 bpm)',
      color: 'danger',
      advice: 'Detak jantung janin terlalu lambat! Waspada gawat janin. SEGERA KE IGD RUMAH SAKIT!',
    };
  }
  return {
    status: 'warning',
    label: 'Takikardia (> 160 bpm)',
    color: 'warning',
    advice: 'Detak jantung janin cepat. Evaluasi suhu tubuh ibu (apakah demam), dehidrasi, atau stres fisik.',
  };
}

/**
 * Helper Evaluasi AFI (Air Ketuban)
 */
export function evaluateAFI(afiVal) {
  const num = parseFloat(afiVal);
  if (!num || Number.isNaN(num)) return null;
  if (num >= 8 && num <= 18) {
    return {
      status: 'normal',
      label: 'Ideal (8–18 cm)',
      color: 'success',
      advice: 'Jumlah air ketuban ideal untuk melindungi dan mendukung ruang gerak janin.',
    };
  }
  if (num >= 5 && num < 8) {
    return {
      status: 'warning',
      label: 'Batas Rendah (5–8 cm)',
      color: 'warning',
      advice: 'Ketuban agak sedikit. Tingkatkan minum air putih minimal 2.5–3 liter/hari dan perbanyak istirahat tidur miring kiri.',
    };
  }
  if (num < 5) {
    return {
      status: 'danger',
      label: 'Oligohidramnion (< 5 cm)',
      color: 'danger',
      advice: 'Ketuban sangat sedikit! Bahaya jepitan tali pusat. Segera konsultasikan ke dokter kandungan untuk pemantauan ketat.',
    };
  }
  return {
    status: 'warning',
    label: 'Polihidramnion (> 24 cm)',
    color: 'warning',
    advice: 'Jumlah ketuban berlebih. Konsultasikan ke dokter untuk skrining kadar gula darah dan saluran cerna janin.',
  };
}
