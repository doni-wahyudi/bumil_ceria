/**
 * Real-world Labor Cost Packages and Estimates for Bandar Lampung, Indonesia
 */

export const LABOR_METHODS = [
  {
    id: 'normal',
    name: 'Persalinan Normal (Pervaginam)',
    shortName: 'Normal',
    emoji: '🌸',
    stayDuration: '1–2 Hari Rawat',
    recovery: 'Pemulihan Cepat (1–2 minggu)',
    desc: 'Melahirkan alami melalui jalan lahir didampingi Bidan atau Dokter Sp.OG. Minim intervensi obat dan risiko komplikasi jangka panjang lebih rendah.',
  },
  {
    id: 'eracs',
    name: 'Operasi Sesar Metode ERACS',
    shortName: 'Sesar ERACS',
    emoji: '⚡',
    stayDuration: '2–3 Hari Rawat',
    recovery: 'Mobilisasi Cepat (bisa duduk 2 jam pasca operasi)',
    desc: 'Metode bedah sesar modern yang menggunakan jarum spinal kecil, puasa minimal, dan kombinasi analgesik non-opioid sehingga Mama bisa berjalan dan pulih jauh lebih cepat.',
  },
];

export const HOSPITAL_CLASSES = [
  { id: 'kelas3', label: 'Kelas 3', desc: 'Kamar isi 4–6 pasien' },
  { id: 'kelas2', label: 'Kelas 2', desc: 'Kamar isi 2–3 pasien' },
  { id: 'kelas1', label: 'Kelas 1', desc: 'Kamar isi 1–2 pasien' },
  { id: 'vip', label: 'VIP / VVIP', desc: 'Kamar privat 1 pasien + sofa pendamping' },
];

export const INSURANCE_MODES = [
  {
    id: 'bpjs_full',
    label: 'BPJS Kesehatan Penuh',
    badge: 'Ditanggung 100%',
    emoji: '🟢',
    desc: 'Biaya persalinan dan rawat inap ditanggung sepenuhnya sesuai hak kelas kepesertaan tanpa biaya tambahan (dengan rujukan Faskes 1 atau IGD Darurat).',
  },
  {
    id: 'bpjs_upgrade',
    label: 'BPJS Naik Kelas Kamar',
    badge: 'Bayar Selisih Tarif',
    emoji: '🟡',
    desc: 'Tetap menggunakan BPJS tapi memilih naik kelas kamar (misal hak Kelas 2 naik ke VIP). Anda hanya membayar selisih tarif INA-CBG.',
  },
  {
    id: 'asuransi_swasta',
    label: 'Asuransi Kantor / Swasta',
    badge: 'Sesuai Plafon Polis',
    emoji: '🔵',
    desc: 'Klaim cashless atau reimbursement sesuai batas plafon melahirkan (maternity benefit) pada polis asuransi Anda.',
  },
  {
    id: 'mandiri',
    label: 'Bayar Mandiri (Umum)',
    badge: 'Biaya Penuh',
    emoji: '⚪',
    desc: 'Pembayaran pribadi secara mandiri tanpa asuransi.',
  },
];

export const LAMPUNG_COST_ESTIMATES = {
  // Normal delivery baseline by class (in Rupiah)
  normal: {
    bidan: { min: 1500000, max: 2800000, avg: 2200000 },
    kelas3: { min: 3500000, max: 5500000, avg: 4500000 },
    kelas2: { min: 5000000, max: 7500000, avg: 6200000 },
    kelas1: { min: 7000000, max: 10500000, avg: 8500000 },
    vip: { min: 11000000, max: 16000000, avg: 13500000 },
  },
  // Sesar ERACS baseline by class (in Rupiah)
  eracs: {
    bidan: { min: 0, max: 0, avg: 0 }, // Not available at midwive clinics
    kelas3: { min: 12000000, max: 15500000, avg: 13800000 },
    kelas2: { min: 15000000, max: 19000000, avg: 17000000 },
    kelas1: { min: 19000000, max: 25000000, avg: 22000000 },
    vip: { min: 25000000, max: 35000000, avg: 29500000 },
  },
};

export const HIDDEN_COSTS_CHECKLIST = [
  {
    id: 'hc_shk',
    title: 'Skrining Hipotiroid Kongenital (SHK)',
    estCost: 150000,
    desc: 'Pemeriksaan darah tumit bayi newborn untuk deteksi dini fungsi hormon tiroid (cegah stunting & keterbelakangan mental).',
    isMandatory: true,
  },
  {
    id: 'hc_vaksin',
    title: 'Vaksin Hepatitis B0 & Vitamin K1 Newborn',
    estCost: 250000,
    desc: 'Suntikan wajib dalam 24 jam pertama setelah bayi lahir untuk mencegah infeksi hepatitis B dan pendarahan defisiensi vitamin K.',
    isMandatory: true,
  },
  {
    id: 'hc_fototerapi',
    title: 'Dana Jaga-Jaga Fototerapi Bayi Kuning',
    estCost: 1500000,
    desc: 'Sekitar 40-50% bayi baru lahir mengalami kuning fisiologis yang kadang butuh fototerapi sinar biru 1x24 jam di ruang perinatologi.',
    isMandatory: false,
  },
  {
    id: 'hc_emergency',
    title: 'Dana Cadangan Darurat CITO & Obat Tambahan',
    estCost: 2000000,
    desc: 'Antisipasi jika proses persalinan normal perlu induksi tambahan, vakum, atau dialihkan ke operasi sesar darurat.',
    isMandatory: false,
  },
];
