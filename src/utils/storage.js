/**
 * Storage abstraction layer.
 * Currently uses localStorage. Designed to be swapped with Supabase.
 *
 * All functions follow a consistent async interface so the Supabase
 * migration will be a drop-in replacement without changing consumers.
 */

import { getSupabase, getDeviceUserId } from './supabaseClient';

const STORAGE_KEYS = {
  PROFILE: 'bumpbuddy_profile',
  CHECKLIST: 'bumpbuddy_checklist',
  ONBOARDING_DONE: 'bumpbuddy_onboarding_done',
  USG_STATUS: 'bumpbuddy_usg_status',
  HOSPITAL_BAG: 'bumpbuddy_hospital_bag',
  CUSTOM_BAG_ITEMS: 'bumpbuddy_custom_bag_items',
  DOCTOR_VISITS: 'bumpbuddy_doctor_visits',
  DOCTOR_QUESTIONS: 'bumpbuddy_doctor_questions',
  DAILY_LOGS: 'bumpbuddy_daily_logs',
  KICK_SESSIONS: 'bumpbuddy_kick_sessions',
  CONTRACTION_RECORDS: 'bumpbuddy_contraction_records',
  LABOR_BUDGET: 'bumpbuddy_labor_budget',
};

// ---- Profile ----

/**
 * @typedef {Object} Profile
 * @property {string} mamaName
 * @property {string} papaName
 * @property {string} hpht - ISO date string (YYYY-MM-DD)
 * @property {'bpjs' | 'asuransi_kerja' | 'mandiri'} insuranceType
 * @property {string} hospitalName - User-input hospital name
 * @property {string} hospitalAddress - Optional hospital address
 * @property {string} doctorName - Optional doctor name
 */

export async function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  return profile;
}

export async function updateProfile(updates) {
  const current = await getProfile();
  const updated = { ...current, ...updates };
  return saveProfile(updated);
}

// ---- Onboarding ----

export async function isOnboardingDone() {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
}

export async function setOnboardingDone() {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
}

// ---- Checklist ----

/**
 * Get all completed checklist item IDs.
 * @returns {Promise<string[]>}
 */
export async function getCompletedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle a checklist item's completion status.
 * @param {string} itemId
 * @returns {Promise<boolean>} New completion state
 */
export async function toggleChecklistItem(itemId) {
  const completed = await getCompletedItems();
  const index = completed.indexOf(itemId);
  if (index >= 0) {
    completed.splice(index, 1);
  } else {
    completed.push(itemId);
  }
  localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(completed));
  return index < 0; // true if now completed
}

/**
 * Check if a specific item is completed.
 * @param {string} itemId
 * @returns {Promise<boolean>}
 */
export async function isItemCompleted(itemId) {
  const completed = await getCompletedItems();
  return completed.includes(itemId);
}

// ---- USG Status ----

/**
 * Get USG completion status map.
 * @returns {Promise<Object<string, boolean>>}
 */
export async function getUSGStatus() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USG_STATUS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Toggle USG milestone completion.
 * @param {string} usgId
 * @returns {Promise<boolean>} New completion state
 */
export async function toggleUSGStatus(usgId) {
  const status = await getUSGStatus();
  status[usgId] = !status[usgId];
  localStorage.setItem(STORAGE_KEYS.USG_STATUS, JSON.stringify(status));
  return status[usgId];
}

// ---- Hospital Bag (Phase 2) ----

/**
 * Get packed item IDs.
 * @returns {Promise<string[]>}
 */
export async function getHospitalBagItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HOSPITAL_BAG);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle hospital bag item packed state.
 * @param {string} itemId
 * @returns {Promise<boolean>}
 */
export async function toggleHospitalBagItem(itemId) {
  const items = await getHospitalBagItems();
  const index = items.indexOf(itemId);
  if (index >= 0) {
    items.splice(index, 1);
  } else {
    items.push(itemId);
  }
  localStorage.setItem(STORAGE_KEYS.HOSPITAL_BAG, JSON.stringify(items));
  return index < 0;
}

