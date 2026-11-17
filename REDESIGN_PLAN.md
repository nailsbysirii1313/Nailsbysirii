# Redesign Plan: Nails by Sirii

## Project Overview
- **Brand Direction**: Contemporary, artist-led nail studio centered on sculptural precision, health-first natural nail architecture (BIAB & Japanese gel), and expressive hand-painted nail art. An intimate studio experience in Garhi Cantt, Dehradun where detail is deliberate and pricing is transparent.
- **Color Palette & Semantic Tokens**:
  - `bg-studio-canvas`: `#FAF6F0` (warm alabaster / studio linen)
  - `bg-studio-surface`: `#FFFFFF` (clean architectural white)
  - `bg-studio-subtle`: `#F3ECE2` (warm oat tint)
  - `brand-wine`: `#7D2838` (deep artist wine rose / black cherry)
  - `brand-wineHover`: `#651E2C`
  - `brand-wineLight`: `#FDF2F4`
  - `text-ink`: `#1C1917` (Stone 900, ratio 14.8:1)
  - `text-secondary`: `#57534E` (Stone 600, ratio 6.2:1)
  - `text-muted`: `#8C827A` (Stone 400, ratio 4.6:1)
  - `border-subtle`: `#E8DFD5`
  - `border-strong`: `#D1C4B5`
  - `accent-gold`: `#C29358` / `#FDF8F0`
  - `status-emerald`: `#15803D` / `#F0FDF4`
  - `status-amber`: `#B45309` / `#FFFBEB`
- **Typography Pairing**:
  - **Headings & Accents**: `Fraunces` (`font-display`, variable optical serif with sculptural character)
  - **Body, UI & Admin**: `Plus Jakarta Sans` (`font-sans`, geometric, high legibility on mobile screens)
- **Repository Strategy**: Preserve flat-file database (`data/db.json`), Express backend (`server/index.js`), Vite build, and client routing. No stack rewrites.

---

## Phases & Roadmap

### Phase 0: Discover and Baseline
- [x] Inspect existing code, runtime, assets, data models, and dependencies.
- [x] Verify running application and verify API behavior.
- [x] Reproduce and trace the 4 specific prompt issues.
- [x] Audit application surfaces, data integrity, security boundaries, and responsive issues.
- [x] Establish project tracking documents: `REDESIGN_PLAN.md`, `FEATURE_MAP.md`, `QA_CHECKLIST.md`.
- [x] Define exact scope and intended files for Phase 1.

### Phase 1: Repair Critical Fundamentals
- [x] Customizer handoff & pricing synchronization (single source of truth in `customizerCalculator.js`).
- [x] Operating hours & slot bounds reconciliation (`12:00 PM – 7:00 PM` IST, `getAvailableSlotsForDuration`).
- [x] Access control & credential redaction (stripped `studioPasscode` from public API, added session auth).
- [x] Restricted public invoice "Mark as Paid" action.
- [x] Timezone stability (`Asia/Kolkata` date generation).
- [x] Suppressed numeric balance leaks in no-prices mode.
- [x] Desktop navigation overlap fix (`md:hidden`).
- [x] Created scalable geometric SVG silhouettes (`NailTipSchematic.jsx`).

### Phase 2: Design System & Pilot Screens
- [x] Formulated concise brand positioning statement & voice guidelines.
- [x] Selected and integrated typography pairing (`Fraunces` + `Plus Jakarta Sans`).
- [x] Implemented complete semantic color tokens in `tailwind.config.js` and `index.css`.
- [x] Defined restrained motion specification respecting `prefers-reduced-motion`.
- [x] Built and integrated **Public Mobile Home Pilot** (`PublicHomePilot.jsx` at 390px).
- [x] Built and integrated **Studio Hub Today Pilot** (`StudioTodayPilot.jsx` at 390px).
- [x] Added live interactive pilot comparison toggle in `App.jsx` allowing side-by-side inspection with baseline.
- [x] Verified clean production build (`npm run build`).

