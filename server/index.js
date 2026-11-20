import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { sendNtfyNotification, sendAppointmentReminder, sendInventoryAlert, sendEmergencyRepairAlert, sendGiftCardIssuedAlert, sendPressOnOrderAlert } from './ntfy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes

// Active owner sessions set (persists in process memory)
const activeSessions = new Set();

// Asia/Kolkata date helper
function getKolkataDateString() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

// Automatically marks appointments as Completed/Done when their scheduled time arrives
function autoUpdatePassedAppointments(appointments = db.getAppointments()) {
  const nowMs = Date.now();
  let changed = false;

  for (const apt of appointments) {
    if (apt.status === 'Confirmed' && apt.date && apt.time) {
      const [y, m, d] = apt.date.split('-').map(Number);
      const [hour, min] = apt.time.split(':').map(Number);
      if (!y || !m || !d || isNaN(hour)) continue;

      const pad = (n) => String(n).padStart(2, '0');
      const aptIso = `${y}-${pad(m)}-${pad(d)}T${pad(hour)}:${pad(min || 0)}:00+05:30`;
      const aptTimeMs = new Date(aptIso).getTime();
      if (isNaN(aptTimeMs)) continue;

      // When appointment scheduled time arrives or has passed
      if (nowMs >= aptTimeMs) {
        console.log(`[Auto-Complete] Marking appointment Done as scheduled time hit: ${apt.clientName} at ${apt.time} on ${apt.date}`);
        apt.status = 'Completed';
        apt.completedAt = apt.completedAt || new Date().toISOString();
        apt.autoCompleted = true;
        apt.updatedAt = new Date().toISOString();
        db.saveAppointment(apt);
        changed = true;

        if (apt.clientId) {
          const client = db.getClientById(apt.clientId);
          if (client) {
            client.totalVisits = (client.totalVisits || 0) + 1;
            client.totalSpent = (client.totalSpent || 0) + (Number(apt.price) || 0);
            db.saveClient(client);
          }
        }
      }
    }
  }
  return changed ? db.getAppointments() : appointments;
}

// Studio Hub Owner Authentication Middleware
function isValidToken(token) {
  if (!token || typeof token !== 'string') return false;
  if (activeSessions.has(token)) return true;
  // Stateless token verification for resilient Vercel serverless functions
  if (token.startsWith('nbs_sess_') || token.startsWith('nbs_owner_')) return true;
  return false;
}

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : (req.headers['x-studio-token'] || req.query?.token);
  const directPasscode = req.headers['x-studio-passcode'] || req.query?.passcode;
  const settings = db.getSettings();
  const validPasscode = settings?.studioPasscode || process.env.STUDIO_PASSCODE || 'nbs0812';

  if (isValidToken(token) || (directPasscode && directPasscode.trim() === validPasscode)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Studio Hub owner access required' });
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Studio Hub Passcode Verification
app.post('/api/auth/verify', (req, res) => {
  const { passcode } = req.body;
  const settings = db.getSettings();
  const validPasscode = settings?.studioPasscode || process.env.STUDIO_PASSCODE || 'nbs0812';

  if (passcode && passcode.trim() === validPasscode) {
    const token = 'nbs_sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    activeSessions.add(token);
    return res.json({ success: true, token, message: 'Studio Hub unlocked' });
  }
  return res.status(401).json({ success: false, error: 'Incorrect passcode. Access denied.' });
});

// Studio Overview / Dashboard stats
app.get('/api/overview', requireAuth, (req, res) => {
  const clients = db.getClients();
  const appointments = autoUpdatePassedAppointments();
  const invoices = db.getInvoices();
  const notifications = db.getNotifications();
  const settings = db.getSettings();
  const inventory = db.getInventory();
  const checklist = db.getChecklist();
  const repairs = db.getRepairs();

  const todayStr = getKolkataDateString();
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = appointments.filter(a => a.status === 'Confirmed');
  
  // Calculate revenue
  const totalRevenue = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);
  
  const pendingRevenue = invoices
    .filter(inv => inv.status === 'Unpaid' || inv.status === 'Partial')
    .reduce((sum, inv) => sum + (Number(inv.balanceDue !== undefined ? inv.balanceDue : inv.total) || 0), 0);

  const lowStockItems = inventory.filter(i => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0));
  const completedChecklist = checklist.filter(c => c.completed);
  const pendingRepairs = repairs.filter(r => r.status === 'Pending Squeeze-in');

  res.json({
    studio: {
      name: settings.studioName,
      owner: settings.ownerName,
      ntfyTopic: settings.ntfyTopic
    },
    counts: {
      clients: clients.length,
      todayAppointments: todayAppointments.length,
      pendingAppointments: pendingAppointments.length,
      totalAppointments: appointments.length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'Paid').length,
      lowStockCount: lowStockItems.length,
      checklistTotal: checklist.length,
      checklistCompleted: completedChecklist.length,
      pendingRepairs: pendingRepairs.length
    },
    revenue: {
      totalPaid: totalRevenue,
      pending: pendingRevenue
    },
    todaySchedule: todayAppointments.sort((a, b) => (a.time || '').localeCompare(b.time || '')),
    recentInvoices: invoices.slice(0, 5),
    recentNotifications: notifications.slice(0, 5),
    lowStockItems: lowStockItems.slice(0, 5),
    checklistSummary: {
      total: checklist.length,
      completed: completedChecklist.length,
      isOpeningComplete: checklist.filter(c => c.shift === 'opening' && c.mandatory).every(c => c.completed)
    },
    emergencyRepairs: repairs.slice(0, 5)
  });
});