/**
 * Get custom hospital bag items added by user.
 * @returns {Promise<Array<{ id: string, category: string, text: string }>>}
 */
export async function getCustomBagItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_BAG_ITEMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add a custom item to the hospital bag.
 * @param {string} category - 'mama' | 'baby' | 'papa'
 * @param {string} text - Item description
 */
export async function addCustomBagItem(category, text) {
  const items = await getCustomBagItems();
  const newItem = {
    id: `custom_hb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    category,
    text,
    isCustom: true,
  };
  items.push(newItem);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_BAG_ITEMS, JSON.stringify(items));
  return newItem;
}

/**
 * Remove a custom item from the hospital bag.
 * @param {string} id
 */
export async function removeCustomBagItem(id) {
  const items = await getCustomBagItems();
  const filtered = items.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_BAG_ITEMS, JSON.stringify(filtered));

  // Also remove from packed items if present
  const packed = await getHospitalBagItems();
  const filteredPacked = packed.filter((itemId) => itemId !== id);
  localStorage.setItem(STORAGE_KEYS.HOSPITAL_BAG, JSON.stringify(filteredPacked));
  return filtered;
}

// ---- Doctor Visits Log (Phase 2) ----

/**
 * @typedef {Object} DoctorVisit
 * @property {string} id
 * @property {string} date - YYYY-MM-DD
 * @property {number} week - gestational week
 * @property {string} bloodPressure - e.g. "110/70"
 * @property {string} motherWeight - e.g. "58.5"
 * @property {string} babyWeight - e.g. "1200" or notes
 * @property {string} doctorNotes - observations/prescriptions
 * @property {string} doctorName - doctor's name
 */

/**
 * Get all doctor visit logs.
 * @returns {Promise<DoctorVisit[]>}
 */
export async function getDoctorVisits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTOR_VISITS);
    const visits = raw ? JSON.parse(raw) : [];
    // Sort by date descending (newest first)
    return visits.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch {
    return [];
  }
}

/**
 * Add a doctor visit record.
 * @param {Omit<DoctorVisit, 'id' | 'createdAt'>} visitData
 */
export async function addDoctorVisit(visitData) {
  const visits = await getDoctorVisits();
  const newVisit = {
    ...visitData,
    id: `visit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  visits.unshift(newVisit);
  localStorage.setItem(STORAGE_KEYS.DOCTOR_VISITS, JSON.stringify(visits));
  return newVisit;
}

/**
 * Delete a doctor visit record.
 * @param {string} id
 */
export async function deleteDoctorVisit(id) {
  const visits = await getDoctorVisits();
  const filtered = visits.filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCTOR_VISITS, JSON.stringify(filtered));
  return filtered;
}

// ---- Doctor Questions (Phase 2) ----

/**
 * @typedef {Object} DoctorQuestion
 * @property {string} id
 * @property {string} text
 * @property {boolean} isAnswered
 * @property {string} note - optional answer or response note
 */

/**
 * Get all questions for doctor.
 * @returns {Promise<DoctorQuestion[]>}
 */
export async function getDoctorQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTOR_QUESTIONS);
    if (!raw) {
      // Default starter questions
      const defaultQuestions = [
        { id: 'q_default_1', text: 'Apakah posisi plasenta aman dan tidak menutupi jalan lahir?', isAnswered: false, note: '' },
        { id: 'q_default_2', text: 'Bagaimana jumlah dan kejernihan air ketuban saat ini?', isAnswered: false, note: '' },
        { id: 'q_default_3', text: 'Apakah vitamin yang dikonsumsi saat ini sudah cukup atau perlu tambahan zat besi/kalsium?', isAnswered: false, note: '' },
      ];
      localStorage.setItem(STORAGE_KEYS.DOCTOR_QUESTIONS, JSON.stringify(defaultQuestions));
      return defaultQuestions;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Add a new question for doctor.
 * @param {string} text
 */
export async function addDoctorQuestion(text) {
  const questions = await getDoctorQuestions();
  const newQ = {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    text,
    isAnswered: false,
    note: '',
  };
  questions.unshift(newQ);
  localStorage.setItem(STORAGE_KEYS.DOCTOR_QUESTIONS, JSON.stringify(questions));
  return newQ;
}

/**
 * Toggle question answered status.
 * @param {string} id
 */
export async function toggleDoctorQuestion(id) {
  const questions = await getDoctorQuestions();
  const q = questions.find((item) => item.id === id);
  if (q) {
    q.isAnswered = !q.isAnswered;
    localStorage.setItem(STORAGE_KEYS.DOCTOR_QUESTIONS, JSON.stringify(questions));
  }
  return questions;
}

/**
 * Delete a question.
 * @param {string} id
 */
export async function deleteDoctorQuestion(id) {
  const questions = await getDoctorQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.DOCTOR_QUESTIONS, JSON.stringify(filtered));
  return filtered;
}

