/**
 * Bumil Ceria - BMI & Gestational Weight Gain Tracker Utilities
 *
 * Implements Institute of Medicine (IOM 2009) & Kemenkes RI (Buku KIA)
 * clinical guidelines for maternal pre-pregnancy BMI classification and
 * healthy gestational weight gain corridors across pregnancy weeks (0-40).
 */

/**
 * @typedef {'underweight' | 'normal' | 'overweight' | 'obese'} BMICategory
 */

/**
 * Calculate Body Mass Index (BMI / IMT)
 * Formula: weight (kg) / (height (m) ^ 2)
 *
 * @param {number|string} weightKg
 * @param {number|string} heightCm
 * @returns {number|null}
 */
export function calculateBMI(weightKg, heightCm) {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);
  if (!w || !h || h <= 0) return null;
  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Standard IOM 2009 & Kemenkes RI Guidelines Data
 */
export const BMI_GUIDELINES = {
  underweight: {
    category: 'underweight',
    label: 'Underweight (Kurus)',
    badgeColor: 'warning',
    colorHex: '#f59e0b',
    rangeLabel: '< 18.5',
    totalGainMin: 12.5,
    totalGainMax: 18.0,
    rateT2T3Label: '~0.51 kg / minggu (0.44 - 0.58)',
    rateT2T3Avg: 0.51,
    summary: 'Rekomendasi kenaikan total 12.5 – 18.0 kg',
    advice:
      'Ibu disarankan meningkatkan asupan kalori dan protein bergizi seimbang untuk mencegah risiko bayi lahir dengan berat badan rendah (BBLR) atau kondisi Kurang Energi Kronis (KEK).',
  },
  normal: {
    category: 'normal',
    label: 'Normal (Ideal)',
    badgeColor: 'success',
    colorHex: '#10b981',
    rangeLabel: '18.5 – 24.9',
    totalGainMin: 11.5,
    totalGainMax: 16.0,
    rateT2T3Label: '~0.42 kg / minggu (0.35 - 0.50)',
    rateT2T3Avg: 0.42,
    summary: 'Rekomendasi kenaikan total 11.5 – 16.0 kg',
    advice:
      'Kategori IMT optimal. Pertahankan pola makan seimbang, konsumsi sayuran hijau, buah, protein hewani/nabati, dan suplementasi tablet tambah darah & asam folat.',
  },
  overweight: {
    category: 'overweight',
    label: 'Overweight (Kelebihan BB)',
    badgeColor: 'warning',
    colorHex: '#f97316',
    rangeLabel: '25.0 – 29.9',
    totalGainMin: 7.0,
    totalGainMax: 11.5,
    rateT2T3Label: '~0.28 kg / minggu (0.23 - 0.33)',
    rateT2T3Avg: 0.28,
    summary: 'Rekomendasi kenaikan total 7.0 – 11.5 kg',
    advice:
      'Kenaikan berat badan perlu dijaga agar tidak berlebihan. Batasi konsumsi camilan manis, minuman bergula, dan makanan olahan berminyak. Lakukan jalan pagi 20-30 menit secara rutin.',
  },
  obese: {
    category: 'obese',
    label: 'Obesitas (IMT ≥ 30)',
    badgeColor: 'danger',
    colorHex: '#ef4444',
    rangeLabel: '≥ 30.0',
    totalGainMin: 5.0,
    totalGainMax: 9.0,
    rateT2T3Label: '~0.22 kg / minggu (0.17 - 0.27)',
    rateT2T3Avg: 0.22,
    summary: 'Rekomendasi kenaikan total 5.0 – 9.0 kg',
    advice:
      'Konsultasikan secara rutin dengan dokter spesialis kandungan dan ahli gizi untuk memantau tekanan darah dan kadar gula darah guna mencegah risiko preeklamsia dan diabetes gestasional.',
  },
};

/**
 * Classify BMI according to WHO & Kemenkes RI standard
 *
 * @param {number|null} bmi
 * @returns {typeof BMI_GUIDELINES.normal}
 */
export function classifyBMI(bmi) {
  if (bmi === null || bmi === undefined || isNaN(bmi)) {
    return BMI_GUIDELINES.normal;
  }
  if (bmi < 18.5) return BMI_GUIDELINES.underweight;
  if (bmi < 25.0) return BMI_GUIDELINES.normal;
  if (bmi < 30.0) return BMI_GUIDELINES.overweight;
  return BMI_GUIDELINES.obese;
}

/**
 * Calculate recommended gestational weight gain range (min, max, avg) at a given gestational week
 *
 * Curve model:
 * - Week 0 to 13 (Trimester 1): Total target gain 0.5 - 2.0 kg.
 * - Week 14 to 40 (Trimester 2 & 3): Linear progression up to totalGainMin and totalGainMax.
 *
 * @param {number} week - Gestational week (0 to 42)
 * @param {BMICategory|string} categoryKey
 * @returns {{ minGain: number, maxGain: number, avgGain: number }}
 */
