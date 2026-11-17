# QA Checklist: Nails by Sirii

This document records reproducible manual and automated quality assurance checks, expected behavior, and actual results verified against the codebase and running application.

---

## Baseline & Phase Checks Matrix

| ID | Check Description | Reproduction Method | Expected Behavior | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **QA-01** | Production Build | Run `npm run build` | Zero syntax errors, produces `dist/` bundle | Built cleanly in 1.28s (CSS: 73.55 kB, JS: 744.10 kB). Zero build errors. | **PASS** |
| **QA-02** | Express Server Health | `GET http://localhost:3001/api/health` | Returns `{ status: 'ok', time: ... }` | Returns `200 OK` with ISO timestamp. | **PASS** |
| **QA-03** | Database Integrity & Record Preservation | Inspect `data/db.json` keys & arrays | Contains settings, services, inventory, checklist, reviews | All services (10), inventory (10), checklist (10), reviews (10), and settings preserved intact. | **PASS** |
| **QA-04** | Customizer → Booking Price Handoff | Select Medium Almond + Medium Length (+₹300) + Hailey Glazed (+₹600). Click "Book This Custom Set". | Booking wizard should show ₹3,100 total, 105 mins duration, and custom set items. | Step 1 and Step 3 display ₹3,100, 105 mins, and itemized custom set cards. Preserved on submit into appointment and invoice items. | **PASS** (Resolved) |
| **QA-05** | Operating Hours & Slot Consistency | Compare `settings.timings` with booking time slot options. | All booking slots fall within studio hours (12:00 PM – 7:00 PM) and respect duration. | Slots start at 12:00 PM opening. Slots exceeding 19:00 closing (e.g. 17:30 for 105m) are filtered out via `getAvailableSlotsForDuration`. | **PASS** (Resolved) |
| **QA-06** | Live Nail Preview Visual Honesty | Inspect "Live Custom Set Preview" card in Customizer. | Honest illustrative schematic or visual silhouette, labeled as illustrative preview. | Renders scalable SVG silhouette (`NailTipSchematic`) reflecting exact shape geometry, length, and finish overlay, with "Illustrative Schematic Preview" badge. | **PASS** (Resolved) |
| **QA-07** | Passcode Redaction & Security Boundaries | Inspect accessibility labels, placeholders, and API responses. | Passcode never disclosed in UI text, accessible attributes, or public API endpoints. | `nbs0812` completely redacted from `ClientWebsite.jsx`, `PasscodeModal.jsx`, `SettingsView.jsx`, and stripped from `/api/settings`. Protected routes enforce session token. | **PASS** (Resolved) |
| **QA-08** | Public Invoice Payment Permission | Inspect `PublicInvoiceView.jsx` on `#invoice-:id`. | Public viewers cannot mark invoices as paid without studio credentials. | "Mark as Paid" action restricted to authenticated studio sessions (`nbs_studio_auth`). Public viewer sees dynamic UPI QR code without admin action. | **PASS** (Resolved) |
| **QA-09** | Desktop Bottom Navigation Overlap | Open Studio Hub at desktop width (>768px). | Mobile bottom bar is hidden on desktop viewports. | `MobileBottomNav` has `md:hidden`; hidden on desktop viewports while desktop sidebar is active. | **PASS** (Resolved) |
| **QA-10** | No-Prices Catalogue Mode Price Leakage | Navigate with `?noPrices=1` or `#no-prices`, toggle advance payment in booking. | No monetary amounts are displayed. | Pending balance displays "Balance due at appointment" and "Balance due at studio" instead of leaking numeric totals. | **PASS** (Resolved) |
| **QA-11** | India Time Zone (Asia/Kolkata) Date Integrity | Test date generation between midnight and 5:30 AM IST. | Uses local calendar date in Asia/Kolkata. | Replaced UTC `toISOString().split('T')[0]` with `getKolkataTodayString()` and `getKolkataTomorrowString()` using `Intl.DateTimeFormat(..., { timeZone: 'Asia/Kolkata' })`. | **PASS** (Resolved) |
| **QA-12** | Lookbook "Book This Look" Linkage | Click "Book This Look" on Glazed Donut Nails (₹2,800, 75 mins). | Booking wizard initializes with look's service, ₹2,800 price, and 75m duration. | Sets `bookingMode = 'lookbook'`, binds look title, ₹2,800 price, and 75m duration in Step 1 and Step 3. | **PASS** (Resolved) |
| **QA-13** | Customizer Mobile-First Layout | Inspect Customizer section on 390px viewport. | Live Schematic Preview Card renders above selectors so changes are immediately visible. | `order-first` placed on Preview Card on mobile (<1024px); sticky right column on desktop. | **PASS** (Phase 3) |
| **QA-14** | Mobile Input Zoom Prevention | Inspect input elements on mobile viewports. | Form inputs use `text-base` (16px) on mobile so iOS Safari does not zoom the viewport. | Inputs set to `text-base sm:text-xs` across ClientWebsite, EmergencyRepairModal, and PasscodeModal. | **PASS** (Phase 3) |
| **QA-15** | Public Appointment Submission API | Submit `POST /api/appointments` with custom set line items. | Returns 200 with persisted record and auto-links client profile. | Returns 200 with ID `apt_1794928415040`, price 3100, duration 105m, and 3 line items. | **PASS** (Phase 3) |
| **QA-16** | Emergency Repair Squeeze-in Dispatch | Submit `POST /api/repairs` from `EmergencyRepairModal`. | Returns 200 with persisted repair record and urgent flag. | Returns 200 with ID `rep_1794928415042` targeting Right Hand Index Finger. | **PASS** (Phase 3) |
| **QA-17** | Verified Review Submission | Submit `POST /api/reviews` from Review Modal. | Returns 200 with persisted review and updates average rating. | Returns 200 with ID `rev_1794928419012` and rating 5★. | **PASS** (Phase 3) |
| **QA-18** | Floating Mobile Concierge Bar Visibility | Check viewport `<640px` and `>=640px`. | Bar appears only on mobile viewports and respects safe-area insets. | Styled with `sm:hidden` and `pb-safe`, positioned with padding so it never obscures form fields or footer. | **PASS** (Phase 3) |
| **QA-19** | Batch 4A Production Build | Run `npm run build` with updated Studio Hub Batch 4A components. | Zero syntax or bundling errors. | Built in 1.44s. Bundle sizes: CSS 73.20 kB, JS 745.19 kB. Zero errors. | **PASS** (Batch 4A) |
| **QA-20** | Appointments View 3-Mode Switcher | Toggle between List, Month Calendar, and Day Timeline in `AppointmentsView.jsx`. | Seamless view mode switching with state persistence. | Verified List, Month Calendar with daily detail drawer, and Day Timeline with operating hours (12:00–19:00 IST). | **PASS** (Batch 4A) |
| **QA-21** | Client Detail Drawer & Spend Tracking | Open `ClientDetailDrawer.jsx` for client profile. | Displays total spend, visits, preferred shape, VIP tag, loyalty progress, and 1-tap call/WhatsApp. | Verified drawer renders style profile, loyalty reward checklist, and aftercare launcher. | **PASS** (Batch 4A) |
| **QA-22** | Appointment Status Lifecycle | Update appointment status via `PUT /api/appointments/:id`. | Status updates correctly from Confirmed to In Progress to Completed. | API returned 200 OK and updated appointment status to 'In Progress'. | **PASS** (Batch 4A) |

---

## Regression Verification Checks
1. **Production Build**: `npm run build` passes with zero errors in 1.28s.
2. **Server Route Protection**: Unauthenticated `GET /api/overview` returns 401. Authenticated `GET /api/overview` with token returns 200.
3. **Public Booking Persistence**: Public appointment submission persists price, duration, and custom set details while auto-linking client profile.
4. **Calculations**: Customizer calculation unit test confirms ₹3,100 total price and 105 mins duration.
5. **Modals**: EmergencyRepairModal, ShareCatalogueModal, and PasscodeModal styled with `studio-*` tokens and responsive layout.
