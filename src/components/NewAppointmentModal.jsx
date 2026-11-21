import React, { useState, useEffect, useMemo } from 'react';
import ModalPortal from './ModalPortal';
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
  Heart,
  Sparkles,
  PenTool
} from 'lucide-react';
import {
  getKolkataTodayString,
  getKolkataTomorrowString,
  formatKolkataDate,
  formatTime12h
} from '../utils/dateTime';

// Helper for future date strings in Kolkata timezone
function getFutureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

// Preset interactive time pills
const TIME_SLOTS = [
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:30', label: '5:30 PM' },
  { value: '19:00', label: '7:00 PM' },
];

export default function NewAppointmentModal({
  isOpen,
  onClose,
  onSave,
  clients = [],
  services = [],
  appointments = [],
  preselectedClient = null,
  appointmentToEdit = null,
  preselectedDate = null,
  preselectedTime = null,
  isFromNewClient = false
}) {
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Primary Nail Service (Manual Writing Tab + Custom Price)
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceId, setServiceId] = useState('');

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [date, setDate] = useState(preselectedDate || getKolkataTodayString());
  const [time, setTime] = useState(preselectedTime || '12:00');
  const [notes, setNotes] = useState('');

  // Advance Payment State & Toggle
  const [hasAdvancePayment, setHasAdvancePayment] = useState(false);
  const [depositPaid, setDepositPaid] = useState(500);
  const [advancePaymentMethod, setAdvancePaymentMethod] = useState('UPI (Google Pay)');

  // Remind Me & Studio Alert Preferences (24h & 4h enabled by default)
  const [remind24h, setRemind24h] = useState(true);
  const [remind4h, setRemind4h] = useState(true);
  const [remind1h, setRemind1h] = useState(false);
  const [notifyImmediate, setNotifyImmediate] = useState(true);

  // Compute previous services ONLY from real past appointments
  const previousServices = useMemo(() => {
    const list = [];
    const seen = new Set();

    // Prioritize this client's past appointments if selected
    const clientApts = clientId ? appointments.filter((a) => a.clientId === clientId) : [];
    const otherApts = appointments.filter((a) => !clientId || a.clientId !== clientId);
    const prioritized = [...clientApts, ...otherApts];

    for (const apt of prioritized) {
      const name = (apt.serviceName || '').trim();
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      const p = Number(apt.servicePrice || apt.price);
      list.push({
        name,
        price: !isNaN(p) && p > 0 ? p : 0,
        isClientPast: apt.clientId === clientId
      });
    }

    // Only return actual past inputs from real appointments (no hardcoded presets)
    return list.slice(0, 8);
  }, [appointments, clientId]);

  useEffect(() => {
    if (appointmentToEdit) {
      setClientId(appointmentToEdit.clientId || '');
      setClientName(appointmentToEdit.clientName || '');
      setClientPhone(appointmentToEdit.clientPhone || '');
      setServiceName(appointmentToEdit.serviceName || '');
      setServicePrice(appointmentToEdit.servicePrice !== undefined && appointmentToEdit.servicePrice !== null && appointmentToEdit.servicePrice !== '' ? appointmentToEdit.servicePrice : (appointmentToEdit.price || ''));
      setServiceId(appointmentToEdit.serviceId || '');
      setSelectedAddons(appointmentToEdit.addonServiceNames || []);
      setDate(appointmentToEdit.date || getKolkataTodayString());
      setTime(appointmentToEdit.time || '12:00');
      setNotes(appointmentToEdit.notes || '');

      setRemind24h(appointmentToEdit.remind24h !== undefined ? appointmentToEdit.remind24h : true);
      setRemind4h(appointmentToEdit.remind4h !== undefined ? appointmentToEdit.remind4h : true);
      setRemind1h(appointmentToEdit.remind1h || false);

      const existingDeposit = Number(appointmentToEdit.depositPaid || appointmentToEdit.advancePaid || 0);
      setHasAdvancePayment(existingDeposit > 0);
      setDepositPaid(existingDeposit > 0 ? existingDeposit : 500);
      setAdvancePaymentMethod(appointmentToEdit.advancePaymentMethod || 'UPI (Google Pay)');
      setNotifyImmediate(false);
    } else if (preselectedClient) {
      setClientId(preselectedClient.id);
      setClientName(preselectedClient.name);
      setClientPhone(preselectedClient.phone);

      // Check if this client had past appointments
      const clientPast = appointments.find((a) => a.clientId === preselectedClient.id);
      if (clientPast && clientPast.serviceName) {
        setServiceName(clientPast.serviceName);
        setServicePrice(clientPast.servicePrice || clientPast.price || '');
      } else if (!serviceName) {
        setServiceName('');
        setServicePrice('');
      }

      if (preselectedDate) setDate(preselectedDate);
      if (preselectedTime) setTime(preselectedTime);
      setHasAdvancePayment(false);
      setDepositPaid(500);
      setRemind24h(true);
      setRemind4h(true);
      setRemind1h(false);
      setNotifyImmediate(true);
    } else {
      if (clients.length > 0 && !clientId) {
        setClientId(clients[0].id);
        setClientName(clients[0].name);
        setClientPhone(clients[0].phone);
      }

      if (!serviceName) {
        const lastApt = appointments[0];
        if (lastApt && lastApt.serviceName) {
          setServiceName(lastApt.serviceName);
          setServicePrice(lastApt.servicePrice || lastApt.price || '');
        } else {
          setServiceName('');
          setServicePrice('');
        }
      }

      if (preselectedDate) setDate(preselectedDate);
      if (preselectedTime) setTime(preselectedTime);
      setHasAdvancePayment(false);
      setDepositPaid(500);
      setRemind24h(true);
      setRemind4h(true);
      setRemind1h(false);
      setNotifyImmediate(true);
    }
  }, [isOpen, preselectedClient, appointmentToEdit, preselectedDate, preselectedTime, clients]);

  if (!isOpen) return null;

  const handleClientChange = (id) => {
    setClientId(id);
    const found = clients.find((c) => c.id === id);
    if (found) {
      setClientName(found.name);
      setClientPhone(found.phone);

      // Check if this newly selected client has a past service to suggest
      const clientPast = appointments.find((a) => a.clientId === id);
      if (clientPast && clientPast.serviceName && !appointmentToEdit) {
        setServiceName(clientPast.serviceName);
        setServicePrice(clientPast.servicePrice || clientPast.price || '');
      }
    }
  };

  const addonsList = services.filter((s) => s.category === 'Nail Art' || s.category === 'Add-on');

  // Compute total price (respecting custom set overrides if present)
  const isCustomSet = Boolean(appointmentToEdit?.customSet || appointmentToEdit?.serviceId === 'custom_set');
  const customBasePrice = Number(appointmentToEdit?.customSet?.price || appointmentToEdit?.price) || 0;

  const addonServices = addonsList.filter((a) => selectedAddons.includes(a.name));
  const addonTotal = addonServices.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const basePriceNum = Math.max(0, Number(servicePrice) || 0);
  const totalPrice = isCustomSet ? customBasePrice + addonTotal : basePriceNum + addonTotal;

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

  const todayStr = getKolkataTodayString();
  const tomorrowStr = getKolkataTomorrowString();
  const in2DaysStr = getFutureDate(2);
  const in3DaysStr = getFutureDate(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientName.trim() || (!serviceName.trim() && !isCustomSet)) {
      alert('Please fill in required client and service details.');
      return;
    }

    const pad = (n) => String(n).padStart(2, '0');
    const [y, m, d] = (date || '').split('-').map(Number);
    const [h, min] = (time || '12:00').split(':').map(Number);
    const targetMs = new Date(`${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min || 0)}:00+05:30`).getTime();
    const isFutureSlot = targetMs > Date.now();
    const isRescheduled = appointmentToEdit && (appointmentToEdit.date !== date || appointmentToEdit.time !== time);
    const resetToConfirmed = isRescheduled && isFutureSlot;

    onSave({
      ...(appointmentToEdit?.id ? { id: appointmentToEdit.id } : {}),
      clientId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceId: isCustomSet ? (appointmentToEdit?.serviceId || 'custom_set') : (serviceId || 'manual_service'),
      serviceName: isCustomSet ? (appointmentToEdit?.serviceName || 'Custom Designer Nail Set') : (serviceName.trim() || 'Signature Nail Service'),
      servicePrice: basePriceNum,
      customSet: appointmentToEdit?.customSet || null,
      addonServiceNames: selectedAddons,
      date,
      time,
      duration: 75,
      price: totalPrice,
      depositPaid: advanceAmountNum,
      advancePaid: advanceAmountNum,
      hasAdvancePayment,
      advancePaymentMethod: hasAdvancePayment ? advancePaymentMethod : null,
      pendingAmount,
      balanceDue: pendingAmount,
      notes,
      remind24h,
      remind4h,
      remind1h,
      reminded24h: resetToConfirmed ? false : (appointmentToEdit?.reminded24h || false),
      reminded4h: resetToConfirmed ? false : (appointmentToEdit?.reminded4h || false),
      reminded1h: resetToConfirmed ? false : (appointmentToEdit?.reminded1h || false),
      notifyImmediate,
      status: resetToConfirmed ? 'Confirmed' : (appointmentToEdit ? appointmentToEdit.status : 'Confirmed')
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
        className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-7 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-7 shadow-studio-float border-t sm:border border-studio-border relative max-h-[90vh] sm:max-h-[85vh] overflow-y-auto font-sans overscroll-contain"
        >
          <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto mb-3 sm:hidden" />
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-studio-muted hover:text-studio-ink hover:bg-studio-subtle transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-wineLight text-studio-wine text-xs font-semibold mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{appointmentToEdit ? 'Edit Booking' : isFromNewClient ? 'Step 2: Schedule Appointment' : 'Schedule Nail Appointment'}</span>
            </div>
            <h3 className="font-display italic font-bold text-2xl text-studio-ink">
              {appointmentToEdit ? 'Update Appointment' : 'Book Client Appointment'}
            </h3>
            <p className="text-xs text-studio-secondary mt-1">
              Reserve studio time with smart manual service entry and multi-stage phone reminders.
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
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-studio-secondary">
                  Select Client *
                </label>
                {clientId && (
                  <button
                    type="button"
                    onClick={() => {
                      setClientId('');
                      setClientName('');
                      setClientPhone('');
                    }}
                    className="text-[10px] text-studio-muted hover:text-studio-wine underline"
                  >
                    Clear / Write New
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                {/* Option 1: Select from saved clients list */}
                <select
                  value={clientId}
                  onChange={(e) => handleClientChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none font-medium text-base sm:text-xs text-studio-ink cursor-pointer"
                >
                  <option value="">
                    {clients.length > 0
                      ? `-- Select from saved clients (${clients.length}) --`
                      : '-- No saved clients yet (type below) --'}
                  </option>
                  {preselectedClient && !clients.some((c) => c.id === preselectedClient.id) && (
                    <option key={preselectedClient.id} value={preselectedClient.id}>
                      {preselectedClient.name} ({preselectedClient.phone})
                    </option>
                  )}
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.phone ? `(${c.phone})` : ''} {c.vip ? '[VIP Client]' : ''}
                    </option>
                  ))}
                </select>

                {/* Option 2: Write manually */}
                <input
                  type="text"
                  placeholder={clientId ? "Selected client name (editable)" : "Write client name manually..."}
                  required
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    const matched = clients.find((c) => c.id === clientId);
                    if (matched && matched.name !== e.target.value) {
                      setClientId('');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 focus:bg-studio-surface focus:border-studio-wine outline-none font-medium text-base sm:text-xs text-studio-ink"
                />
              </div>
            </div>

            {/* Primary Nail Service: Manual Writing Tab + Previous Inputs */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-studio-subtle border border-studio-border">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-studio-secondary">
                  Primary Nail Service & Custom Price *
                </label>
                <span className="text-[11px] text-studio-muted">
                  {previousServices.length > 0 ? 'Write manually or tap past service' : 'Enter treatment name & rate'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Service Name (Manual Input) */}
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acrylic Nail Extension (Full Set)"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none font-medium text-base sm:text-xs text-studio-ink placeholder:text-studio-muted shadow-xs"
                  />
                </div>

                {/* Service Price (Manual Input) */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-studio-muted font-bold text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    placeholder="e.g. 1500"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none font-bold text-base sm:text-xs text-studio-wine shadow-xs"
                  />
                </div>
              </div>

              {/* Previous Inputs Selection Section (from real appointment history) */}
              {previousServices.length > 0 && (
                <div className="pt-1.5 border-t border-studio-border/70">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3 h-3 text-studio-wine shrink-0" />
                    <span className="text-[11px] font-semibold text-studio-secondary">
                      Previous Inputs & Past Services
                    </span>
                    <span className="text-[10px] text-studio-muted">
                      (Tap to quick-fill)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                    {previousServices.map((prev, idx) => {
                      const isSelected =
                        serviceName.trim().toLowerCase() === prev.name.trim().toLowerCase() &&
                        Number(servicePrice) === Number(prev.price);
                      return (
                        <button
                          key={`${prev.name}-${idx}`}
                          type="button"
                          onClick={() => {
                            setServiceName(prev.name);
                            setServicePrice(prev.price);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all active:scale-95 flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                              : 'bg-studio-surface text-studio-ink border-studio-border hover:bg-studio-wineLight hover:border-studio-wine/40'
                          }`}
                        >
                          <span className="truncate max-w-[170px]">{prev.name}</span>
                          <span className={isSelected ? 'text-white/90 font-bold' : 'text-studio-wine font-semibold'}>
                            ₹{Number(prev.price).toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Nail Art Tier & Custom Add-ons */}
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

            {/* Date & Time Selection (Modern, Interactive, Premium) */}
            <div className="space-y-3 p-3.5 rounded-2xl bg-studio-subtle border border-studio-border">
              {/* Date Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-studio-secondary">
                    Appointment Date *
                  </label>
                  <span className="text-[11px] font-semibold text-studio-wine">
                    {formatKolkataDate(date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Quick Date Pills */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Today', val: todayStr },
                    { label: 'Tomorrow', val: tomorrowStr },
                    { label: '+2 Days', val: in2DaysStr },
                    { label: '+3 Days', val: in3DaysStr }
                  ].map((d) => {
                    const isSelected = date === d.val;
                    return (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setDate(d.val)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                            : 'bg-studio-surface text-studio-secondary border-studio-border hover:bg-studio-canvas hover:text-studio-ink'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>

                {/* Date Input */}
                <div className="relative pt-1">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink font-medium shadow-xs"
                  />
                </div>
              </div>

              {/* Time Slot Selector */}
              <div className="space-y-1.5 pt-2 border-t border-studio-border">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-studio-secondary">
                    Time Slot *
                  </label>
                  <span className="text-[11px] font-semibold text-studio-wine">
                    {formatTime12h(time)}
                  </span>
                </div>

                {/* Quick Time Slot Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = time === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setTime(slot.value)}
                        className={`py-1.5 px-1 rounded-xl text-xs font-semibold text-center border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-studio-wine text-white border-studio-wine shadow-xs'
                            : 'bg-studio-surface text-studio-secondary border-studio-border hover:bg-studio-canvas hover:text-studio-ink'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Time Slot Input */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-studio-muted shrink-0 font-medium">Custom time:</span>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-studio-border bg-studio-surface focus:border-studio-wine outline-none text-base sm:text-xs text-studio-ink font-medium shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Total Service Price Card (Estimated duration removed) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-studio-wineLight/60 via-studio-subtle to-studio-wineLight/40 border border-studio-wine/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-studio-wine block">
                  Total Appointment Price
                </span>
                <span className="text-xs text-studio-secondary font-medium">
                  {serviceName || 'Custom Service'} {addonServices.length > 0 ? `+ ${addonServices.length} add-on${addonServices.length > 1 ? 's' : ''}` : ''}
                </span>
              </div>

              <div className="text-right">
                <span className="font-display italic font-bold text-2xl text-studio-wine">
                  ₹{Number(totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Remind Me & Studio Alert Preferences (Multi-Check, 24h & 4h checked by default) */}
            <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-studio-wineLight flex items-center justify-center text-studio-wine">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-studio-ink text-xs block">
                      Remind Me & Studio Alerts
                    </span>
                    <span className="text-[11px] text-studio-secondary">
                      Multi-check when to dispatch alert reminders to your phone (ntfy)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-wineLight text-studio-wine font-bold">
                  Multi-Check
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {/* 24 Hours Before - Default Checked */}
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  remind24h
                    ? 'bg-studio-surface border-studio-wine/50 shadow-xs'
                    : 'bg-studio-canvas/50 border-studio-border hover:bg-studio-surface opacity-75'
                }`}>
                  <input
                    type="checkbox"
                    checked={remind24h}
                    onChange={(e) => setRemind24h(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-studio-ink">24 Hours Before Appointment</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Default Active</span>
                    </div>
                    <p className="text-[11px] text-studio-secondary mt-0.5">
                      Advance preparation alert with client phone, custom service, price, and schedule.
                    </p>
                  </div>
                </label>

                {/* 4 Hours Before - Default Checked */}
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  remind4h
                    ? 'bg-studio-surface border-studio-wine/50 shadow-xs'
                    : 'bg-studio-canvas/50 border-studio-border hover:bg-studio-surface opacity-75'
                }`}>
                  <input
                    type="checkbox"
                    checked={remind4h}
                    onChange={(e) => setRemind4h(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-studio-ink">4 Hours Before Appointment</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Default Active</span>
                    </div>
                    <p className="text-[11px] text-studio-secondary mt-0.5">
                      Arrival readiness alert to prepare sterilization buffers and station products.
                    </p>
                  </div>
                </label>

                {/* 1 Hour Before - Optional */}
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  remind1h
                    ? 'bg-studio-surface border-studio-wine/50 shadow-xs'
                    : 'bg-studio-canvas/50 border-studio-border hover:bg-studio-surface opacity-75'
                }`}>
                  <input
                    type="checkbox"
                    checked={remind1h}
                    onChange={(e) => setRemind1h(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-studio-ink">1 Hour Before Appointment</span>
                    <p className="text-[11px] text-studio-secondary mt-0.5">
                      Final arrival prompt right before client walks into the studio atelier.
                    </p>
                  </div>
                </label>

                {/* Immediate Booking Alert */}
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                  notifyImmediate
                    ? 'bg-studio-surface border-studio-wine/50 shadow-xs'
                    : 'bg-studio-canvas/50 border-studio-border hover:bg-studio-surface opacity-75'
                }`}>
                  <input
                    type="checkbox"
                    checked={notifyImmediate}
                    onChange={(e) => setNotifyImmediate(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-studio-wine focus:ring-studio-wine border-studio-border accent-studio-wine"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs text-studio-ink">Immediate Confirmation Alert</span>
                    <p className="text-[11px] text-studio-secondary mt-0.5">
                      Dispatch instant push notification alert right now upon booking.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Advance Payment / Deposit Section with Live Pending Calculation */}
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
    
  </ModalPortal>
);
}
