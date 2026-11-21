# DESIGN.md: Bumil Ceria Design System & Direction

## Design Read
> Reading this as: Maternal & fetal health companion web app (PWA) for Indonesian expectant couples (Mama & Papa in Bandar Lampung), in a warm, tactile, non-clinical Buku KIA editorial style, dial ENERGY 2 / RHYTHM 2 / MOTION 2.

## Liveliness Dials
- **ENERGY: 2 (Balanced)**: Warm, calm, reassuring presence tailored for expectant parents checking daily pregnancy milestones, fetal biometry, and emergency readiness without clinical sterility or aggressive marketing energy.
- **RHYTHM: 2 (Consistent with purposeful breaks)**: Consistent card and list rhythm across tracking modules broken intentionally by the weekly ProgressRing hero, Quick Actions 2x3/3x2 grid, inline alert callouts (USG, BPJS emergency rights, 5-1-1 contraction alert), and the WeightGainChart trajectory visualization.
- **MOTION: 2 (Purposeful transitions & feedback)**: Micro-interactions (button press `scale(0.97)`, checkmark spring pop `350ms`, modal/tab scale-fade `250ms`) using `cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.23, 1, 0.32, 1)`. Zero infinite ambient loops or perpetual pulse animations (`R-19`). All non-essential motion collapses under `prefers-reduced-motion: reduce`.

## 60-30-10 Color Architecture & WCAG AA Verification (`R-25`, `R-29`, `R-34`)
- **60% Dominant Foundation**: Warm Paper Cream (`#FDF8F4` light / `#1C1917` warm dark) evoking the physical Indonesian Buku KIA companion experience without sterile blue-white glare.
- **30% Structural & Surface**: Crisp Warm White cards (`#FFFFFF` light / `#292524` dark) with hairline warm-stone borders (`#E2DAD2` light / `#44403C` dark).
- **10% Deliberate Accent & Semantic Roles**:
  - **Primary Accent (Warm Blossom Rose)**: `#B8527A` (Light, `4.64:1` against `#FFFFFF`) / `#F4B8CD` (Dark, `10.48:1` against `#1C1917`) for primary CTAs, active navigation indicators, Mama role highlights, and gestational progress ring.
  - **Supporting Core (Sage Teal)**: `#3A7D82` (Light) / `#94D2D6` (Dark) for clinical reassurance, hydration/nutrition goals, and normal status badges.
  - **Supporting Role (Papa Slate)**: `#3C637E` (Light) / `#9CC2DC` (Dark) for Papa checklist & financial/logistics responsibilities.
  - **Warm Honey Highlight**: `#7D5814` on `#FDF3DF` (Light, `5.82:1`) / `#FCE4AD` on `#3D3118` (Dark) for USG milestones and preparation reminders.

## Typography & Numeric Hygiene (`R-06`, `appllama-app-design-skill` Law 4)
- **Display & Headings**: `'Nunito'` (friendly rounded terminal strokes suited to a family maternal companion) with tight `-0.02em` tracking and clear `h1 -> h2 -> h3` hierarchy on every screen.
- **Body & Clinical Readouts**: `'Inter'` for clear legibility across long medical notes, nutrition facts, and biometry tables (`line-height: 1.5` to `1.65`).
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` applied to gestational week counters, kick/contraction timers, Rupiah cost estimates, dates, and biometry tables so changing digits never jitter horizontally.

## Modular Spacing, Shape Lock & Tap Targets (`R-03`, `R-11`)
- **Spacing Scale**: Strict 4px/8px base unit (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`).
- **Shape Lock Scale**: `--radius-xs: 6px` (micro tags), `--radius-sm: 8px` (compact chips/inputs), `--radius-md: 12px` (inputs, icon wraps, nested panels), `--radius-lg: 16px` (content cards), `--radius-xl: 20px` (modals, companion frame), `--radius-2xl: 24px` (auth card), `--radius-full: 9999px` (primary CTAs, pills, tabs).
- **Breakpoints (3 Designed States)**:
  - Mobile (`< 640px`): Single-column stacked cards, 2-column quick action grid, fixed bottom nav with reserved scroll padding.
  - Tablet (`640px – 1023px`): Expanded `680px` reading frame with 2-to-3 column grids so tablets are never a stretched phone stack.
  - Desktop (`>= 1024px`): 3-column companion workspace (Left: Navigation & Week Summary, Center: Core Frame, Right: 24h IGD Emergency Dial & KIA Red Flags).
- **Touch Targets**: Minimum `44x44px` hit box on interactive buttons, toggles, icon controls, and week pills.

## One-Line Reasons for Major Visual Decisions (`R-31`)
1. **Warm cream + blossom rose + sage teal palette**: Grounded in Indonesian maternal care (Buku KIA) to feel reassuring and distinct from generic blue-purple AI gradients.
2. **Nunito + Inter pairing**: Rounded friendly display headings paired with crisp clinical sans body text balances warmth with high legibility for medical numbers.
3. **3-column desktop companion + mobile bottom bar**: Keeps emergency IGD numbers and pregnancy status visible at a glance on desktop while optimizing one-handed thumb navigation on mobile.
4. **Solid cards with restrained elevation**: Replaces blanket glassmorphism and glow so primary CTAs and clinical alerts establish clear hierarchy without floating-page noise.
5. **Static status markers + transition-only motion**: Replaces endless pulse loops so expectant parents can read medical indicators calmly without visual distraction.
