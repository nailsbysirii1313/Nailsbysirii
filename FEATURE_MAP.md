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
| **Complete Redesigned Public Experience** | `src/components/ClientWebsite.jsx` | `services`, `settings`, `reviews` | TESTED | Complete Creative Redesign centered on the **Atelier Design Booklet & Catalogue**. Zero price rates shown. Mobile-first (390px), Fraunces + Plus Jakarta Sans, warm studio linen & wine palette, 44px+ touch targets, safe-area insets. |
| **Atelier Design Catalogue & Booklet** | `src/components/ClientWebsite.jsx` | `catalogueBooklet` array, `NailTipSchematic.jsx` | TESTED | **Main feature of client portal**. 17 curated designs with 5 dedicated **Acrylic Nails** sculptures (French Ombré, 3D Hand-Carved Florals, Encapsulated Gold Leaf, Velvet Cat-Eye, Milky Quartz Marble), BIAB, Gel-X, Hand-Painted Art, Bridal, Press-Ons. Zero price rates. |
| **Bring Your Own Internet Inspo Mode** | `src/components/ClientWebsite.jsx` | Local state, `inspoUrl`, `inspoDescription` | TESTED | Prominent hero banner & booking mode enabling clients to submit photo reference links or descriptions from Pinterest, Instagram, or TikTok. |
| **Price Rates Completely Removed** | `ClientWebsite.jsx`, `ShareCatalogueModal.jsx`, `Sidebar.jsx` | Public surfaces | TESTED | All numeric prices and "With/Without Prices" toggles removed from the client portal. Pure aesthetic booklet. Booking requires zero upfront deposit. |
| **Luxury Press-On Nails E-Commerce Boutique** | `ClientWebsite.jsx`, `#press-ons`, `PressOnsView.jsx` | `api.getPressOnProducts()`, `api.createPressOnOrder()` | TESTED | Replaced customizer with full e-commerce shopping experience for ready-to-wear press-on nails. Product cards with shape/length badges, transparent prices (₹1,199–₹1,699), stock badges, Sizing Guide modal, and UPI QR code checkout modal. Decrements stock automatically. |
| **Appointment Reservation Flow** | `ClientWebsite.jsx` | `settings`, `api.createAppointment()` | TESTED | Streamlined 4-step reservation wizard (Select Design or Internet Inspo → Preferred Shape & Length → Date & Slot within 12–7 PM IST → Client Contact info). Zero deposit or price barrier. |
| **Elevated Reviews & Social Proof Suite** | `ClientWebsite.jsx` | `api.getReviews()`, `api.createReview()`, `data/db.json` | TESTED | Google Trust Scorecard (4.9★, 344+ verified reviews, trust pillars, direct Maps link), interactive category filter pills (Exact Inspo Match, Extensions & BIAB, Hand-Painted Art, Hygiene & Hospitality, Nail Tech Academy), Magazine Spotlight Card, interactive Heart/Helpful upvoting, and upgraded 5-star review modal with confetti. |
| **Studio Policies & Location Footer** | `ClientWebsite.jsx` | `settings` (address, phone, timings, maps URL) | TESTED | Autoclave sterilization standards, appointment etiquette, 3–4 weeks durability tips, Google Maps link, operating hours (12:00 PM – 7:00 PM IST), contacts. |
| **Urgent Repair Request** | `ClientWebsite.jsx`, `EmergencyRepairModal.jsx` | `api.createRepair()`, NTFY notification | TESTED | Form for broken nail squeeze-in; styled with `studio-*` tokens and dispatches urgent push notification to phone. |
| **Owner Hub Access Gate** | `ClientWebsite.jsx`, `PasscodeModal.jsx` | `api.verifyPasscode()`, `localStorage` | TESTED | Passcode completely redacted from UI attributes, labels, and placeholders. Verified against token authentication. |
| **Share Catalogue Modal** | `ClientWebsite.jsx`, `ShareCatalogueModal.jsx` | `settings` | TESTED | Generates shareable Design Booklet URL, dynamic salon desk QR code, and formatted WhatsApp message. Zero price modes. |
| **Floating Mobile Concierge Bar** | `ClientWebsite.jsx` | Local state | TESTED | Fixed bottom on mobile (`sm:hidden`, `pb-safe`) with Reserve Slot CTA, WhatsApp chat link, and Share Booklet button. |

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
| **Inventory & Supplies** | `src/components/InventoryView.jsx` | `api.getInventory()`, `api.adjustInventoryStock()`, `api.sendInventoryLowStockAlert()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Stock level adjustments, minimum thresholds, category filters, restock alerts, 16px inputs. |
| **Daily Sanitization Checklist** | `src/components/InventoryView.jsx`, `DashboardView.jsx`, `server/db.js`, `StudioTodayPilot.jsx` | `api.getChecklist()`, `api.toggleChecklistItem()`, `api.resetChecklist()` | TESTED | OSHA & State Board protocols for opening/closing shifts, timestamping and sign-off logging. |
| **Interactive Set Customizer** | `src/components/NailCustomizerView.jsx` | `customizerCalculator.js`, `NailTipSchematic.jsx` | TESTED | Studio-side customizer. Carries custom set selections and itemization directly into `NewAppointmentModal` and `NewInvoiceModal`. |
| **Financials & Growth Analytics** | `src/components/AnalyticsView.jsx` | `invoices`, `appointments`, `clients`, `services` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Revenue metrics in ₹, average ticket size, client retention rate, category breakdown bars, top spender leaderboard, and tax CSV export. |
| **Services & Art Menu Editor** | `src/components/ServicesView.jsx` | `api.getServices()`, `api.createService()`, `api.updateService()`, `api.deleteService()` | TESTED | Service catalog CRUD, pricing, duration, popular tag, category assignment. |
| **Phone Reminders & NTFY Alerts** | `src/components/RemindersView.jsx`, `QrModal.jsx`, `server/ntfy.js` | `api.getNotifications()`, `api.sendTestNotification()`, `ntfy.sh` API | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. NTFY topic configuration, QR code mobile pairing, live test alert dispatcher, transmission log, and auto-scheduler worker. |
| **Studio Settings** | `src/components/SettingsView.jsx` | `api.getSettings()`, `api.updateSettings()` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Studio info, timings, owner name, UPI settings, tax rate, passcode, backup export. Passcode redacted over public wire. |
| **Aftercare Card Generator** | `src/components/AftercareCardModal.jsx` | `client`, `appointment`, `settings` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Generates customized digital aftercare tips card for client with 1-tap WhatsApp and print delivery. |
| **Quick Messaging Modal** | `src/components/QuickMessageModal.jsx` | `client`, `appointment`, `settings` | TESTED | Redesigned with `studio-*` tokens and Fraunces typography. Elevated copy, 16px inputs on mobile, WhatsApp and SMS templates (Confirmation, 24-hr Reminder, Aftercare, Birthday). |
| **Command Palette (Cmd+K)** | `src/components/CommandPalette.jsx` | Global state in `App.jsx` | TESTED | Redesigned with `studio-*` tokens and 16px search input on mobile. Quick search across clients, appointments, invoices, and actions. |
| **Mobile Navigation & Sheets** | `MobileBottomNav.jsx`, `MobileQuickActionSheet.jsx`, `MobileStudioHubSheet.jsx` | `currentTab`, `setTab` | TESTED | Redesigned with `studio-*` tokens and brand-wine accents. Bottom bar has `md:hidden` to prevent double navigation on desktop, with safe area inset support. |
| **Press-On Boutique Admin Hub** | `src/components/PressOnsView.jsx` | `api.getPressOnProducts()`, `api.getPressOnOrders()`, `api.updatePressOnOrder()` | TESTED | Dedicated Studio Hub tab (`ShoppingBag`). Financial stats, order cards/table, status workflow (pending/processing/shipped/delivered), courier name & tracking URL, 1-tap WhatsApp notifications, and products catalog stock manager. |

---

## 3. Backend & Storage

| Component | File Path | Mechanism | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **API Server** | `server/index.js` | Express 4.21 on port 3001 | TESTED | Serves REST endpoints; protected private routes via `requireAuth` session token header. Includes press-on boutique orders & catalog endpoints. |
| **JSON Database** | `server/db.js`, `data/db.json` | Atomic JSON read/write via temp file swap | TESTED | Stores settings, services, clients, appointments, invoices, inventory, checklist, repairs, vouchers, reviews, press-on products and orders. |
| **Supabase Cloud Database (Free Tier)** | `server/supabase.js`, `supabase-schema.sql`, `scripts/seed-supabase.js` | PostgreSQL + Row-Level Security via `@supabase/supabase-js` | READY | Complete schema DDL, RLS policies, automatic fallback to `db.json` if environment keys omitted, and `npm run seed:supabase` migration script. |
| **Automated Worker** | `server/index.js` | 60s `setInterval` checking upcoming appointments | TESTED | Uses Kolkata timezone; triggers phone alerts for upcoming appointments within lead hours. |
| **NTFY Dispatcher** | `server/ntfy.js` | HTTP POST to `ntfy.sh` | TESTED | Sends push alerts for bookings, low stock, emergency repairs, new press-on orders, and reminders. Verified priority header. |