export function getTargetGainAtWeek(week, categoryKey = 'normal') {
  const guide = BMI_GUIDELINES[categoryKey] || BMI_GUIDELINES.normal;
  const w = Math.max(0, Math.min(42, Number(week) || 0));

  if (w === 0) {
    return { minGain: 0, maxGain: 0, avgGain: 0 };
  }

  // Trimester 1 (Weeks 1 to 13)
  if (w <= 13) {
    const fraction = w / 13;
    const minGain = Math.round(fraction * 0.5 * 10) / 10;
    const maxGain = Math.round(fraction * 2.0 * 10) / 10;
    const avgGain = Math.round(((minGain + maxGain) / 2) * 10) / 10;
    return { minGain, maxGain, avgGain };
  }

  // Trimesters 2 & 3 (Weeks 14 to 40)
  const t2Weeks = w - 13;
  const remainingWeeks = 27; // 40 - 13
  const t2MinGain = guide.totalGainMin - 0.5;
  const t2MaxGain = guide.totalGainMax - 2.0;

  const minGain = Math.round((0.5 + (t2Weeks / remainingWeeks) * t2MinGain) * 10) / 10;
  const maxGain = Math.round((2.0 + (t2Weeks / remainingWeeks) * t2MaxGain) * 10) / 10;
  const avgGain = Math.round(((minGain + maxGain) / 2) * 10) / 10;

  return { minGain, maxGain, avgGain };
}

/**
 * Generate full 0-40 week trajectory curve for SVG charting
 *
 * @param {BMICategory|string} categoryKey
 * @param {number} prePregnancyWeight
 * @returns {Array<{ week: number, minGain: number, maxGain: number, minWeight: number, maxWeight: number }>}
 */
export function generateWeightGainCorridor(categoryKey = 'normal', prePregnancyWeight = 0) {
  const points = [];
  const baseW = Number(prePregnancyWeight) || 0;

  for (let w = 0; w <= 40; w++) {
    const { minGain, maxGain } = getTargetGainAtWeek(w, categoryKey);
    points.push({
      week: w,
      minGain,
      maxGain,
      minWeight: Math.round((baseW + minGain) * 10) / 10,
      maxWeight: Math.round((baseW + maxGain) * 10) / 10,
    });
  }

  return points;
}

/**
 * Evaluate current weight against target corridor
 *
 * @param {number|string} currentWeight
 * @param {number|string} prePregnancyWeight
 * @param {number|string} currentWeek
 * @param {BMICategory|string} categoryKey
 */
export function evaluateWeightGain(currentWeight, prePregnancyWeight, currentWeek, categoryKey = 'normal') {
  const curr = parseFloat(currentWeight);
  const base = parseFloat(prePregnancyWeight);
  const week = parseInt(currentWeek, 10) || 0;

  if (isNaN(curr) || isNaN(base) || base <= 0) {
    return null;
  }

  const actualGain = Math.round((curr - base) * 10) / 10;
  const { minGain, maxGain } = getTargetGainAtWeek(week, categoryKey);

  // Status tolerance (+/- 0.3 kg)
  if (actualGain < minGain - 0.3) {
    const deficit = Math.round((minGain - actualGain) * 10) / 10;
    return {
      status: 'under',
      label: 'Di Bawah Rekomendasi',
      color: 'warning',
      colorHex: '#f59e0b',
      actualGain,
      targetMin: minGain,
      targetMax: maxGain,
      difference: -deficit,
      summary: `Kenaikan saat ini (+${actualGain} kg) kurang ${deficit} kg dari target minimum (rentang ${minGain} - ${maxGain} kg).`,
      advice:
        'Tingkatkan porsi makan bergizi dengan camilan padat nutrisi seperti susu hamil, alpukat, telur, dan kacang-kacangan untuk mendukung pertumbuhan janin optimal.',
    };
  }

  if (actualGain > maxGain + 0.3) {
    const excess = Math.round((actualGain - maxGain) * 10) / 10;
    return {
      status: 'over',
      label: 'Melebihi Rekomendasi',
      color: 'danger',
      colorHex: '#ef4444',
      actualGain,
      targetMin: minGain,
      targetMax: maxGain,
      difference: excess,
      summary: `Kenaikan saat ini (+${actualGain} kg) melebihi ${excess} kg dari batas atas rekomendasi (rentang ${minGain} - ${maxGain} kg).`,
      advice:
        'Kurangi konsumsi karbohidrat olahan, gula pasir, teh manis, serta gorengan. Tingkatkan konsumsi sayur berserat tinggi dan tetap aktif bergerak ringan.',
    };
  }

  return {
    status: 'ideal',
    label: 'Ideal / Sesuai Target',
    color: 'success',
    colorHex: '#10b981',
    actualGain,
    targetMin: minGain,
    targetMax: maxGain,
    difference: 0,
    summary: `Kenaikan saat ini (+${actualGain} kg) sangat ideal di dalam rentang rekomendasi (${minGain} - ${maxGain} kg).`,
    advice:
      'Pertahankan pola makan bergizi seimbang dan gaya hidup sehat saat ini. Perkembangan berat badan Mama sangat baik!',
  };
}
