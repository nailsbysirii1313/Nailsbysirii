# Nails by Sirii — Studio OS & Client Management Platform

A high-craft, modern, and boutique web platform designed specifically for **Nails by Sirii** (Bespoke Nail Art & Luxury Gel Atelier).

Built from end-to-end across four comprehensive phases to manage clients, track custom nail anatomy/style preferences, trigger automated push alerts on Sirii's phone via **ntfy**, and generate chic itemized invoices that can be printed or shared via WhatsApp/iMessage with a single click.

---

## Aesthetic & Design Identity

- **Design Philosophy**: *Chic Haute Atelier & Soft Rose Minimalist*
- **Palette**: Warm Cashmere Cream (`#FAF7F5`), Blush Ivory (`#FFF9F7`), Rose Dust & Berry (`#C24D68`, `#D96E85`), Champagne Gold accents (`#EEDDCC`), and Noir Cocoa (`#231F20`) for razor-sharp typography contrast.
- **Typography**: Google Fonts — *Playfair Display* (expressive editorial serif) paired with *Plus Jakarta Sans* (clean modern geometric sans).
- **Zero Emojis**: 100% clean, professional SVG iconography using Lucide stroke icons.

---

## Core Capabilities Across All 4 Phases

### Phase 1: Studio OS & Client CRM
- **Comprehensive Profile**: Name, Phone, Email, Instagram handle (`@username`), Client Birthday, VIP status.
- **Nail Style & Anatomy Tracking**:
  - Preferred Shape: Almond, Coffin, Squoval, Round, Square, Stiletto
  - Preferred Length: Short, Medium, Long, Extra Long
  - Preferred Aesthetic: 3D Chrome & Glaze, BIAB Natural Look, French Ombre, Velvet Cat Eye, Y2K Kawaii Charms, Hand-Painted Abstract
  - Health & Allergies: HEMA sensitivities, acetone caution, delicate cuticles
  - Personal Notes: Beverage preferences, booking frequency, color favorites.
- **Appointments & Studio Calendar**: Booking flow, auto duration & pricing calculations, deposit tracking ($30 standard).
- **Phone Alerts via ntfy.sh**: Zero-cost, zero-signup native push alerts to iOS/Android with live QR code and automated 60s background poller.
- **Billing & Invoices**: Haute-Couture itemized receipts with print/PDF export and 1-click WhatsApp text format.

### Phase 2: Public Client Portal & Consultation Tools
- **Public Website & Self-Booking**: Editorial client landing page with etiquette policies and 4-step booking wizard that pings Sirii's phone in real-time.
- **Signature Lookbook**: Visual cards for signature aesthetics (*Glazed Donut*, *3D Chrome Orbit*, *Velvet Cat-Eye*, *Micro-French*).
- **Interactive Nail Customizer**: Mix & match shape, length, base palette, and finish with live visual preview and instant cost calculator.
- **Digital Receipt View**: Standalone client receipt view with interactive payment instructions (Zelle, Venmo, Apple Pay).

### Phase 3: Analytics, Loyalty & Client Messaging
- **Financial Analytics & Growth**: Average Order Value (AOV), client retention rate, category breakdown, VIP spender leaderboard, and projected run-rate.
- **Atelier Loyalty Punch Card**: 10-visit milestone punch card with milestone rewards (Visit 5: Free Nail Art, Visit 10: 50% off full set).
- **WhatsApp & SMS Quick-Dispatch**: Pre-formatted templates for 24-hr reminders, booking confirmations, aftercare protocols, and birthday perks with direct launch buttons.
- **Accounting CSV & Data Backup**: 1-click invoice CSV export for tax filing and full database JSON backup.

### Phase 4: Production Polish, PWA & Studio Experience
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant search across all clients, appointments, and quick actions.
- **Client Lookbook & Ring-Light Photo Moodboard**: Dedicated tab inside client profiles to document ring-light photos, retention notes, and growth checks over time.
- **Progressive Web App (PWA) Manifest**: Custom app icon, theme color, and standalone configuration so Sirii can install the app on her iPhone, iPad, or Mac home screen as a standalone application.
- **Synthesized Crystal Audio Chime**: Subtle, luxury studio chime generated via Web Audio API whenever an appointment is confirmed or payment is received.

