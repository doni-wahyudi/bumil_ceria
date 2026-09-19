/**
 * Comprehensive week-by-week pregnancy data (40 weeks).
 * Localized for Indonesian parents.
 *
 * Each week contains:
 * - babySize: fun size comparison with familiar Indonesian objects
 * - babyDevelopment: what's happening with the baby
 * - mamaSymptoms: what mama might experience
 * - mamaTips: advice for mama
 * - mamaChecklist: tasks for mama (with category)
 * - papaChecklist: tasks for papa (with category)
 *
 * Checklist categories:
 *   Mama: pemeriksaan, nutrisi, dokumen, kesehatan, persiapan_bayi
 *   Papa: keuangan, transportasi, support, rumah, dokumen
 */

const weeklyData = [
  // ==================== TRIMESTER 1 (Week 1-13) ====================
  {
    week: 1,
    trimester: 1,
    babySize: 'Belum terlihat',
    babySizeEmoji: '🌱',
    babyDevelopment: 'Secara teknis, minggu pertama kehamilan dihitung dari hari pertama haid terakhir (HPHT). Sel telur belum dibuahi, tapi tubuh Mama sedang mempersiapkan diri.',
    mamaSymptoms: 'Menstruasi normal. Belum ada gejala kehamilan.',
    mamaTips: 'Mulai konsumsi asam folat 400mcg/hari. Hindari alkohol dan rokok. Perbanyak makanan bergizi.',
    mamaChecklist: [
      { id: 'w1-m1', text: 'Mulai konsumsi suplemen asam folat', category: 'nutrisi', priority: 'high' },
      { id: 'w1-m2', text: 'Catat tanggal HPHT (Hari Pertama Haid Terakhir)', category: 'pemeriksaan', priority: 'high' },
      { id: 'w1-m3', text: 'Hindari konsumsi alkohol, rokok, dan obat tanpa resep', category: 'kesehatan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w1-p1', text: 'Dukung istri untuk hidup sehat — berhenti merokok di sekitar istri', category: 'support', priority: 'high' },
      { id: 'w1-p2', text: 'Mulai diskusi perencanaan keuangan untuk kehamilan', category: 'keuangan', priority: 'medium' },
    ],
  },
  {
    week: 2,
    trimester: 1,
    babySize: 'Belum terlihat',
    babySizeEmoji: '🌱',
    babyDevelopment: 'Ovulasi terjadi. Sel telur dilepaskan dari ovarium dan siap untuk dibuahi. Ini adalah masa subur Mama.',
    mamaSymptoms: 'Mungkin ada tanda ovulasi: keputihan bening, nyeri ringan di perut bawah.',
    mamaTips: 'Masa subur! Jika sedang program hamil, ini waktu yang tepat. Tetap konsumsi asam folat.',
    mamaChecklist: [
      { id: 'w2-m1', text: 'Lanjutkan suplemen asam folat', category: 'nutrisi', priority: 'high' },
      { id: 'w2-m2', text: 'Perbanyak makan sayuran hijau (bayam, kangkung, brokoli)', category: 'nutrisi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w2-p1', text: 'Jaga pola makan sehat bersama istri', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 3,
    trimester: 1,
    babySize: 'Sekecil biji wijen',
    babySizeEmoji: '🫘',
    babyDevelopment: 'Pembuahan terjadi! Sperma bertemu sel telur. Zigot terbentuk dan mulai membelah diri sambil bergerak menuju rahim.',
    mamaSymptoms: 'Belum ada gejala yang terasa. Beberapa wanita mengalami implantation bleeding ringan.',
    mamaTips: 'Tetap jalani rutinitas sehari-hari dengan sehat. Hindari stres berlebihan.',
    mamaChecklist: [
      { id: 'w3-m1', text: 'Minum air putih minimal 8 gelas per hari', category: 'kesehatan', priority: 'medium' },
      { id: 'w3-m2', text: 'Hindari makanan mentah (sushi, telur setengah matang)', category: 'nutrisi', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w3-p1', text: 'Cari tahu fasilitas kesehatan terdekat untuk pemeriksaan kehamilan', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 4,
    trimester: 1,
    babySize: 'Sebesar biji pepaya',
    babySizeEmoji: '🫘',
    babyDevelopment: 'Embrio menempel di dinding rahim (implantasi). Plasenta mulai terbentuk. Tes kehamilan bisa menunjukkan hasil positif!',
    mamaSymptoms: 'Telat haid, mual ringan mungkin mulai terasa, payudara sensitif, mudah lelah.',
    mamaTips: 'Lakukan tes kehamilan jika telat haid. Segera ke dokter jika positif untuk konfirmasi.',
    mamaChecklist: [
      { id: 'w4-m1', text: 'Lakukan tes kehamilan (test pack)', category: 'pemeriksaan', priority: 'high' },
      { id: 'w4-m2', text: 'Jika positif, jadwalkan USG pertama ke dokter/bidan', category: 'pemeriksaan', priority: 'high' },
      { id: 'w4-m3', text: 'Cek kelengkapan kartu BPJS / asuransi kesehatan', category: 'dokumen', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w4-p1', text: 'Temani istri melakukan tes kehamilan', category: 'support', priority: 'high' },
      { id: 'w4-p2', text: 'Siapkan dana darurat awal untuk biaya pemeriksaan', category: 'keuangan', priority: 'high' },
      { id: 'w4-p3', text: 'Pastikan BPJS / asuransi aktif dan mencakup kehamilan', category: 'dokumen', priority: 'high' },
    ],
  },
  {
    week: 5,
    trimester: 1,
    babySize: 'Sebesar biji jeruk',
    babySizeEmoji: '🍊',
    babyDevelopment: 'Jantung bayi mulai terbentuk dan berdetak! Tabung saraf (calon otak dan tulang belakang) berkembang.',
    mamaSymptoms: 'Morning sickness mulai terasa, payudara membesar dan nyeri, sering buang air kecil, mudah lelah.',
    mamaTips: 'Makan sedikit tapi sering untuk mengurangi mual. Crackers atau biskuit tawar bisa membantu.',
    mamaChecklist: [
      { id: 'w5-m1', text: '📋 USG: Konfirmasi kehamilan & pemeriksaan kantung janin', category: 'pemeriksaan', priority: 'high' },
      { id: 'w5-m2', text: 'Mulai makan sedikit tapi sering untuk atasi mual', category: 'nutrisi', priority: 'medium' },
      { id: 'w5-m3', text: 'Siapkan biskuit/crackers di samping tempat tidur', category: 'kesehatan', priority: 'low' },
    ],
    papaChecklist: [
      { id: 'w5-p1', text: 'Antar istri ke dokter untuk USG pertama', category: 'support', priority: 'high' },
      { id: 'w5-p2', text: 'Siapkan snack sehat yang bisa dimakan istri kapan saja', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 6,
    trimester: 1,
    babySize: 'Sebesar kacang polong',
    babySizeEmoji: '🫛',
    babyDevelopment: 'Hidung, mulut, dan telinga mulai terbentuk. Tangan dan kaki mulai berkembang sebagai tunas kecil.',
    mamaSymptoms: 'Mual dan muntah meningkat (morning sickness), perubahan mood, sensitive terhadap bau.',
    mamaTips: 'Jahe bisa membantu meredakan mual — coba wedang jahe hangat. Istirahat cukup.',
    mamaChecklist: [
      { id: 'w6-m1', text: '📋 USG: Check perkembangan & detak jantung bayi', category: 'pemeriksaan', priority: 'high' },
      { id: 'w6-m2', text: 'Konsumsi jahe untuk mengurangi mual (wedang jahe/permen jahe)', category: 'nutrisi', priority: 'medium' },
      { id: 'w6-m3', text: 'Daftarkan kehamilan di Puskesmas untuk dapat Buku KIA', category: 'dokumen', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w6-p1', text: 'Pahami bahwa mood swing istri adalah normal — bersabar', category: 'support', priority: 'high' },
      { id: 'w6-p2', text: 'Bantu pekerjaan rumah lebih banyak', category: 'support', priority: 'medium' },
      { id: 'w6-p3', text: 'Antar istri ke Puskesmas untuk daftarkan kehamilan', category: 'support', priority: 'high' },
    ],
  },
  {
    week: 7,
    trimester: 1,
    babySize: 'Sebesar buah blueberry',
    babySizeEmoji: '🫐',
    babyDevelopment: 'Otak berkembang pesat. Lengan dan kaki semakin jelas. Wajah mulai terbentuk dengan mata dan lubang hidung.',
    mamaSymptoms: 'Mual berlanjut, kelelahan, payudara semakin besar, mungkin ada jerawat.',
    mamaTips: 'Pilih bra yang nyaman dan suportif. Hindari kafein berlebihan (max 200mg/hari).',
    mamaChecklist: [
      { id: 'w7-m1', text: 'Beli bra hamil yang nyaman dan suportif', category: 'persiapan_bayi', priority: 'medium' },
      { id: 'w7-m2', text: 'Batasi kafein — maksimal 1 cangkir kopi/hari', category: 'nutrisi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w7-p1', text: 'Mulai riset estimasi biaya persalinan (normal vs caesar)', category: 'keuangan', priority: 'medium' },
      { id: 'w7-p2', text: 'Buat spreadsheet tabungan khusus persiapan bayi', category: 'keuangan', priority: 'medium' },
    ],
  },
  {
    week: 8,
    trimester: 1,
    babySize: 'Sebesar buah anggur',
    babySizeEmoji: '🍇',
    babyDevelopment: 'Jari tangan dan kaki mulai terbentuk. Bayi mulai bergerak, meskipun Mama belum bisa merasakannya.',
    mamaSymptoms: 'Mual masih kuat, perut kembung, sembelit mulai terasa, sering merasa lapar.',
    mamaTips: 'Perbanyak serat: buah pepaya, sayur bayam, dan air putih. Konsumsi makanan tinggi protein.',
    mamaChecklist: [
      { id: 'w8-m1', text: 'Tingkatkan asupan protein (telur, tempe, tahu, ikan)', category: 'nutrisi', priority: 'medium' },
      { id: 'w8-m2', text: 'Perbanyak serat untuk mengatasi sembelit', category: 'nutrisi', priority: 'medium' },
      { id: 'w8-m3', text: 'Jadwalkan kunjungan ANC (Antenatal Care) pertama di Puskesmas jika belum', category: 'pemeriksaan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w8-p1', text: 'Belikan buah-buahan segar untuk istri setiap minggu', category: 'support', priority: 'medium' },
      { id: 'w8-p2', text: 'Ikut mendampingi istri kontrol ke bidan/dokter', category: 'support', priority: 'high' },
    ],
  },
  {
    week: 9,
    trimester: 1,
    babySize: 'Sebesar buah kurma',
    babySizeEmoji: '🫒',
    babyDevelopment: 'Semua organ vital sudah terbentuk. Ekor embrio menghilang. Bayi sekarang disebut janin (fetus).',
    mamaSymptoms: 'Mual mungkin memuncak minggu ini. Berat badan mungkin belum banyak bertambah.',
    mamaTips: 'Jika mual parah (hiperemesis), segera konsultasi ke dokter. Jangan ragu minta obat anti mual.',
    mamaChecklist: [
      { id: 'w9-m1', text: 'Konsultasi dokter jika mual/muntah sangat parah', category: 'pemeriksaan', priority: 'high' },
      { id: 'w9-m2', text: 'Pastikan konsumsi asam folat tetap rutin', category: 'nutrisi', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w9-p1', text: 'Masak atau belikan makanan yang tidak bikin istri mual', category: 'support', priority: 'medium' },
      { id: 'w9-p2', text: 'Mulai baca-baca tentang tahapan kehamilan', category: 'support', priority: 'low' },
    ],
  },
  {
    week: 10,
    trimester: 1,
    babySize: 'Sebesar buah stroberi',
    babySizeEmoji: '🍓',
    babyDevelopment: 'Organ vital mulai berfungsi. Tulang dan tulang rawan terbentuk. Gigi mulai berkembang di dalam gusi.',
    mamaSymptoms: 'Mual mulai berkurang perlahan, perut mulai sedikit membuncit, pembuluh darah lebih terlihat.',
    mamaTips: 'Mulai gunakan produk perawatan kulit yang aman untuk ibu hamil (tanpa retinol).',
    mamaChecklist: [
      { id: 'w10-m1', text: 'Ganti skincare dengan produk yang aman untuk bumil', category: 'kesehatan', priority: 'medium' },
      { id: 'w10-m2', text: 'Mulai pakai celana hamil jika perut mulai membesar', category: 'persiapan_bayi', priority: 'low' },
    ],
    papaChecklist: [
      { id: 'w10-p1', text: 'Diskusikan kapan akan memberi tahu keluarga & teman', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 11,
    trimester: 1,
    babySize: 'Sebesar buah ara (fig)',
    babySizeEmoji: '🥝',
    babyDevelopment: 'Wajah hampir lengkap terbentuk. Kuku jari mulai tumbuh. Bayi sudah bisa cegukan!',
    mamaSymptoms: 'Mual berkurang, lebih berenergi, mungkin ada gusi bengkak/berdarah saat sikat gigi.',
    mamaTips: 'Perhatikan kesehatan gigi dan mulut — ke dokter gigi untuk pemeriksaan rutin.',
    mamaChecklist: [
      { id: 'w11-m1', text: '📋 USG: Screening Down Syndrome & NIPT', category: 'pemeriksaan', priority: 'high' },
      { id: 'w11-m2', text: 'Check darah lengkap ibu', category: 'pemeriksaan', priority: 'high' },
      { id: 'w11-m3', text: 'Periksa kesehatan gigi ke dokter gigi', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w11-p1', text: 'Antar istri untuk screening & tes darah', category: 'support', priority: 'high' },
      { id: 'w11-p2', text: 'Siapkan dana untuk biaya screening NT dan NIPT', category: 'keuangan', priority: 'high' },
    ],
  },
  {
    week: 12,
    trimester: 1,
    babySize: 'Sebesar buah jeruk nipis',
    babySizeEmoji: '🍋',
    babyDevelopment: 'Refleks mulai berkembang — bayi bisa mengepalkan tangan. Organ reproduksi mulai terbentuk.',
    mamaSymptoms: 'Mual umumnya mulai mereda. Muncul garis gelap di perut (linea nigra).',
    mamaTips: 'Aman untuk mulai memberi tahu orang terdekat tentang kehamilan setelah screening trimester 1 selesai.',
    mamaChecklist: [
      { id: 'w12-m1', text: 'Evaluasi hasil screening trimester 1 dengan dokter', category: 'pemeriksaan', priority: 'high' },
      { id: 'w12-m2', text: 'Mulai olahraga ringan: jalan kaki 30 menit/hari', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w12-p1', text: 'Beri tahu keluarga tentang kehamilan (jika sudah siap)', category: 'support', priority: 'medium' },
      { id: 'w12-p2', text: 'Mulai riset asuransi tambahan jika diperlukan', category: 'keuangan', priority: 'medium' },
    ],
  },
  {
    week: 13,
    trimester: 1,
    babySize: 'Sebesar buah lemon',
    babySizeEmoji: '🍋',
    babyDevelopment: 'Sidik jari sudah unik! Organ sudah cukup berkembang. Risiko keguguran menurun signifikan.',
    mamaSymptoms: 'Energi kembali meningkat, mual mereda, nafsu makan mulai pulih.',
    mamaTips: 'Selamat memasuki Trimester 2! Ini biasanya fase paling nyaman dalam kehamilan.',
    mamaChecklist: [
      { id: 'w13-m1', text: 'Mulai konsumsi vitamin kehamilan lengkap (zat besi, kalsium, DHA)', category: 'nutrisi', priority: 'high' },
      { id: 'w13-m2', text: 'Ikuti Kelas Ibu Hamil di Puskesmas (gratis)', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w13-p1', text: 'Ikut Kelas Ibu Hamil bersama istri jika tersedia', category: 'support', priority: 'medium' },
      { id: 'w13-p2', text: 'Update daftar pengeluaran kehamilan', category: 'keuangan', priority: 'medium' },
    ],
  },
  // ==================== TRIMESTER 2 (Week 14-27) ====================
  {
    week: 14,
    trimester: 2,
    babySize: 'Sebesar buah kiwi',
    babySizeEmoji: '🥝',
    babyDevelopment: 'Bayi mulai membuat ekspresi wajah! Lanugo (bulu halus) mulai tumbuh di seluruh tubuh.',
    mamaSymptoms: 'Energi meningkat, mual biasanya sudah hilang, mungkin ada hidung tersumbat.',
    mamaTips: 'Nikmati fase golden period ini. Mulai perhatikan pola makan yang lebih terstruktur.',
    mamaChecklist: [
      { id: 'w14-m1', text: 'Tingkatkan asupan protein: 75-100 gram per hari', category: 'nutrisi', priority: 'medium' },
      { id: 'w14-m2', text: 'Mulai gunakan sunscreen saat ke luar rumah (hindari melasma)', category: 'kesehatan', priority: 'low' },
    ],
    papaChecklist: [
      { id: 'w14-p1', text: 'Rencanakan babymoon sederhana bersama istri', category: 'support', priority: 'low' },
      { id: 'w14-p2', text: 'Mulai diskusi nama bayi', category: 'support', priority: 'low' },
    ],
  },
  {
    week: 15,
    trimester: 2,
    babySize: 'Sebesar buah apel',
    babySizeEmoji: '🍎',
    babyDevelopment: 'Tulang semakin keras. Bayi bisa merasakan cahaya meskipun kelopak mata masih tertutup.',
    mamaSymptoms: 'Perut semakin terlihat, mungkin ada nyeri pinggang ringan, gusi sensitif.',
    mamaTips: 'Mulai tidur miring ke kiri untuk aliran darah optimal ke bayi.',
    mamaChecklist: [
      { id: 'w15-m1', text: 'Biasakan tidur miring ke kiri', category: 'kesehatan', priority: 'medium' },
      { id: 'w15-m2', text: 'Beli bantal hamil untuk tidur lebih nyaman', category: 'persiapan_bayi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w15-p1', text: 'Belikan bantal hamil untuk kenyamanan istri tidur', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 16,
    trimester: 2,
    babySize: 'Sebesar buah alpukat',
    babySizeEmoji: '🥑',
    babyDevelopment: 'Mata mulai bergerak, otot wajah berkembang, sistem saraf semakin matang. Jenis kelamin mungkin bisa terlihat di USG!',
    mamaSymptoms: 'Baby bump semakin terlihat, mungkin mulai merasakan gerakan bayi (butterfly flutters).',
    mamaTips: 'Jadwalkan USG untuk cek jenis kelamin jika ingin tahu. Ini momen spesial!',
    mamaChecklist: [
      { id: 'w16-m1', text: '📋 USG: Check jenis kelamin bayi', category: 'pemeriksaan', priority: 'high' },
      { id: 'w16-m2', text: 'Kontrol rutin ke bidan/dokter', category: 'pemeriksaan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w16-p1', text: 'Temani istri USG untuk lihat jenis kelamin bayi!', category: 'support', priority: 'high' },
      { id: 'w16-p2', text: 'Mulai buat list perlengkapan bayi yang diperlukan', category: 'rumah', priority: 'medium' },
    ],
  },
  {
    week: 17,
    trimester: 2,
    babySize: 'Sebesar buah mangga kecil',
    babySizeEmoji: '🥭',
    babyDevelopment: 'Lemak mulai terbentuk di bawah kulit. Tali pusar semakin kuat. Bayi bisa mendengar suara dari luar.',
    mamaSymptoms: 'Nafsu makan meningkat, perubahan pigmentasi kulit, mungkin ada mimisan.',
    mamaTips: 'Mulai ajak bayi bicara — dia sudah bisa mendengar suara Mama dan Papa!',
    mamaChecklist: [
      { id: 'w17-m1', text: 'Mulai ajak bicara / cerita ke bayi dalam kandungan', category: 'kesehatan', priority: 'low' },
      { id: 'w17-m2', text: 'Perbanyak makanan kaya kalsium (susu, keju, ikan teri)', category: 'nutrisi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w17-p1', text: 'Ajak ngobrol bayi lewat perut istri — dia bisa dengar!', category: 'support', priority: 'low' },
      { id: 'w17-p2', text: 'Mulai sisihkan tabungan rutin khusus persiapan bayi', category: 'keuangan', priority: 'high' },
    ],
  },
  {
    week: 18,
    trimester: 2,
    babySize: 'Sebesar ubi jalar kecil',
    babySizeEmoji: '🍠',
    babyDevelopment: 'Sidik jari terbentuk sempurna. Jika perempuan, rahim dan saluran tuba sudah terbentuk.',
    mamaSymptoms: 'Gerakan bayi semakin terasa (quickening), kaki mungkin bengkak, napas lebih pendek.',
    mamaTips: 'Jika kaki bengkak, angkat kaki saat istirahat. Kurangi makanan tinggi garam.',
    mamaChecklist: [
      { id: 'w18-m1', text: 'Kurangi asupan garam untuk mengurangi bengkak', category: 'nutrisi', priority: 'medium' },
      { id: 'w18-m2', text: 'Lakukan senam hamil ringan atau yoga prenatal', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w18-p1', text: 'Bantu pijat kaki istri jika bengkak', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 19,
    trimester: 2,
    babySize: 'Sebesar buah mangga',
    babySizeEmoji: '🥭',
    babyDevelopment: 'Vernix caseosa (lapisan pelindung putih) melapisi kulit bayi. Otak mengembangkan area sensorik.',
    mamaSymptoms: 'Nyeri ligamen round (nyeri tajam di perut bawah saat bergerak cepat), kulit mungkin gatal.',
    mamaTips: 'Gunakan body lotion/minyak untuk kulit perut yang gatal dan mencegah stretch marks.',
    mamaChecklist: [
      { id: 'w19-m1', text: 'Gunakan body lotion/bio oil untuk perut secara rutin', category: 'kesehatan', priority: 'medium' },
      { id: 'w19-m2', text: 'Hindari gerakan tiba-tiba yang bisa menyebabkan nyeri ligamen', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w19-p1', text: 'Bantu oleskan lotion di perut istri yang sulit dijangkau', category: 'support', priority: 'low' },
    ],
  },
  {
    week: 20,
    trimester: 2,
    babySize: 'Sebesar buah pisang',
    babySizeEmoji: '🍌',
    babyDevelopment: 'Setengah perjalanan! Bayi menelan air ketuban dan menghasilkan mekonium. Gerakan semakin aktif.',
    mamaSymptoms: 'Perut semakin besar, sesak napas ringan, mungkin ada heartburn/maag.',
    mamaTips: 'Selamat, sudah setengah jalan! Jadwalkan USG anatomi (anomaly scan) minggu ini.',
    mamaChecklist: [
      { id: 'w20-m1', text: '📋 USG 4D: Fetal screening kelengkapan organ (anomaly scan)', category: 'pemeriksaan', priority: 'high' },
      { id: 'w20-m2', text: 'Makan sedikit tapi sering untuk mengurangi heartburn', category: 'nutrisi', priority: 'medium' },
      { id: 'w20-m3', text: 'Kontrol berat badan — target kenaikan 0.5kg/minggu', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w20-p1', text: 'Temani istri USG 4D — momen melihat wajah bayi!', category: 'support', priority: 'high' },
      { id: 'w20-p2', text: 'Mulai riset perlengkapan bayi: stroller, car seat, box bayi', category: 'rumah', priority: 'medium' },
    ],
  },
  {
    week: 21,
    trimester: 2,
    babySize: 'Sebesar wortel besar',
    babySizeEmoji: '🥕',
    babyDevelopment: 'Indra perasa berkembang — bayi bisa merasakan rasa air ketuban. Alis dan kelopak mata terbentuk.',
    mamaSymptoms: 'Stretch marks mungkin mulai muncul, varises, kram kaki terutama malam hari.',
    mamaTips: 'Makan makanan kaya magnesium (pisang, almond, bayam) untuk mengurangi kram kaki.',
    mamaChecklist: [
      { id: 'w21-m1', text: 'Konsumsi makanan kaya magnesium untuk mengurangi kram', category: 'nutrisi', priority: 'medium' },
      { id: 'w21-m2', text: 'Mulai pakai compression socks jika varises mengganggu', category: 'kesehatan', priority: 'low' },
    ],
    papaChecklist: [
      { id: 'w21-p1', text: 'Pijat betis istri saat kram malam hari', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 22,
    trimester: 2,
    babySize: 'Sebesar buah kelapa muda',
    babySizeEmoji: '🥥',
    babyDevelopment: 'Mata terbentuk sempurna meskipun iris belum berwarna. Pankreas berkembang. Berat ±450 gram.',
    mamaSymptoms: 'Perut semakin menonjol, punggung pegal, mungkin ada kontraksi Braxton Hicks ringan.',
    mamaTips: 'Kontraksi Braxton Hicks (palsu) adalah normal. Beda dengan kontraksi asli: tidak teratur dan tidak semakin kuat.',
    mamaChecklist: [
      { id: 'w22-m1', text: 'Pelajari perbedaan kontraksi Braxton Hicks vs kontraksi asli', category: 'kesehatan', priority: 'medium' },
      { id: 'w22-m2', text: 'Lanjutkan senam hamil / jalan kaki rutin', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w22-p1', text: 'Pelajari tanda-tanda persalinan (untuk jaga-jaga)', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 23,
    trimester: 2,
    babySize: 'Sebesar buah pepaya kecil',
    babySizeEmoji: '🥭',
    babyDevelopment: 'Paru-paru mulai memproduksi surfaktan untuk persiapan bernapas. Pendengaran semakin baik.',
    mamaSymptoms: 'Gusi lebih sensitif, bengkak di kaki dan tangan, sulit tidur malam.',
    mamaTips: 'Coba dengarkan musik klasik atau murotal — baik untuk perkembangan otak bayi.',
    mamaChecklist: [
      { id: 'w23-m1', text: 'Perdengarkan musik/murotal untuk stimulasi bayi', category: 'kesehatan', priority: 'low' },
      { id: 'w23-m2', text: 'Periksa gigi jika gusi sering berdarah', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w23-p1', text: 'Bacakan cerita atau doa untuk bayi dalam kandungan', category: 'support', priority: 'low' },
    ],
  },
  {
    week: 24,
    trimester: 2,
    babySize: 'Sebesar jagung besar',
    babySizeEmoji: '🌽',
    babyDevelopment: 'Bayi sudah memiliki siklus tidur-bangun. Wajah hampir seperti bayi baru lahir. Berat ±600 gram.',
    mamaSymptoms: 'Perut gatal karena kulit meregang, linea nigra semakin gelap, kelelahan meningkat.',
    mamaTips: 'Cek apakah ada tanda diabetes gestasional — biasanya dokter akan tes gula darah sekitar minggu ini.',
    mamaChecklist: [
      { id: 'w24-m1', text: 'Tes gula darah untuk screening diabetes gestasional', category: 'pemeriksaan', priority: 'high' },
      { id: 'w24-m2', text: 'Mulai siapkan daftar perlengkapan bayi baru lahir', category: 'persiapan_bayi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w24-p1', text: 'Mulai pelan-pelan beli perlengkapan bayi (cicil setiap bulan)', category: 'keuangan', priority: 'medium' },
      { id: 'w24-p2', text: 'Siapkan kamar/area untuk bayi di rumah', category: 'rumah', priority: 'medium' },
    ],
  },
  {
    week: 25,
    trimester: 2,
    babySize: 'Sebesar buah naga',
    babySizeEmoji: '🫒',
    babyDevelopment: 'Rambut mulai tumbuh. Kapiler darah terbentuk, kulit mulai berwarna kemerahan.',
    mamaSymptoms: 'Sering BAK karena tekanan pada kandung kemih, kaki kram, kadang sesak.',
    mamaTips: 'Tetap minum banyak air meskipun sering ke toilet. Dehidrasi bisa memicu kontraksi.',
    mamaChecklist: [
      { id: 'w25-m1', text: 'Minum minimal 10 gelas air per hari', category: 'nutrisi', priority: 'medium' },
      { id: 'w25-m2', text: 'Kontrol rutin bulanan ke bidan/dokter', category: 'pemeriksaan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w25-p1', text: 'Pastikan selalu ada air minum untuk istri', category: 'support', priority: 'low' },
      { id: 'w25-p2', text: 'Mulai diskusi birth plan dengan istri', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 26,
    trimester: 2,
    babySize: 'Sebesar buah terong',
    babySizeEmoji: '🍆',
    babyDevelopment: 'Mata mulai terbuka! Bayi bereaksi terhadap suara dan cahaya. Paru-paru terus berkembang.',
    mamaSymptoms: 'Kontraksi Braxton Hicks lebih sering, susah tidur, rasa panas di dada (heartburn).',
    mamaTips: 'Hindari makan besar sebelum tidur. Tidur dengan posisi kepala lebih tinggi.',
    mamaChecklist: [
      { id: 'w26-m1', text: 'Jangan makan 2-3 jam sebelum tidur untuk kurangi heartburn', category: 'nutrisi', priority: 'medium' },
      { id: 'w26-m2', text: 'Mulai hitung gerakan bayi — minimal 10 tendangan per 2 jam', category: 'kesehatan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w26-p1', text: 'Bantu hitung gerakan bayi bersama istri', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 27,
    trimester: 2,
    babySize: 'Sebesar buah kembang kol',
    babySizeEmoji: '🥦',
    babyDevelopment: 'Otak sangat aktif — bayi bermimpi! Paru-paru hampir matang. Berat ±900 gram.',
    mamaSymptoms: 'Kaki bengkak, insomnia, kram kaki, gatal di perut.',
    mamaTips: 'Minggu depan masuk Trimester 3! Mulai pikirkan persiapan persalinan.',
    mamaChecklist: [
      { id: 'w27-m1', text: 'Mulai siapkan mental dan fisik untuk trimester 3', category: 'kesehatan', priority: 'medium' },
      { id: 'w27-m2', text: 'Persiapkan dokumen untuk pendaftaran RS persalinan', category: 'dokumen', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w27-p1', text: 'Survey rumah sakit/klinik untuk persalinan', category: 'transportasi', priority: 'high' },
      { id: 'w27-p2', text: 'Cek rute tercepat ke RS dari rumah', category: 'transportasi', priority: 'medium' },
    ],
  },
  // ==================== TRIMESTER 3 (Week 28-40) ====================
  {
    week: 28,
    trimester: 3,
    babySize: 'Sebesar buah nanas',
    babySizeEmoji: '🍍',
    babyDevelopment: 'Bayi bisa berkedip, batuk, cegukan, dan bermimpi. Lapisan lemak terus bertambah. Berat ±1 kg.',
    mamaSymptoms: 'Kontrol tekanan darah penting! Bengkak, sesak napas, sering BAK, punggung pegal.',
    mamaTips: 'Mulai Trimester 3! Kontrol tekanan darah rutin. Waspada tanda preeklampsia: tekanan darah tinggi, bengkak berlebihan, pandangan kabur.',
    mamaChecklist: [
      { id: 'w28-m1', text: '📋 USG: Check tekanan darah, berat badan, risiko preeklampsia', category: 'pemeriksaan', priority: 'high' },
      { id: 'w28-m2', text: 'Kontrol setiap 2 minggu mulai sekarang', category: 'pemeriksaan', priority: 'high' },
      { id: 'w28-m3', text: 'Daftarkan diri untuk kelas persiapan persalinan', category: 'kesehatan', priority: 'medium' },
      { id: 'w28-m4', text: 'Mulai siapkan daftar isi tas persalinan', category: 'persiapan_bayi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w28-p1', text: 'Antar istri kontrol tekanan darah & cek preeklampsia', category: 'support', priority: 'high' },
      { id: 'w28-p2', text: 'Daftarkan persalinan di RS pilihan', category: 'transportasi', priority: 'high' },
      { id: 'w28-p3', text: 'Pastikan kendaraan selalu siap dan bensin penuh', category: 'transportasi', priority: 'medium' },
      { id: 'w28-p4', text: 'Simpan nomor darurat: RS, dokter, ambulans', category: 'transportasi', priority: 'high' },
    ],
  },
  {
    week: 29,
    trimester: 3,
    babySize: 'Sebesar labu siam besar',
    babySizeEmoji: '🎃',
    babyDevelopment: 'Otot dan paru-paru semakin matang. Otak mengendalikan suhu tubuh dan pernapasan.',
    mamaSymptoms: 'Sesak napas lebih terasa, sulit menemukan posisi tidur nyaman, kram kaki malam.',
    mamaTips: 'Gunakan bantal di antara kaki saat tidur miring. Senam hamil sangat membantu.',
    mamaChecklist: [
      { id: 'w29-m1', text: 'Rutin senam hamil untuk persiapan persalinan', category: 'kesehatan', priority: 'medium' },
      { id: 'w29-m2', text: 'Perbanyak makanan kaya zat besi (daging, bayam, hati ayam)', category: 'nutrisi', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w29-p1', text: 'Ikut kelas persiapan persalinan bersama istri', category: 'support', priority: 'medium' },
      { id: 'w29-p2', text: 'Pelajari cara membantu istri saat kontraksi', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 30,
    trimester: 3,
    babySize: 'Sebesar buah kelapa',
    babySizeEmoji: '🥥',
    babyDevelopment: 'Lanugo mulai rontok. Bayi semakin gemuk. Otak berkembang dengan kerutan (gyri).',
    mamaSymptoms: 'Sulit bernapas karena rahim menekan diafragma, sering heartburn, kelelahan meningkat.',
    mamaTips: 'Istirahat cukup, jangan memaksakan diri. Minta bantuan untuk tugas berat.',
    mamaChecklist: [
      { id: 'w30-m1', text: 'Mulai siapkan tas persalinan (isi secara bertahap)', category: 'persiapan_bayi', priority: 'high' },
      { id: 'w30-m2', text: 'Cek kelengkapan dokumen: KTP, KK, surat nikah, BPJS', category: 'dokumen', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w30-p1', text: 'Bantu istri menyiapkan tas persalinan', category: 'support', priority: 'high' },
      { id: 'w30-p2', text: 'Siapkan fotokopi dokumen: KTP, KK, surat nikah, BPJS', category: 'dokumen', priority: 'high' },
      { id: 'w30-p3', text: 'Pastikan tabungan persalinan sudah mencukupi', category: 'keuangan', priority: 'high' },
    ],
  },
  {
    week: 31,
    trimester: 3,
    babySize: 'Sebesar buah melon kecil',
    babySizeEmoji: '🍈',
    babyDevelopment: 'Semua indra berfungsi. Bayi merespons cahaya, suara, dan rasa. Berat ±1.5 kg.',
    mamaSymptoms: 'Payudara mengeluarkan kolostrum, sesak napas, kaki bengkak, sulit tidur.',
    mamaTips: 'Kolostrum yang keluar itu normal — ini "emas cair" pertama untuk bayi. Jangan diperas paksa.',
    mamaChecklist: [
      { id: 'w31-m1', text: 'Siapkan breast pad jika kolostrum sudah keluar', category: 'persiapan_bayi', priority: 'low' },
      { id: 'w31-m2', text: 'Pelajari teknik menyusui yang benar (tonton video/ikut kelas)', category: 'kesehatan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w31-p1', text: 'Pelajari cara mendukung istri menyusui nanti', category: 'support', priority: 'medium' },
      { id: 'w31-p2', text: 'Siapkan area menyusui yang nyaman di rumah', category: 'rumah', priority: 'medium' },
    ],
  },
  {
    week: 32,
    trimester: 3,
    babySize: 'Sebesar buah melon',
    babySizeEmoji: '🍈',
    babyDevelopment: 'Tulang mengeras (kecuali tengkorak untuk proses lahir). Kuku jari sudah panjang. Berat ±1.8 kg.',
    mamaSymptoms: 'Kontraksi Braxton Hicks lebih sering, sesak, susah tidur, punggung sangat pegal.',
    mamaTips: 'Kontrol rutin 2 minggu sekali. Perhatikan gerakan bayi — laporkan jika berkurang drastis.',
    mamaChecklist: [
      { id: 'w32-m1', text: '📋 USG: Kontrol kondisi janin, posisi & berat', category: 'pemeriksaan', priority: 'high' },
      { id: 'w32-m2', text: 'Pantau gerakan bayi setiap hari (kick count)', category: 'kesehatan', priority: 'high' },
      { id: 'w32-m3', text: 'Cuci dan setrika baju bayi baru lahir', category: 'persiapan_bayi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w32-p1', text: 'Temani istri USG kontrol kondisi janin', category: 'support', priority: 'high' },
      { id: 'w32-p2', text: 'Rakit box bayi / tempat tidur bayi', category: 'rumah', priority: 'medium' },
      { id: 'w32-p3', text: 'Install car seat jika punya mobil', category: 'transportasi', priority: 'medium' },
    ],
  },
  {
    week: 33,
    trimester: 3,
    babySize: 'Sebesar buah durian kecil',
    babySizeEmoji: '🍈',
    babyDevelopment: 'Bayi mengumpulkan antibodi dari Mama. Tulang semakin kuat kecuali tengkorak. Posisi mulai turun.',
    mamaSymptoms: 'Tekanan di panggul meningkat, sering BAK, kelelahan, sulit bernapas.',
    mamaTips: 'Jika bayi masih sungsang, tanyakan dokter tentang external cephalic version (ECV).',
    mamaChecklist: [
      { id: 'w33-m1', text: 'Diskusi posisi bayi dengan dokter jika masih sungsang', category: 'pemeriksaan', priority: 'medium' },
      { id: 'w33-m2', text: 'Lengkapi isi tas persalinan untuk mama', category: 'persiapan_bayi', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w33-p1', text: 'Siapkan tas persalinan untuk papa (baju ganti, snack, charger)', category: 'support', priority: 'medium' },
      { id: 'w33-p2', text: 'Atur cuti kerja / izin untuk menemani persalinan', category: 'dokumen', priority: 'high' },
    ],
  },
  {
    week: 34,
    trimester: 3,
    babySize: 'Sebesar buah durian',
    babySizeEmoji: '🍈',
    babyDevelopment: 'Paru-paru hampir matang sepenuhnya. Lapisan vernix semakin tebal. Berat ±2.2 kg.',
    mamaSymptoms: 'Perut sangat besar, panggul terasa berat, sulit tidur, kontraksi palsu makin sering.',
    mamaTips: 'Kontrol lebih sering mulai minggu ini — bisa seminggu sekali. Persiapkan birth plan.',
    mamaChecklist: [
      { id: 'w34-m1', text: 'Buat birth plan (rencana persalinan) bersama dokter', category: 'pemeriksaan', priority: 'high' },
      { id: 'w34-m2', text: 'Kontrol setiap minggu mulai sekarang', category: 'pemeriksaan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w34-p1', text: 'Diskusi birth plan bersama istri dan dokter', category: 'support', priority: 'high' },
      { id: 'w34-p2', text: 'Pastikan jalur ke RS sudah familiar — latih rute saat macet', category: 'transportasi', priority: 'high' },
    ],
  },
  {
    week: 35,
    trimester: 3,
    babySize: 'Sebesar buah semangka kecil',
    babySizeEmoji: '🍉',
    babyDevelopment: 'Ginjal dan hati berfungsi penuh. Bayi sudah cukup matang meskipun lebih baik tunggu 37 minggu.',
    mamaSymptoms: 'Perut sangat penuh, sesak napas berkurang jika bayi sudah turun (lightening), sering BAK.',
    mamaTips: 'Jika bayi sudah turun ke panggul, bernapas jadi lebih lega tapi BAK lebih sering — ini normal.',
    mamaChecklist: [
      { id: 'w35-m1', text: 'Cek kelengkapan tas persalinan — checklist final', category: 'persiapan_bayi', priority: 'high' },
      { id: 'w35-m2', text: 'Lakukan tes GBS (Group B Streptococcus) jika dokter anjurkan', category: 'pemeriksaan', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w35-p1', text: 'Final check: dokumen, tas, kendaraan, rute RS semua siap', category: 'transportasi', priority: 'high' },
      { id: 'w35-p2', text: 'Koordinasi dengan keluarga untuk bantuan setelah bayi lahir', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 36,
    trimester: 3,
    babySize: 'Sebesar buah semangka',
    babySizeEmoji: '🍉',
    babyDevelopment: 'Bayi sudah hampir siap lahir! Berat ±2.7 kg. Posisi kepala biasanya sudah di bawah.',
    mamaSymptoms: 'Tekanan panggul sangat terasa, kontraksi Braxton Hicks intens, serviks mulai melunak.',
    mamaTips: 'Kontrol persiapan lahiran lengkap. Jika ada kontraksi teratur setiap 5 menit, hubungi RS.',
    mamaChecklist: [
      { id: 'w36-m1', text: '📋 USG: Kontrol persiapan lahiran, posisi janin, plasenta, air ketuban, tali pusar, CTG', category: 'pemeriksaan', priority: 'high' },
      { id: 'w36-m2', text: 'Hafalkan tanda-tanda persalinan: kontraksi teratur, pecah ketuban, bloody show', category: 'kesehatan', priority: 'high' },
      { id: 'w36-m3', text: 'Siapkan baju bayi untuk dibawa pulang dari RS', category: 'persiapan_bayi', priority: 'medium' },
    ],
    papaChecklist: [
      { id: 'w36-p1', text: 'Antar istri USG kontrol persiapan lahiran & CTG', category: 'support', priority: 'high' },
      { id: 'w36-p2', text: 'Hafalkan nomor darurat RS dan bidan', category: 'transportasi', priority: 'high' },
      { id: 'w36-p3', text: 'Siapkan perlengkapan bayi baru lahir di rumah (popok, baju, selimut)', category: 'rumah', priority: 'high' },
    ],
  },
  {
    week: 37,
    trimester: 3,
    babySize: 'Sebesar buah semangka besar',
    babySizeEmoji: '🍉',
    babyDevelopment: 'Bayi dianggap "full term" — siap lahir! Berat ±2.9 kg. Paru-paru sudah matang sepenuhnya.',
    mamaSymptoms: 'Kontraksi bisa terjadi kapan saja, lendir serviks keluar (bloody show), sangat tidak nyaman.',
    mamaTips: 'SIAP SIAGA! Bayi bisa lahir kapan saja mulai sekarang. Istirahat sebanyak mungkin.',
    mamaChecklist: [
      { id: 'w37-m1', text: 'Tas persalinan harus sudah siap 100% di dekat pintu', category: 'persiapan_bayi', priority: 'high' },
      { id: 'w37-m2', text: 'Istirahat sebanyak mungkin — tidur siang jika bisa', category: 'kesehatan', priority: 'high' },
      { id: 'w37-m3', text: 'Kontrol mingguan ke dokter', category: 'pemeriksaan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w37-p1', text: 'HP selalu on & battery penuh — siap dihubungi kapan saja', category: 'support', priority: 'high' },
      { id: 'w37-p2', text: 'Jangan pergi jauh dari istri — siap antar kapan saja', category: 'transportasi', priority: 'high' },
      { id: 'w37-p3', text: 'Bensin kendaraan selalu penuh', category: 'transportasi', priority: 'high' },
    ],
  },
  {
    week: 38,
    trimester: 3,
    babySize: 'Sebesar buah labu',
    babySizeEmoji: '🎃',
    babyDevelopment: 'Vernix dan lanugo hampir hilang. Bayi menghasilkan surfaktan untuk bernapas. Berat ±3.1 kg.',
    mamaSymptoms: 'Serviks mulai membuka, kontraksi semakin terasa, insomnia, sangat tidak sabar.',
    mamaTips: 'Kontrol terakhir! Jika ada ketuban pecah (air mengalir dari vagina), SEGERA ke RS.',
    mamaChecklist: [
      { id: 'w38-m1', text: '📋 USG: Kontrol terakhir sebelum persalinan', category: 'pemeriksaan', priority: 'high' },
      { id: 'w38-m2', text: 'Latihan pernapasan untuk persalinan', category: 'kesehatan', priority: 'high' },
      { id: 'w38-m3', text: 'Siapkan daftar kontak penting: dokter, RS, keluarga', category: 'dokumen', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w38-p1', text: 'Temani istri kontrol terakhir', category: 'support', priority: 'high' },
      { id: 'w38-p2', text: 'Review rencana: siapa yang menjaga rumah, siapa yang dihubungi saat persalinan', category: 'support', priority: 'high' },
      { id: 'w38-p3', text: 'Siapkan camilan dan minuman untuk istri saat persalinan', category: 'support', priority: 'medium' },
    ],
  },
  {
    week: 39,
    trimester: 3,
    babySize: 'Sebesar buah semangka besar',
    babySizeEmoji: '🍉',
    babyDevelopment: 'Bayi sudah sepenuhnya siap lahir. Organ sempurna. Berat ±3.2-3.4 kg. Menunggu waktu yang tepat.',
    mamaSymptoms: 'Kontraksi bisa kapan saja, lendir darah, perasaan tidak tenang (nesting instinct).',
    mamaTips: 'Nesting instinct (keinginan bersih-bersih/menata) adalah normal. Tapi jangan terlalu capek!',
    mamaChecklist: [
      { id: 'w39-m1', text: 'Kontrol mingguan — cek pembukaan serviks', category: 'pemeriksaan', priority: 'high' },
      { id: 'w39-m2', text: 'Jangan lakukan aktivitas berat', category: 'kesehatan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w39-p1', text: 'Stand by 24/7 — bayi bisa datang kapan saja!', category: 'support', priority: 'high' },
      { id: 'w39-p2', text: 'Persiapan dokumen untuk akta kelahiran nanti', category: 'dokumen', priority: 'medium' },
    ],
  },
  {
    week: 40,
    trimester: 3,
    babySize: 'Sebesar buah semangka besar 🎉',
    babySizeEmoji: '🎉',
    babyDevelopment: 'Hari Perkiraan Lahir! Bayi sempurna dan siap bertemu dunia. Berat rata-rata 3.0-3.5 kg, panjang ±50 cm.',
    mamaSymptoms: 'Kontraksi bisa terjadi — tanda persalinan dimulai! Tenang, percaya pada tubuh Mama.',
    mamaTips: 'Jika belum ada tanda persalinan, jangan khawatir — banyak bayi lahir di minggu 40-41. Diskusikan dengan dokter tentang induksi jika lewat HPL.',
    mamaChecklist: [
      { id: 'w40-m1', text: 'Kontrol ke dokter — diskusi induksi jika belum ada tanda persalinan', category: 'pemeriksaan', priority: 'high' },
      { id: 'w40-m2', text: 'Tetap pantau gerakan bayi', category: 'kesehatan', priority: 'high' },
      { id: 'w40-m3', text: 'Berdoa dan siapkan mental untuk persalinan 🤲', category: 'kesehatan', priority: 'high' },
    ],
    papaChecklist: [
      { id: 'w40-p1', text: 'Dampingi istri setiap saat — berikan semangat dan ketenangan', category: 'support', priority: 'high' },
      { id: 'w40-p2', text: 'Semua persiapan harus sudah FINAL — tinggal berangkat ke RS!', category: 'transportasi', priority: 'high' },
      { id: 'w40-p3', text: 'Berdoa bersama untuk kelancaran persalinan 🤲', category: 'support', priority: 'high' },
    ],
  },
];

/**
 * Get data for a specific week.
 */
export function getWeekData(week) {
  return weeklyData.find((w) => w.week === week) || null;
}

/**
 * Get all checklist items for a specific role and optional week range.
 */
export function getChecklistByRole(role, fromWeek = 1, toWeek = 40) {
  const items = [];
  weeklyData
    .filter((w) => w.week >= fromWeek && w.week <= toWeek)
    .forEach((w) => {
      const list = role === 'mama' ? w.mamaChecklist : w.papaChecklist;
      list.forEach((item) => {
        items.push({ ...item, week: w.week, trimester: w.trimester });
      });
    });
  return items;
}

/**
 * Get checklist items for a specific week and role.
 */
export function getWeekChecklist(week, role) {
  const data = getWeekData(week);
  if (!data) return [];
  const list = role === 'mama' ? data.mamaChecklist : data.papaChecklist;
  return list.map((item) => ({ ...item, week, trimester: data.trimester }));
}

/**
 * Get all unique checklist categories for a role.
 */
export function getCategories(role) {
  if (role === 'mama') {
    return [
      { id: 'pemeriksaan', label: 'Pemeriksaan & USG', emoji: '🏥' },
      { id: 'nutrisi', label: 'Suplemen & Nutrisi', emoji: '💊' },
      { id: 'dokumen', label: 'Dokumen & Administrasi', emoji: '📋' },
      { id: 'kesehatan', label: 'Kesehatan & Olahraga', emoji: '🧘' },
      { id: 'persiapan_bayi', label: 'Persiapan Bayi', emoji: '👶' },
    ];
  }
  return [
    { id: 'keuangan', label: 'Keuangan & Tabungan', emoji: '💰' },
    { id: 'transportasi', label: 'Transportasi & Logistik', emoji: '🚗' },
    { id: 'support', label: 'Support & Komunikasi', emoji: '📱' },
    { id: 'rumah', label: 'Persiapan Rumah', emoji: '🏠' },
    { id: 'dokumen', label: 'Dokumen', emoji: '📄' },
  ];
}

export default weeklyData;
