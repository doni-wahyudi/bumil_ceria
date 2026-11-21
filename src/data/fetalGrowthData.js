/**
 * Weekly Fetal Growth, Uterine Expansion (TFU), and Clinical Biometry (Weeks 1-40)
 * Based on Buku KIA Kemenkes RI & Hadlock / Fetal Growth Reference Charts.
 * - Weeks 1-19 use Crown-Rump Length (CRL) in cm
 * - Weeks 20-40 use Crown-Heel Length (CHL) in cm
 */

const WEEKLY_METRICS = [
  // Trimester 1 (Weeks 1-13)
  { week: 1, lengthCm: 0.02, weightGrams: 0.01, stage: 'blastocyst', fetusScale: 0.07, wombScale: 0.18, bellyCurve: 0.0, heartRateBpm: 'Tahap persiapan sel', sensoryMilestone: 'Tubuh Mama sedang menyiapkan lapisan rahim terbaik untuk pembuahan.' },
  { week: 2, lengthCm: 0.03, weightGrams: 0.01, stage: 'blastocyst', fetusScale: 0.07, wombScale: 0.19, bellyCurve: 0.0, heartRateBpm: 'Ovulasi & pembuahan', sensoryMilestone: 'Sel telur matang dilepaskan menuju saluran tuba untuk bertemu sel sperma.' },
  { week: 3, lengthCm: 0.05, weightGrams: 0.02, stage: 'blastocyst', fetusScale: 0.08, wombScale: 0.20, bellyCurve: 0.0, heartRateBpm: 'Pembelahan zigot aktif', sensoryMilestone: 'Zigot membelah menjadi puluhan sel sambil bergerak turun menuju rongga rahim.' },
  { week: 4, lengthCm: 0.2, weightGrams: 0.1, stage: 'blastocyst', fetusScale: 0.10, wombScale: 0.22, bellyCurve: 0.02, heartRateBpm: 'Pembentukan pembuluh awal', sensoryMilestone: 'Blastokista menempel erat di dinding rahim dan plasenta mulai terbentuk.' },
  { week: 5, lengthCm: 0.3, weightGrams: 0.2, stage: 'embryo', fetusScale: 0.12, wombScale: 0.24, bellyCurve: 0.03, heartRateBpm: '100-115 bpm (awal)', sensoryMilestone: 'Tabung jantung primitif mulai berdenyut teratur untuk pertama kalinya.' },
  { week: 6, lengthCm: 0.6, weightGrams: 0.5, stage: 'embryo', fetusScale: 0.14, wombScale: 0.26, bellyCurve: 0.05, heartRateBpm: '110-130 bpm', sensoryMilestone: 'Tunas lengan, kaki, serta cikal bakal mata dan telinga mulai terbentuk.' },
  { week: 7, lengthCm: 1.0, weightGrams: 0.8, stage: 'embryo', fetusScale: 0.16, wombScale: 0.29, bellyCurve: 0.06, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Otak kanan dan kiri berkembang pesat membentuk lipatan saraf utama.' },
  { week: 8, lengthCm: 1.6, weightGrams: 1, stage: 'embryo', fetusScale: 0.19, wombScale: 0.32, bellyCurve: 0.08, heartRateBpm: '140-170 bpm', sensoryMilestone: 'Selaput jari tangan dan kaki mulai tampak; embrio membuat kedutan spontan pertama.' },
  { week: 9, lengthCm: 2.3, weightGrams: 2, stage: 'embryo', fetusScale: 0.22, wombScale: 0.35, bellyCurve: 0.10, heartRateBpm: '145-175 bpm', sensoryMilestone: 'Otot mungil dan persendian mulai tersambung, tanda fase embrio beralih ke janin.' },
  { week: 10, lengthCm: 3.1, weightGrams: 4, stage: 'early_fetus', fetusScale: 0.25, wombScale: 0.38, bellyCurve: 0.13, heartRateBpm: '145-170 bpm', sensoryMilestone: 'Organ vital sudah lengkap di tempatnya dan mulai berfungsi berkoordinasi.' },
  { week: 11, lengthCm: 4.1, weightGrams: 7, stage: 'early_fetus', fetusScale: 0.28, wombScale: 0.41, bellyCurve: 0.16, heartRateBpm: '140-165 bpm', sensoryMilestone: 'Janin sudah aktif menggeliat, menguap, dan merespons sentuhan lembut di kulitnya.' },
  { week: 12, lengthCm: 5.4, weightGrams: 14, stage: 'early_fetus', fetusScale: 0.31, wombScale: 0.45, bellyCurve: 0.20, heartRateBpm: '140-165 bpm', sensoryMilestone: 'Jari mungil mulai bisa membuka dan mengepal dengan refleks mengisap awal.' },
  { week: 13, lengthCm: 7.4, weightGrams: 23, stage: 'early_fetus', fetusScale: 0.34, wombScale: 0.48, bellyCurve: 0.24, heartRateBpm: '135-160 bpm', sensoryMilestone: 'Sidik jari unik terbentuk dan pita suara mungil mulai tersusun.' },

  // Trimester 2 (Weeks 14-27)
  { week: 14, lengthCm: 8.7, weightGrams: 43, stage: 'early_fetus', fetusScale: 0.38, wombScale: 0.51, bellyCurve: 0.28, heartRateBpm: '135-160 bpm', sensoryMilestone: 'Otot wajah mulai aktif sehingga janin dapat mengerutkan kening atau tersenyum.' },
  { week: 15, lengthCm: 10.1, weightGrams: 70, stage: 'early_fetus', fetusScale: 0.41, wombScale: 0.54, bellyCurve: 0.32, heartRateBpm: '130-160 bpm', sensoryMilestone: 'Walau kelopak mata masih tertutup, saraf matanya sudah peka terhadap cahaya kuat.' },
  { week: 16, lengthCm: 11.6, weightGrams: 100, stage: 'mid_fetus', fetusScale: 0.45, wombScale: 0.57, bellyCurve: 0.36, heartRateBpm: '130-160 bpm', sensoryMilestone: 'Tulang telinga mengeras sehingga getaran suara detak jantung Mama mulai terdengar.' },
  { week: 17, lengthCm: 13.0, weightGrams: 140, stage: 'mid_fetus', fetusScale: 0.48, wombScale: 0.60, bellyCurve: 0.40, heartRateBpm: '130-160 bpm', sensoryMilestone: 'Cadangan lemak cokelat mulai terbentuk untuk menjaga kehangatan suhu tubuh bayi.' },
  { week: 18, lengthCm: 14.2, weightGrams: 190, stage: 'mid_fetus', fetusScale: 0.51, wombScale: 0.63, bellyCurve: 0.44, heartRateBpm: '130-160 bpm', sensoryMilestone: 'Tendangan lembut atau sensasi kepakan di perut (quickening) mulai bisa dirasakan.' },
  { week: 19, lengthCm: 15.3, weightGrams: 240, stage: 'mid_fetus', fetusScale: 0.54, wombScale: 0.66, bellyCurve: 0.48, heartRateBpm: '130-155 bpm', sensoryMilestone: 'Lapisan pelindung putih (vernix) melapisi kulit dan area sensorik otak berkembang.' },
  { week: 20, lengthCm: 25.6, weightGrams: 300, stage: 'mid_fetus', fetusScale: 0.57, wombScale: 0.69, bellyCurve: 0.52, heartRateBpm: '125-155 bpm', sensoryMilestone: 'Bayi menelan air ketuban secara rutin untuk melatih sistem cerna dan refleks menelan.' },
  { week: 21, lengthCm: 26.7, weightGrams: 360, stage: 'mid_fetus', fetusScale: 0.60, wombScale: 0.71, bellyCurve: 0.56, heartRateBpm: '125-155 bpm', sensoryMilestone: 'Indra pengecap aktif mengenal berbagai rasa dari asupan makanan Mama lewat ketuban.' },
  { week: 22, lengthCm: 27.8, weightGrams: 430, stage: 'mid_fetus', fetusScale: 0.63, wombScale: 0.73, bellyCurve: 0.59, heartRateBpm: '125-155 bpm', sensoryMilestone: 'Suara Papa dan Mama dari luar perut mulai dikenali jelas oleh koklea telinga.' },
  { week: 23, lengthCm: 28.9, weightGrams: 501, stage: 'mid_fetus', fetusScale: 0.65, wombScale: 0.75, bellyCurve: 0.63, heartRateBpm: '125-155 bpm', sensoryMilestone: 'Gerak napas ritmis berlatih mengembang-kempiskan rongga dada dengan ketuban.' },
  { week: 24, lengthCm: 30.0, weightGrams: 600, stage: 'mid_fetus', fetusScale: 0.68, wombScale: 0.77, bellyCurve: 0.66, heartRateBpm: '120-155 bpm', sensoryMilestone: 'Pola tidur dan bangun janin sudah terbentuk serta telinga tengah menjaga keseimbangan.' },
  { week: 25, lengthCm: 34.6, weightGrams: 660, stage: 'mid_fetus', fetusScale: 0.70, wombScale: 0.79, bellyCurve: 0.69, heartRateBpm: '120-155 bpm', sensoryMilestone: 'Bayi sudah bisa menggenggam erat tali pusar dan menoleh ke arah sumber suara.' },
  { week: 26, lengthCm: 35.6, weightGrams: 760, stage: 'mid_fetus', fetusScale: 0.72, wombScale: 0.81, bellyCurve: 0.72, heartRateBpm: '120-155 bpm', sensoryMilestone: 'Kelopak mata mulai membuka dan berkedip perlahan merespons sorotan cahaya hangat.' },
  { week: 27, lengthCm: 36.6, weightGrams: 875, stage: 'mid_fetus', fetusScale: 0.75, wombScale: 0.83, bellyCurve: 0.75, heartRateBpm: '120-155 bpm', sensoryMilestone: 'Aktivitas gelombang otak REM meningkat, cegukan kecil terasa sebagai ketukan teratur.' },

  // Trimester 3 (Weeks 28-40)
  { week: 28, lengthCm: 37.6, weightGrams: 1005, stage: 'late_fetus', fetusScale: 0.77, wombScale: 0.85, bellyCurve: 0.78, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Paru-paru memproduksi surfaktan lebih banyak sementara bayi bermimpi dalam tidur REM.' },
  { week: 29, lengthCm: 38.6, weightGrams: 1153, stage: 'late_fetus', fetusScale: 0.79, wombScale: 0.87, bellyCurve: 0.80, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Gerakan terasa lebih kuat sebagai dorongan dan sikut saat ruang rahim mulai padat.' },
  { week: 30, lengthCm: 39.9, weightGrams: 1319, stage: 'late_fetus', fetusScale: 0.81, wombScale: 0.89, bellyCurve: 0.83, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Sumsum tulang belakang mengambil alih produksi sel darah merah sepenuhnya.' },
  { week: 31, lengthCm: 41.1, weightGrams: 1502, stage: 'late_fetus', fetusScale: 0.83, wombScale: 0.90, bellyCurve: 0.85, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Kelima panca indra sudah bekerja aktif memproses cahaya, suara, rasa, dan sentuhan.' },
  { week: 32, lengthCm: 42.4, weightGrams: 1702, stage: 'late_fetus', fetusScale: 0.86, wombScale: 0.92, bellyCurve: 0.88, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Sebagian besar bayi mulai berputar memosisikan kepala ke arah bawah panggul.' },
  { week: 33, lengthCm: 43.7, weightGrams: 1918, stage: 'late_fetus', fetusScale: 0.88, wombScale: 0.93, bellyCurve: 0.90, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Tulang tubuh mengeras, sedangkan tulang tengkorak tetap lentur demi proses persalinan.' },
  { week: 34, lengthCm: 45.0, weightGrams: 2146, stage: 'late_fetus', fetusScale: 0.90, wombScale: 0.95, bellyCurve: 0.92, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Sistem kekebalan tubuh dan saraf pusat semakin matang menghadapi dunia luar.' },
  { week: 35, lengthCm: 46.2, weightGrams: 2383, stage: 'late_fetus', fetusScale: 0.92, wombScale: 0.96, bellyCurve: 0.94, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Pertambahan lemak membuat pipi dan bahu bayi tampak berisi serta halus.' },
  { week: 36, lengthCm: 47.4, weightGrams: 2622, stage: 'late_fetus', fetusScale: 0.94, wombScale: 0.97, bellyCurve: 0.96, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Bulu halus (lanugo) mulai rontok dan kepala bayi perlahan turun ke pintu panggul.' },
  { week: 37, lengthCm: 48.6, weightGrams: 2859, stage: 'late_fetus', fetusScale: 0.96, wombScale: 0.98, bellyCurve: 0.98, heartRateBpm: '120-150 bpm', sensoryMilestone: 'Memasuki usia cukup bulan awal; refleks menghisap dan menggenggam sangat kuat.' },
  { week: 38, lengthCm: 49.8, weightGrams: 3083, stage: 'late_fetus', fetusScale: 0.98, wombScale: 0.99, bellyCurve: 0.99, heartRateBpm: '115-150 bpm', sensoryMilestone: 'Semua organ matang dan mekonium berkumpul sebagai feses pertama bayi nanti.' },
  { week: 39, lengthCm: 50.7, weightGrams: 3288, stage: 'late_fetus', fetusScale: 0.99, wombScale: 1.00, bellyCurve: 1.00, heartRateBpm: '115-150 bpm', sensoryMilestone: 'Plasenta terus menyalurkan antibodi penting hingga detik menjelang persalinan.' },
  { week: 40, lengthCm: 51.2, weightGrams: 3462, stage: 'late_fetus', fetusScale: 1.00, wombScale: 1.00, bellyCurve: 1.00, heartRateBpm: '115-150 bpm', sensoryMilestone: 'Si kecil mengisi penuh ruang rahim dan siap lahir bertemu Mama dan Papa.' },
];

function getFundusLabel(week) {
  if (week <= 11) return 'Di dalam rongga panggul (belum teraba dari luar)';
  if (week <= 15) return '1-3 jari di atas tulang kemaluan (Simfisis)';
  if (week <= 19) return 'Pertengahan antara tulang kemaluan & pusar';
  if (week <= 21) return 'Setinggi pusar Ibu (TFU ~20 cm)';
  if (week <= 27) return 'Di atas pusar Ibu (TFU ~22-27 cm)';
  if (week <= 35) return 'Pertengahan pusar & ulu hati (TFU ~28-33 cm)';
  if (week <= 38) return 'Mendekati puncak ulu hati (TFU ~34-36 cm)';
  return 'Sedikit turun karena kepala masuk panggul (Lightening)';
}

function getPositionLabel(week) {
  if (week <= 4) return 'Implantasi mikro di lapisan dinding rahim';
  if (week <= 9) return 'Melengkung bentuk-C di kantung ketuban awal';
  if (week <= 25) return 'Melayang bebas & aktif berputar di cairan ketuban';
  if (week <= 31) return 'Aktif menendang, mulai mencari arah panggul';
  if (week <= 35) return 'Posisi kepala umumnya mulai mengarah ke panggul';
  return 'Posisi kepala di bawah pintu panggul (Cephalic siap lahir)';
}

const STAGE_IMAGE_MAP = {
  blastocyst: 'fetus/stage-1-blastocyst.jpg',
  embryo: 'fetus/stage-2-embryo.jpg',
  early_fetus: 'fetus/stage-3-early-fetus.jpg',
  mid_fetus: 'fetus/stage-4-mid-fetus.jpg',
  late_fetus: 'fetus/stage-5-late-fetus.jpg',
};

export const FETAL_GROWTH_DATA = WEEKLY_METRICS.map((entry) => ({
  ...entry,
  imagePath: STAGE_IMAGE_MAP[entry.stage] || STAGE_IMAGE_MAP.mid_fetus,
  lengthType: entry.week < 20 ? 'CRL (Kepala-Bokong)' : 'CHL (Kepala-Tumit)',
  fundusLabel: getFundusLabel(entry.week),
  positionLabel: getPositionLabel(entry.week),
}));

export function getFetalGrowthForWeek(week) {
  const clamped = Math.max(1, Math.min(40, Math.round(Number(week) || 1)));
  return FETAL_GROWTH_DATA[clamped - 1];
}