### Phase 5: Studio Supplies Inventory & Sanitization Protocol Tracker
- **Supplies Catalog & Valuation**: Track professional gels, Gel-X tips, Russian diamond bits, Swarovski flatback crystals, chrome pigments, and retail aftercare with real-time inventory valuation.
- **Quick Stock Steppers**: 1-click `[ - ]` and `[ + ]` stock adjustment steppers directly from the supply cards with minimum restock threshold monitoring.
- **1-Click NTFY Mobile Restock Alert**: Instant push notifications dispatched to Sirii's phone via ntfy detailing all SKUs requiring restock and supplier notes.
- **Daily Sanitization Checklist (State Board & OSHA Compliant)**:
  - Opening Shift: Autoclave steam strip verification, 24-hr fresh Barbicide mixing, HEPA-13 air purifier & desk dust extractor check, ultrasonic diamond bit bath, and single-use client trays.
  - Evening Closing Shift: Class B autoclave final run & register log, gel bottle neck acetone cleansing, and hospital-grade surface disinfection.
  - Timestamps, digital verification badges (*"Verified by Sirii"*), and morning reset functionality.
- **Dashboard Quick-Protocol Widget**: Live sanitization progress bar and restock alerts accessible immediately upon logging in.

### Phase 6: Consultation Diagnostics, Emergency Repair Desk & Bespoke Aftercare
- **Nail Health & Consultation Diagnostic Drawer**:
  - Natural plate integrity rating (Grade A/B/C), cuticle sensitivity assessment, and skin undertone analysis.
  - Curated nude gel shade match recommendations (*Teddy, Cashmere, Strawberry Milk, Sheer Rosewater*).
  - Clinical patch test history log (*HEMA-free builder, tip adhesives*) with verified pass status.
  - Tailored long-term plate recovery and apex maintenance strategy.
- **Bespoke Aftercare Stationery Card Generator**:
  - Generates custom care guides for each client with the 5 Core Longevity Rules (48-hour thermal guard, daily jojoba oil immersion, "Jewels Not Tools", chemical protection, and no-peel rule).
  - Automatically calculates the recommended 3-week infill date based on session date.
  - 1-click formatted text copying for WhatsApp / SMS / iMessage.
  - 1-click printable haute atelier stationery view (`window.print`).
- **Emergency Broken Nail & Repair Request Desk**:
  - Live in the Public Client Portal: clients can submit urgent repair tickets specifying hand, finger, repair type, issue, and urgency.
  - Dispatches immediate **URGENT** priority push notifications to Sirii's phone via ntfy (`tags: "rotating_light,fire,sos"`).
  - Dedicated Emergency Repair Queue on Dashboard and Schedule views with direct click-to-call links and 1-click squeeze-in confirmations.

### Phase 7: Haute Gift Cards & Vouchers Suite + Verified Client Reviews Wall
- **Digital Gift Certificates & Haute Stationery Themes**:
  - Unique voucher code generation (`GIFT-SIRII-XXXX`) with 4 distinct design themes (*Blush Rose Quartz*, *Bridal Velvet Silk*, *Noir Onyx Luxe*, *Lavender Celestial*).
  - Live visual gift card previews, recipient/sender details, and personal gift note display.
  - Real-time ntfy push notification to Sirii's phone whenever a gift voucher is generated.
- **In-Studio Checkout & Invoice Redemption**:
  - Dedicated in-studio redemption checkout station with real-time balance lookup and partial deduction.
  - Direct integration into `NewInvoiceModal` to deduct voucher credits from client invoices.
  - Printable luxury gift certificate modal (`window.print`) and 1-click code copying.
- **Verified Client Reviews Wall (`/publicBooking#reviews`)**:
  - High-fashion testimonials wall embedded into the public booking portal with 5-star ratings, quotes, rendered services, and "Verified Atelier Client" badges.
  - Real-time average studio score indicator (e.g. `4.98 / 5.0`).
  - Interactive "Leave an Atelier Review" modal allowing clients to share their experience.

