# Nails by Sirii - Studio Operating System (Desktop Edition)

Welcome to the complete, production-ready build of **Nails by Sirii**. Everything has been compiled and saved to this desktop folder.

---

## 1. Quick Start

### Option A: 1-Click Launch (Mac Finder)
Double-click [`Start-Nails-by-Sirii.command`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/Start-Nails-by-Sirii.command).
It will automatically start the server and open `http://localhost:3001` in your browser.

### Option B: Terminal Command
Open Terminal, change to this folder, and start:
```bash
cd /Users/metagurpreet/Desktop/Nails-by-Sirii
npm start
```
Then visit `http://localhost:3001`.

---

## 2. Using On Your Mobile Phone

Since this is designed primarily for mobile usage, you can access the system from your phone in two easy ways:

### On the same Wi-Fi network (Home / Atelier Wi-Fi):
1. Find your Mac's IP address (System Settings > Wi-Fi > Details, or run `ipconfig getifaddr en0` in Terminal).
2. On your phone's Safari or Chrome, open:
   ```text
   http://<YOUR-MAC-IP>:3001
   ```
   *(For example: `http://192.168.1.15:3001`)*
3. Tap **Share > Add to Home Screen** on iPhone, or **Install app / Add to Home screen** on Android. The app will launch like a native mobile app with a clean full-screen experience!

### Anywhere over the Internet (Mobile Data / Remote):
Run a secure tunnel using Cloudflare Tunnel or localtunnel:
```bash
npx localtunnel --port 3001
```
Open the generated HTTPS URL on your phone anytime.

---

## 3. Ntify Mobile Notifications Setup

To receive real-time push alerts on your phone whenever a client books or an appointment reminder is triggered:

1. Download the free **ntify** app from the App Store (iOS) or Google Play Store (Android).
2. Open the ntify app and tap **Subscribe to topic (+)**.
3. Enter your studio topic name:
   ```text
   nails-by-sirii-alerts
   ```
4. You will immediately start receiving instant notification banners with sound and priority tags for:
   - New client bookings
   - 2-hour appointment reminders
   - Direct client phone call & WhatsApp action buttons

*(You can customize your topic name anytime in Studio Settings).*

---

## 4. Logo Customization

Your custom logo can be updated at any moment without editing any code:
1. Open the app on phone or desktop.
2. Go to **Settings > Studio Branding**.
3. Under **Studio Logo**, tap **Upload New Logo** and select your PNG, JPG, or SVG image.
4. Your logo immediately updates across:
   - Navigation header and sidebar
   - Client digital invoice links
   - Printable PDF / thermal receipts
   - Public client booking portal
   - Digital gift cards

---

## 5. Billing & Digital Invoicing Features

- **Currency**: Indian Rupees (`₹` / INR) throughout all views.
- **UPI QR Code**: Dynamic UPI payment QR codes generated on the fly for any invoice total or balance due.
- **1-Tap Mobile UPI Intent**: Clients clicking your link on their phone can tap "Pay via UPI App" to open Google Pay, PhonePe, Paytm, or BHIM directly with the exact amount pre-filled.
- **Digital Sharing**: 1-click native Web Share and WhatsApp receipt sharing.
- **Printable Stationery**: Professional print view formatted for A4 or thermal receipt printers (`window.print()`).
- **Payment Reconciliation**: Record UTR transaction numbers, cash payments, or card settlements with auto status transitions.

---

## 6. Directory Structure

- [`Start-Nails-by-Sirii.command`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/Start-Nails-by-Sirii.command) - 1-Click desktop launcher
- [`server/`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/server) - Express backend with REST API and Ntify scheduler
- [`data/db.json`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/data/db.json) - Local database storing clients, bookings, services, and invoices
- [`dist/`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/dist) - Compiled, optimized production frontend assets
- [`src/`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/src) - Full React source code
- [`public/`](file:///Users/metagurpreet/Desktop/Nails-by-Sirii/public) - Studio logos, icons, and static assets

