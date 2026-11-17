# Feature Map: Nails by Sirii

This document catalogues every feature in the application, its implementation location, dependencies, data flow, and current verification status.

## Verification Status Key
- **OBSERVED**: Found in running application or browser review.
- **CODE-VERIFIED**: Traced and confirmed by inspecting source code files.
- **TESTED**: Verified through automated command execution or API requests.
- **UNKNOWN**: Exists in code or UI but behavior under edge cases is not yet verified.

---

## 1. Public Surfaces

| Feature | Implementation Locations | Data Dependencies | Status | Notes & Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Complete Redesigned Public Experience** | `src/components/ClientWebsite.jsx` | `services`, `settings`, `reviews` | TESTED | Complete Phase 3 creative redesign. Mobile-first (390px default), Fraunces + Plus Jakarta Sans, warm studio linen & deep wine palette, 44px+ touch targets, safe-area insets. |
| **Public Mobile Home Pilot** | `src/components/PublicHomePilot.jsx` | `services`, `settings`, `reviews` | TESTED | Mobile-first pilot (390px default). Available in switcher bar for side-by-side comparison. |
| **Service Catalogue & Search** | `src/components/ClientWebsite.jsx` | `api.getServices()`, `data/db.json` | TESTED | Dynamic category pills, 16px search input (prevents iOS auto-zoom), duration badges, included prep checklist, transparent pricing. |
| **Price Modes (With/Without Prices)** | `src/App.jsx`, `ClientWebsite.jsx`, `ShareCatalogueModal.jsx` | URL params `?hidePrices=true`, `?noPrices=1`, `#no-prices` | TESTED | Portfolio preview mode hides prices across catalog, cards, and customizer. Advance payment and confirmation cards suppress numeric balances. |
| **Nail Set Customizer** | `ClientWebsite.jsx`, `NailCustomizerView.jsx`, `customizerCalculator.js` | `calculateCustomSet()` | TESTED | Mobile-First layout: Live Schematic Preview rendered FIRST on mobile (<1024px). Single source of truth preserves price (₹3,100) & duration (105m) into booking wizard. |
| **Live Nail Preview** | `ClientWebsite.jsx`, `NailTipSchematic.jsx`, `PublicHomePilot.jsx` | Local state | TESTED | Honest geometric SVG silhouette (`NailTipSchematic`) reflecting exact shape geometry, length, and finish overlay, with "Illustrative Schematic Preview" badge. |
| **Curated Lookbook Gallery** | `ClientWebsite.jsx` | `lookbookItems` array, `NailTipSchematic.jsx` | TESTED | 6 editorial looks with geometric SVG preview silhouettes, durations, and 1-tap "Reserve This Look" handoff. |
| **4-Step Booking Wizard** | `ClientWebsite.jsx` | `services`, `settings`, `api.createAppointment()` | TESTED | Step 1 (Treatment / Custom Set / Look), Step 2 (Silhouette & Length), Step 3 (Date & Time filtered to 12–7 PM IST ending before 19:00), Step 4 (Client details & Advance Payment), Step 5 (Confirmed Booking + 1-tap WhatsApp). |
| **Advance Payment UI** | `ClientWebsite.jsx` | `settings.upiId`, UPI links | TESTED | Optional advance deposit toggle with UPI ID copy (`nailsbysirii@okaxis`), clear advance vs pending calculation, and numeric balance suppression when `hidePrices` is active. |
| **Client Reviews & Testimonials** | `ClientWebsite.jsx` | `api.getReviews()`, `api.createReview()`, `data/db.json` | TESTED | Google rating header (4.9 ★), verified review badges, star rating average, "Share Your Experience" modal with form validation. |
| **Studio Policies & Location Footer** | `ClientWebsite.jsx` | `settings` (address, phone, timings, maps URL) | TESTED | Autoclave sterilization standards, appointment etiquette, 3–4 weeks durability tips, Google Maps link, operating hours (12:00 PM – 7:00 PM IST), contacts. |
| **Urgent Repair Request** | `ClientWebsite.jsx`, `EmergencyRepairModal.jsx` | `api.createRepair()`, NTFY notification | TESTED | Form for broken nail squeeze-in; styled with `studio-*` tokens and dispatches urgent push notification to phone. |
| **Owner Hub Access Gate** | `ClientWebsite.jsx`, `PasscodeModal.jsx` | `api.verifyPasscode()`, `localStorage` | TESTED | Passcode completely redacted from UI attributes, labels, and placeholders. Verified against token authentication. |
| **Share Catalogue Modal** | `ClientWebsite.jsx`, `ShareCatalogueModal.jsx` | `settings` | TESTED | Generates shareable URL with/without prices, dynamic QR code, and formatted WhatsApp message. Styled with `studio-*` tokens. |
| **Floating Mobile Concierge Bar** | `ClientWebsite.jsx` | Local state | TESTED | Fixed bottom on mobile (`sm:hidden`, `pb-safe`) with Reserve Slot CTA, WhatsApp chat link, and Share modal button. |

