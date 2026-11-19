import React, { useState, useEffect } from 'react';
import ModalPortal from './ModalPortal';
import { X, Receipt, Plus, Trash2 } from 'lucide-react';
import { getKolkataTodayString } from '../utils/dateTime';
import { customSetToInvoiceItems } from '../utils/customizerCalculator';

export default function NewInvoiceModal({
  isOpen,
  onClose,
  onSave,
  clients = [],
  services = [],
  preselectedAppointment = null,
  preselectedClient = null,
  invoiceToEdit = null
}) {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState(getKolkataTodayString());
  const [status, setStatus] = useState('Unpaid');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [items, setItems] = useState([
    { description: '', quantity: 1, unitPrice: '', amount: 0 }
  ]);
  const [tip, setTip] = useState(0);
  const [depositDeducted, setDepositDeducted] = useState(0);
  const [notes, setNotes] = useState(
    'Thank you for visiting Nails by Sirii! Keep cuticles nourished daily.'
  );

  useEffect(() => {
    if (invoiceToEdit) {
      setClientId(invoiceToEdit.clientId || '');
      setClientName(invoiceToEdit.clientName || '');
      setClientPhone(invoiceToEdit.clientPhone || '');
      setClientEmail(invoiceToEdit.clientEmail || '');
      setDate(invoiceToEdit.date || getKolkataTodayString());
      setStatus(invoiceToEdit.status || 'Unpaid');
      setPaymentMethod(invoiceToEdit.paymentMethod || 'UPI');
      setItems(invoiceToEdit.items && invoiceToEdit.items.length > 0 ? invoiceToEdit.items : [
        { description: '', quantity: 1, unitPrice: '', amount: 0 }
      ]);
      setTip(invoiceToEdit.tip || 0);
      setDepositDeducted(invoiceToEdit.depositDeducted || 0);
      setNotes(invoiceToEdit.notes || '');
    } else if (preselectedAppointment) {
      const apt = preselectedAppointment;
      setClientId(apt.clientId || '');
      setClientName(apt.clientName || '');
      setClientPhone(apt.clientPhone || '');
      const client = clients.find((c) => c.id === apt.clientId);
      if (client?.email) setClientEmail(client.email);

      // Build line items from appointment service, customSet, and addons
      let lineItems = [];
      if (apt.customSet) {
        lineItems = customSetToInvoiceItems(apt.customSet);
        if (apt.addonServiceNames && apt.addonServiceNames.length > 0) {
          const addonItems = apt.addonServiceNames.map((addon) => {
            const foundAddon = (services || []).find((s) => s.name === addon);
            const addonPrice = Number(foundAddon?.price || 500);
            return {
              description: addon,
              quantity: 1,
              unitPrice: addonPrice,
              amount: addonPrice
            };
          });
          lineItems = [...lineItems, ...addonItems];
        }
      } else {
        const addonItems = (apt.addonServiceNames || []).map((addon) => {
          const foundAddon = (services || []).find((s) => s.name === addon);
          const addonPrice = Number(foundAddon?.price || 500);
          return {
            description: addon,
            quantity: 1,
            unitPrice: addonPrice,
            amount: addonPrice
          };
        });

        const mainPrice = Number(apt.servicePrice || apt.price) || 0;
        const mainItem = {
          description: apt.serviceName || 'Nail Treatment Session',
          quantity: 1,
          unitPrice: mainPrice,
          amount: mainPrice
        };
        lineItems = [mainItem, ...addonItems];
      }

      setItems(lineItems.length > 0 ? lineItems : [
        { description: apt.serviceName || 'Nail Treatment Session', quantity: 1, unitPrice: Number(apt.servicePrice || apt.price) || 0, amount: Number(apt.servicePrice || apt.price) || 0 }
      ]);

      const advanceAmt = Number(apt.depositPaid || apt.advancePaid) || 0;
      setDepositDeducted(advanceAmt);
      setDate(apt.date || getKolkataTodayString());
      setStatus('Unpaid');
      setPaymentMethod('UPI');
    } else if (preselectedClient) {
      setClientId(preselectedClient.id || '');
      setClientName(preselectedClient.name || '');
      setClientPhone(preselectedClient.phone || '');
      setClientEmail(preselectedClient.email || '');
      setDate(getKolkataTodayString());
      setItems([{ description: '', quantity: 1, unitPrice: '', amount: 0 }]);
      setDepositDeducted(0);
      setTip(0);
      setStatus('Unpaid');
    } else {
      setDate(getKolkataTodayString());
      setClientId('');
      setClientName('');
      setClientPhone('');
      setClientEmail('');
      setItems([{ description: '', quantity: 1, unitPrice: '', amount: 0 }]);
      setDepositDeducted(0);
      setTip(0);
      setStatus('Unpaid');
    }
  }, [invoiceToEdit, preselectedAppointment, preselectedClient, clients, services]);

  if (!isOpen) return null;

  const handleClientChange = (selectedId) => {
    setClientId(selectedId);
    const client = clients.find((c) => c.id === selectedId);
    if (client) {
      setClientName(client.name);
      setClientPhone(client.phone || '');
      setClientEmail(client.email || '');
    } else {
      setClientName('');
      setClientPhone('');
      setClientEmail('');
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Math.max(1, Number(field === 'quantity' ? value : updated[index].quantity) || 1);
      const p = Math.max(0, Number(field === 'unitPrice' ? value : updated[index].unitPrice) || 0);
      updated[index].amount = q * p;
    }
    setItems(updated);
  };

  const addItem = (description = '', unitPrice = '') => {
    setItems([
      ...items,
      {
        description,
        quantity: 1,
        unitPrice: unitPrice === '' ? '' : Number(unitPrice),
        amount: Number(unitPrice) || 0
      }
    ]);
  };

  const handleSelectServiceQuickAdd = (serviceId) => {
    const srv = (services || []).find((s) => s.id === serviceId);
    if (srv) {
      addItem(srv.name, srv.price);
    }
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const total = subtotal + (Number(tip) || 0);
  const balanceDue = Math.max(0, total - (Number(depositDeducted) || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || items.length === 0) {
      alert('Please provide client name and at least one item.');
      return;
    }

    onSave({
      clientId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      appointmentId: preselectedAppointment ? preselectedAppointment.id : null,
      date,
      dueDate: date,
      items,
      subtotal,
      taxRate: 0,
      taxAmount: 0,
      tip: Number(tip) || 0,
      total,
      depositDeducted: Number(depositDeducted) || 0,
      giftCardCode: (invoiceToEdit?.giftCardCode || '').trim().toUpperCase(),
      giftCardDeducted: Number(invoiceToEdit?.giftCardDeducted) || 0,
      balanceDue: status === 'Paid' ? 0 : balanceDue,
      status,
      paymentMethod,
      notes: notes.trim()
    });
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Scrollable floating dialog container */}
      <div
        className="fixed inset-0 z-[71] p-3 sm:p-4 flex items-center justify-center animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="bg-studio-surface rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-studio-float border border-border-subtle relative max-h-[90vh] sm:max-h-[85vh] overflow-y-auto font-sans overscroll-contain"
        >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 sm:top-5 right-3.5 sm:right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clean Header */}
        <div className="mb-4 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-studio-subtle text-brand-wine text-[11px] font-semibold mb-1.5 border border-border-subtle">
            <Receipt className="w-3.5 h-3.5 text-brand-wine" />
            <span>{invoiceToEdit ? 'Edit Invoice' : 'New Invoice'}</span>
          </div>
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-text-ink leading-tight">
            {invoiceToEdit ? 'Update Studio Invoice' : 'Create Studio Invoice'}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Quick itemized receipt with UPI QR code and payment tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Client & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-text-secondary">
                  Client *
                </label>
                {clientId && (
                  <button
                    type="button"
                    onClick={() => {
                      setClientId('');
                      setClientName('');
                      setClientPhone('');
                      setClientEmail('');
                    }}
                    className="text-[10px] text-text-muted hover:text-brand-wine underline"
                  >
                    Clear / Write New
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {/* Option 1: Select from existing clients list */}
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-medium text-text-ink cursor-pointer"
                >
                  <option value="">
                    {clients.length > 0
                      ? `-- Select from saved clients (${clients.length}) --`
                      : '-- No saved clients yet (type below) --'}
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ''} {c.vip ? '[VIP]' : ''}
                    </option>
                  ))}
                </select>

                {/* Option 2: Write manually */}
                <input
                  type="text"
                  required
                  placeholder={clientId ? "Selected client name (editable)" : "Write client name manually..."}
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    const matched = clients.find((c) => c.id === clientId);
                    if (matched && matched.name !== e.target.value) {
                      setClientId('');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs text-text-ink font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-text-secondary mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-medium text-text-ink"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-text-secondary uppercase tracking-wider text-[11px]">
                Line Items ({items.length})
              </label>
              <button
                type="button"
                onClick={() => addItem('', 0)}
                className="text-[11px] font-semibold text-brand-wine hover:text-brand-wineHover flex items-center gap-1 px-2.5 py-1 rounded-lg bg-studio-subtle border border-border-subtle hover:border-brand-wine transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Item</span>
              </button>
            </div>

            {services && services.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectServiceQuickAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="w-full text-xs px-3 py-2 rounded-xl border border-border-subtle bg-studio-canvas hover:border-brand-wine text-text-secondary font-medium outline-none cursor-pointer transition-colors"
              >
                <option value="" disabled>+ Quick-add service from menu...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - ₹{Number(s.price).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            )}

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-0.5">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-studio-canvas/80 rounded-xl border border-border-subtle focus-within:border-brand-wine/50 transition-all flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    placeholder="Item / service description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full sm:flex-1 px-2.5 py-1.5 rounded-lg border border-border-subtle bg-white text-xs text-text-ink outline-none focus:border-brand-wine font-medium"
                  />
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-text-muted sm:hidden">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        required
                        title="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-12 px-1.5 py-1.5 rounded-lg border border-border-subtle bg-white text-xs text-center outline-none focus:border-brand-wine"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-text-muted sm:hidden">Price:</span>
                      <div className="w-24 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          required
                          title="Unit Price"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-border-subtle bg-white text-xs text-right font-mono outline-none focus:border-brand-wine font-medium"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1 text-text-muted hover:text-rose-600 disabled:opacity-20 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-border-subtle">
            {/* Payment Status & Method */}
            <div className="space-y-2">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Payment Status
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-studio-canvas rounded-xl border border-border-subtle">
                  <button
                    type="button"
                    onClick={() => setStatus('Unpaid')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      status === 'Unpaid'
                        ? 'bg-white text-brand-wine shadow-xs border border-border-subtle'
                        : 'text-text-muted hover:text-text-ink'
                    }`}
                  >
                    Unpaid / Due
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Paid')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      status === 'Paid'
                        ? 'bg-brand-wine text-white shadow-xs'
                        : 'text-text-muted hover:text-text-ink'
                    }`}
                  >
                    Paid in Full
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-base sm:text-xs font-medium text-text-ink"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Pending UPI">Pending UPI</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Advance / Deposit Paid (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  value={depositDeducted}
                  onChange={(e) => setDepositDeducted(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-studio-canvas text-xs font-mono"
                />
              </div>
            </div>

            {/* Clean Bill Summary */}
            <div className="p-3 rounded-2xl bg-studio-canvas border border-border-subtle flex flex-col justify-between">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-text-secondary">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-text-ink">
                    ₹{Number(subtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                {Number(depositDeducted) > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Advance Credited:</span>
                    <span className="font-semibold font-mono">
                      -₹{Number(depositDeducted).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-text-secondary">
                  <span>Tip (optional):</span>
                  <div className="w-20 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-text-muted">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="0"
                      value={tip}
                      onChange={(e) => setTip(e.target.value)}
                      className="w-full pl-5 pr-2 py-0.5 rounded-lg border border-border-subtle bg-white text-xs text-right font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2.5 mt-2 border-t border-border-subtle flex justify-between items-baseline">
                <div>
                  <span className="block font-bold text-text-ink text-sm">
                    {status === 'Paid' ? 'Total Settled:' : 'Balance Due:'}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    {status === 'Paid' ? 'Marked settled in full' : 'Ready for payment QR'}
                  </span>
                </div>
                <span className="font-display font-bold text-2xl text-brand-wine">
                  ₹{Number(status === 'Paid' ? 0 : balanceDue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div>
            <label className="block font-semibold text-text-secondary mb-1">
              Note / Care Advice
            </label>
            <input
              type="text"
              placeholder="e.g. Keep cuticles nourished daily."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary hover:bg-studio-canvas text-xs font-semibold transition-all min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 min-h-[40px]"
            >
              {invoiceToEdit ? 'Save Changes' : 'Issue Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  
</ModalPortal>
  );
}
