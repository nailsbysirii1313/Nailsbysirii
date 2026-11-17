const API_BASE = '/api';

export const api = {
  // Overview
  async getOverview() {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to load overview');
    return res.json();
  },

  // Clients
  async getClients() {
    const res = await fetch(`${API_BASE}/clients`);
    if (!res.ok) throw new Error('Failed to load clients');
    return res.json();
  },
  async createClient(data) {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },
  async updateClient(id, data) {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update client');
    return res.json();
  },
  async deleteClient(id) {
    const res = await fetch(`${API_BASE}/clients/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete client');
    return res.json();
  },

  // Services
  async getServices() {
    const res = await fetch(`${API_BASE}/services`);
    if (!res.ok) throw new Error('Failed to load services');
    return res.json();
  },
  async createService(data) {
    const res = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },
  async updateService(id, data) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },
  async deleteService(id) {
    const res = await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // Appointments
  async getAppointments() {
    const res = await fetch(`${API_BASE}/appointments`);
    if (!res.ok) throw new Error('Failed to load appointments');
    return res.json();
  },
  async createAppointment(data) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },
  async updateAppointment(id, data) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },
  async updateAppointmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update appointment status');
    return res.json();
  },
  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete appointment');
    return res.json();
  },
  async remindAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}/remind`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to send phone reminder');
    return res.json();
  },

  // Invoices
  async getInvoices() {
    const res = await fetch(`${API_BASE}/invoices`);
    if (!res.ok) throw new Error('Failed to load invoices');
    return res.json();
  },
  async createInvoice(data) {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },
  async updateInvoice(id, data) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return res.json();
  },
  async updateInvoiceStatus(id, status, details = {}) {
    const payload = typeof details === 'string' ? { status, paymentMethod: details } : { status, ...details };
    const res = await fetch(`${API_BASE}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update invoice status');
    return res.json();
  },
  async deleteInvoice(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },
  async sendTestNotification(params) {
    const res = await fetch(`${API_BASE}/notifications/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to send test alert');
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },
  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Inventory & Supplies
  async getInventory() {
    const res = await fetch(`${API_BASE}/inventory`);
    if (!res.ok) throw new Error('Failed to load inventory');
    return res.json();
  },
  async createInventoryItem(data) {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    return res.json();
  },
  async updateInventoryItem(id, data) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update inventory item');
    return res.json();
  },
  async adjustInventoryStock(id, delta, notify = false) {
    const res = await fetch(`${API_BASE}/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta, notify })
    });
    if (!res.ok) throw new Error('Failed to adjust stock');
    return res.json();
  },
  async deleteInventoryItem(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete inventory item');
    return res.json();
  },
  async sendInventoryLowStockAlert() {
    const res = await fetch(`${API_BASE}/inventory/alert`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to send inventory alert');
    return res.json();
  },

  // Daily Sanitization Checklist
  async getChecklist() {
    const res = await fetch(`${API_BASE}/checklist`);
    if (!res.ok) throw new Error('Failed to load checklist');
    return res.json();
  },
  async toggleChecklistItem(id, signedBy = 'Sirii') {
    const res = await fetch(`${API_BASE}/checklist/${id}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedBy })
    });
    if (!res.ok) throw new Error('Failed to toggle checklist item');
    return res.json();
  },
  async resetChecklist() {
    const res = await fetch(`${API_BASE}/checklist/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset checklist');
    return res.json();
  },

  // Emergency Nail Repairs
  async getRepairs() {
    const res = await fetch(`${API_BASE}/repairs`);
    if (!res.ok) throw new Error('Failed to load emergency repairs');
    return res.json();
  },
  async createRepair(data) {
    const res = await fetch(`${API_BASE}/repairs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit emergency repair');
    return res.json();
  },
  async updateRepairStatus(id, status) {
    const res = await fetch(`${API_BASE}/repairs/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update repair status');
    return res.json();
  },
  async deleteRepair(id) {
    const res = await fetch(`${API_BASE}/repairs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete repair ticket');
    return res.json();
  },

  // Studio Gift Cards & Vouchers
  async getGiftCards() {
    const res = await fetch(`${API_BASE}/gift-cards`);
    if (!res.ok) throw new Error('Failed to load gift cards');
    return res.json();
  },
  async createGiftCard(data) {
    const res = await fetch(`${API_BASE}/gift-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create gift card');
    return res.json();
  },
  async redeemGiftCard(code, amount) {
    const res = await fetch(`${API_BASE}/gift-cards/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to redeem gift card');
    return data;
  },
  async deleteGiftCard(id) {
    const res = await fetch(`${API_BASE}/gift-cards/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete gift card');
    return res.json();
  },

  // Reviews & Testimonials
  async getReviews() {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },
  async createReview(data) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  },
  async deleteReview(id) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },

  // Studio Passcode Authentication
  async verifyPasscode(passcode) {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Incorrect passcode');
    return data;
  }
};

