import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Calendar,
  Receipt,
  Sparkles,
  Bell,
  Globe,
  Palette,
  FileSpreadsheet,
  Package,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Gift,
  X,
  ArrowRight
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  clients,
  appointments,
  invoices,
  onSelectClient,
  onSelectAppointment,
  onSelectInvoice,
  onAction
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent listener
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = (query || '').toLowerCase().trim();

  const filteredClients = clients.filter(
    (c) =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.preferredAesthetic && c.preferredAesthetic.toLowerCase().includes(q))
  );

  const filteredAppointments = appointments.filter(
    (a) =>
      (a.clientName || '').toLowerCase().includes(q) ||
      (a.serviceName || '').toLowerCase().includes(q) ||
      (a.date && a.date.includes(q))
  );

  const quickActions = [
    { id: 'new_apt', label: 'Book New Appointment', icon: Calendar, category: 'Action' },
    { id: 'new_client', label: 'Register New Client', icon: User, category: 'Action' },
    { id: 'new_invoice', label: 'Create New Invoice', icon: Receipt, category: 'Action' },
    { id: 'giftcards', label: 'Studio Gift Cards & Vouchers', icon: Gift, category: 'Navigation' },
    { id: 'repairs_queue', label: 'Emergency Nail Repair Requests Queue', icon: AlertTriangle, category: 'Urgent' },
    { id: 'aftercare', label: 'Client Aftercare & Longevity Guide Generator', icon: FileText, category: 'Care' },
    { id: 'inventory', label: 'Studio Inventory & Supplies', icon: Package, category: 'Navigation' },
    { id: 'sanitization', label: 'Daily Sanitization Protocols Checklist', icon: ShieldCheck, category: 'Compliance' },
    { id: 'restock_alert', label: 'Send Low-Stock Phone Alert (ntfy)', icon: Bell, category: 'Action' },
    { id: 'customizer', label: 'Open Nail Customizer Tool', icon: Palette, category: 'Navigation' },
    { id: 'portal', label: 'View Public Client Portal', icon: Globe, category: 'Navigation' },
    { id: 'test_phone', label: 'Test Phone Alert (ntfy)', icon: Bell, category: 'Action' },
    { id: 'export_csv', label: 'Export Invoices to CSV Spreadsheet', icon: FileSpreadsheet, category: 'Data' }
  ].filter((act) => act.label.toLowerCase().includes(q) || act.category.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-float border border-atelier-champagneBorder overflow-hidden relative">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-atelier-champagneBorder/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-atelier-rose500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a client name, service, date, or quick action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-xs font-medium text-atelier-noir placeholder:text-atelier-muted outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-atelier-cream text-atelier-muted text-xs"
          >
            <span className="font-mono text-[10px] bg-atelier-cream px-1.5 py-0.5 rounded border border-atelier-champagneBorder">
              ESC
            </span>
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions Section */}
          {quickActions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-muted px-2.5 block">
                Quick Commands
              </span>
              {quickActions.slice(0, 4).map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      onClose();
                      onAction(act.id);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-atelier-rose50 text-left flex items-center justify-between text-atelier-charcoal hover:text-atelier-noir transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-atelier-rose500" />
                      <span className="font-semibold text-xs">{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-atelier-muted group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Matched Clients */}
          {filteredClients.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-muted px-2.5 block">
                Clients ({filteredClients.length})
              </span>
              {filteredClients.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onClose();
                    onSelectClient(c);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-atelier-cream text-left flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-atelier-rose100 text-atelier-rose600 font-serif font-bold text-xs flex items-center justify-center">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-atelier-noir text-xs block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-atelier-muted">
                        {c.phone} • {c.preferredShape || 'Almond'}
                      </span>
                    </div>
                  </div>
                  {c.vip && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      VIP
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Matched Appointments */}
          {filteredAppointments.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-muted px-2.5 block">
                Appointments ({filteredAppointments.length})
              </span>
              {filteredAppointments.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onClose();
                    onSelectAppointment(a);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-atelier-cream text-left flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-atelier-rose500 shrink-0" />
                    <div>
                      <span className="font-semibold text-atelier-noir text-xs block">
                        {a.clientName} — {a.serviceName}
                      </span>
                      <span className="text-[10px] text-atelier-muted">
                        {a.date} at {a.time} (₹{Number(a.price).toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-atelier-rose600">
                    {a.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {quickActions.length === 0 && filteredClients.length === 0 && filteredAppointments.length === 0 && (
            <p className="text-center py-6 text-atelier-muted italic">
              No matching clients or actions found for "{query}".
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-atelier-cream/50 border-t border-atelier-champagneBorder/60 text-[10px] text-atelier-muted flex items-center justify-between px-4">
          <span>Tip: Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border">↓</kbd> to navigate</span>
          <span>Nails by Sirii Command OS</span>
        </div>
      </div>
    </div>
  );
}

