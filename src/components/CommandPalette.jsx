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
  clients = [],
  appointments = [],
  invoices = [],
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
    { id: 'restock_alert', label: 'Send Low-Stock Phone Alert (NTFY)', icon: Bell, category: 'Action' },
    { id: 'customizer', label: 'Open Nail Customizer Tool', icon: Palette, category: 'Navigation' },
    { id: 'portal', label: 'View Public Client Portal', icon: Globe, category: 'Navigation' },
    { id: 'test_phone', label: 'Test Phone Alert (NTFY)', icon: Bell, category: 'Action' },
    { id: 'export_csv', label: 'Export Invoices to CSV Spreadsheet', icon: FileSpreadsheet, category: 'Data' }
  ].filter((act) => act.label.toLowerCase().includes(q) || act.category.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-text-ink/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-studio-surface rounded-3xl max-w-xl w-full shadow-studio border border-border-subtle overflow-hidden relative">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-wine shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search clients, services, dates, or quick actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-xs font-medium text-text-ink placeholder:text-text-muted outline-none bg-transparent"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-studio-canvas text-text-muted text-xs min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <span className="font-mono text-[10px] bg-studio-canvas px-1.5 py-0.5 rounded border border-border-subtle">
              ESC
            </span>
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions Section */}
          {quickActions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-2.5 block">
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
                    className="w-full p-2.5 rounded-2xl hover:bg-studio-canvas text-left flex items-center justify-between text-text-ink transition-colors group min-h-[44px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-brand-wine" />
                      <span className="font-semibold text-xs">{act.label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:translate-x-1 transition-transform" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Matched Clients */}
          {filteredClients.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-2.5 block">
                Clients ({filteredClients.length})
              </span>
              {filteredClients.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onClose();
                    onSelectClient(c);
                  }}
                  className="w-full p-2.5 rounded-2xl hover:bg-studio-canvas text-left flex items-center justify-between transition-colors group min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-wine text-white font-display font-bold text-xs flex items-center justify-center shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-text-ink text-xs block">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {c.phone} • {c.preferredShape || 'Almond'}
                      </span>
                    </div>
                  </div>
                  {c.vip && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
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
              <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-2.5 block">
                Appointments ({filteredAppointments.length})
              </span>
              {filteredAppointments.slice(0, 3).map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    onClose();
                    onSelectAppointment(a);
                  }}
                  className="w-full p-2.5 rounded-2xl hover:bg-studio-canvas text-left flex items-center justify-between transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-brand-wine shrink-0" />
                    <div>
                      <span className="font-semibold text-text-ink text-xs block">
                        {a.clientName} — {a.serviceName}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {a.date} at {a.time} (₹{Number(a.price).toLocaleString('en-IN')})
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-brand-wine">
                    {a.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {quickActions.length === 0 && filteredClients.length === 0 && filteredAppointments.length === 0 && (
            <p className="text-center py-6 text-text-muted italic">
              No matching clients or actions found for "{query}".
            </p>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-studio-canvas/50 border-t border-border-subtle text-[11px] text-text-muted flex items-center justify-between px-4">
          <span>Tip: Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-border-subtle">↑</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-border-subtle">↓</kbd> to navigate</span>
          <span className="font-medium text-brand-wine">Nails by Sirii Command Palette</span>
        </div>
      </div>
    </div>
  );
}