// ---- Daily Water & Vitamin Log (Phase 2) ----

/**
 * Get daily log for a specific date (YYYY-MM-DD).
 * @param {string} dateStr
 */
export async function getDailyLog(dateStr) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const logs = raw ? JSON.parse(raw) : {};
    return logs[dateStr] || { waterGlasses: 0, tookVitamin: false };
  } catch {
    return { waterGlasses: 0, tookVitamin: false };
  }
}

/**
 * Update daily log for a specific date.
 * @param {string} dateStr
 * @param {Partial<{ waterGlasses: number, tookVitamin: boolean }>} updates
 */
export async function updateDailyLog(dateStr, updates) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const logs = raw ? JSON.parse(raw) : {};
    const current = logs[dateStr] || { waterGlasses: 0, tookVitamin: false };
    logs[dateStr] = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    return logs[dateStr];
  } catch {
    return { waterGlasses: 0, tookVitamin: false };
  }
}

// ---- Supabase Cloud Sync (Phase 3) ----

export async function isCloudConnected() {
  const supabase = getSupabase();
  return !!supabase;
}

export async function syncLocalToSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, message: 'Supabase belum dikonfigurasi. Masukkan URL dan Anon Key di Pengaturan.' };
  }

  const userId = getDeviceUserId();

  try {
    // 1. Sync Profile
    const profile = await getProfile();
    if (profile) {
      await supabase.from('profiles').upsert({
        user_id: userId,
        mama_name: profile.mamaName || 'Mama',
        papa_name: profile.papaName || 'Papa',
        hpht: profile.hpht,
        insurance_type: profile.insuranceType || 'bpjs',
        hospital_name: profile.hospitalName || '',
        hospital_address: profile.hospitalAddress || '',
        doctor_name: profile.doctorName || '',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    // 2. Sync Weekly Checklist
    const completed = await getCompletedItems();
    if (completed.length > 0) {
      const records = completed.map((itemId) => ({
        user_id: userId,
        item_id: itemId,
      }));
      await supabase.from('checklist_completions').upsert(records, { onConflict: 'user_id,item_id' });
    }

    // 3. Sync Hospital Bag
    const bagPacked = await getHospitalBagItems();
    if (bagPacked.length > 0) {
      const records = bagPacked.map((itemId) => ({
        user_id: userId,
        item_id: itemId,
      }));
      await supabase.from('hospital_bag_completions').upsert(records, { onConflict: 'user_id,item_id' });
    }

    // 4. Sync Custom Bag Items
    const customBag = await getCustomBagItems();
    if (customBag.length > 0) {
      const records = customBag.map((ci) => ({
        user_id: userId,
        category: ci.category,
        title: ci.text,
      }));
      await supabase.from('custom_bag_items').upsert(records);
    }

    // 5. Sync Doctor Visits
    const visits = await getDoctorVisits();
    if (visits.length > 0) {
      const records = visits.map((v) => ({
        user_id: userId,
        date: v.date,
        week: v.week,
        blood_pressure: v.bloodPressure,
        mother_weight: v.motherWeight,
        baby_weight: v.babyWeight,
        doctor_notes: v.doctorNotes,
        doctor_name: v.doctorName,
      }));
      await supabase.from('doctor_visits').upsert(records);
    }

    // 6. Sync Doctor Questions
    const questions = await getDoctorQuestions();
    if (questions.length > 0) {
      const records = questions.map((q) => ({
        user_id: userId,
        text: q.text,
        is_answered: q.isAnswered,
        note: q.note || '',
      }));
      await supabase.from('doctor_questions').upsert(records);
    }

    return {
      success: true,
      message: 'Semua data lokal berhasil disinkronkan ke cloud Supabase!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal sinkronisasi ke cloud: ${err.message}`,
    };
  }
}

export async function fetchSupabaseToLocal() {
  const supabase = getSupabase();
  if (!supabase) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  const userId = getDeviceUserId();

  try {
    // 1. Fetch Profile
    const { data: profData } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
    if (profData) {
      await saveProfile({
        mamaName: profData.mama_name,
        papaName: profData.papa_name,
        hpht: profData.hpht,
        insuranceType: profData.insurance_type,
        hospitalName: profData.hospital_name,
        hospitalAddress: profData.hospital_address,
        doctorName: profData.doctor_name,
      });
    }

    // 2. Fetch Checklist
    const { data: checkData } = await supabase.from('checklist_completions').select('item_id').eq('user_id', userId);
    if (checkData) {
      const ids = checkData.map((r) => r.item_id);
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(ids));
    }

    // 3. Fetch Hospital Bag
    const { data: bagData } = await supabase.from('hospital_bag_completions').select('item_id').eq('user_id', userId);
    if (bagData) {
      const ids = bagData.map((r) => r.item_id);
      localStorage.setItem(STORAGE_KEYS.HOSPITAL_BAG, JSON.stringify(ids));
    }

    // 4. Fetch Doctor Visits
    const { data: visitData } = await supabase.from('doctor_visits').select('*').eq('user_id', userId).order('date', { ascending: false });
    if (visitData) {
      const formatted = visitData.map((v) => ({
        id: v.id,
        date: v.date,
        week: v.week,
        bloodPressure: v.blood_pressure,
        motherWeight: v.mother_weight,
        babyWeight: v.baby_weight,
        doctorNotes: v.doctor_notes,
        doctorName: v.doctor_name,
      }));
      localStorage.setItem(STORAGE_KEYS.DOCTOR_VISITS, JSON.stringify(formatted));
    }

    return {
      success: true,
      message: 'Data dari cloud Supabase berhasil dimuat ke penyimpanan lokal!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal memuat data dari cloud: ${err.message}`,
    };
  }
}

// ---- Kick Counter (Phase 4) ----

export async function getKickSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KICK_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveKickSession(session) {
  const sessions = await getKickSessions();
  const newSession = {
    ...session,
    id: `kick_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  sessions.unshift(newSession);
  localStorage.setItem(STORAGE_KEYS.KICK_SESSIONS, JSON.stringify(sessions));
  return newSession;
}

export async function deleteKickSession(id) {
  const sessions = await getKickSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.KICK_SESSIONS, JSON.stringify(filtered));
  return filtered;
}

// ---- Contraction Timer (Phase 4) ----

export async function getContractionRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTRACTION_RECORDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveContractionRecord(record) {
  const records = await getContractionRecords();
  const newRecord = {
    ...record,
    id: `cont_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  };
  records.unshift(newRecord);
  localStorage.setItem(STORAGE_KEYS.CONTRACTION_RECORDS, JSON.stringify(records));
  return newRecord;
}

export async function clearContractionRecords() {
  localStorage.removeItem(STORAGE_KEYS.CONTRACTION_RECORDS);
  return [];
}

// ---- Labor Budget (Phase 4) ----

export async function getLaborBudget() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LABOR_BUDGET);
    return raw ? JSON.parse(raw) : { currentSavings: 0, targetOverride: null };
  } catch {
    return { currentSavings: 0, targetOverride: null };
  }
}

export async function saveLaborBudget(budget) {
  localStorage.setItem(STORAGE_KEYS.LABOR_BUDGET, JSON.stringify(budget));
  return budget;
}

// ---- Reset ----

export async function resetAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

export { STORAGE_KEYS };
