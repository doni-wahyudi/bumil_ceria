import { createClient } from '@supabase/supabase-js';

const CONFIG_KEY = 'bumpbuddy_supabase_config';
const USER_ID_KEY = 'bumpbuddy_client_user_id';

/**
 * Get or generate a persistent user ID for anonymous sync.
 */
export function getDeviceUserId() {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

/**
 * Get stored Supabase configuration (from localStorage or Vite environment variables).
 */
export function getSupabaseConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch {
    // ignore
  }

  // Fallback to .env variables if present
  const envUrl = import.meta.env?.VITE_SUPABASE_URL;
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, fromEnv: true };
  }

  return { url: '', anonKey: '', isConfigured: false };
}

/**
 * Save user-entered Supabase config to localStorage.
 */
export function saveSupabaseConfig(url, anonKey) {
  if (!url || !anonKey) {
    localStorage.removeItem(CONFIG_KEY);
    cachedClient = null;
    return;
  }
  localStorage.setItem(CONFIG_KEY, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
  cachedClient = null; // reset cached client
}

let cachedClient = null;

/**
 * Get Supabase client instance.
 * @returns {import('@supabase/supabase-js').SupabaseClient | null}
 */
export function getSupabase() {
  if (cachedClient) return cachedClient;

  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      cachedClient = createClient(config.url, config.anonKey, {
        auth: { persistSession: false },
      });
      return cachedClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

/**
 * Test whether given or stored Supabase credentials can connect to the database.
 * @param {string} [testUrl]
 * @param {string} [testKey]
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function testSupabaseConnection(testUrl, testKey) {
  const url = testUrl || getSupabaseConfig().url;
  const anonKey = testKey || getSupabaseConfig().anonKey;

  if (!url || !anonKey) {
    return {
      success: false,
      message: 'URL proyek dan Anon Key belum diisi.',
    };
  }

  try {
    const client = createClient(url.trim(), anonKey.trim());
    // Quick test query
    const { error } = await client.from('profiles').select('count', { count: 'exact', head: true });
    if (error) {
      // If table doesn't exist yet, it's still a valid connection to Supabase!
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Tersambung ke Supabase! (Catatan: Jalankan supabase_schema.sql di SQL Editor untuk membuat tabel).',
        };
      }
      return {
        success: false,
        message: `Gagal query: ${error.message} (Kode: ${error.code})`,
      };
    }
    return {
      success: true,
      message: 'Koneksi ke Supabase berhasil dan tabel terverifikasi!',
    };
  } catch (err) {
    return {
      success: false,
      message: `Gagal menghubungi server: ${err.message}`,
    };
  }
}
