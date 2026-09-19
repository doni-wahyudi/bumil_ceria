# Project Technical Details — BumpBuddy

A mobile-first React + Vite pregnancy tracking web app tailored for Indonesian parents (Bandar Lampung). All 5 phases (Core Foundation, Enhanced Features, Polish & Cloud Integration, Clinical & Practical Tools, and Desktop Companion & Audio Relaxation) are completely implemented and verified.

---

## 1. System Overview & Tech Stack
* **Framework**: React 19 + Vite 8.x
* **Routing**: react-router-dom v7
* **Icons**: lucide-react
* **Audio Synthesis**: Pure Web Audio API (`src/utils/audioSynth.js`), zero external MP3 dependencies
* **PWA**: Installable web application with `manifest.json` and standalone display
* **Database**: Hybrid architecture — offline-first localStorage with async Promise layer & seamless sync to Supabase Cloud
* **Supabase SDK**: `@supabase/supabase-js` installed & configured with `supabase_schema.sql`
* **Styling**: Vanilla CSS with design tokens in `src/index.css` (Light & Warm Dark Mode, Desktop 3-Column Companion)
* **Fonts**: Nunito (display) + Inter (body) via Google Fonts
* **Language**: UI in Bahasa Indonesia, code in English
* **Design Philosophy**: Warm, nurturing palette (soft rose + sage teal), non-clinical, anti-overwhelm, tactile micro-animations
* **Color Tokens**:
  - Light: `--color-primary: #D88EAA`, `--color-secondary: #7EAEB2`, `--color-accent: #F2C97E`, `--color-bg: #FDF8F4`
  - Dark: `--color-primary: #F4B8CD`, `--color-secondary: #94D2D6`, `--color-accent: #F7D488`, `--color-bg: #1C1917`

---

## 2. Active Routing & Navigation
* `/` → Home (dashboard with progress ring, 6-card Quick Actions grid, Bandar Lampung Hospital banner, Audio Relaxation banner, USG reminder, weekly checklist)
* `/timeline` → Timeline (week-by-week 1–40 view + 9 USG milestones schedule)
* `/checklist` → Checklist (sub-tab toggle: Tugas Mingguan vs Tas Bersalin 🎒, bounded scrollable categories, scope switcher)
* `/profile` → Profile (edit names, HPHT, hospital, insurance, dark mode, Supabase cloud sync card, medical export & backup)
* `/hospital-bag` → Tas Bersalin (Mama, Bayi, Papa & Dokumen checklist, custom items, packing progress)
* `/doctor-notes` → Catatan Kontrol (Tanya Dokter list & riwayat kontrol BP/weight/notes)
* `/nutrition` → Nutrisi & Mitos (Isi Piringku, superfood lokal, pantangan medis, myth buster, daily water & vitamin tracker)
* `/calculator` → Kalkulator HPL (metode HPHT variabel siklus haid & metode USG Trimester 1 CRL)
* `/hospitals` → Direktori Faskes & RS Bandar Lampung (RSIA Bunda, Belleza, RS Advent, RSUDAM, Hermina, Urip, tombol Call IGD & Maps)
* `/labor-tools` → Alat Persalinan (Cardiff Count-to-10 Kick Counter & 5-1-1 Active Contraction Timer)
* `/cost-simulator` → Simulasi Biaya Persalinan (Normal vs ERACS, BPJS vs Mandiri vs Swasta, kelas kamar, dan target tabungan bulanan Papa)
* Desktop Companion View: 3-column sticky sidebar (Left: Brand, Profile & Week Tracker, Audio Relaksasi button, Navigation Menu; Center: Mobile frame; Right: 24h IGD Emergency Dial & Red Flags)

---

## 3. Data Architecture & Storage Schema

All storage operations follow an async Promise-based contract in `src/utils/storage.js`:

| Key Name | Storage Type | Supabase Table | Purpose |
| :--- | :--- | :--- | :--- |
| `bumpbuddy_profile` | Object | `profiles` | User profile (mama, papa, hpht, insurance, hospital, doctor) |
| `bumpbuddy_checklist` | String[] | `checklist_completions` | Completed weekly checklist items |
| `bumpbuddy_usg_status` | Object | `usg_completions` | Completed USG milestone status |
| `bumpbuddy_hospital_bag` | String[] | `hospital_bag_completions` | Packed hospital bag items |
| `bumpbuddy_custom_bag_items`| Object[] | `custom_bag_items` | User-added hospital bag items `{id, category, text}` |
| `bumpbuddy_doctor_visits` | Object[] | `doctor_visits` | Medical visit records `{date, week, blood_pressure, mother_weight, doctor_notes}` |
| `bumpbuddy_doctor_questions` | Object[] | `doctor_questions` | Questions for doctor `{text, is_answered, note}` |
| `bumpbuddy_daily_logs` | Object | `daily_logs` | Daily water & vitamin logs `{date: {water_glasses, took_vitamin}}` |
| `bumpbuddy_kick_sessions` | Object[] | `kick_sessions` | Cardiff Kick Counter records `{id, date, count, durationSeconds}` |
| `bumpbuddy_contraction_records` | Object[] | `contraction_records` | Contraction log `{id, timestamp, duration, intensity, interval}` |
| `bumpbuddy_labor_budget` | Object | `labor_budget` | Labor cost plan & saved budget `{currentSavings, method, insurance, hospitalClass}` |
| `bumpbuddy_theme` | String | `localStorage` | UI theme preference ('light' \| 'dark' \| 'system') |
| `bumpbuddy_supabase_config`| Object | `localStorage` | Supabase Project URL & Anon Key |

---

## 4. Web Audio API Relaxation Engine
Implemented in `src/utils/audioSynth.js`:
1. **Womb Heartbeat (Denyut Rahim / Jantung Janin)**: Dual-pulse sine wave (68 Hz & 82 Hz) at 72 BPM with lowpass filter (140 Hz) mimicking amniotic sound.
2. **Ocean Waves (Deburan Ombak Lembut)**: Continuous pink noise passed through a sweeping resonant lowpass filter modulated by a 0.14 Hz LFO (7.1s wave cycle).
3. **Calm Rain (Hujan Rintik Tenang)**: Filtered pink/white noise with bandpass resonance centered at 1400 Hz.
4. **4-7-8 Breathing Guide**: Guided visual pulse and harmonic 528 Hz / 440 Hz / 350 Hz solfeggio bell chimes pacing inhale, hold, and exhale phases.

---

## 5. Verification Pipeline
```bash
npm run build     # Production bundle verification (passes with 0 errors)
npm run dev       # Local Vite development server on port 5173
```