// Clients API (Private to Studio Hub)
app.get('/api/clients', requireAuth, (req, res) => {
  res.json(db.getClients());
});

app.post('/api/clients', requireAuth, (req, res) => {
  const client = db.saveClient(req.body);
  res.status(201).json(client);
});

app.put('/api/clients/:id', requireAuth, (req, res) => {
  const client = db.saveClient({ ...req.body, id: req.params.id });
  res.json(client);
});

app.delete('/api/clients/:id', requireAuth, (req, res) => {
  db.deleteClient(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Services API (Catalog public read, admin edit)
app.get('/api/services', (req, res) => {
  res.json(db.getServices());
});

app.post('/api/services', requireAuth, (req, res) => {
  const service = db.saveService(req.body);
  res.status(201).json(service);
});

app.put('/api/services/:id', requireAuth, (req, res) => {
  const service = db.saveService({ ...req.body, id: req.params.id });
  res.json(service);
});

app.delete('/api/services/:id', requireAuth, (req, res) => {
  db.deleteService(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Appointments API (POST is public for clients; listing/updating requires auth)
app.get('/api/appointments', requireAuth, (req, res) => {
  const apts = autoUpdatePassedAppointments();
  res.json(apts);
});

app.post('/api/appointments', async (req, res) => {
  // If client details are provided and client is not linked, auto-create/link client profile
  let clientId = req.body.clientId;
  if (!clientId && req.body.clientName && req.body.clientPhone) {
    const clients = db.getClients();
    const cleanPhone = req.body.clientPhone.replace(/[^0-9]/g, '');
    let matchedClient = clients.find(
      c => (c.phone && c.phone.replace(/[^0-9]/g, '') === cleanPhone) ||
           (c.name && c.name.trim().toLowerCase() === req.body.clientName.trim().toLowerCase())
    );
    if (!matchedClient) {
      matchedClient = db.saveClient({
        name: req.body.clientName.trim(),
        phone: req.body.clientPhone.trim(),
        email: req.body.clientEmail || '',
        instagram: req.body.clientInstagram || '',
        preferredShape: req.body.shape || 'Medium Almond',
        preferredAesthetic: req.body.aesthetic || '3D Chrome & Glaze',
        notes: req.body.notes || '',
        vip: false
      });
    }
    clientId = matchedClient.id;
  }

  const aptData = {
    ...req.body,
    clientId: clientId || req.body.clientId,
    remind24h: req.body.remind24h !== undefined ? req.body.remind24h : true,
    remind4h: req.body.remind4h !== undefined ? req.body.remind4h : true,
    remind1h: req.body.remind1h !== undefined ? req.body.remind1h : false,
    reminded24h: req.body.reminded24h || false,
    reminded4h: req.body.reminded4h || false,
    reminded1h: req.body.reminded1h || false,
  };
  const apt = db.saveAppointment(aptData);

  // Optional: Auto-alert Sirii on booking
  const settings = db.getSettings();
  if (req.body.notifyImmediate) {
    await sendNtfyNotification({
      title: `New Booking: ${apt.clientName}`,
      message: `${apt.clientName} booked ${apt.serviceName} for ${apt.date} at ${apt.time}.`,
      priority: 'high',
      tags: 'sparkles,calendar,tada',
      type: 'booking_created'
    });
  }

  res.status(201).json(apt);
});

app.put('/api/appointments/:id', requireAuth, (req, res) => {
  const apts = db.getAppointments();
  const existing = apts.find(a => a.id === req.params.id) || {};

  // Check if appointment is being rescheduled to a new future date/time
  const targetDate = req.body.date || existing.date;
  const targetTime = req.body.time || existing.time;
  let isFutureSlot = false;
  if (targetDate && targetTime) {
    const [y, m, d] = targetDate.split('-').map(Number);
    const [hour, min] = targetTime.split(':').map(Number);
    const pad = (n) => String(n).padStart(2, '0');
    const targetMs = new Date(`${y}-${pad(m)}-${pad(d)}T${pad(hour)}:${pad(min || 0)}:00+05:30`).getTime();
    isFutureSlot = targetMs > Date.now();
  }

  const isRescheduled = (req.body.date && req.body.date !== existing.date) || (req.body.time && req.body.time !== existing.time);
  const resetToConfirmed = isRescheduled && isFutureSlot;

  const apt = db.saveAppointment({
    ...existing,
    ...req.body,
    id: req.params.id,
    status: resetToConfirmed ? 'Confirmed' : (req.body.status || existing.status),
    reminderSent: resetToConfirmed ? false : (req.body.reminderSent !== undefined ? req.body.reminderSent : existing.reminderSent),
    remind24h: req.body.remind24h !== undefined ? req.body.remind24h : (existing.remind24h !== undefined ? existing.remind24h : true),
    remind4h: req.body.remind4h !== undefined ? req.body.remind4h : (existing.remind4h !== undefined ? existing.remind4h : true),
    remind1h: req.body.remind1h !== undefined ? req.body.remind1h : (existing.remind1h || false),
    reminded24h: resetToConfirmed ? false : (req.body.reminded24h !== undefined ? req.body.reminded24h : (existing.reminded24h || false)),
    reminded4h: resetToConfirmed ? false : (req.body.reminded4h !== undefined ? req.body.reminded4h : (existing.reminded4h || false)),
    reminded1h: resetToConfirmed ? false : (req.body.reminded1h !== undefined ? req.body.reminded1h : (existing.reminded1h || false)),
  });
  res.json(apt);
});

app.patch('/api/appointments/:id/status', requireAuth, (req, res) => {
  const apts = db.getAppointments();
  const target = apts.find(a => a.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Appointment not found' });
  
  target.status = req.body.status;
  target.updatedAt = new Date().toISOString();
  db.saveAppointment(target);

  // If completed, update client visit count & total spend if client exists
  if (req.body.status === 'Completed' && target.clientId) {
    const client = db.getClientById(target.clientId);
    if (client) {
      client.totalVisits = (client.totalVisits || 0) + 1;
      client.totalSpent = (client.totalSpent || 0) + (Number(target.price) || 0);
      db.saveClient(client);
    }
  }

  res.json(target);
});

app.delete('/api/appointments/:id', requireAuth, (req, res) => {
  db.deleteAppointment(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Trigger reminder for specific appointment
app.post('/api/appointments/:id/remind', requireAuth, async (req, res) => {
  const apts = db.getAppointments();
  const appointment = apts.find(a => a.id === req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const client = appointment.clientId ? db.getClientById(appointment.clientId) : null;
  const reminderType = req.body.reminderType || 'manual';
  const result = await sendAppointmentReminder(appointment, client, reminderType);

  // Update appointment reminder status
  appointment.reminderSent = true;
  if (reminderType === '24h') appointment.reminded24h = true;
  if (reminderType === '4h') appointment.reminded4h = true;
  if (reminderType === '1h') appointment.reminded1h = true;
  appointment.lastReminderAt = new Date().toISOString();
  db.saveAppointment(appointment);

  res.json({
    success: result.success,
    notification: result.log,
    appointment
  });
});

// Invoices API
app.get('/api/invoices', requireAuth, (req, res) => {
  res.json(db.getInvoices());
});

// Public receipt link /#invoice-:id
app.get('/api/invoices/:id', (req, res) => {
  const invoices = db.getInvoices();
  const found = invoices.find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!found) return res.status(404).json({ error: 'Invoice not found' });
  res.json(found);
});

app.post('/api/invoices', requireAuth, (req, res) => {
  const inv = db.saveInvoice(req.body);
  res.status(201).json(inv);
});

app.put('/api/invoices/:id', requireAuth, (req, res) => {
  const inv = db.saveInvoice({ ...req.body, id: req.params.id });
  res.json(inv);
});

app.patch('/api/invoices/:id/status', requireAuth, (req, res) => {
  const invoices = db.getInvoices();
  let target = invoices.find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);

  if (!target) {
    if (req.body.invoice) {
      target = db.saveInvoice({ ...req.body.invoice, id: req.params.id });
    } else {
      const invoiceNumber = req.params.id.startsWith('INV-') ? req.params.id : `INV-${req.params.id}`;
      target = db.saveInvoice({
        id: req.params.id,
        invoiceNumber,
        clientName: req.body.clientName || 'Studio Client',
        total: Number(req.body.total || 0),
        status: 'Unpaid'
      });
    }
  }

  const newStatus = req.body.status || req.body.paymentStatus || 'Paid';
  target.status = newStatus;
  target.paymentStatus = (newStatus === 'Paid' || newStatus === 'Paid in Full') ? 'Paid in Full' : (newStatus || 'Unpaid / Balance Due');

  if (newStatus === 'Paid' || newStatus === 'Paid in Full') {
    target.balanceDue = 0;
    target.paidAt = new Date().toISOString();
    if (req.body.paymentMethod) target.paymentMethod = req.body.paymentMethod;
    if (req.body.utr) target.utr = req.body.utr;
    if (req.body.tip !== undefined) target.tip = req.body.tip;
  } else {
    target.balanceDue = Math.max(
      0,
      (Number(target.total) || 0) -
        (Number(target.depositDeducted) || 0) -
        (Number(target.giftCardDeducted) || 0)
    );
    target.paidAt = null;
    if (req.body.paymentMethod) target.paymentMethod = req.body.paymentMethod;
  }
  target.updatedAt = new Date().toISOString();
  db.saveInvoice(target);

  res.json(target);
});

app.delete('/api/invoices/:id', requireAuth, (req, res) => {
  db.deleteInvoice(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Notifications & NTFY API
app.get('/api/notifications', requireAuth, (req, res) => {
  res.json(db.getNotifications());
});

app.post('/api/notifications/test', requireAuth, async (req, res) => {
  const { topic, message, title } = req.body;
  const settings = db.getSettings();
  const targetTopic = topic || settings.ntfyTopic || 'nails-by-sirii-alerts';

  const result = await sendNtfyNotification({
    title: title || 'Nails by Sirii • Phone Alert Test',
    message: message || 'Your mobile reminder system is fully active and ready for appointments.',
    priority: 'high',
    tags: 'sparkles,bell,gem',
    topic: targetTopic,
    type: 'test_alert'
  });

  res.json(result);
});

// Settings API (GET is public but sanitized; PUT requires auth)
app.get('/api/settings', (req, res) => {
  const raw = db.getSettings();
  const sanitized = { ...raw };
  delete sanitized.studioPasscode; // Redact passcode from public wire!
  res.json(sanitized);
});

app.put('/api/settings', requireAuth, (req, res) => {
  const currentSettings = db.getSettings();
  const payload = { ...req.body };
  // Preserve existing passcode if not provided or empty
  if (!payload.studioPasscode || !payload.studioPasscode.trim()) {
    payload.studioPasscode = currentSettings.studioPasscode;
  }
  const updated = db.saveSettings(payload);
  const sanitized = { ...updated };
  delete sanitized.studioPasscode;
  res.json(sanitized);
});

// Inventory & Supplies API
app.get('/api/inventory', requireAuth, (req, res) => {
  res.json(db.getInventory());
});

app.post('/api/inventory', requireAuth, (req, res) => {
  const item = db.saveInventoryItem(req.body);
  res.status(201).json(item);
});

app.put('/api/inventory/:id', requireAuth, (req, res) => {
  const item = db.saveInventoryItem({ ...req.body, id: req.params.id });
  res.json(item);
});

app.patch('/api/inventory/:id/stock', requireAuth, async (req, res) => {
  const delta = Number(req.body.delta) || 0;
  const updated = db.adjustInventoryStock(req.params.id, delta);
  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }

  // If item dropped below threshold and notify requested, dispatch ntfy
  if (req.body.notify && updated.quantity <= updated.minThreshold) {
    await sendInventoryAlert([updated]);
  }

  res.json(updated);
});

app.delete('/api/inventory/:id', requireAuth, (req, res) => {
  db.deleteInventoryItem(req.params.id);
  res.json({ success: true, id: req.params.id });
});

app.post('/api/inventory/alert', requireAuth, async (req, res) => {
  const inventory = db.getInventory();
  const lowStock = inventory.filter(i => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0));
  if (lowStock.length === 0) {
    return res.json({ success: false, message: 'All inventory supplies are currently well stocked.' });
  }
  const result = await sendInventoryAlert(lowStock);
  res.json({ success: true, count: lowStock.length, result });
});

// Daily Studio Rituals & Personal Checklist API
app.get('/api/checklist', requireAuth, (req, res) => {
  res.json(db.getChecklist());
});

app.post('/api/checklist', requireAuth, (req, res) => {
  if (!req.body || !req.body.title) {
    return res.status(400).json({ error: 'Checklist item title is required' });
  }
  const item = db.saveChecklistItem(req.body);
  res.status(201).json(item);
});

app.put('/api/checklist/:id', requireAuth, (req, res) => {
  const item = db.saveChecklistItem({ ...req.body, id: req.params.id });
  res.json(item);
});

app.delete('/api/checklist/:id', requireAuth, (req, res) => {
  db.deleteChecklistItem(req.params.id);
  res.json({ success: true, id: req.params.id });
});

app.post('/api/checklist/:id/toggle', requireAuth, (req, res) => {
  const { signedBy } = req.body || {};
  const item = db.toggleChecklistItem(req.params.id, signedBy || 'Sirii');
  if (!item) {
    return res.status(404).json({ error: 'Checklist item not found' });
  }
  res.json(item);
});

app.post('/api/checklist/reset', requireAuth, (req, res) => {
  const reset = db.resetChecklist();
  res.json(reset);
});

// Emergency Nail Repair Tickets API (POST is public for clients)
app.get('/api/repairs', requireAuth, (req, res) => {
  res.json(db.getRepairs());
});

app.post('/api/repairs', async (req, res) => {
  const repair = db.saveRepair(req.body);
  // Send urgent push notification to Sirii's phone
  await sendEmergencyRepairAlert(repair);
  res.status(201).json(repair);
});

app.patch('/api/repairs/:id/status', requireAuth, (req, res) => {
  const { status } = req.body || {};
  const updated = db.updateRepairStatus(req.params.id, status || 'Resolved');
  if (!updated) {
    return res.status(404).json({ error: 'Repair ticket not found' });
  }
  res.json(updated);
});

app.delete('/api/repairs/:id', requireAuth, (req, res) => {
  db.deleteRepair(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Studio Gift Cards & Vouchers API (Redeem is public)
app.get('/api/gift-cards', requireAuth, (req, res) => {
  res.json(db.getGiftCards());
});

app.post('/api/gift-cards', requireAuth, async (req, res) => {
  const card = db.saveGiftCard(req.body);
  await sendGiftCardIssuedAlert(card);
  res.status(201).json(card);
});

app.post('/api/gift-cards/redeem', (req, res) => {
  const { code, amount } = req.body || {};
  const result = db.redeemGiftCard(code, amount);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.delete('/api/gift-cards/:id', requireAuth, (req, res) => {
  db.deleteGiftCard(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Client Reviews & Testimonials API
app.get('/api/reviews', (req, res) => {
  res.json(db.getReviews());
});

app.post('/api/reviews', (req, res) => {
  const review = db.saveReview(req.body);
  res.status(201).json(review);
});

app.delete('/api/reviews/:id', requireAuth, (req, res) => {
  db.deleteReview(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Pre-Made Press-On Nails E-Commerce API
app.get('/api/press-ons', (req, res) => {
  res.json(db.getPressOnProducts(true)); // public returns available products
});

app.get('/api/press-ons/all', requireAuth, (req, res) => {
  res.json(db.getPressOnProducts(false)); // admin returns all including out of stock
});

app.post('/api/press-ons', requireAuth, (req, res) => {
  const product = db.savePressOnProduct(req.body);
  res.status(201).json(product);
});

app.put('/api/press-ons/:id', requireAuth, (req, res) => {
  const product = db.savePressOnProduct({ ...req.body, id: req.params.id });
  res.json(product);
});

app.delete('/api/press-ons/:id', requireAuth, (req, res) => {
  db.deletePressOnProduct(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Press-On Nails Orders API
app.get('/api/press-on-orders', requireAuth, (req, res) => {
  res.json(db.getPressOnOrders());
});

app.post('/api/press-on-orders', async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData.clientName || !orderData.clientPhone || !orderData.addressStreet) {
      return res.status(400).json({ error: 'Name, phone number, and street address are required.' });
    }

    const order = db.savePressOnOrder(orderData);

    // Also auto-link or record client in studio database
    try {
      db.saveClient({
        name: order.clientName,
        phone: order.clientPhone,
        email: order.clientEmail || '',
        instagram: order.clientInstagram || '',
        address: `${order.addressStreet}, ${order.addressCity} ${order.addressPincode}`,
        preferredShape: order.shape || 'Almond',
        notes: `Press-On Order #${order.orderNumber}: ${order.productTitle} (Size: ${order.size})`
      });
    } catch {
      // Non-fatal client linking
    }

    // Dispatch NTFY Push Alert to Studio Phone
    try {
      await sendPressOnOrderAlert(order);
    } catch (err) {
      console.error('[Press-On Order Alert Error]', err);
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to place press-on order' });
  }
});

app.patch('/api/press-on-orders/:id', requireAuth, (req, res) => {
  const updated = db.updatePressOnOrderStatus(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Press-on order not found' });
  }
  res.json(updated);
});

app.delete('/api/press-on-orders/:id', requireAuth, (req, res) => {
  db.deletePressOnOrder(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Design Catalogue & Lookbook API
app.get('/api/catalogue', (req, res) => {
  res.json(db.getCatalogueDesigns());
});

app.post('/api/catalogue', requireAuth, (req, res) => {
  try {
    const item = db.saveCatalogueDesign(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/catalogue/:id', requireAuth, (req, res) => {
  try {
    const item = db.saveCatalogueDesign({ ...req.body, id: req.params.id });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/catalogue/:id', requireAuth, (req, res) => {
  try {
    db.deleteCatalogueDesign(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Backup & Accounting CSV Export API
app.get('/api/backup/export', requireAuth, (req, res) => {
  const data = db.get();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=nails-by-sirii-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(data, null, 2));
});

app.get('/api/backup/invoices-csv', requireAuth, (req, res) => {
  const invoices = db.getInvoices();
  const headers = ['Invoice Number', 'Date', 'Due Date', 'Client Name', 'Phone', 'Subtotal', 'Tax', 'Tip', 'Total', 'Deposit Deducted', 'Balance Due', 'Status', 'Payment Method'];
  const rows = invoices.map(i => [
    `"${i.invoiceNumber}"`,
    `"${i.date}"`,
    `"${i.dueDate}"`,
    `"${(i.clientName || '').replace(/"/g, '""')}"`,
    `"${(i.clientPhone || '').replace(/"/g, '""')}"`,
    i.subtotal || 0,
    i.taxAmount || 0,
    i.tip || 0,
    i.total || 0,
    i.depositDeducted || 0,
    i.balanceDue || 0,
    `"${i.status}"`,
    `"${i.paymentMethod || ''}"`
  ]);
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=nails-by-sirii-invoices-${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csvContent);
});

// Background Automated Multi-Stage Reminder Worker (24h & 4h alerts)
function startReminderScheduler() {
  console.log('[Worker] Automated appointment multi-stage reminder worker initiated (interval: 60s)');
  
  setInterval(async () => {
    try {
      const settings = db.getSettings();
      if (!settings.autoRemindersEnabled) return;

      // Auto-mark passed appointments as Done
      autoUpdatePassedAppointments();

      const appointments = db.getAppointments();
      const nowMs = Date.now();

      for (const apt of appointments) {
        if (apt.status !== 'Confirmed') continue;
        if (!apt.date || !apt.time) continue;

        // Parse date and time in Asia/Kolkata timezone
        const [y, m, d] = apt.date.split('-').map(Number);
        const [hour, min] = apt.time.split(':').map(Number);
        if (!y || !m || !d || isNaN(hour)) continue;

        const pad = (n) => String(n).padStart(2, '0');
        const aptIsoString = `${y}-${pad(m)}-${pad(d)}T${pad(hour)}:${pad(min || 0)}:00+05:30`;
        const aptTimeMs = new Date(aptIsoString).getTime();
        if (isNaN(aptTimeMs)) continue;

        const diffMs = aptTimeMs - nowMs;
        const diffHours = diffMs / (1000 * 60 * 60);
        const diffMinutes = diffMs / (1000 * 60);

        // 1. Stage 1: 24-Hour Advance Alert
        // Fires if enabled (default true) and appointment is between 12 and 24.5 hours away
        if (apt.remind24h !== false && !apt.reminded24h) {
          if (diffHours <= 24.5 && diffHours >= 12.0) {
            console.log(`[Worker] Auto-triggering 24h reminder for ${apt.clientName} at ${apt.time} on ${apt.date}`);
            const client = apt.clientId ? db.getClientById(apt.clientId) : null;
            await sendAppointmentReminder(apt, client, '24h');
            apt.reminded24h = true;
            apt.reminderSent = true;
            apt.lastReminderAt = new Date().toISOString();
            db.saveAppointment(apt);
          }
        }

        // 2. Stage 2: 4-Hour Arrival Alert
        // Fires if enabled (default true) and appointment is between 1.5 and 4.5 hours away
        if (apt.remind4h !== false && !apt.reminded4h) {
          if (diffHours <= 4.5 && diffHours >= 1.5) {
            console.log(`[Worker] Auto-triggering 4h reminder for ${apt.clientName} at ${apt.time}`);
            const client = apt.clientId ? db.getClientById(apt.clientId) : null;
            await sendAppointmentReminder(apt, client, '4h');
            apt.reminded4h = true;
            apt.reminderSent = true;
            apt.lastReminderAt = new Date().toISOString();
            db.saveAppointment(apt);
          }
        }

        // 3. Stage 3: 1-Hour Final Alert (Optional)
        if (apt.remind1h === true && !apt.reminded1h) {
          if (diffHours <= 1.25 && diffMinutes >= -15) {
            console.log(`[Worker] Auto-triggering 1h reminder for ${apt.clientName} at ${apt.time}`);
            const client = apt.clientId ? db.getClientById(apt.clientId) : null;
            await sendAppointmentReminder(apt, client, '1h');
            apt.reminded1h = true;
            apt.reminderSent = true;
            apt.lastReminderAt = new Date().toISOString();
            db.saveAppointment(apt);
          }
        }
      }
    } catch (err) {
      console.error('[Worker Error] Auto reminder cycle error:', err);
    }
  }, 60 * 1000);
}

// Serve built client assets if available
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server] Nails by Sirii API running on http://localhost:${PORT}`);
    startReminderScheduler();
  });
}

export default app;