### Phase 3: Complete Public Experience (COMPLETED & TESTED)
- [x] **Complete Creative Redesign of `ClientWebsite.jsx`**:
  - Replaced legacy `atelier-*` pink-and-serif styling with contemporary artist-led `studio-*` tokens and `Fraunces` + `Plus Jakarta Sans` typography.
  - Eliminated generic copy ("Affordable", "Cute babe" spam); adopted sculptural nail architecture positioning with transparent pricing and honest session durations.
- [x] **Public Header & Mobile Drawer**:
  - Compact 390px-optimized header with safe-area padding (`pt-safe`), studio logo, with/without prices toggle, and owner passcode lock.
  - Slide-over mobile drawer with accessible touch targets (≥44px), price toggle, and direct WhatsApp / owner links.
- [x] **Hero & Immediate Portfolio Showcase**:
  - Concise editorial headline, operating hours & ratings badges, key standards (autoclave sterilization, zero damage, 3–4 weeks durability).
  - 4-card portfolio showcase directly below headline featuring scalable geometric silhouettes (`NailTipSchematic`), prices, durations, and 1-tap reservation handoff.
- [x] **Service Catalogue & Menu**:
  - Dynamic category pill chips, search bar (16px input to prevent iOS zoom), with/without prices mode toggle, and treatment cards with prep checklists.
- [x] **Interactive Virtual Nail Studio / Customizer**:
  - Mobile-First layout: Live Schematic Preview Card placed FIRST (`order-first`) on mobile so visual silhouette immediately reflects shape, length, color, and finish changes.
  - 4 selection steps: Silhouette, Length (with surcharges), Base Mineral Tint (swatches), and Art Finish.
  - Real-time price/duration calculation via `customizerCalculator.js` and 1-tap "Reserve This Custom Set" handoff.
- [x] **Curated Lookbook Gallery**:
  - 6 editorial looks with honest geometric SVG silhouettes (`NailTipSchematic`), tags, durations, and 1-tap "Reserve This Look" handoff.
- [x] **4-Step Booking Wizard**:
  - Step 1: Active Custom Set or Look card breakdown with option to edit or switch to catalogue; standard services; optional add-ons.
  - Step 2: Shape chips, length buttons, and aesthetic vibe selection.
  - Step 3: Date picker + Time slots filtered through `getAvailableSlotsForDuration(totalDuration)` ensuring closing by 19:00 IST. Total bill & duration preview.
  - Step 4: 16px inputs (Name, Phone, Email, Instagram, Allergies, Special Requests).
    - Optional Advance Deposit toggle with copyable UPI ID (`nailsbysirii@okaxis`), clear advance vs pending calculation.
    - When `hidePrices` is active: suppresses all numeric balances and displays "Balance due at appointment".
  - Step 5: Confirmed Booking screen with 1-tap WhatsApp confirmation pre-filling complete appointment details.
- [x] **Verified Client Reviews & Testimonials**:
  - Google rating header `4.9 ★ on Google (344+ Reviews)`, review cards with star ratings and verified tags, and "Share Your Experience" modal.
- [x] **Studio Policies, Sanitation & Location**:
  - Hospital-grade sterilization, appointment etiquette, 3–4 week aftercare principles, Google Maps link, operating hours (12:00 PM – 7:00 PM IST), and contacts.
- [x] **Discreet Floating Mobile Concierge Bar**:
  - Fixed bottom on mobile screens (`sm:hidden`, `pb-safe`) with quick Reserve, WhatsApp, and Share actions.
- [x] **Harmonized Public Modals**:
  - Redesigned `EmergencyRepairModal.jsx`, `ShareCatalogueModal.jsx`, and `PasscodeModal.jsx` using `studio-*` tokens and artist-led voice.
- [x] **Verification**: Zero build errors (`npm run build`), all API endpoints tested via automated script.