### Phase 8: Mobile-First Studio OS & Touch-First Ergonomics
- **Mobile Bottom Navigation Bar**:
  - Native 5-button bottom bar with *Today*, *Schedule*, elevated center *[ + ] Quick Add*, *Clients*, and *Studio Hub*.
  - Full support for iPhone/Android safe-area insets (`env(safe-area-inset-bottom)`).
  - Primary touch targets strictly >= 48px in the natural thumb zone.
- **Mobile Quick Action Bottom Sheet**:
  - 1-tap thumb shortcuts for Book Appointment, Register Client, Create Invoice, Emergency Repair, and Gift Voucher.
  - Tactile grab handle bar and smooth slide-up animation.
- **Studio Hub Sheet**:
  - Replaces desktop sidebar on mobile, providing organized access to supplies, sanitization checklist, customizer, analytics, and settings.
- **Bottom-Sheet Modal Transformation**:
  - All studio modals anchor to the bottom of the screen with pull handles on mobile screens.
- **Swipeable Horizontal Filter Tracks**:
  - Horizontally swipeable filter pills across Appointments, Clients, Invoices, and Supplies.

---

## Getting Started

### 1. Live Access
The studio server is currently running on:
**[http://localhost:3001](http://localhost:3001)**

To start manually:
```bash
cd /Users/metagurpreet/.gemini/antigravity/scratch/nails-by-sirii
npm install
npm run dev
```

Or run the production server directly:
```bash
npm run build
npm start
```

---

## Directory Structure
```
nails-by-sirii/
├── data/
│   └── db.json               # Persistent studio database
├── server/
│   ├── index.js              # Express API, Backup exports, & Reminder Worker
│   ├── db.js                 # Database CRUD methods & seeding
│   └── ntfy.js               # Phone alert dispatcher via ntfy.sh
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Top bar with Cmd+K search & view switcher
│   │   ├── Sidebar.jsx       # Studio navigation
│   │   ├── DashboardView.jsx # Studio dashboard & today's agenda
│   │   ├── ClientsView.jsx   # Clients CRM & search
│   │   ├── ClientDetailDrawer.jsx # Slide-over client profile, loyalty card & moodboard
│   │   ├── AppointmentsView.jsx   # Calendar & bookings
│   │   ├── NewAppointmentModal.jsx# Booking modal
│   │   ├── NewClientModal.jsx     # Client registration modal
│   │   ├── InvoicesView.jsx       # Invoices list & financial summary
│   │   ├── NewInvoiceModal.jsx    # Invoice generator
│   │   ├── InvoiceModal.jsx       # Haute-Couture printable & shareable receipt
│   │   ├── PublicBookingView.jsx  # Client portal & self-booking flow
│   │   ├── NailCustomizerView.jsx # Interactive nail set customizer
│   │   ├── PublicInvoiceView.jsx  # Standalone client receipt view
│   │   ├── AnalyticsView.jsx      # Financials, AOV, retention & charts
│   │   ├── QuickMessageModal.jsx  # WhatsApp & SMS quick-dispatch
│   │   ├── CommandPalette.jsx     # Cmd+K quick command overlay
│   │   ├── ServicesView.jsx       # Services & pricing menu
│   │   ├── RemindersView.jsx      # Phone alerts hub & live dispatcher
│   │   ├── SettingsView.jsx       # Studio profile, payments & data backup
│   │   ├── QrModal.jsx            # Scan-to-subscribe QR Code
│   │   └── Toast.jsx              # Status toast notifications
│   ├── utils/
│   │   └── audio.js          # Web Audio crystal chime synthesizer
│   ├── App.jsx               # Main application controller
│   ├── api.js                # API client
│   └── main.jsx
├── public/
│   ├── favicon.svg           # Atelier vector brand icon
│   └── manifest.json         # PWA home screen installation manifest
├── tailwind.config.js
├── vite.config.js
└── package.json
```
# Nailsbysirii
