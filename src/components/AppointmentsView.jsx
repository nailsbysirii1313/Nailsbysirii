import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Bell,
  Receipt,
  CheckCircle2,
  Trash2,
  Edit3,
  Search,
  Filter,
  Sparkles,
  Phone,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LayoutList,
  CalendarDays,
  Wallet,
  Check,
  ArrowRight,
  User,
  ShieldCheck,
  TrendingUp,
  CircleDot
} from 'lucide-react';

export default function AppointmentsView({
  appointments,
  clients,
  settings,
  repairs = [],
  onUpdateRepairStatus,
  onOpenNewAppointment,
  onEditAppointment,
  onDeleteAppointment,
  onUpdateStatus,
  onRemindAppointment,
  onOpenNewInvoice,
  onOpenClientProfile
}) {
  const currency = settings?.currency || '₹';
  const todayStr = new Date().toISOString().split('T')[0];

  // View Switcher Mode: 'list' | 'calendar' | 'timeline'
  const [viewMode, setViewMode] = useState('list');

  // List View Filter & Search
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, TODAY, UPCOMING, COMPLETED
  const [search, setSearch] = useState('');

  // Calendar & Timeline Selected Date State
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Filtered appointments for list view
  const filtered = appointments.filter((apt) => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (apt.clientName || '').toLowerCase().includes(q) ||
      (apt.serviceName || '').toLowerCase().includes(q) ||
      (apt.notes && apt.notes.toLowerCase().includes(q));

    let matchesTab = true;
    if (filterTab === 'TODAY') {
      matchesTab = apt.date === todayStr;
    } else if (filterTab === 'UPCOMING') {
      matchesTab = apt.date >= todayStr && apt.status !== 'Completed' && apt.status !== 'Cancelled';
    } else if (filterTab === 'COMPLETED') {
      matchesTab = apt.status === 'Completed';
    }

    return matchesSearch && matchesTab;
  });

  // Calendar computations
  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth(); // 0 - 11
  const monthName = currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Monday start: 0 = Mon, 6 = Sun
  const startOffset = (firstDayOfWeek + 6) % 7;

  // Month Statistics
  const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthAppointments = appointments.filter((a) => a.date?.startsWith(currentMonthPrefix));
  const monthTotalRevenue = monthAppointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const monthTotalAdvance = monthAppointments.reduce((sum, a) => sum + (Number(a.depositPaid || a.advancePaid) || 0), 0);
  const monthTotalPending = Math.max(0, monthTotalRevenue - monthTotalAdvance);

  // Selected Day Appointments & Financials
  const dayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === selectedDate)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [appointments, selectedDate]);

  const dayTotalRevenue = dayAppointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const dayTotalAdvance = dayAppointments.reduce((sum, a) => sum + (Number(a.depositPaid || a.advancePaid) || 0), 0);
  const dayTotalPending = Math.max(0, dayTotalRevenue - dayTotalAdvance);

  // Month Navigation
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleJumpToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(todayStr);
  };

  // Day Navigation for Timeline View
  const handlePrevDay = () => {
    const d = new Date((selectedDate || todayStr) + 'T12:00:00');
    if (isNaN(d.getTime())) return;
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date((selectedDate || todayStr) + 'T12:00:00');
    if (isNaN(d.getTime())) return;
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Timeline Hours
  const timelineHours = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00'
  ];

  const formattedSelectedDate = (() => {
    try {
      const d = new Date((selectedDate || todayStr) + 'T12:00:00');
      return isNaN(d.getTime())
        ? selectedDate
        : new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).format(d);
    } catch {
      return selectedDate;
    }
  })();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. TOP HEADER & VIEW SWITCHER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Bookings Schedule</span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl sm:text-3xl text-atelier-noir tracking-tight">
            Bookings & Calendar
          </h2>
          <p className="text-xs text-atelier-muted">
            Switch between list view, monthly studio calendar, and hourly day timeline with advance payment tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Creative View Mode Switcher Pills */}
          <div className="flex items-center bg-atelier-cream/80 p-1 rounded-2xl border border-atelier-champagneBorder shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${viewMode === 'list'
                ? 'bg-white text-atelier-noir shadow-soft border border-atelier-champagneBorder/60'
                : 'text-atelier-muted hover:text-atelier-noir'
                }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-atelier-rose500 shrink-0" />
              <span>List</span>
              <span className="hidden sm:inline">View</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${viewMode === 'calendar'
                ? 'bg-white text-atelier-noir shadow-soft border border-atelier-champagneBorder/60'
                : 'text-atelier-muted hover:text-atelier-noir'
                }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-atelier-rose500 shrink-0" />
              <span>Month</span>
              <span className="hidden sm:inline">Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${viewMode === 'timeline'
                ? 'bg-white text-atelier-noir shadow-soft border border-atelier-champagneBorder/60'
                : 'text-atelier-muted hover:text-atelier-noir'
                }`}
            >
              <Clock className="w-3.5 h-3.5 text-atelier-rose500 shrink-0" />
              <span>Timeline</span>
              <span className="hidden sm:inline">Day</span>
            </button>
          </div>

          {/* Book Appointment CTA */}
          <button
            onClick={() => onOpenNewAppointment(selectedDate ? { date: selectedDate } : null)}
            className="px-3.5 sm:px-4 py-2 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Book Appointment</span>
            <span className="xs:hidden">Book</span>
          </button>
        </div>
      </div>

      {/* 2. EMERGENCY REPAIR QUEUE (If any active) */}
      {repairs.length > 0 && (
        <div className="bg-rose-50/70 rounded-3xl p-5 border border-rose-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-base text-atelier-noir">
                  Emergency Repair Queue
                </h3>
                <span className="text-[10px] text-rose-700">
                  {repairs.filter((r) => r.status === 'Pending Squeeze-in').length} urgent request(s) awaiting squeeze-in confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {repairs.map((repair) => (
              <div
                key={repair.id}
                className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic font-bold text-sm text-atelier-noir">
                      {repair.clientName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${repair.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-700'
                        }`}
                    >
                      {repair.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-atelier-muted">
                    <span className="font-semibold text-atelier-rose600">
                      {repair.hand || ''} • {repair.finger}
                    </span>
                    <span>•</span>
                    <span className="text-atelier-charcoal">{repair.serviceType}</span>
                  </div>

                  {repair.issue && (
                    <p className="text-[11px] text-atelier-charcoal bg-atelier-cream/50 p-2 rounded-xl border border-atelier-champagneBorder/60">
                      {repair.issue}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-atelier-muted pt-1">
                    <span>
                      Urgency: <strong className="text-rose-700">{repair.urgency}</strong>
                    </span>
                    <span>{repair.clientPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-atelier-champagneBorder/60 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${repair.clientPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose50 text-atelier-charcoal hover:text-atelier-rose600 font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3 h-3 text-atelier-rose500" />
                    <span>Call Client</span>
                  </a>

                  {repair.status !== 'Resolved' ? (
                    <button
                      onClick={() => onUpdateRepairStatus && onUpdateRepairStatus(repair.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-all shadow-xs"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Squeezed In</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-medium">Repair Complete</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: CREATIVE MONTH CALENDAR VIEW
          ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Month Financial & Booking KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-white border border-atelier-champagneBorder shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                Month Sessions
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-serif font-bold text-2xl text-atelier-noir">
                  {monthAppointments.length}
                </span>
                <span className="text-[11px] text-atelier-muted">booked</span>
              </div>
              <span className="text-[10px] text-atelier-rose600 font-semibold mt-1 block">
                {monthName}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-atelier-champagneBorder shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
                Month Revenue
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-atelier-muted font-bold">{currency}</span>
                <span className="font-serif font-bold text-2xl text-atelier-noir">
                  {monthTotalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-atelier-muted mt-1 block">
                Total booking value
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-200/70 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-600" />
                <span>Advance Collected</span>
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-emerald-600 font-bold">{currency}</span>
                <span className="font-serif font-bold text-2xl text-emerald-700">
                  {monthTotalAdvance.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                Secured upfront deposit
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-200/70 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Pending to Collect</span>
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-amber-600 font-bold">{currency}</span>
                <span className="font-serif font-bold text-2xl text-amber-700">
                  {monthTotalPending.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                Due upon completion
              </span>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-atelier-champagneBorder shadow-soft space-y-4">
            {/* Calendar Month Header & Navigation Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
              <div className="flex items-center gap-3">
                <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-atelier-noir">
                  {monthName}
                </h3>
                <button
                  onClick={handleJumpToday}
                  className="px-2.5 py-1 rounded-xl bg-atelier-cream hover:bg-atelier-rose100 text-atelier-charcoal text-[11px] font-semibold transition-colors border border-atelier-champagneBorder/60 active:scale-95"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose100 text-atelier-charcoal transition-colors active:scale-95"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose100 text-atelier-charcoal transition-colors active:scale-95"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-atelier-muted uppercase tracking-wider py-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-atelier-rose600">Sat</span>
              <span className="text-atelier-rose600">Sun</span>
            </div>

            {/* Monthly Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Offset days from previous month */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div
                  key={`offset-${i}`}
                  className="min-h-[64px] sm:min-h-[96px] p-1.5 rounded-2xl bg-atelier-cream/20 border border-transparent opacity-30 select-none"
                />
              ))}

              {/* Days of current month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                  dayNum
                ).padStart(2, '0')}`;
                const isToday = dateKey === todayStr;
                const isSelected = dateKey === selectedDate;
                const dayApts = appointments.filter((a) => a.date === dateKey);
                const hasAdvance = dayApts.some((a) => (Number(a.depositPaid || a.advancePaid) || 0) > 0);

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`min-h-[50px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${isSelected
                      ? 'border-atelier-rose500 bg-atelier-rose50/60 ring-2 ring-atelier-rose300 shadow-sm'
                      : isToday
                        ? 'border-atelier-rose300 bg-atelier-rose50/30'
                        : dayApts.length > 0
                          ? 'border-atelier-champagneBorder hover:border-atelier-rose300 bg-white'
                          : 'border-atelier-champagneBorder/50 hover:bg-atelier-cream/40 bg-white/70'
                      }`}
                  >
                    {/* Top Row: Date Number & Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isToday
                          ? 'bg-atelier-rose500 text-white font-bold shadow-soft'
                          : isSelected
                            ? 'bg-atelier-noir text-white font-bold'
                            : 'text-atelier-charcoal group-hover:text-atelier-rose600'
                          }`}
                      >
                        {dayNum}
                      </span>

                      {/* Advance indicator dot or Count */}
                      <div className="flex items-center gap-1">
                        {hasAdvance && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                            title="Advance payment secured for this day"
                          />
                        )}
                        {dayApts.length > 0 && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${isSelected
                              ? 'bg-atelier-rose500 text-white'
                              : 'bg-atelier-rose100 text-atelier-rose700'
                              }`}
                          >
                            {dayApts.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Mini Client Chips (Desktop & Tablet) */}
                    <div className="hidden sm:flex flex-col gap-1 my-1 overflow-hidden">
                      {dayApts.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className={`text-[9px] px-1.5 py-0.5 rounded-md truncate font-medium flex items-center justify-between ${apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                            : (apt.depositPaid || apt.advancePaid) > 0
                              ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                              : 'bg-stone-50 text-stone-700 border border-stone-200/50'
                            }`}
                        >
                          <span className="truncate">{(apt.clientName || 'Client').split(' ')[0]}</span>
                          <span className="font-mono text-[8px] opacity-80 shrink-0 ml-0.5">
                            {apt.time}
                          </span>
                        </div>
                      ))}
                      {dayApts.length > 2 && (
                        <span className="text-[9px] text-atelier-muted font-bold text-center block">
                          +{dayApts.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Mobile: Simple Dot Indicators */}
                    <div className="sm:hidden flex items-center justify-center gap-1 pt-1">
                      {dayApts.slice(0, 3).map((apt, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${apt.status === 'Completed'
                            ? 'bg-emerald-500'
                            : (apt.depositPaid || apt.advancePaid) > 0
                              ? 'bg-atelier-rose500'
                              : 'bg-amber-500'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. SELECTED DAY SCHEDULE BREAKDOWN PANEL */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-atelier-champagneBorder/60">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-rose600 block">
                  Day Schedule Details
                </span>
                <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
                  {formattedSelectedDate}
                </h3>
                <p className="text-xs text-atelier-muted">
                  {dayAppointments.length} session{dayAppointments.length === 1 ? '' : 's'} scheduled • Total value: {currency}
                  {dayTotalRevenue.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Day Advance / Pending Summary Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {dayTotalAdvance > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advance: {currency}{dayTotalAdvance.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {dayTotalPending > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pending: {currency}{dayTotalPending.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <button
                  onClick={() => onOpenNewAppointment({ date: selectedDate })}
                  className="px-3.5 py-1.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center gap-1 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book on {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </button>
              </div>
            </div>

            {dayAppointments.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h4 className="font-serif italic font-semibold text-base text-atelier-noir">
                  No Appointments Scheduled on This Date
                </h4>
                <p className="text-xs text-atelier-muted max-w-sm mx-auto">
                  The studio schedule is completely open on {formattedSelectedDate}. You can schedule a client appointment or block this time.
                </p>
                <button
                  onClick={() => onOpenNewAppointment({ date: selectedDate })}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold hover:bg-atelier-rose600 shadow-soft"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Client for This Day</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {dayAppointments.map((apt) => {
                  const client = clients.find((c) => c.id === apt.clientId);
                  const advanceAmt = Number(apt.depositPaid || apt.advancePaid) || 0;
                  const balanceDue = Math.max(0, (Number(apt.price) || 0) - advanceAmt);

                  return (
                    <div
                      key={apt.id}
                      className="p-4 sm:p-5 rounded-2xl border border-atelier-champagneBorder hover:border-atelier-rose300 bg-white transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Time & Client Details */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-atelier-rose50 border border-atelier-rose200/70 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="font-bold text-xs text-atelier-noir">{apt.time}</span>
                          <span className="text-[10px] text-atelier-muted">{apt.duration}m</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              onClick={() => client && onOpenClientProfile(client)}
                              className="font-serif italic font-bold text-base text-atelier-noir hover:text-atelier-rose600 cursor-pointer transition-colors"
                            >
                              {apt.clientName}
                            </h4>
                            {client?.vip && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                VIP
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apt.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : apt.status === 'In Progress'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-atelier-charcoal">
                            {apt.serviceName}
                          </p>

                          <div className="flex items-center gap-2 text-[11px] text-atelier-muted">
                            <span>{apt.clientPhone}</span>
                            {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-atelier-rose600 font-medium">
                                  +{apt.addonServiceNames.length} add-on{apt.addonServiceNames.length === 1 ? '' : 's'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Advance & Pending Payment Badges + Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-atelier-champagneBorder/60">
                        {/* Financial Advance & Pending Breakdown */}
                        <div className="text-left md:text-right space-y-0.5">
                          <span className="font-serif italic font-bold text-lg text-atelier-noir block">
                            {currency}{Number(apt.price).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {advanceAmt > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                <Check className="w-2.5 h-2.5" />
                                <span>{currency}{advanceAmt.toLocaleString('en-IN')} Advance</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                                No Advance
                              </span>
                            )}

                            {balanceDue > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                                <span>{currency}{balanceDue.toLocaleString('en-IN')} Due</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Fully Paid
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {client?.phone && (
                            <a
                              href={`tel:${client.phone}`}
                              className="p-2 sm:p-1.5 rounded-xl bg-atelier-cream hover:bg-atelier-rose50 text-atelier-charcoal hover:text-atelier-rose600 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                              title="Call Client"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            onClick={() => onRemindAppointment(apt)}
                            title="Ping phone reminder via ntfy"
                            className="p-2 sm:p-1.5 rounded-xl bg-atelier-rose50 hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenNewInvoice(apt)}
                            title="Generate Invoice (applies advance credit automatically)"
                            className="p-2 sm:p-1.5 rounded-xl bg-white hover:bg-atelier-cream text-atelier-charcoal border border-atelier-champagneBorder transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                          >
                            <Receipt className="w-3.5 h-3.5 text-atelier-noir" />
                          </button>

                          <button
                            onClick={() => onEditAppointment(apt)}
                            className="p-2 sm:p-1.5 rounded-xl hover:bg-atelier-cream text-atelier-muted hover:text-atelier-noir transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                            title="Edit Appointment Details / Advance Payment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteAppointment(apt.id)}
                            className="p-2 sm:p-1.5 rounded-xl hover:bg-red-50 text-atelier-muted hover:text-red-500 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                            title="Cancel / Delete Appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DAY TIMELINE HOURLY VIEW
          ========================================================================= */}
      {viewMode === 'timeline' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Day Navigation & Daily Summary Banner */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-atelier-champagneBorder shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-atelier-champagneBorder/60">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  className="p-2 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose100 text-atelier-charcoal transition-colors active:scale-95"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div>
                  <h3 className="font-serif italic font-bold text-xl sm:text-2xl text-atelier-noir">
                    {formattedSelectedDate}
                  </h3>
                  <span className="text-[11px] text-atelier-muted block">
                    {selectedDate === todayStr ? "Today's Live Schedule" : 'Scheduled Studio Day'}
                  </span>
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-2 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose100 text-atelier-charcoal transition-colors active:scale-95"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleJumpToday}
                  className="ml-2 px-2.5 py-1 rounded-xl bg-atelier-cream hover:bg-atelier-rose100 text-atelier-charcoal text-[11px] font-semibold transition-colors border border-atelier-champagneBorder/60 active:scale-95"
                >
                  Today
                </button>
              </div>

              {/* Day Financial Metrics */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="p-2.5 px-3 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder">
                  <span className="text-[10px] text-atelier-muted font-bold uppercase tracking-wider block">Total Billed</span>
                  <span className="font-serif font-bold text-base text-atelier-noir">{currency}{dayTotalRevenue.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Advance Paid</span>
                  <span className="font-serif font-bold text-base text-emerald-700">{currency}{dayTotalAdvance.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-2.5 px-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Pending Due</span>
                  <span className="font-serif font-bold text-base text-amber-700">{currency}{dayTotalPending.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Hourly Timeline Grid */}
            <div className="space-y-3 pt-2">
              {timelineHours.map((hour) => {
                const hourPrefix = hour.slice(0, 2);
                const matchingApts = dayAppointments.filter((a) => (a.time || '').startsWith(hourPrefix));

                return (
                  <div key={hour} className="flex items-start gap-3 sm:gap-4 group">
                    {/* Time Column Gutter */}
                    <div className="w-14 sm:w-16 pt-3 text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-atelier-charcoal group-hover:text-atelier-rose600 transition-colors">
                        {hour}
                      </span>
                    </div>

                    {/* Timeline Content Block */}
                    <div className="flex-1 min-w-0">
                      {matchingApts.length > 0 ? (
                        <div className="space-y-2.5">
                          {matchingApts.map((apt) => {
                            const client = clients.find((c) => c.id === apt.clientId);
                            const advanceAmt = Number(apt.depositPaid || apt.advancePaid) || 0;
                            const balanceDue = Math.max(0, (Number(apt.price) || 0) - advanceAmt);

                            return (
                              <div
                                key={apt.id}
                                className="p-4 rounded-2xl border border-atelier-rose200 bg-gradient-to-r from-atelier-rose50/40 via-white to-white shadow-xs hover:shadow-soft transition-all space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-atelier-rose500 text-white shadow-xs">
                                        {apt.time} ({apt.duration} min)
                                      </span>
                                      <h4
                                        onClick={() => client && onOpenClientProfile(client)}
                                        className="font-serif italic font-bold text-base text-atelier-noir hover:text-atelier-rose600 cursor-pointer"
                                      >
                                        {apt.clientName}
                                      </h4>
                                      {client?.vip && (
                                        <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                          VIP
                                        </span>
                                      )}
                                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-atelier-cream text-atelier-charcoal border border-atelier-champagneBorder">
                                        {apt.status}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-atelier-charcoal">
                                      {apt.serviceName}
                                    </p>
                                  </div>

                                  {/* Financial tags in timeline */}
                                  <div className="text-left sm:text-right space-y-0.5">
                                    <span className="font-serif italic font-bold text-base text-atelier-noir block">
                                      {currency}{Number(apt.price).toLocaleString('en-IN')}
                                    </span>
                                    <div className="flex items-center sm:justify-end gap-1.5 flex-wrap">
                                      {advanceAmt > 0 && (
                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                          ₹{advanceAmt} Advance
                                        </span>
                                      )}
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${balanceDue > 0 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-emerald-700 bg-emerald-50'}`}>
                                        {balanceDue > 0 ? `₹${balanceDue} Due` : 'Fully Paid'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {apt.notes && (
                                  <p className="text-[11px] text-atelier-muted italic bg-white/70 p-2 rounded-xl border border-atelier-champagneBorder/50">
                                    "{apt.notes}"
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-atelier-champagneBorder/50 text-xs">
                                  <div className="flex items-center gap-2 text-[11px] text-atelier-muted">
                                    <Phone className="w-3 h-3 text-atelier-rose400" />
                                    <span>{apt.clientPhone}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => onRemindAppointment(apt)}
                                      className="px-2.5 py-1 rounded-xl bg-atelier-rose50 text-atelier-rose600 border border-atelier-rose200 text-[11px] font-semibold flex items-center gap-1 hover:bg-atelier-rose100 transition-colors"
                                    >
                                      <Bell className="w-3 h-3" />
                                      <span>Alert</span>
                                    </button>
                                    <button
                                      onClick={() => onOpenNewInvoice(apt)}
                                      className="px-2.5 py-1 rounded-xl bg-white text-atelier-charcoal border border-atelier-champagneBorder text-[11px] font-semibold flex items-center gap-1 hover:bg-atelier-cream transition-colors"
                                    >
                                      <Receipt className="w-3 h-3 text-atelier-noir" />
                                      <span>Bill</span>
                                    </button>
                                    <button
                                      onClick={() => onEditAppointment(apt)}
                                      className="p-1 rounded-lg hover:bg-atelier-cream text-atelier-muted"
                                      title="Edit Appointment"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          onClick={() => onOpenNewAppointment({ date: selectedDate, time: hour })}
                          className="h-11 rounded-2xl border border-dashed border-atelier-champagneBorder/80 hover:border-atelier-rose300 bg-atelier-cream/20 hover:bg-atelier-rose50/40 px-4 flex items-center justify-between text-xs text-atelier-muted hover:text-atelier-rose600 cursor-pointer transition-all group/slot"
                        >
                          <span className="text-[11px] font-medium">Slot Available ({hour})</span>
                          <span className="text-[11px] font-semibold flex items-center gap-1 opacity-0 group-hover/slot:opacity-100 transition-opacity text-atelier-rose600">
                            <Plus className="w-3 h-3" />
                            <span>Book Session</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: DETAILED LIST VIEW (With Advance & Pending Badges)
          ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Filter Tabs & Search */}
          <div className="bg-white rounded-2xl p-4 border border-atelier-champagneBorder shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-atelier-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search appointments by client name, service, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-atelier-cream/50 border border-atelier-champagneBorder focus:bg-white focus:border-atelier-rose400 outline-none text-base sm:text-xs"
              />
            </div>

            {/* Tab Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
              {[
                { id: 'ALL', label: 'All Bookings' },
                { id: 'TODAY', label: "Today's Schedule" },
                { id: 'UPCOMING', label: 'Upcoming' },
                { id: 'COMPLETED', label: 'Completed' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${filterTab === tab.id
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : 'bg-atelier-cream/60 text-atelier-charcoal hover:bg-atelier-rose50'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-atelier-champagneBorder text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <p className="font-serif italic font-semibold text-lg text-atelier-noir">
                No Appointments Found
              </p>
              <p className="text-xs text-atelier-muted max-w-sm mx-auto">
                No bookings match the selected criteria. Create a new booking to populate your calendar.
              </p>
              <button
                onClick={onOpenNewAppointment}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold hover:bg-atelier-rose600 shadow-soft"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((apt) => {
                const client = clients.find((c) => c.id === apt.clientId);
                const isToday = apt.date === todayStr;
                const advanceAmt = Number(apt.depositPaid || apt.advancePaid) || 0;
                const balanceDue = Math.max(0, (Number(apt.price) || 0) - advanceAmt);

                return (
                  <div
                    key={apt.id}
                    className={`bg-white rounded-3xl p-5 border transition-all shadow-sm hover:shadow-soft ${isToday
                      ? 'border-atelier-rose300/80 bg-gradient-to-r from-atelier-rose50/30 to-white'
                      : 'border-atelier-champagneBorder'
                      }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Date/Time Badge + Service Info */}
                      <div className="flex items-start gap-4">
                        {/* Date/Time Column */}
                        <div className="w-16 h-16 rounded-2xl bg-atelier-rose50 border border-atelier-rose200 flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-[10px] font-bold text-atelier-rose600 uppercase tracking-wider">
                            {(() => {
                              try {
                                const d = new Date((apt.date || todayStr) + 'T12:00:00');
                                return isNaN(d.getTime())
                                  ? apt.date || 'Today'
                                  : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
                              } catch {
                                return apt.date || 'Today';
                              }
                            })()}
                          </span>
                          <span className="font-bold text-xs text-atelier-noir mt-0.5">{apt.time}</span>
                          <span className="text-[9px] text-atelier-muted">{apt.duration} min</span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              onClick={() => client && onOpenClientProfile(client)}
                              className="font-serif italic font-bold text-lg text-atelier-noir hover:text-atelier-rose600 cursor-pointer transition-colors"
                            >
                              {apt.clientName}
                            </h3>
                            {client?.vip && (
                              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                VIP
                              </span>
                            )}
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-atelier-rose100 text-atelier-rose600">
                                Today
                              </span>
                            )}
                            <select
                              value={apt.status}
                              onChange={(e) => onUpdateStatus(apt.id, e.target.value)}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-atelier-champagneBorder bg-white cursor-pointer outline-none"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="No Show">No Show</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-atelier-charcoal font-medium">
                            <span className="font-semibold text-atelier-noir">
                              {apt.serviceName}
                            </span>
                            <span>•</span>
                            <span className="text-atelier-muted">{apt.clientPhone}</span>
                          </div>

                          {/* Add-ons Chips */}
                          {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {apt.addonServiceNames.map((addon, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-atelier-cream border border-atelier-champagneBorder text-[10px] text-atelier-muted font-medium"
                                >
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}

                          {apt.notes && (
                            <p className="text-[11px] text-atelier-muted italic">
                              "{apt.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Advance Payment & Pending Financial Breakdown + Actions */}
                      <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-atelier-champagneBorder/40">
                        <div className="text-left lg:text-right space-y-1">
                          <span className="font-serif italic font-bold text-xl text-atelier-noir block">
                            {currency}{Number(apt.price).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center lg:justify-end gap-1.5 flex-wrap">
                            {advanceAmt > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                <Check className="w-2.5 h-2.5" />
                                <span>{currency}{advanceAmt.toLocaleString('en-IN')} Advance</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                                No Advance
                              </span>
                            )}

                            {balanceDue > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                                <span>{currency}{balanceDue.toLocaleString('en-IN')} Due</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Fully Paid
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Send Phone Alert Now */}
                          <button
                            onClick={() => onRemindAppointment(apt)}
                            title="Send immediate reminder to Sirii's phone via ntfy"
                            className="px-3 py-1.5 rounded-xl bg-atelier-rose50 hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Phone Alert</span>
                          </button>

                          {/* Create Invoice */}
                          <button
                            onClick={() => onOpenNewInvoice(apt)}
                            title="Generate Invoice (applies advance payment as deduction)"
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-atelier-cream text-atelier-charcoal border border-atelier-champagneBorder text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                          >
                            <Receipt className="w-3.5 h-3.5 text-atelier-rose500" />
                            <span className="hidden sm:inline">Invoice</span>
                          </button>

                          {/* Edit / Update Advance */}
                          <button
                            onClick={() => onEditAppointment(apt)}
                            className="p-2 sm:p-1.5 rounded-xl hover:bg-atelier-cream text-atelier-muted hover:text-atelier-noir transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                            title="Edit Booking or Update Advance Payment"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteAppointment(apt.id)}
                            className="p-2 sm:p-1.5 rounded-xl hover:bg-red-50 text-atelier-muted hover:text-red-500 transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
                            title="Cancel Booking"
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
      )}
    </div>
  );
}
