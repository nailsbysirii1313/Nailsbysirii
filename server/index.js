import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { sendNtfyNotification, sendAppointmentReminder, sendInventoryAlert, sendEmergencyRepairAlert, sendGiftCardIssuedAlert } from './ntfy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes

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
    return res.json({ success: true, message: 'Studio Hub unlocked' });
  }
  return res.status(401).json({ success: false, error: 'Incorrect passcode. Access denied.' });
});

// Studio Overview / Dashboard stats
app.get('/api/overview', (req, res) => {
  const clients = db.getClients();
  const appointments = db.getAppointments();
  const invoices = db.getInvoices();
  const notifications = db.getNotifications();
  const settings = db.getSettings();
  const inventory = db.getInventory();
  const checklist = db.getChecklist();
  const repairs = db.getRepairs();

  const todayStr = new Date().toISOString().split('T')[0];
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
    todaySchedule: todayAppointments.sort((a, b) => a.time.localeCompare(b.time)),
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

// Clients API
app.get('/api/clients', (req, res) => {
  res.json(db.getClients());
});

app.post('/api/clients', (req, res) => {
  const client = db.saveClient(req.body);
  res.status(201).json(client);
});

app.put('/api/clients/:id', (req, res) => {
  const client = db.saveClient({ ...req.body, id: req.params.id });
  res.json(client);
});

app.delete('/api/clients/:id', (req, res) => {
  db.deleteClient(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Services API
app.get('/api/services', (req, res) => {
  res.json(db.getServices());
});

app.post('/api/services', (req, res) => {
  const service = db.saveService(req.body);
  res.status(201).json(service);
});

app.put('/api/services/:id', (req, res) => {
  const service = db.saveService({ ...req.body, id: req.params.id });
  res.json(service);
});

app.delete('/api/services/:id', (req, res) => {
  db.deleteService(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Appointments API
app.get('/api/appointments', (req, res) => {
  const apts = db.getAppointments();
  res.json(apts);
});

app.post('/api/appointments', async (req, res) => {
  const apt = db.saveAppointment(req.body);

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

app.put('/api/appointments/:id', (req, res) => {
  const apt = db.saveAppointment({ ...req.body, id: req.params.id });
  res.json(apt);
});

app.patch('/api/appointments/:id/status', (req, res) => {
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

app.delete('/api/appointments/:id', (req, res) => {
  db.deleteAppointment(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Trigger reminder for specific appointment
app.post('/api/appointments/:id/remind', async (req, res) => {
  const apts = db.getAppointments();
  const appointment = apts.find(a => a.id === req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const client = appointment.clientId ? db.getClientById(appointment.clientId) : null;
  const result = await sendAppointmentReminder(appointment, client);

  // Update appointment reminder status
  appointment.reminderSent = true;
  appointment.lastReminderAt = new Date().toISOString();
  db.saveAppointment(appointment);

  res.json({
    success: result.success,
    notification: result.log,
    appointment
  });
});

// Invoices API
app.get('/api/invoices', (req, res) => {
  res.json(db.getInvoices());
});

app.get('/api/invoices/:id', (req, res) => {
  const invoices = db.getInvoices();
  const found = invoices.find(i => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!found) return res.status(404).json({ error: 'Invoice not found' });
  res.json(found);
});

app.post('/api/invoices', (req, res) => {
  const inv = db.saveInvoice(req.body);
  res.status(201).json(inv);
});

app.put('/api/invoices/:id', (req, res) => {
  const inv = db.saveInvoice({ ...req.body, id: req.params.id });
  res.json(inv);
});

app.patch('/api/invoices/:id/status', (req, res) => {
  const invoices = db.getInvoices();
  const target = invoices.find(i => i.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'Invoice not found' });

  target.status = req.body.status;
  if (req.body.status === 'Paid') {
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

app.delete('/api/invoices/:id', (req, res) => {
  db.deleteInvoice(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Notifications & NTFY API
app.get('/api/notifications', (req, res) => {
  res.json(db.getNotifications());
});

app.post('/api/notifications/test', async (req, res) => {
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

// Settings API
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req, res) => {
  const updated = db.saveSettings(req.body);
  res.json(updated);
});

// Inventory & Supplies API
app.get('/api/inventory', (req, res) => {
  res.json(db.getInventory());
});

app.post('/api/inventory', (req, res) => {
  const item = db.saveInventoryItem(req.body);
  res.status(201).json(item);
});

app.put('/api/inventory/:id', (req, res) => {
  const item = db.saveInventoryItem({ ...req.body, id: req.params.id });
  res.json(item);
});

app.patch('/api/inventory/:id/stock', async (req, res) => {
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

app.delete('/api/inventory/:id', (req, res) => {
  db.deleteInventoryItem(req.params.id);
  res.json({ success: true, id: req.params.id });
});

app.post('/api/inventory/alert', async (req, res) => {
  const inventory = db.getInventory();
  const lowStock = inventory.filter(i => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0));
  if (lowStock.length === 0) {
    return res.json({ success: false, message: 'All inventory supplies are currently well stocked.' });
  }
  const result = await sendInventoryAlert(lowStock);
  res.json({ success: true, count: lowStock.length, result });
});

// Daily Sanitization Checklist API
app.get('/api/checklist', (req, res) => {
  res.json(db.getChecklist());
});

app.post('/api/checklist/:id/toggle', (req, res) => {
  const { signedBy } = req.body || {};
  const item = db.toggleChecklistItem(req.params.id, signedBy || 'Sirii');
  if (!item) {
    return res.status(404).json({ error: 'Checklist item not found' });
  }
  res.json(item);
});

app.post('/api/checklist/reset', (req, res) => {
  const reset = db.resetChecklist();
  res.json(reset);
});

// Emergency Nail Repair Tickets API
app.get('/api/repairs', (req, res) => {
  res.json(db.getRepairs());
});

app.post('/api/repairs', async (req, res) => {
  const repair = db.saveRepair(req.body);
  // Send urgent push notification to Sirii's phone
  await sendEmergencyRepairAlert(repair);
  res.status(201).json(repair);
});

app.patch('/api/repairs/:id/status', (req, res) => {
  const { status } = req.body || {};
  const updated = db.updateRepairStatus(req.params.id, status || 'Resolved');
  if (!updated) {
    return res.status(404).json({ error: 'Repair ticket not found' });
  }
  res.json(updated);
});

app.delete('/api/repairs/:id', (req, res) => {
  db.deleteRepair(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Studio Gift Cards & Vouchers API
app.get('/api/gift-cards', (req, res) => {
  res.json(db.getGiftCards());
});

app.post('/api/gift-cards', async (req, res) => {
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

app.delete('/api/gift-cards/:id', (req, res) => {
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

app.delete('/api/reviews/:id', (req, res) => {
  db.deleteReview(req.params.id);
  res.json({ success: true, id: req.params.id });
});

// Backup & Accounting CSV Export API
app.get('/api/backup/export', (req, res) => {
  const data = db.get();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=nails-by-sirii-backup-${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(data, null, 2));
});

app.get('/api/backup/invoices-csv', (req, res) => {
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

// Background Automated Reminder Worker
function startReminderScheduler() {
  console.log('[Worker] Automated appointment reminder worker initiated (interval: 60s)');
  
  setInterval(async () => {
    try {
      const settings = db.getSettings();
      if (!settings.autoRemindersEnabled) return;

      const appointments = db.getAppointments();
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      for (const apt of appointments) {
        if (apt.date !== todayStr) continue;
        if (apt.status !== 'Confirmed') continue;
        if (apt.reminderSent) continue;

        // Check appointment time vs current time
        const [hours, minutes] = apt.time.split(':').map(Number);
        const aptDateTime = new Date();
        aptDateTime.setHours(hours, minutes, 0, 0);

        const diffMinutes = (aptDateTime - now) / (1000 * 60);
        const leadMinutes = (settings.reminderLeadHours || 2) * 60;

        // If appointment is within lead time and hasn't passed by more than 15 mins
        if (diffMinutes <= leadMinutes && diffMinutes >= -15) {
          console.log(`[Worker] Auto-triggering reminder for ${apt.clientName} at ${apt.time}`);
          const client = apt.clientId ? db.getClientById(apt.clientId) : null;
          await sendAppointmentReminder(apt, client);
          
          apt.reminderSent = true;
          apt.lastReminderAt = new Date().toISOString();
          db.saveAppointment(apt);
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
