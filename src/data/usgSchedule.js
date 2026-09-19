/**
 * USG Schedule — based on reference image from @newmommbaby.
 * Contains all recommended ultrasound milestones during pregnancy.
 */

const usgSchedule = [
  {
    id: 'usg-1',
    weekRange: [4, 5],
    weekLabel: 'Minggu 4–5',
    trimester: 1,
    title: 'Konfirmasi Kehamilan',
    description: 'Check USG positif hamil, pemeriksaan kantung janin (gestational sac). Memastikan lokasi kehamilan di dalam rahim (bukan kehamilan ektopik/di luar rahim).',
    whatToExpect: 'Dokter akan melakukan USG transvaginal untuk melihat kantung kehamilan. Belum bisa melihat janin secara jelas.',
    questionsToAsk: [
      'Apakah kantung janin terlihat normal?',
      'Apakah lokasi kehamilan di dalam rahim?',
      'Kapan jadwal kontrol selanjutnya?',
    ],
    icon: '🔍',
  },
  {
    id: 'usg-2',
    weekRange: [6, 8],
    weekLabel: 'Minggu 6–8',
    trimester: 1,
    title: 'Detak Jantung Bayi',
    description: 'Check perkembangan janin serta detak jantung bayi. Ini adalah momen pertama mendengar detak jantung si kecil!',
    whatToExpect: 'USG transvaginal untuk melihat embrio dan mendeteksi detak jantung (normalnya 120–160 bpm). Ukuran janin sekitar 1–2 cm.',
    questionsToAsk: [
      'Berapa detak jantung janin?',
      'Apakah perkembangan sesuai usia kehamilan?',
      'Apakah kehamilan tunggal atau kembar?',
    ],
    icon: '💓',
  },
  {
    id: 'usg-3',
    weekRange: [11, 13],
    weekLabel: 'Minggu 11–13',
    trimester: 1,
    title: 'Screening Down Syndrome & NIPT',
    description: 'Screening Down Syndrome dan NIPT (Non-Invasive Prenatal Testing) untuk deteksi kelainan kromosom. Check darah lengkap ibu.',
    whatToExpect: 'Pengukuran nuchal translucency (NT) — ketebalan cairan di belakang leher janin. Tes darah ibu untuk deteksi risiko kelainan kromosom.',
    questionsToAsk: [
      'Berapa hasil pengukuran NT?',
      'Apakah perlu tes NIPT tambahan?',
      'Bagaimana hasil cek darah lengkap?',
      'Apakah ada risiko yang perlu diperhatikan?',
    ],
    icon: '🧬',
  },
  {
    id: 'usg-4',
    weekRange: [16, 16],
    weekLabel: 'Minggu 16',
    trimester: 2,
    title: 'Check Jenis Kelamin',
    description: 'Pemeriksaan untuk mengetahui jenis kelamin bayi. Momen yang ditunggu-tunggu banyak orang tua!',
    whatToExpect: 'USG abdomen (perut). Dokter akan melihat organ genital janin untuk menentukan jenis kelamin, meskipun kadang posisi bayi membuat sulit terlihat.',
    questionsToAsk: [
      'Apakah jenis kelamin sudah bisa dipastikan?',
      'Bagaimana perkembangan janin secara umum?',
      'Apakah berat dan ukuran janin normal?',
    ],
    icon: '👶',
  },
  {
    id: 'usg-5',
    weekRange: [20, 24],
    weekLabel: 'Minggu 20–24',
    trimester: 2,
    title: 'USG 4D & Fetal Screening',
    description: 'USG 4D dan fetal screening untuk memeriksa kelengkapan organ bayi. Pemeriksaan anatomi detail (anomaly scan).',
    whatToExpect: 'Pemeriksaan detail seluruh organ: jantung, otak, tulang belakang, ginjal, tangan, kaki. USG 4D memberikan gambar 3 dimensi wajah bayi.',
    questionsToAsk: [
      'Apakah semua organ berkembang normal?',
      'Bagaimana kondisi plasenta dan air ketuban?',
      'Apakah ada kelainan yang terdeteksi?',
      'Berapa estimasi berat janin saat ini?',
    ],
    icon: '🫧',
  },
  {
    id: 'usg-6',
    weekRange: [28, 28],
    weekLabel: 'Minggu 28',
    trimester: 3,
    title: 'Cek Risiko Preeklampsia',
    description: 'Check tekanan darah dan berat badan bumil. Cek risiko preeklampsia pada ibu.',
    whatToExpect: 'Pemeriksaan tekanan darah, protein urine, dan berat badan ibu. USG untuk memonitor pertumbuhan janin dan volume air ketuban.',
    questionsToAsk: [
      'Apakah tekanan darah saya normal?',
      'Apakah ada tanda-tanda preeklampsia?',
      'Bagaimana pertumbuhan berat janin?',
      'Apakah volume air ketuban cukup?',
    ],
    icon: '🩺',
  },
  {
    id: 'usg-7',
    weekRange: [32, 32],
    weekLabel: 'Minggu 32',
    trimester: 3,
    title: 'Kontrol Kondisi Janin',
    description: 'Kontrol kondisi janin untuk memastikan pertumbuhan sesuai. Memonitor posisi dan berat badan bayi.',
    whatToExpect: 'USG untuk memeriksa pertumbuhan janin, posisi bayi (kepala di bawah/sungsang), dan kondisi plasenta. Estimasi berat janin ±1.800 gram.',
    questionsToAsk: [
      'Apakah posisi bayi sudah di bawah?',
      'Berapa estimasi berat janin?',
      'Apakah plasenta berfungsi baik?',
      'Kapan sebaiknya mulai persiapan persalinan?',
    ],
    icon: '📊',
  },
  {
    id: 'usg-8',
    weekRange: [36, 36],
    weekLabel: 'Minggu 36',
    trimester: 3,
    title: 'Kontrol Persiapan Lahiran',
    description: 'Kontrol persiapan lahiran: cek posisi janin beserta plasenta, jumlah air ketuban, lilitan tali pusar. CTG untuk mendeteksi kontraksi.',
    whatToExpect: 'Pemeriksaan menyeluruh menjelang persalinan. CTG (Cardiotocography) untuk memantau detak jantung janin dan kontraksi rahim.',
    questionsToAsk: [
      'Apakah posisi bayi sudah siap lahir?',
      'Ada lilitan tali pusar tidak?',
      'Bagaimana kondisi plasenta dan air ketuban?',
      'Apa hasil CTG? Apakah ada kontraksi?',
      'Apakah ada indikasi caesar?',
    ],
    icon: '🏥',
  },
  {
    id: 'usg-9',
    weekRange: [38, 38],
    weekLabel: 'Minggu 38',
    trimester: 3,
    title: 'Kontrol Terakhir',
    description: 'Kontrol terakhir sebelum persalinan. Memastikan semua kondisi siap untuk kelahiran.',
    whatToExpect: 'Pemeriksaan akhir: posisi bayi, pembukaan serviks, kesiapan persalinan. Diskusi rencana persalinan (birth plan).',
    questionsToAsk: [
      'Apakah sudah ada tanda-tanda persalinan?',
      'Kapan harus ke rumah sakit?',
      'Apa saja tanda darurat yang harus diwaspadai?',
      'Apakah saya perlu induksi?',
    ],
    icon: '🎯',
  },
];

/**
 * Get the next upcoming USG based on current week.
 */
export function getNextUSG(currentWeek) {
  return usgSchedule.find(
    (usg) => currentWeek <= usg.weekRange[1]
  ) || null;
}

/**
 * Get USG for a specific week.
 */
export function getUSGForWeek(week) {
  return usgSchedule.find(
    (usg) => week >= usg.weekRange[0] && week <= usg.weekRange[1]
  ) || null;
}

/**
 * Check if a given week has a USG scheduled.
 */
export function hasUSGInWeek(week) {
  return usgSchedule.some(
    (usg) => week >= usg.weekRange[0] && week <= usg.weekRange[1]
  );
}

export default usgSchedule;
