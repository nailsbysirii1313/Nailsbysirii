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
  QrCode
} from 'lucide-react';

export default function InvoicesView({
  invoices,
  settings,
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
      inv.balanceDue || inv.total
    ).toLocaleString('en-IN')}\nUPI ID: ${upiId}\nView digital bill: ${window.location.origin}/#invoice-${inv.id}`;
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Invoices & Studio Billing
          </h2>
          <p className="text-xs text-atelier-muted">
            Issue itemized digital receipts in Rupees (₹) with UPI dynamic QR codes and WhatsApp dispatch.
          </p>
        </div>

        <button
          onClick={() => onOpenNewInvoice(null)}
          className="px-4 py-2.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Financial Overview Metrics in Rupees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-5 rounded-3xl bg-white border border-atelier-champagneBorder shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Total Invoiced
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-atelier-muted font-bold">{currency}</span>
            <span className="font-serif font-bold text-2xl text-atelier-noir">
              {totalBilled.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-atelier-muted mt-1 block">
            {invoices.length} invoices generated
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-atelier-champagneBorder shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Collected Revenue
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-emerald-600 font-bold">{currency}</span>
            <span className="font-serif font-bold text-2xl text-emerald-700">
              {totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {invoices.filter((i) => i.status === 'Paid').length} paid in full
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-atelier-champagneBorder shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Outstanding Balances
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs text-amber-600 font-bold">{currency}</span>
            <span className="font-serif font-bold text-2xl text-amber-700">
              {totalPending.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {invoices.filter((i) => i.status !== 'Paid').length} invoices pending
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-atelier-champagneBorder shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-atelier-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice number, client name, or payment mode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-atelier-rose500 text-white shadow-xs'
                  : 'bg-atelier-cream/60 text-atelier-charcoal hover:bg-atelier-rose50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-atelier-champagneBorder text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="font-serif italic font-semibold text-lg text-atelier-noir">
            No Invoices Found
          </p>
          <p className="text-xs text-atelier-muted max-w-sm mx-auto">
            Create an invoice to bill for completed appointments or custom nail art services.
          </p>
          <button
            onClick={() => onOpenNewInvoice(null)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold hover:bg-atelier-rose600 shadow-soft"
          >
            <Plus className="w-3.5 h-3.5" />
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
                onClick={() => onOpenInvoiceDetail(inv)}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-xs hover:shadow-soft transition-all cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  {/* Left: Invoice Number & Client */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-atelier-rose50 border border-atelier-rose200/80 flex items-center justify-center text-atelier-rose600 shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-atelier-charcoal">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>

                      <h3 className="font-serif italic font-bold text-base text-atelier-noir hover:text-atelier-rose600 transition-colors">
                        {inv.clientName}
                      </h3>

                      <p className="text-[11px] text-atelier-muted">
                        Date: {inv.date} • {inv.items?.length || 0} item{inv.items?.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amounts & Actions */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-atelier-champagneBorder/40">
                    <div className="text-right">
                      <span className="font-serif italic font-bold text-lg text-atelier-noir">
                        {currency}{Number(inv.total).toLocaleString('en-IN')}
                      </span>
                      {!isPaid && (
                        <span className="text-[11px] text-amber-600 font-semibold block">
                          {currency}{Number(inv.balanceDue || inv.total).toLocaleString('en-IN')} due
                        </span>
                      )}
                      {isPaid && inv.paymentMethod && (
                        <span className="text-[10px] text-atelier-muted block">
                          via {inv.paymentMethod}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {/* Quick WhatsApp Send */}
                      <button
                        onClick={(e) => handleQuickWhatsApp(e, inv)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
                        title="Send bill on WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      {/* View & Share Modal */}
                      <button
                        onClick={() => onOpenInvoiceDetail(inv)}
                        className="px-2.5 py-1.5 rounded-xl bg-atelier-rose50 hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200 text-xs font-semibold flex items-center gap-1 transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Mark as Paid */}
                      {!isPaid && (
                        <button
                          onClick={() => onMarkPaid(inv.id)}
                          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs"
                          title="Mark as Paid"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-2 rounded-xl hover:bg-red-50 text-atelier-muted hover:text-red-500 transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
