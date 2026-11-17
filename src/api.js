const API_BASE = '/api';

function getAuthHeaders(customHeaders = {}) {
  const headers = { ...customHeaders };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nbs_studio_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export const api = {
  // Overview
  async getOverview() {
    const res = await fetch(`${API_BASE}/overview`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load overview');
    return res.json();
  },

  // Clients
  async getClients() {
    const res = await fetch(`${API_BASE}/clients`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load clients');
    return res.json();
  },
  async createClient(data) {
    const res = await fetch(`${API_BASE}/clients`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create client');
    return res.json();
  },
  async updateClient(id, data) {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update client');
    return res.json();
  },
  async deleteClient(id) {
    const res = await fetch(`${API_BASE}/clients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },
  async updateService(id, data) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },
  async deleteService(id) {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // Appointments
  async getAppointments() {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load appointments');
    return res.json();
  },
  async createAppointment(data) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },
  async updateAppointment(id, data) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },
  async updateAppointmentStatus(id, status) {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update appointment status');
    return res.json();
  },
  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete appointment');
    return res.json();
  },
  async remindAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}/remind`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to send phone reminder');
    return res.json();
  },

  // Invoices
  async getInvoices() {
    const res = await fetch(`${API_BASE}/invoices`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load invoices');
    return res.json();
  },
  async getInvoiceById(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}`);
    if (!res.ok) throw new Error('Failed to load invoice');
    return res.json();
  },
  async createInvoice(data) {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create invoice');
    return res.json();
  },
  async updateInvoice(id, data) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update invoice');
    return res.json();
  },
  async updateInvoiceStatus(id, status, details = {}) {
    const payload = typeof details === 'string' ? { status, paymentMethod: details } : { status, ...details };
    const res = await fetch(`${API_BASE}/invoices/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update invoice status');
    return res.json();
  },
  async deleteInvoice(id) {
    const res = await fetch(`${API_BASE}/invoices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete invoice');
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load notifications');
    return res.json();
  },
  async sendTestNotification(params) {
    const res = await fetch(`${API_BASE}/notifications/test`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Inventory & Supplies
  async getInventory() {
    const res = await fetch(`${API_BASE}/inventory`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load inventory');
    return res.json();
  },
  async createInventoryItem(data) {
    const res = await fetch(`${API_BASE}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create inventory item');
    return res.json();
  },
  async updateInventoryItem(id, data) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update inventory item');
    return res.json();
  },
  async adjustInventoryStock(id, delta, notify = false) {
    const res = await fetch(`${API_BASE}/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ delta, notify })
    });
    if (!res.ok) throw new Error('Failed to adjust stock');
    return res.json();
  },
  async deleteInventoryItem(id) {
    const res = await fetch(`${API_BASE}/inventory/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete inventory item');
    return res.json();
  },
  async sendInventoryLowStockAlert() {
    const res = await fetch(`${API_BASE}/inventory/alert`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to send inventory alert');
    return res.json();
  },

  // Daily Sanitization Checklist
  async getChecklist() {
    const res = await fetch(`${API_BASE}/checklist`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load checklist');
    return res.json();
  },
  async toggleChecklistItem(id, signedBy = 'Sirii') {
    const res = await fetch(`${API_BASE}/checklist/${id}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ signedBy })
    });
    if (!res.ok) throw new Error('Failed to toggle checklist item');
    return res.json();
  },
  async resetChecklist() {
    const res = await fetch(`${API_BASE}/checklist/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to reset checklist');
    return res.json();
  },

  // Emergency Nail Repairs
  async getRepairs() {
    const res = await fetch(`${API_BASE}/repairs`, {
      headers: getAuthHeaders()
    });
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update repair status');
    return res.json();
  },
  async deleteRepair(id) {
    const res = await fetch(`${API_BASE}/repairs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete repair ticket');
    return res.json();
  },

  // Studio Gift Cards & Vouchers
  async getGiftCards() {
    const res = await fetch(`${API_BASE}/gift-cards`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load gift cards');
    return res.json();
  },
  async createGiftCard(data) {
    const res = await fetch(`${API_BASE}/gift-cards`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
    const res = await fetch(`${API_BASE}/gift-cards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
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
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete review');
    return res.json();
  },

  // Pre-Made Press-On Nails E-Commerce API
  async getPressOnProducts() {
    const res = await fetch(`${API_BASE}/press-ons`);
    if (!res.ok) throw new Error('Failed to load press-on products');
    return res.json();
  },
  async getAllPressOnProducts() {
    const res = await fetch(`${API_BASE}/press-ons/all`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load admin press-on products');
    return res.json();
  },
  async createPressOnProduct(data) {
    const res = await fetch(`${API_BASE}/press-ons`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create press-on product');
    return res.json();
  },
  async updatePressOnProduct(id, data) {
    const res = await fetch(`${API_BASE}/press-ons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update press-on product');
    return res.json();
  },
  async deletePressOnProduct(id) {
    const res = await fetch(`${API_BASE}/press-ons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete press-on product');
    return res.json();
  },

  // Press-On Customer Orders
  async getPressOnOrders() {
    const res = await fetch(`${API_BASE}/press-on-orders`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to load press-on orders');
    return res.json();
  },
  async createPressOnOrder(data) {
    const res = await fetch(`${API_BASE}/press-on-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to place press-on order');
    return result;
  },
  async updatePressOnOrder(id, data) {
    const res = await fetch(`${API_BASE}/press-on-orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update press-on order');
    return res.json();
  },
  async deletePressOnOrder(id) {
    const res = await fetch(`${API_BASE}/press-on-orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete press-on order');
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
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('nbs_studio_token', data.token);
      localStorage.setItem('nbs_studio_auth', 'true');
    }
    return data;
  },

  // Design Catalogue & Lookbook
  async getCatalogueDesigns() {
    const res = await fetch(`${API_BASE}/catalogue`);
    if (!res.ok) throw new Error('Failed to load catalogue designs');
    return res.json();
  },
  async createCatalogueDesign(data) {
    const res = await fetch(`${API_BASE}/catalogue`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create catalogue design');
    return res.json();
  },
  async updateCatalogueDesign(id, data) {
    const res = await fetch(`${API_BASE}/catalogue/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update catalogue design');
    return res.json();
  },
  async deleteCatalogueDesign(id) {
    const res = await fetch(`${API_BASE}/catalogue/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete catalogue design');
    return res.json();
  }
};
