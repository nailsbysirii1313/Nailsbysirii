import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Copy,
  Printer,
  Trash2,
  Check,
  Eye,
  Send,
  CreditCard,
  QrCode,
  ArrowRight,
  TrendingUp,
  Clock,
  Wallet
} from 'lucide-react';

export default function InvoicesView({
  invoices = [],
  settings = {},
  onOpenNewInvoice,
  onOpenInvoiceDetail,
  onMarkPaid,
  onDeleteInvoice
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const currency = settings?.currency || '₹';

  const filtered = invoices.filter((inv) => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(q) ||
      (inv.clientName || '').toLowerCase().includes(q) ||
      (inv.clientPhone && inv.clientPhone.toLowerCase().includes(q)) ||
      (inv.paymentMethod && inv.paymentMethod.toLowerCase().includes(q));

    const matchesStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'PAID'
        ? inv.status === 'Paid'
        : inv.status !== 'Paid';

    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const totalPaid = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const totalPending = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.total) || 0), 0);

  const handleQuickWhatsApp = (e, inv) => {
    e.stopPropagation();
    const cleanPhone = (inv.clientPhone || '').replace(/[^0-9]/g, '');
    const upiId = settings?.upiId || 'nailsbysirii@okaxis';
    const text = `Invoice ${inv.invoiceNumber} from Nails by Sirii\nClient: ${inv.clientName}\nTotal: ${currency}${Number(
      inv.total
    ).toLocaleString('en-IN')}\nBalance Due: ${currency}${Number(
      inv.balanceDue !== undefined ? inv.balanceDue : inv.total
    ).toLocaleString('en-IN')}\nUPI ID: ${upiId}\nView digital bill: ${window.location.origin}/#invoice-${inv.id}`;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <Receipt className="w-3.5 h-3.5 text-brand-wine" />
            <span>Digital Receipts & Billing</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-ink tracking-tight">
            Invoices & Studio Billing
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Issue itemized digital receipts in Rupees (₹) with UPI dynamic QR codes, advance credit deductions, and direct WhatsApp delivery.
          </p>
        </div>

        <button
          onClick={() => onOpenNewInvoice && onOpenNewInvoice(null)}
          className="px-4 py-2.5 rounded-2xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Financial Overview Metrics in Rupees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-5 rounded-3xl bg-studio-surface border border-border-subtle shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Total Invoiced
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-text-muted font-bold">{currency}</span>
            <span className="font-display font-bold text-2xl text-text-ink">
              {totalBilled.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-xs text-text-muted mt-1 block">
            {invoices.length} invoices generated
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
            <Wallet className="w-3 h-3 text-emerald-700" />
            <span>Collected Revenue</span>
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-emerald-700 font-bold">{currency}</span>
            <span className="font-display font-bold text-2xl text-emerald-800">
              {totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            {invoices.filter((i) => i.status === 'Paid').length} paid in full
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>Outstanding Balances</span>
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-amber-700 font-bold">{currency}</span>
            <span className="font-display font-bold text-2xl text-amber-800">
              {totalPending.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">
            {invoices.filter((i) => i.status !== 'Paid').length} invoices pending
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-studio-surface rounded-2xl p-3 sm:p-4 border border-border-subtle shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice number, client name, or payment mode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-studio-canvas border border-border-subtle focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'UNPAID', label: 'Unpaid / Due' },
            { id: 'PAID', label: 'Paid in Full' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
                filterStatus === tab.id
                  ? 'bg-brand-wine text-white shadow-studio font-bold'
                  : 'bg-studio-canvas text-text-secondary hover:bg-studio-subtle border border-border-subtle'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      {filtered.length === 0 ? (
        <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="font-display font-semibold text-lg text-text-ink">
            No Invoices Found
          </p>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Create an invoice to bill for completed appointments or custom bespoke nail art treatments.
          </p>
          <button
            onClick={() => onOpenNewInvoice && onOpenNewInvoice(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wineHover shadow-studio min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const isPaid = inv.status === 'Paid';

            return (
              <div
                key={inv.id}
                onClick={() => onOpenInvoiceDetail && onOpenInvoiceDetail(inv)}
                className="bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle hover:border-border-strong shadow-xs hover:shadow-studio transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  {/* Left: Invoice Number & Client */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-studio-canvas border border-border-subtle flex items-center justify-center text-brand-wine shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-text-ink">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-status-emeraldBg text-status-emerald'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-base text-text-ink hover:text-brand-wine transition-colors">
                        {inv.clientName}
                      </h3>

                      <p className="text-xs text-text-muted">
                        Date: {inv.date} • {inv.items?.length || 0} item{inv.items?.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amounts & Actions */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                    <div className="text-right">
                      <span className="font-display font-bold text-lg text-text-ink">
                        {currency}{Number(inv.total).toLocaleString('en-IN')}
                      </span>
                      {!isPaid && (
                        <span className="text-xs text-amber-700 font-semibold block">
                          {currency}{Number(inv.balanceDue !== undefined ? inv.balanceDue : inv.total).toLocaleString('en-IN')} due
                        </span>
                      )}
                      {isPaid && inv.paymentMethod && (
                        <span className="text-[11px] text-text-muted block">
                          via {inv.paymentMethod}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Quick WhatsApp Send */}
                      <button
                        onClick={(e) => handleQuickWhatsApp(e, inv)}
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center"
                        title="Send bill on WhatsApp"
                        aria-label="Send bill on WhatsApp"
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      {/* View & Share Modal */}
                      <button
                        onClick={() => onOpenInvoiceDetail && onOpenInvoiceDetail(inv)}
                        className="px-3 py-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-brand-wine border border-border-subtle text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs min-h-[40px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Mark as Paid */}
                      {!isPaid && (
                        <button
                          onClick={() => onMarkPaid && onMarkPaid(inv.id)}
                          className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-all shadow-xs min-h-[40px] min-w-[40px] flex items-center justify-center"
                          title="Mark as Paid"
                          aria-label="Mark as Paid"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteInvoice && onDeleteInvoice(inv.id)}
                        className="p-2.5 rounded-xl hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-border-subtle"
                        title="Delete Invoice"
                        aria-label="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
