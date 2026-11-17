import React, { useState, useEffect } from 'react';
import { X, Receipt, Plus, Trash2, Sparkles, User, Tag } from 'lucide-react';
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
  const [dueDate, setDueDate] = useState(getKolkataTodayString());
  const [status, setStatus] = useState('Unpaid');
  const [paymentMethod, setPaymentMethod] = useState('Pending UPI');
  const [items, setItems] = useState([
    { description: 'Signature BIAB / Builder Gel Manicure', quantity: 1, unitPrice: 2200, amount: 2200 }
  ]);
  const [taxRate, setTaxRate] = useState(0);
  const [tip, setTip] = useState(0);
  const [depositDeducted, setDepositDeducted] = useState(0);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardDeducted, setGiftCardDeducted] = useState(0);
  const [notes, setNotes] = useState(
    'Thank you for visiting Nails by Sirii! Please keep cuticles nourished daily with botanical oil.'
  );

  useEffect(() => {
    if (invoiceToEdit) {
      setClientId(invoiceToEdit.clientId || '');
      setClientName(invoiceToEdit.clientName || '');
      setClientPhone(invoiceToEdit.clientPhone || '');
      setClientEmail(invoiceToEdit.clientEmail || '');
      setDate(invoiceToEdit.date || getKolkataTodayString());
      setDueDate(invoiceToEdit.dueDate || getKolkataTodayString());
      setStatus(invoiceToEdit.status || 'Unpaid');
      setPaymentMethod(invoiceToEdit.paymentMethod || 'Pending UPI');
      setItems(invoiceToEdit.items || []);
      setTaxRate(invoiceToEdit.taxRate || 0);
      setTip(invoiceToEdit.tip || 0);
      setDepositDeducted(invoiceToEdit.depositDeducted || 0);
      setGiftCardCode(invoiceToEdit.giftCardCode || '');
      setGiftCardDeducted(invoiceToEdit.giftCardDeducted || 0);
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

        const mainPrice = Number(apt.price) || 2200;
        const mainItem = {
          description: apt.serviceName || 'Nail Architecture & Art Session',
          quantity: 1,
          unitPrice: mainPrice,
          amount: mainPrice
        };
        lineItems = [mainItem, ...addonItems];
      }

      setItems(lineItems.length > 0 ? lineItems : [
        { description: apt.serviceName || 'Studio Treatment', quantity: 1, unitPrice: Number(apt.price) || 2200, amount: Number(apt.price) || 2200 }
      ]);

      const advanceAmt = Number(apt.depositPaid || apt.advancePaid) || 0;
      setDepositDeducted(advanceAmt);
      setDate(apt.date || getKolkataTodayString());
      setDueDate(apt.date || getKolkataTodayString());
    } else if (preselectedClient) {
      setClientId(preselectedClient.id || '');
      setClientName(preselectedClient.name || '');
      setClientPhone(preselectedClient.phone || '');
      setClientEmail(preselectedClient.email || '');
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
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Number(field === 'quantity' ? value : updated[index].quantity) || 1;
      const p = Number(field === 'unitPrice' ? value : updated[index].unitPrice) || 0;
      updated[index].amount = q * p;
    }
    setItems(updated);
  };

  const addItem = (description = '', unitPrice = 0) => {
    setItems([
      ...items,
      {
        description,
        quantity: 1,
        unitPrice: Number(unitPrice),
        amount: Number(unitPrice)
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

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const taxAmount = Math.round((subtotal * (Number(taxRate) || 0)) / 100);
  const total = subtotal + taxAmount + (Number(tip) || 0);
  const balanceDue = Math.max(0, total - (Number(depositDeducted) || 0) - (Number(giftCardDeducted) || 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || items.length === 0) {
      alert('Please provide client name and at least one line item.');
      return;
    }

    onSave({
      clientId,
      clientName,
      clientPhone,
      clientEmail,
      appointmentId: preselectedAppointment ? preselectedAppointment.id : null,
      date,
      dueDate,
      items,
      subtotal,
      taxRate: Number(taxRate) || 0,
      taxAmount,
      tip: Number(tip) || 0,
      total,
      depositDeducted: Number(depositDeducted) || 0,
      giftCardCode: giftCardCode.trim().toUpperCase(),
      giftCardDeducted: Number(giftCardDeducted) || 0,
      balanceDue: status === 'Paid' ? 0 : balanceDue,
      status,
      paymentMethod,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-text-ink/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-studio border-t sm:border border-border-subtle relative max-h-[94vh] overflow-y-auto font-sans">
        <div className="w-10 h-1.5 rounded-full bg-border-subtle mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <Receipt className="w-3.5 h-3.5 text-brand-wine" />
            <span>{invoiceToEdit ? 'Edit Invoice' : 'New Client Invoice'}</span>
          </div>
          <h3 className="font-display font-semibold text-2xl text-text-ink">
            {invoiceToEdit ? 'Update Invoice' : 'Create Studio Invoice'}
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Issue an itemized receipt in Rupees (₹) with UPI dynamic QR code, WhatsApp dispatch, and advance credit deductions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Client & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-text-secondary mb-1">
                Client *
              </label>
              {clients.length > 0 ? (
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs font-medium"
                >
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas text-base sm:text-xs"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-text-secondary mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-secondary mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
              />
            </div>
          </div>

          {/* Quick Service Picker Dropdown */}
          {services && services.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-studio-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-text-ink font-semibold">
                <Tag className="w-3.5 h-3.5 text-brand-wine" />
                <span>Quick-Add from Menu:</span>
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectServiceQuickAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="px-3 py-2 rounded-xl border border-border-subtle bg-studio-surface outline-none text-base sm:text-xs font-medium"
              >
                <option value="" disabled>Select service to add...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ₹{Number(s.price).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Line Items Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-ink">
                Itemized Services & Retail Items
              </span>
              <button
                type="button"
                onClick={() => addItem('', 0)}
                className="text-xs font-semibold text-brand-wine hover:text-brand-wineHover flex items-center gap-1 min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-studio-canvas rounded-xl border border-border-subtle"
                >
                  <input
                    type="text"
                    required
                    placeholder="Item or service description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-border-subtle bg-studio-surface outline-none focus:border-brand-wine text-base sm:text-xs"
                  />
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-border-subtle bg-studio-surface outline-none text-center text-base sm:text-xs"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      required
                      placeholder="Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-2 rounded-lg border border-border-subtle bg-studio-surface outline-none text-right text-base sm:text-xs font-mono"
                    />
                  </div>
                  <span className="w-20 font-display font-bold text-text-ink text-right text-xs pr-1">
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-text-muted hover:text-rose-600 disabled:opacity-30 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Preset Buttons in Rupees */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider mr-1">
                Quick Add:
              </span>
              <button
                type="button"
                onClick={() => addItem('Organic Botanical Cuticle Oil Roller (Retail)', 950)}
                className="px-2.5 py-1 rounded-lg bg-studio-surface border border-border-subtle hover:border-brand-wine text-[11px] font-medium text-text-secondary"
              >
                + Cuticle Oil (₹950)
              </button>
              <button
                type="button"
                onClick={() => addItem('Custom 3D Jewel / Swarovski Crystals', 1500)}
                className="px-2.5 py-1 rounded-lg bg-studio-surface border border-border-subtle hover:border-brand-wine text-[11px] font-medium text-text-secondary"
              >
                + Crystals (₹1,500)
              </button>
              <button
                type="button"
                onClick={() => addItem('Steam Gel Soak-Off & Rebalance', 700)}
                className="px-2.5 py-1 rounded-lg bg-studio-surface border border-border-subtle hover:border-brand-wine text-[11px] font-medium text-text-secondary"
              >
                + Removal (₹700)
              </button>
              <button
                type="button"
                onClick={() => addItem('Velvet Cat-Eye & Glaze Chrome Finish', 600)}
                className="px-2.5 py-1 rounded-lg bg-studio-surface border border-border-subtle hover:border-brand-wine text-[11px] font-medium text-text-secondary"
              >
                + Glaze (₹600)
              </button>
            </div>
          </div>

          {/* Financial Breakdown & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border-subtle">
            {/* Status & Method */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Payment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-base sm:text-xs font-semibold"
                >
                  <option value="Unpaid">Unpaid / Balance Due</option>
                  <option value="Paid">Paid in Full</option>
                  <option value="Partial">Partial / Deposit Paid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas outline-none text-base sm:text-xs font-medium"
                >
                  <option value="Pending UPI">Pending UPI</option>
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="UPI (Paytm)">UPI (Paytm)</option>
                  <option value="UPI (BHIM)">UPI (BHIM)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Net Banking / IMPS">Net Banking / IMPS</option>
                </select>
              </div>
            </div>

            {/* Tip, Deposit & Calculations */}
            <div className="p-4 rounded-2xl bg-studio-canvas border border-border-subtle space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Subtotal:</span>
                <span className="font-semibold text-text-ink">
                  ₹{Number(subtotal).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Tip (₹):</span>
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="₹0"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-border-subtle text-right bg-white text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Deposit Paid (₹):</span>
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="₹0"
                    value={depositDeducted}
                    onChange={(e) => setDepositDeducted(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg border border-emerald-300 text-right bg-emerald-50 text-base sm:text-xs text-emerald-800 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-1.5 border-t border-border-subtle space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Gift Voucher Code:</span>
                  <div className="w-28">
                    <input
                      type="text"
                      placeholder="GIFT-..."
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 rounded-lg border border-border-subtle text-right bg-white text-base sm:text-[11px] font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Voucher Credit (₹):</span>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="₹0"
                      value={giftCardDeducted}
                      onChange={(e) => setGiftCardDeducted(e.target.value)}
                      className="w-full px-2 py-1 rounded-lg border border-border-subtle text-right bg-white text-base sm:text-xs text-brand-wine font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border-subtle flex justify-between items-baseline">
                <span className="font-bold text-text-ink">Balance Due:</span>
                <span className="font-display font-bold text-xl text-brand-wine">
                  ₹{Number(status === 'Paid' ? 0 : balanceDue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-text-secondary mb-1">
              Invoice Footer & Care Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-canvas focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border-subtle text-text-secondary hover:bg-studio-canvas text-xs font-semibold transition-all min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95 min-h-[44px]"
            >
              {invoiceToEdit ? 'Save Changes' : 'Issue Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