---

## 2. Studio Hub Surfaces

| Feature | Implementation Locations | Data Dependencies | Status | Notes & Verification |
| :--- | :--- | :--- | :--- | :--- |
| **Studio Hub Today Pilot** | `src/components/StudioTodayPilot.jsx` | `appointments`, `clients`, `invoices`, `repairs`, `checklist` | TESTED | Mobile-first pilot (390px default). High-density agenda, emergency repair squeeze-in card, deposit tracking, 1-tap call/WhatsApp, sanitization progress. |
| **Studio Dashboard / Today** | `src/components/DashboardView.jsx` | `overview`, `appointments`, `clients`, `invoices`, `checklist`, `inventory`, `repairs` | TESTED | Agenda for today, urgent repair requests, key metrics, daily sanitization status, stock alerts. Uses Kolkata calendar date. |
| **Clients & Profiles** | `src/components/ClientsView.jsx`, `ClientDetailDrawer.jsx`, `NewClientModal.jsx` | `api.getClients()`, `api.createClient()`, `api.updateClient()`, `api.deleteClient()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Search, VIP filters, preferred shape badges, appointment spend history, loyalty rewards, and 1-tap call/WhatsApp. |
| **Appointments & Schedule** | `src/components/AppointmentsView.jsx`, `NewAppointmentModal.jsx` | `api.getAppointments()`, `api.updateAppointmentStatus()`, `api.remindAppointment()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. 3 view modes (List, Month Calendar, Day Timeline). Aligned with 12:00–19:00 operating hours, advance payment badges, and emergency repair queue. |
| **Invoices & Studio Billing** | `src/components/InvoicesView.jsx`, `InvoiceModal.jsx`, `NewInvoiceModal.jsx` | `api.getInvoices()`, `api.createInvoice()`, `api.updateInvoiceStatus()`, `api.deleteInvoice()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Itemized line items, advance deposit crediting, voucher credit, tip, dynamic UPI QR code, printable studio bill, and WhatsApp dispatch. |
| **Public Invoice Digital Bill** | `src/components/PublicInvoiceView.jsx` | Route `#invoice-:id`, `api.getInvoices()`, `api.updateInvoiceStatus()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Dynamic UPI QR code (`upi://pay`), instant payment intent, optional tip selector, aftercare guidance. "Mark Settled" strictly restricted to authenticated studio sessions. |
| **Gift Cards & Vouchers** | `src/components/GiftCardsView.jsx` | `api.getGiftCards()`, `api.createGiftCard()`, `api.redeemGiftCard()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. 4 luxury stationery themes, instant in-studio checkout balance deduction, printable gift certificate, and code copying. |
| **Inventory & Supplies** | `src/components/InventoryView.jsx` | `api.getInventory()`, `api.adjustInventoryStock()`, `api.sendInventoryLowStockAlert()` | CODE-VERIFIED | Stock level adjustments, minimum thresholds, category filters, restock alerts. |
| **Daily Sanitization Checklist** | `src/components/InventoryView.jsx`, `DashboardView.jsx`, `server/db.js`, `StudioTodayPilot.jsx` | `api.getChecklist()`, `api.toggleChecklistItem()`, `api.resetChecklist()` | TESTED | OSHA & State Board protocols for opening/closing shifts, timestamping and sign-off logging. |
| **Interactive Set Customizer** | `src/components/NailCustomizerView.jsx` | `customizerCalculator.js`, `NailTipSchematic.jsx` | TESTED | Studio-side customizer. Carries custom set selections and itemization directly into `NewAppointmentModal` and `NewInvoiceModal`. |
| **Financials & Growth Analytics** | `src/components/AnalyticsView.jsx` | `invoices`, `appointments`, `clients`, `services` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Revenue metrics in ₹, average ticket size, client retention rate, category breakdown bars, top spender leaderboard, and tax CSV export. |
| **Services & Art Menu Editor** | `src/components/ServicesView.jsx` | `api.getServices()`, `api.createService()`, `api.updateService()`, `api.deleteService()` | TESTED | Service catalog CRUD, pricing, duration, popular tag, category assignment. |
| **Phone Reminders & NTFY Alerts** | `src/components/RemindersView.jsx`, `QrModal.jsx`, `server/ntfy.js` | `api.getNotifications()`, `api.sendTestNotification()`, `ntfy.sh` API | TESTED | NTFY topic configuration, QR code mobile setup, manual test alert, notification logs, auto-scheduler worker. |
| **Studio Settings** | `src/components/SettingsView.jsx` | `api.getSettings()`, `api.updateSettings()` | TESTED | Studio info, timings, owner name, UPI settings, tax rate, passcode. Passcode redacted over public wire. |
| **Aftercare Card Generator** | `src/components/AftercareCardModal.jsx` | `client`, `appointment`, `settings` | CODE-VERIFIED | Generates customized digital aftercare tips card for client with 1-tap WhatsApp delivery. |
| **Quick Messaging Modal** | `src/components/QuickMessageModal.jsx` | `client`, `appointment`, `settings` | CODE-VERIFIED | Pre-composed WhatsApp/SMS templates (Directions, Reminder, Running Late, Aftercare). |
| **Command Palette (Cmd+K)** | `src/components/CommandPalette.jsx` | Global state in `App.jsx` | CODE-VERIFIED | Keyboard-accessible modal for quick search across clients, appointments, invoices, and actions. |
| **Mobile Navigation & Sheets** | `MobileBottomNav.jsx`, `MobileQuickActionSheet.jsx`, `MobileStudioHubSheet.jsx` | `currentTab`, `setTab` | TESTED | Mobile bottom nav bar and action sheets. `MobileBottomNav` has `md:hidden` to prevent double navigation on desktop. |

---

## 3. Backend & Storage

| Component | File Path | Mechanism | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **API Server** | `server/index.js` | Express 4.21 on port 3001 | TESTED | Serves REST endpoints; protected private routes via `requireAuth` session token header. |
| **JSON Database** | `server/db.js`, `data/db.json` | Atomic JSON read/write via temp file swap | TESTED | Stores settings, services, clients, appointments, invoices, inventory, checklist, repairs, vouchers, reviews. |
| **Automated Worker** | `server/index.js` | 60s `setInterval` checking upcoming appointments | TESTED | Uses Kolkata timezone; triggers phone alerts for upcoming appointments within lead hours. |
| **NTFY Dispatcher** | `server/ntfy.js` | HTTP POST to `ntfy.sh` | TESTED | Sends push alerts for bookings, low stock, emergency repairs, and reminders. Verified priority header. |