### Phase 4: Complete Studio Hub (IN PROGRESS)
- [x] **Batch 4A: Core Scheduling & Client Relationships (COMPLETED & TESTED)**:
  - `NewAppointmentModal.jsx`: Redesigned with `studio-*` tokens, 16px inputs to prevent mobile zoom, advance payment deposit tracking, and operating hours slot picker.
  - `NewClientModal.jsx`: Redesigned with `studio-*` tokens, 16px inputs, VIP toggle, aesthetic & shape preferences.
  - `ClientDetailDrawer.jsx`: Redesigned with `studio-*` tokens, `getKolkataTodayString()`, loyalty rewards tracker, style profile, moodboard, and aftercare launcher.
  - `ClientsView.jsx`: Redesigned with `studio-*` tokens, 16px search input, VIP/Shape filters, and 1-tap Book/Bill actions.
  - `AppointmentsView.jsx`: Redesigned with `studio-*` tokens, `getKolkataTodayString()`, 12:00–19:00 operating hours timeline, Month Calendar with day detail panel, emergency repairs queue, and 1-tap phone alerts / billing.
- [ ] **Batch 4B: Invoices & Billing, Public Invoices, Gift Cards, Financials & Analytics (NEXT)**:
  - `InvoicesView.jsx`: Redesign invoice list, status badges (Paid, Pending, Overdue), and payment breakdown.
  - `NewInvoiceModal.jsx`: Harmonize invoice creator with advance credit deductions and custom set line items.
  - `PublicInvoiceView.jsx`: Upgrade digital bill presentation with UPI QR code and payment verification.
  - `GiftCardsView.jsx`: Redesign voucher creation, redemption tracking, and luxury gift vouchers.
  - `AnalyticsView.jsx`: Redesign revenue metrics, service breakdown, retention charts, and CSV export.
- [ ] **Batch 4C: Inventory & Supplies, Services Menu, Nail Set Customizer**:
  - `InventoryView.jsx`: Stock management, category chips, restock thresholds.
  - `ServicesView.jsx`: Service catalog CRUD, pricing, duration, categories.
  - `NailCustomizerView.jsx`: Studio customizer with SVG silhouettes and direct booking handoff.
- [ ] **Batch 4D: Phone Reminders & NTFY, Settings, Navigation & Layout**:
  - `RemindersView.jsx`: Mobile push alert setup with QR code, live dispatcher, dispatch history.
  - `SettingsView.jsx`: Studio hours, UPI ID, policies, profile management.
  - `Sidebar.jsx`, `Header.jsx`, `DashboardView.jsx`: Align Studio Hub layout and Today dashboard with `StudioTodayPilot`.

### Phase 5: Integration, Verification, and Final Polish
- **Objective**: Cross-device testing (320px, 390px, 768px, 1440px), end-to-end regression sign-off.

---

## Decisions Log
- **D-01 (Architecture)**: Retain Express backend + JSON file storage + Vite frontend. No stack rewrites.
- **D-02 (Data Preservation)**: Preserve `data/db.json` and all existing settings/services/inventory records intact.
- **D-03 (Authentication)**: Enforce session token validation on private routes; redact passcode from DOM and network responses.
- **D-04 (Customizer Truth)**: Single source of truth in `customizerCalculator.js` eliminates discrepancies between customizer, booking, and invoices.
- **D-05 (Operating Hours)**: Source of truth is `settings.timings` (12:00 PM – 7:00 PM). Booking slots start at 12:00 PM and respect treatment duration bounds.
- **D-06 (Visual Honesty)**: Honest geometric SVG silhouettes (`NailTipSchematic.jsx`) labeled as illustrative schematic previews.
- **D-07 (Design System)**: Fraunces + Plus Jakarta Sans + Warm Studio Linen (`#FAF6F0`) & Deep Wine Rose (`#7D2838`). Eliminates generic wedding pink and unverified marketing superlatives.
- **D-08 (Mobile First)**: All layouts verified at 390px (testing 320px–430px) before desktop expansion.
- **D-09 (Customizer Mobile Order)**: On mobile viewports, the Live Schematic Preview is rendered above the configuration selectors (`order-first`) so users immediately see visual feedback as they tap options.
- **D-10 (No-Prices Privacy)**: In portfolio mode (`hidePrices`), numeric advance payments and pending balance amounts are completely replaced with text indicators to prevent accidental disclosure.

---

## Next Task
- Execute **Phase 4: Complete Studio Hub — Batch 4A** (Schedule, Appointments View, Clients Roster, Client Detail Drawer).
