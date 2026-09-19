import { createClient } from '@supabase/supabase-js';

// Initialize from Vite env vars (injected by GitHub Actions secrets at build time)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Singleton client
let _client = null;

export function getSupabase() {
  if (_client) return _client;
  if (!isSupabaseConfigured) return null;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}

/** Sign in with email + password */
export async function signIn(email, password) {
  const supabase = getSupabase();
  if (!supabase) return { error: { message: 'Supabase belum dikonfigurasi.' } };
  return supabase.auth.signInWithPassword({ email, password });
}

/** Sign out current user */
export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  return supabase.auth.signOut();
}

/** Get current session */
export async function getSession() {
  const supabase = getSupabase();
  if (!supabase) return { data: { session: null } };
  return supabase.auth.getSession();
}

/** Subscribe to auth state changes — returns unsubscribe fn */
export function onAuthStateChange(callback) {
  const supabase = getSupabase();
  if (!supabase) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

/** Get or generate a persistent anonymous device user ID (for local storage sync) */
const USER_ID_KEY = 'bumilceria_client_user_id';
export function getDeviceUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

/** Test Supabase connection (used in storage sync) */
export async function testSupabaseConnection() {
  const supabase = getSupabase();
  if (!supabase) return { success: false, message: 'Supabase belum dikonfigurasi.' };
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { success: true, message: 'Tersambung ke Supabase! Jalankan supabase_schema.sql untuk membuat tabel.' };
      }
      return { success: false, message: `Gagal query: ${error.message}` };
    }
    return { success: true, message: 'Koneksi ke Supabase berhasil!' };
  } catch (err) {
    return { success: false, message: `Gagal menghubungi server: ${err.message}` };
  }
}
