import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  User,
  DollarSign,
  Bell,
  Wallet,
  CheckCircle2,
  CreditCard,
  Check
} from 'lucide-react';

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  clients,
  services,
  preselectedClient = null,
  appointmentToEdit = null,
  preselectedDate = null,
  preselectedTime = null
}) {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [date, setDate] = useState(preselectedDate || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(preselectedTime || '11:30');
  const [notes, setNotes] = useState('');

  // Advance Payment State & Toggle
  const [hasAdvancePayment, setHasAdvancePayment] = useState(false);
  const [depositPaid, setDepositPaid] = useState(500);
  const [advancePaymentMethod, setAdvancePaymentMethod] = useState('UPI (Google Pay)');

  const [notifyImmediate, setNotifyImmediate] = useState(true);

  useEffect(() => {
    if (appointmentToEdit) {
      setClientId(appointmentToEdit.clientId || '');
      setClientName(appointmentToEdit.clientName || '');
      setClientPhone(appointmentToEdit.clientPhone || '');
      setServiceId(appointmentToEdit.serviceId || (services[0]?.id || ''));
      setSelectedAddons(appointmentToEdit.addonServiceNames || []);
      setDate(appointmentToEdit.date || new Date().toISOString().split('T')[0]);
      setTime(appointmentToEdit.time || '11:30');
      setNotes(appointmentToEdit.notes || '');

      const existingDeposit = Number(appointmentToEdit.depositPaid || appointmentToEdit.advancePaid || 0);
      setHasAdvancePayment(existingDeposit > 0);
      setDepositPaid(existingDeposit > 0 ? existingDeposit : 500);
      setAdvancePaymentMethod(appointmentToEdit.advancePaymentMethod || 'UPI (Google Pay)');
      setNotifyImmediate(false);
    } else if (preselectedClient) {
      setClientId(preselectedClient.id);
      setClientName(preselectedClient.name);
      setClientPhone(preselectedClient.phone);
      if (services.length > 0 && !serviceId) setServiceId(services[0].id);
      if (preselectedDate) setDate(preselectedDate);
      if (preselectedTime) setTime(preselectedTime);
      setHasAdvancePayment(false);
      setDepositPaid(500);
    } else {
      if (clients.length > 0 && !clientId) {
        setClientId(clients[0].id);
        setClientName(clients[0].name);
        setClientPhone(clients[0].phone);
      }
      if (services.length > 0 && !serviceId) {
        setServiceId(services[0].id);
      }
      if (preselectedDate) setDate(preselectedDate);
      if (preselectedTime) setTime(preselectedTime);
      setHasAdvancePayment(false);
      setDepositPaid(500);
    }
  }, [isOpen, preselectedClient, appointmentToEdit, preselectedDate, preselectedTime, clients, services]);

  if (!isOpen) return null;

  const handleClientChange = (id) => {
    setClientId(id);
    const found = clients.find((c) => c.id === id);
    if (found) {
      setClientName(found.name);
      setClientPhone(found.phone);
    }
  };

  const selectedService = services.find((s) => s.id === serviceId) || services[0];
  const addonsList = services.filter((s) => s.category === 'Nail Art' || s.category === 'Add-on');

  // Compute total duration and price
  const addonServices = addonsList.filter((a) => selectedAddons.includes(a.name));
  const totalDuration = (selectedService?.duration || 60) + addonServices.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalPrice = (selectedService?.price || 0) + addonServices.reduce((sum, a) => sum + (a.price || 0), 0);

  // Compute advance and pending amounts
  const advanceAmountNum = hasAdvancePayment ? Math.min(totalPrice, Math.max(0, Number(depositPaid) || 0)) : 0;
  const pendingAmount = Math.max(0, totalPrice - advanceAmountNum);

  const toggleAddon = (addonName) => {
    if (selectedAddons.includes(addonName)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addonName));
    } else {
      setSelectedAddons([...selectedAddons, addonName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !serviceId) {
      alert('Please fill in required client and service details.');
      return;
    }

    onSave({
      ...(appointmentToEdit?.id ? { id: appointmentToEdit.id } : {}),
      clientId,
      clientName,
      clientPhone,
      serviceId: selectedService?.id || serviceId || '',
      serviceName: selectedService?.name || 'Signature Nail Service',
      addonServiceNames: selectedAddons,
      date,
      time,
      duration: totalDuration,
      price: totalPrice,
      depositPaid: advanceAmountNum,
      advancePaid: advanceAmountNum,
      hasAdvancePayment,
      advancePaymentMethod: hasAdvancePayment ? advancePaymentMethod : null,
      pendingAmount,
      balanceDue: pendingAmount,
      notes,
      notifyImmediate,
      status: appointmentToEdit ? appointmentToEdit.status : 'Confirmed'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-float border-t sm:border border-atelier-champagneBorder relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{appointmentToEdit ? 'Edit Booking' : 'Schedule Nail Appointment 💕'}</span>
          </div>
          <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
            {appointmentToEdit ? 'Update Appointment' : 'Book Client Appointment'}
          </h3>
          <p className="text-xs text-atelier-muted mt-1">
            Reserve time in the studio calendar. Automatically dispatches alerts to your phone.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-atelier-charcoal">
              Select Client *
            </label>
            {clients.length > 0 ? (
              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none font-medium text-base sm:text-xs"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) {c.vip ? '★ VIP' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Client Name"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            )}
          </div>

          {/* Primary Service Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-atelier-charcoal">
              Primary Nail Service *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none font-medium text-base sm:text-xs"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{Number(s.price).toLocaleString('en-IN')} ({s.duration} min)
                </option>
              ))}
            </select>
          </div>

          {/* Nail Art & Add-on Selection */}
          <div className="p-3.5 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder space-y-2">
            <span className="font-semibold text-atelier-noir block">
              Nail Art Tier & Custom Add-ons
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {addonsList.map((addon) => {
                const isSelected = selectedAddons.includes(addon.name);
                return (
                  <button
                    type="button"
                    key={addon.id}
                    onClick={() => toggleAddon(addon.name)}
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${isSelected
                      ? 'bg-atelier-rose100 text-atelier-rose600 border-atelier-rose300 font-semibold shadow-sm'
                      : 'bg-white text-atelier-charcoal border-atelier-champagneBorder hover:bg-atelier-rose50/40'
                      }`}
                  >
                    <span className="truncate pr-1">{addon.name}</span>
                    <span className="shrink-0 font-serif font-bold text-atelier-noir">
                      +₹{Number(addon.price).toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-atelier-charcoal mb-1">
                Time Slot *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>
          </div>

          {/* Summary Box: Price & Duration */}
          <div className="p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                Estimated Duration
              </span>
              <span className="font-semibold text-atelier-noir text-xs">
                {totalDuration} minutes (~{(totalDuration / 60).toFixed(1)} hrs)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                Estimated Total
              </span>
              <span className="font-serif italic font-bold text-xl text-atelier-rose600">
                ₹{Number(totalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Advance Payment / Deposit Section with Toggle & Live Pending Calculation */}
          <div className="p-4 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-atelier-noir text-xs flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-atelier-rose500" />
                  <span>Advance Payment Received</span>
                </span>
                <p className="text-[11px] text-atelier-muted">
                  Record advance deposit taken to hold or secure this appointment slot
                </p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  const next = !hasAdvancePayment;
                  setHasAdvancePayment(next);
                  if (next && (!depositPaid || depositPaid === 0)) {
                    setDepositPaid(500);
                  }
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${hasAdvancePayment ? 'bg-atelier-rose500' : 'bg-stone-300'
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${hasAdvancePayment ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {hasAdvancePayment ? (
              <div className="space-y-3 pt-2 border-t border-atelier-champagneBorder/60 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Advance Amount Paid (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-atelier-muted font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={totalPrice}
                        step="50"
                        required={hasAdvancePayment}
                        value={depositPaid}
                        onChange={(e) => setDepositPaid(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-atelier-champagneBorder bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-semibold text-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-atelier-charcoal mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={advancePaymentMethod}
                      onChange={(e) => setAdvancePaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-atelier-champagneBorder bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs font-medium"
                    >
                      <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                      <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                      <option value="UPI (Paytm)">UPI (Paytm)</option>
                      <option value="UPI (BHIM)">UPI (BHIM)</option>
                      <option value="Cash in Hand">Cash in Hand</option>
                      <option value="Credit / Debit Card">Credit / Debit Card</option>
                      <option value="Bank IMPS / NEFT">Bank IMPS / NEFT</option>
                    </select>
                  </div>
                </div>

                {/* Quick Shortcut Preset Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] text-atelier-muted uppercase font-bold tracking-wider mr-1">
                    Quick Preset:
                  </span>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(500)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[11px] font-semibold text-atelier-charcoal active:scale-95 transition-all"
                  >
                    ₹500 (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(1000)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[11px] font-semibold text-atelier-charcoal active:scale-95 transition-all"
                  >
                    ₹1,000 (Bridal / Art)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(Math.round(totalPrice * 0.5))}
                    className="px-2.5 py-1 rounded-lg bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[11px] font-semibold text-atelier-charcoal active:scale-95 transition-all"
                  >
                    50% (₹{Math.round(totalPrice * 0.5)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(totalPrice)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-[11px] font-semibold text-atelier-charcoal active:scale-95 transition-all"
                  >
                    100% Full (₹{totalPrice})
                  </button>
                </div>

                {/* Calculated Advance & Pending Balance Summary Card */}
                <div className="p-3.5 rounded-xl bg-white border border-atelier-rose200/80 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                      Advance Collected
                    </span>
                    <span className="font-serif italic font-bold text-base text-emerald-700">
                      ₹{Number(advanceAmountNum).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-atelier-muted block">
                      via {advancePaymentMethod}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider">
                      Pending Studio Balance
                    </span>
                    <span className="font-serif italic font-bold text-lg text-amber-700">
                      ₹{Number(pendingAmount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-atelier-muted block">
                      {pendingAmount === 0 ? 'Fully Paid' : 'Due upon completion'}
                    </span>
                  </div>
                </div>

                {advanceAmountNum >= totalPrice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Appointment is 100% paid upfront! Zero balance remaining.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-white/80 border border-dashed border-atelier-champagneBorder text-[11px] text-atelier-muted flex items-center justify-between">
                <span>No advance payment taken. Full amount will be collected in the studio.</span>
                <span className="font-semibold text-amber-700 font-serif">
                  Pending: ₹{Number(totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notifyImmediate}
                onChange={(e) => setNotifyImmediate(e.target.checked)}
                className="w-4 h-4 rounded text-atelier-rose500 focus:ring-atelier-rose400 border-atelier-champagneBorder accent-atelier-rose500"
              />
              <span className="font-semibold text-atelier-noir">
                Ping Sirii's phone immediately (ntfy push alert)
              </span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-atelier-charcoal mb-1">
              Design Notes / Client Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Bringing inspiration photo with silver chrome stars, bridal trial"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
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
              {appointmentToEdit ? 'Save Changes' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

