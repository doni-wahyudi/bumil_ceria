/**
 * Pregnancy calculation utilities.
 * Uses Naegele's rule: HPL = HPHT + 7 days - 3 months + 1 year
 */

/**
 * Calculate HPL (Hari Perkiraan Lahir / Due Date) from HPHT.
 * @param {string|Date} hpht - HPHT date (Hari Pertama Haid Terakhir)
 * @returns {Date}
 */
export function calculateDueDate(hpht) {
  const date = new Date(hpht);
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 7);
  dueDate.setMonth(dueDate.getMonth() - 3);
  dueDate.setFullYear(dueDate.getFullYear() + 1);
  return dueDate;
}

/**
 * Calculate the current pregnancy week from HPHT.
 * @param {string|Date} hpht
 * @returns {number} Week number (1-42)
 */
export function getCurrentWeek(hpht) {
  const start = new Date(hpht);
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(week, 42));
}

/**
 * Calculate the current pregnancy day within the week.
 * @param {string|Date} hpht
 * @returns {number} Day within week (0-6)
 */
export function getCurrentDay(hpht) {
  const start = new Date(hpht);
  const today = new Date();
  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays % 7;
}

/**
 * Get the trimester based on week number.
 * @param {number} week
 * @returns {{ number: number, label: string, range: string }}
 */
export function getTrimester(week) {
  if (week <= 13) {
    return { number: 1, label: 'Trimester 1', range: 'Minggu 1–13' };
  } else if (week <= 27) {
    return { number: 2, label: 'Trimester 2', range: 'Minggu 14–27' };
  } else {
    return { number: 3, label: 'Trimester 3', range: 'Minggu 28–40' };
  }
}

/**
 * Calculate days remaining until due date.
 * @param {string|Date} hpht
 * @returns {number}
 */
export function getDaysRemaining(hpht) {
  const dueDate = calculateDueDate(hpht);
  const today = new Date();
  const diffMs = dueDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Get pregnancy progress as percentage.
 * @param {number} week
 * @returns {number} 0-100
 */
export function getProgressPercentage(week) {
  return Math.min(100, Math.round((week / 40) * 100));
}

/**
 * Format a date to Indonesian locale string.
 * @param {Date|string} date
 * @returns {string} e.g. "14 September 2026"
 */
export function formatDateID(date) {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Get a human-readable description of the pregnancy progress.
 * @param {number} week
 * @param {number} day
 * @returns {string} e.g. "25 minggu, 3 hari"
 */
export function getProgressText(week, day) {
  return `${week} minggu${day > 0 ? `, ${day} hari` : ''}`;
}
