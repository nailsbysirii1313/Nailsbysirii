import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  DollarSign,
  Bell,
  Wallet,
  CheckCircle2,
  CreditCard,
  Check,
  Heart
} from 'lucide-react';
import { getKolkataTodayString } from '../utils/dateTime';

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  clients,
  services,
  preselectedClient = null,
  appointmentToEdit = null,
  preselectedDate = null,
  preselectedTime = null,
  isFromNewClient = false
}) {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [date, setDate] = useState(preselectedDate || getKolkataTodayString());
  const [time, setTime] = useState(preselectedTime || '12:00');
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
      setDate(appointmentToEdit.date || getKolkataTodayString());
      setTime(appointmentToEdit.time || '12:00');
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

  // Compute total duration and price (respecting custom set overrides)
  const isCustomSet = Boolean(appointmentToEdit?.customSet || appointmentToEdit?.serviceId === 'custom_set');
  const customBasePrice = Number(appointmentToEdit?.customSet?.price || appointmentToEdit?.price) || 0;
  const customBaseDuration = Number(appointmentToEdit?.customSet?.duration || appointmentToEdit?.duration) || 0;

  const addonServices = addonsList.filter((a) => selectedAddons.includes(a.name));
  const totalDuration = isCustomSet
    ? customBaseDuration + addonServices.reduce((sum, a) => sum + (a.duration || 0), 0)
    : (selectedService?.duration || 60) + addonServices.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalPrice = isCustomSet
    ? customBasePrice + addonServices.reduce((sum, a) => sum + (a.price || 0), 0)
    : (selectedService?.price || 0) + addonServices.reduce((sum, a) => sum + (a.price || 0), 0);

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
    if (!clientName.trim() || (!serviceId && !isCustomSet)) {
      alert('Please fill in required client and service details.');
      return;
    }

    onSave({
      ...(appointmentToEdit?.id ? { id: appointmentToEdit.id } : {}),
      clientId,
      clientName,
      clientPhone,
      serviceId: isCustomSet ? (appointmentToEdit?.serviceId || 'custom_set') : (selectedService?.id || serviceId || ''),
      serviceName: isCustomSet ? (appointmentToEdit?.serviceName || 'Custom Designer Nail Set') : (selectedService?.name || 'Signature Nail Service'),
      customSet: appointmentToEdit?.customSet || null,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-studio-ink/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-studio-float border-t sm:border border-studio-border relative max-h-[92vh] overflow-y-auto font-sans">
        <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-studio-muted hover:text-studio-ink hover:bg-studio-subtle transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{appointmentToEdit ? 'Edit Booking' : isFromNewClient ? 'Step 2: Schedule Appointment' : 'Schedule Nail Appointment'}</span>
          </div>
          <h3 className="font-display italic font-bold text-2xl text-studio-ink">
            {appointmentToEdit ? 'Update Appointment' : 'Book Client Appointment'}
          </h3>
          <p className="text-xs text-studio-secondary mt-1">
            Reserve time in the studio calendar. Automatically dispatches alerts to your phone.
          </p>
        </div>

        {isFromNewClient && (
          <div className="mb-4 p-3 rounded-2xl bg-studio-wineLight border border-studio-wine/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-studio-wine font-medium">
              <Heart className="w-4 h-4 fill-studio-wine text-studio-wine shrink-0" />
              <span>Client <strong>{clientName || preselectedClient?.name}</strong> registered! Book appointment or skip:</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-wine/30 text-studio-wine hover:bg-studio-wine hover:text-white font-bold text-[11px] shrink-0 transition-all shadow-xs"
            >
              Skip for now
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-studio-secondary">
              Select Client *
            </label>
            {clients.length > 0 ? (
              <select
                value={clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none font-medium text-base sm:text-xs text-studio-ink"
              >
                {preselectedClient && !clients.some((c) => c.id === preselectedClient.id) && (
                  <option key={preselectedClient.id} value={preselectedClient.id}>
                    {preselectedClient.name} ({preselectedClient.phone})
                  </option>
                )}
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) {c.vip ? '[VIP Client]' : ''}
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
              />
            )}
          </div>

          {/* Primary Service Selection */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-studio-secondary">
              Primary Nail Service *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none font-medium text-base sm:text-xs text-studio-ink"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{Number(s.price).toLocaleString('en-IN')} ({s.duration} min)
                </option>
              ))}
            </select>
          </div>

          {/* Nail Art & Add-on Selection */}
          <div className="p-3.5 rounded-2xl bg-studio-subtle border border-studio-border space-y-2">
            <span className="font-semibold text-studio-ink block">
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
                    className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between active:scale-95 ${
                      isSelected
                        ? 'bg-studio-wineLight text-studio-wine border-studio-wine font-semibold shadow-xs'
                        : 'bg-studio-surface text-studio-secondary border-studio-border hover:bg-studio-canvas'
                    }`}
                  >
                    <span className="truncate pr-1">{addon.name}</span>
                    <span className="shrink-0 font-display font-bold text-studio-ink">
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
              <label className="block font-semibold text-studio-secondary mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
              />
            </div>

            <div>
              <label className="block font-semibold text-studio-secondary mb-1">
                Time Slot *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
              />
            </div>
          </div>

          {/* Summary Box: Price & Duration */}
          <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                Estimated Duration
              </span>
              <span className="font-semibold text-studio-ink text-xs">
                {totalDuration} minutes (~{(totalDuration / 60).toFixed(1)} hrs)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
                Estimated Total
              </span>
              <span className="font-display italic font-bold text-xl text-studio-wine">
                ₹{Number(totalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Advance Payment / Deposit Section with Toggle & Live Pending Calculation */}
          <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-semibold text-studio-ink text-xs flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-studio-wine" />
                  <span>Advance Payment Received</span>
                </span>
                <p className="text-[11px] text-studio-secondary">
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
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hasAdvancePayment ? 'bg-studio-wine' : 'bg-studio-borderStrong'
                }`}
                aria-label="Toggle advance payment"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    hasAdvancePayment ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {hasAdvancePayment ? (
              <div className="space-y-3 pt-2 border-t border-studio-border animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Advance Amount Paid (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted font-bold text-xs">
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
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs font-semibold text-emerald-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-studio-secondary mb-1">
                      Payment Mode
                    </label>
                    <select
                      value={advancePaymentMethod}
                      onChange={(e) => setAdvancePaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs font-medium text-studio-ink"
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
                  <span className="text-[10px] text-studio-muted uppercase font-bold tracking-wider mr-1">
                    Preset:
                  </span>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(500)}
                    className="px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border hover:border-studio-wine text-[11px] font-semibold text-studio-secondary active:scale-95 transition-all"
                  >
                    ₹500 (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(1000)}
                    className="px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border hover:border-studio-wine text-[11px] font-semibold text-studio-secondary active:scale-95 transition-all"
                  >
                    ₹1,000 (Bridal / Art)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(Math.round(totalPrice * 0.5))}
                    className="px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border hover:border-studio-wine text-[11px] font-semibold text-studio-secondary active:scale-95 transition-all"
                  >
                    50% (₹{Math.round(totalPrice * 0.5)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositPaid(totalPrice)}
                    className="px-2.5 py-1 rounded-lg bg-studio-surface border border-studio-border hover:border-studio-wine text-[11px] font-semibold text-studio-secondary active:scale-95 transition-all"
                  >
                    100% Full (₹{totalPrice})
                  </button>
                </div>

                {/* Calculated Advance & Pending Balance Summary Card */}
                <div className="p-3.5 rounded-xl bg-studio-surface border border-studio-border flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                      Advance Collected
                    </span>
                    <span className="font-display italic font-bold text-base text-emerald-800">
                      ₹{Number(advanceAmountNum).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-studio-muted block">
                      via {advancePaymentMethod}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
                      Pending Studio Balance
                    </span>
                    <span className="font-display italic font-bold text-lg text-amber-800">
                      ₹{Number(pendingAmount).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-studio-muted block">
                      {pendingAmount === 0 ? 'Fully Paid' : 'Due upon completion'}
                    </span>
                  </div>
                </div>

                {advanceAmountNum >= totalPrice && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Appointment is 100% paid upfront. Zero balance remaining.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-studio-surface/80 border border-dashed border-studio-border text-[11px] text-studio-muted flex items-center justify-between">
                <span>No advance payment recorded. Full amount will be collected at studio.</span>
                <span className="font-semibold text-amber-800 font-display">
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
                className="w-4 h-4 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
              />
              <span className="font-semibold text-studio-ink">
                Send phone alert immediately (ntfy push notification)
              </span>
            </label>
          </div>

          <div>
            <label className="block font-semibold text-studio-secondary mb-1">
              Design Notes / Client Requests
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Reference photo with sculpted chrome ribbons, bridal trial"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-studio-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-studio-border text-studio-secondary hover:bg-studio-subtle text-xs font-semibold transition-all"
            >
              {isFromNewClient ? 'Skip for Now' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white text-xs font-semibold shadow-studio transition-all active:scale-95"
            >
              {appointmentToEdit ? 'Save Changes' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
