import React, { useState, useEffect } from 'react';
import { X, Receipt, Plus, Trash2, Sparkles, User, Tag } from 'lucide-react';

export default function NewInvoiceModal({
  isOpen,
  onClose,
  onSave,
  clients,
  services,
  preselectedAppointment = null,
  preselectedClient = null,
  invoiceToEdit = null
}) {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
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
      setDate(invoiceToEdit.date || new Date().toISOString().split('T')[0]);
      setDueDate(invoiceToEdit.dueDate || new Date().toISOString().split('T')[0]);
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

      // Build line items from appointment service and addons
      let totalAddonsPrice = 0;
      const addonItems = (apt.addonServiceNames || []).map((addon) => {
        const foundAddon = (services || []).find((s) => s.name === addon);
        const addonPrice = Number(foundAddon?.price || 500);
        totalAddonsPrice += addonPrice;
        return {
          description: addon,
          quantity: 1,
          unitPrice: addonPrice,
          amount: addonPrice
        };
      });

      const baseEstimate = apt.price
        ? Math.max(300, Number(apt.price) - totalAddonsPrice)
        : (() => {
            const foundSrv = (services || []).find((s) => s.id === apt.serviceId || s.name === apt.serviceName);
            return Number(foundSrv?.price || 1400);
          })();

      const lineItems = [
        {
          description: apt.serviceName || 'Signature Nail Treatment',
          quantity: 1,
          unitPrice: baseEstimate,
          amount: baseEstimate
        },
        ...addonItems
      ];

      setItems(lineItems);
      setDepositDeducted(Number(apt.depositPaid || apt.advancePaid) || 0);
    } else if (preselectedClient) {
      setClientId(preselectedClient.id);
      setClientName(preselectedClient.name);
      setClientPhone(preselectedClient.phone);
      setClientEmail(preselectedClient.email || '');
    } else if (clients.length > 0 && !clientId) {
      setClientId(clients[0].id);
      setClientName(clients[0].name);
      setClientPhone(clients[0].phone);
      setClientEmail(clients[0].email || '');
    }
  }, [isOpen, preselectedAppointment, preselectedClient, invoiceToEdit, clients]);

  if (!isOpen) return null;

  const handleClientChange = (id) => {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      setClientName(client.name);
      setClientPhone(client.phone);
      setClientEmail(client.email || '');
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = Number(updated[index].quantity) || 0;
      const price = Number(updated[index].unitPrice) || 0;
      updated[index].amount = qty * price;
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-float border-t sm:border border-atelier-champagneBorder relative max-h-[94vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>{invoiceToEdit ? 'Edit Invoice' : 'New Client Invoice'}</span>
          </div>
          <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
            {invoiceToEdit ? 'Update Invoice' : 'Create Studio Invoice'}
          </h3>
          <p className="text-xs text-atelier-muted mt-1">
            Issue an itemized receipt in Rupees (₹) with UPI dynamic QR code, WhatsApp dispatch, and PDF print.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Client & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Client *
              </label>
              {clients.length > 0 ? (
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-medium"
                >
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
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder text-base sm:text-xs"
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>
          </div>

          {/* Quick Service Picker Dropdown */}
          {services && services.length > 0 && (
            <div className="p-3 rounded-2xl bg-atelier-cream/40 border border-atelier-champagneBorder/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-atelier-charcoal font-semibold">
                <Tag className="w-3.5 h-3.5 text-atelier-rose600" />
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
                className="px-3 py-1.5 rounded-xl border border-atelier-champagneBorder bg-white outline-none text-base sm:text-xs font-medium"
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-atelier-noir">
                Itemized Services & Retail Items
              </span>
              <button
                type="button"
                onClick={() => addItem('', 0)}
                className="text-xs font-semibold text-atelier-rose600 hover:text-atelier-rose500 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-atelier-cream/60 rounded-xl border border-atelier-champagneBorder"
                >
                  <input
                    type="text"
                    required
                    placeholder="Item or service description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-atelier-champagneBorder bg-white outline-none focus:border-atelier-rose400 text-base sm:text-xs"
                  />
                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-atelier-champagneBorder bg-white outline-none text-center text-base sm:text-xs"
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
                      className="w-full px-2 py-1.5 rounded-lg border border-atelier-champagneBorder bg-white outline-none text-right text-base sm:text-xs"
                    />
                  </div>
                  <span className="w-20 font-serif font-bold text-atelier-noir text-right text-xs pr-1">
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1 text-atelier-muted hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Preset Buttons in Rupees */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-atelier-muted uppercase font-bold tracking-wider mr-1">
                Quick Add:
              </span>
              <button
                type="button"
                onClick={() => addItem('Organic Botanical Cuticle Oil Roller (Retail)', 950)}
                className="px-2 py-1 rounded-md bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[10px] font-medium text-atelier-charcoal"
              >
                + Cuticle Oil (₹950)
              </button>
              <button
                type="button"
                onClick={() => addItem('Custom 3D Jewel / Swarovski Crystals', 1500)}
                className="px-2 py-1 rounded-md bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[10px] font-medium text-atelier-charcoal"
              >
                + Crystals (₹1,500)
              </button>
              <button
                type="button"
                onClick={() => addItem('Steam Gel Soak-Off & Rebalance', 700)}
                className="px-2 py-1 rounded-md bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[10px] font-medium text-atelier-charcoal"
              >
                + Removal (₹700)
              </button>
              <button
                type="button"
                onClick={() => addItem('Velvet Cat-Eye & Glaze Chrome Finish', 600)}
                className="px-2 py-1 rounded-md bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[10px] font-medium text-atelier-charcoal"
              >
                + Glaze (₹600)
              </button>
            </div>
          </div>

          {/* Financial Breakdown & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-atelier-champagneBorder/60">
            {/* Status & Method */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Payment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 outline-none text-base sm:text-xs font-semibold"
                >
                  <option value="Unpaid">Unpaid / Balance Due</option>
                  <option value="Paid">Paid in Full</option>
                  <option value="Partial">Partial / Deposit Paid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 outline-none text-base sm:text-xs font-medium"
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
            <div className="p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-atelier-muted">Subtotal:</span>
                <span className="font-semibold text-atelier-noir">
                  ₹{Number(subtotal).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-atelier-muted">Tip (₹):</span>
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="₹0"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className="w-full px-2 py-0.5 rounded border border-atelier-champagneBorder text-right bg-white text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-atelier-muted">Deposit Paid (₹):</span>
                <div className="w-24">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="₹0"
                    value={depositDeducted}
                    onChange={(e) => setDepositDeducted(e.target.value)}
                    className="w-full px-2 py-0.5 rounded border border-atelier-champagneBorder text-right bg-white text-base sm:text-xs text-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-1 border-t border-atelier-rose200/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-atelier-muted">Gift Voucher Code:</span>
                  <div className="w-28">
                    <input
                      type="text"
                      placeholder="GIFT-..."
                      value={giftCardCode}
                      onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                      className="w-full px-2 py-0.5 rounded border border-atelier-champagneBorder text-right bg-white text-base sm:text-[11px] font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-atelier-muted">Voucher Credit (₹):</span>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="₹0"
                      value={giftCardDeducted}
                      onChange={(e) => setGiftCardDeducted(e.target.value)}
                      className="w-full px-2 py-0.5 rounded border border-atelier-champagneBorder text-right bg-white text-base sm:text-xs text-rose-600 font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-atelier-rose200 flex justify-between items-baseline">
                <span className="font-bold text-atelier-noir">Balance Due:</span>
                <span className="font-serif italic font-bold text-xl text-atelier-rose600">
                  ₹{Number(status === 'Paid' ? 0 : balanceDue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-atelier-charcoal mb-1">
              Invoice Footer & Care Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-atelier-champagneBorder/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all active:scale-95"
            >
              {invoiceToEdit ? 'Save Changes' : 'Issue Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
