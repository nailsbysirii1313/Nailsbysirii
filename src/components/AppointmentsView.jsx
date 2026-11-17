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
  CalendarHeart,
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
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { getKolkataTodayString, formatKolkataDate, STUDIO_OPENING_TIME, STUDIO_CLOSING_TIME } from '../utils/dateTime';

export default function AppointmentsView({
  appointments = [],
  clients = [],
  settings = {},
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
  const todayStr = getKolkataTodayString();

  // View Switcher Mode: 'list' | 'calendar' | 'timeline'
  const [viewMode, setViewMode] = useState('list');

  // List View Filter & Search
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, TODAY, UPCOMING, COMPLETED
  const [search, setSearch] = useState('');

  // Calendar & Timeline Selected Date State
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Filtered appointments for list view
  const filtered = useMemo(() => {
    return appointments.filter((apt) => {
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
  }, [appointments, search, filterTab, todayStr]);

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
  const monthAppointments = useMemo(() => {
    return appointments.filter((a) => a.date?.startsWith(currentMonthPrefix));
  }, [appointments, currentMonthPrefix]);

  const monthTotalRevenue = useMemo(() => {
    return monthAppointments.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  }, [monthAppointments]);

  const monthTotalAdvance = useMemo(() => {
    return monthAppointments.reduce((sum, a) => sum + (Number(a.depositPaid || a.advancePaid) || 0), 0);
  }, [monthAppointments]);

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

  // Timeline Hours: Aligned to studio operating hours (12:00 PM – 7:00 PM IST)
  const timelineHours = [
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
        : new Intl.DateTimeFormat('en-IN', {
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
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. TOP HEADER & VIEW SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <CalendarHeart className="w-3.5 h-3.5 text-brand-wine" />
            <span>Studio Calendar & Appointments</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-text-ink tracking-tight">
            Schedule & Bookings
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Manage client appointments, view daily timeline schedules (12:00 PM – 7:00 PM), and track upfront advance deposits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher Pills */}
          <div className="flex items-center bg-studio-canvas p-1 rounded-2xl border border-border-subtle shadow-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
                viewMode === 'list'
                  ? 'bg-studio-surface text-text-ink shadow-studio border border-border-subtle font-bold'
                  : 'text-text-muted hover:text-text-ink'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5 text-brand-wine shrink-0" />
              <span>List View</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
                viewMode === 'calendar'
                  ? 'bg-studio-surface text-text-ink shadow-studio border border-border-subtle font-bold'
                  : 'text-text-muted hover:text-text-ink'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-brand-wine shrink-0" />
              <span>Month Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
                viewMode === 'timeline'
                  ? 'bg-studio-surface text-text-ink shadow-studio border border-border-subtle font-bold'
                  : 'text-text-muted hover:text-text-ink'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-brand-wine shrink-0" />
              <span>Day Timeline</span>
            </button>
          </div>

          {/* Book Appointment CTA */}
          <button
            onClick={() => onOpenNewAppointment && onOpenNewAppointment(selectedDate ? { date: selectedDate } : null)}
            className="px-4 py-2.5 rounded-2xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. EMERGENCY REPAIR QUEUE (If any active) */}
      {repairs.length > 0 && (
        <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-text-ink">
                  Emergency Repair Queue
                </h3>
                <span className="text-xs text-amber-800">
                  {repairs.filter((r) => r.status === 'Pending Squeeze-in').length} urgent repair request(s) awaiting squeeze-in confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {repairs.map((repair) => (
              <div
                key={repair.id}
                className="bg-studio-surface p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-2.5 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-sm text-text-ink">
                      {repair.clientName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        repair.status === 'Resolved'
                          ? 'bg-status-emeraldBg text-status-emerald'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {repair.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="font-semibold text-brand-wine">
                      {repair.hand || ''} • {repair.finger}
                    </span>
                    <span>•</span>
                    <span>{repair.serviceType}</span>
                  </div>

                  {repair.issue && (
                    <p className="text-xs text-text-secondary bg-studio-canvas p-2.5 rounded-xl border border-border-subtle">
                      "{repair.issue}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-text-muted pt-1">
                    <span>
                      Urgency: <strong className="text-amber-800 font-bold">{repair.urgency}</strong>
                    </span>
                    <span className="font-mono">{repair.clientPhone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between gap-2">
                  <a
                    href={`tel:${repair.clientPhone}`}
                    className="px-3 py-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink font-semibold text-xs flex items-center gap-1.5 transition-colors min-h-[38px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-wine" />
                    <span>Call Client</span>
                  </a>

                  {repair.status !== 'Resolved' ? (
                    <button
                      onClick={() => onUpdateRepairStatus && onUpdateRepairStatus(repair.id, 'Resolved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs min-h-[38px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Squeezed In</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-medium">Repair Complete</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: MONTH CALENDAR VIEW
          ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          {/* Month Financial & Booking KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-3xl bg-studio-surface border border-border-subtle shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Month Bookings
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="font-display font-bold text-2xl text-text-ink">
                  {monthAppointments.length}
                </span>
                <span className="text-xs text-text-muted">sessions</span>
              </div>
              <span className="text-[10px] text-brand-wine font-semibold mt-1 block">
                {monthName}
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-studio-surface border border-border-subtle shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Estimated Value
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-text-muted font-bold">{currency}</span>
                <span className="font-display font-bold text-2xl text-text-ink">
                  {monthTotalRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-text-muted mt-1 block">
                Total scheduled value
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-700" />
                <span>Advance Collected</span>
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-emerald-700 font-bold">{currency}</span>
                <span className="font-display font-bold text-2xl text-emerald-800">
                  {monthTotalAdvance.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                Secured upfront deposits
              </span>
            </div>

            <div className="p-4 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>Pending Balance</span>
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xs text-amber-700 font-bold">{currency}</span>
                <span className="font-display font-bold text-2xl text-amber-800">
                  {monthTotalPending.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                Due upon completion
              </span>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-studio-surface rounded-3xl p-4 sm:p-6 border border-border-subtle shadow-studio space-y-4">
            {/* Calendar Month Header & Navigation Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-xl sm:text-2xl text-text-ink">
                  {monthName}
                </h3>
                <button
                  onClick={handleJumpToday}
                  className="px-3 py-1.5 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink text-xs font-semibold transition-colors border border-border-subtle active:scale-95"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink transition-colors active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center border border-border-subtle"
                  title="Previous Month"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink transition-colors active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center border border-border-subtle"
                  title="Next Month"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Column Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-text-muted uppercase tracking-wider py-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-brand-wine">Sat</span>
              <span className="text-brand-wine">Sun</span>
            </div>

            {/* Monthly Calendar Grid Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {/* Offset days from previous month */}
              {Array.from({ length: startOffset }).map((_, i) => (
                <div
                  key={`offset-${i}`}
                  className="min-h-[50px] sm:min-h-[96px] p-1.5 rounded-2xl bg-studio-canvas/40 border border-transparent opacity-40 select-none"
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
                    className={`min-h-[56px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'border-brand-wine bg-brand-wineLight ring-2 ring-brand-wine/20 shadow-xs'
                        : isToday
                        ? 'border-brand-wine/40 bg-studio-subtle'
                        : dayApts.length > 0
                        ? 'border-border-strong hover:border-brand-wine bg-studio-surface'
                        : 'border-border-subtle/80 hover:bg-studio-canvas bg-studio-surface/60'
                    }`}
                  >
                    {/* Top Row: Date Number & Badges */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                          isToday
                            ? 'bg-brand-wine text-white font-bold shadow-xs'
                            : isSelected
                            ? 'bg-text-ink text-white font-bold'
                            : 'text-text-ink group-hover:text-brand-wine'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Advance indicator dot or Count */}
                      <div className="flex items-center gap-1">
                        {hasAdvance && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"
                            title="Advance payment secured"
                          />
                        )}
                        {dayApts.length > 0 && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              isSelected
                                ? 'bg-brand-wine text-white'
                                : 'bg-studio-subtle text-brand-wine border border-border-subtle'
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
                          className={`text-[10px] px-2 py-0.5 rounded-lg truncate font-medium flex items-center justify-between ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : (apt.depositPaid || apt.advancePaid) > 0
                              ? 'bg-brand-wineLight text-brand-wine border border-brand-wine/20'
                              : 'bg-stone-50 text-stone-700 border border-stone-200'
                          }`}
                        >
                          <span className="truncate">{(apt.clientName || 'Client').split(' ')[0]}</span>
                          <span className="font-mono text-[9px] opacity-80 shrink-0 ml-1">
                            {apt.time}
                          </span>
                        </div>
                      ))}
                      {dayApts.length > 2 && (
                        <span className="text-[9px] text-text-muted font-bold text-center block">
                          +{dayApts.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Mobile: Simple Dot Indicators */}
                    <div className="sm:hidden flex items-center justify-center gap-1 pt-1">
                      {dayApts.slice(0, 3).map((apt, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-600'
                              : (apt.depositPaid || apt.advancePaid) > 0
                              ? 'bg-brand-wine'
                              : 'bg-amber-600'
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
          <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-border-subtle shadow-studio space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine block">
                  Day Schedule Details
                </span>
                <h3 className="font-display font-semibold text-xl text-text-ink">
                  {formattedSelectedDate}
                </h3>
                <p className="text-xs text-text-muted">
                  {dayAppointments.length} session{dayAppointments.length === 1 ? '' : 's'} scheduled • Total value: {currency}
                  {dayTotalRevenue.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Day Advance / Pending Summary Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {dayTotalAdvance > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Advance: {currency}{dayTotalAdvance.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {dayTotalPending > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pending: {currency}{dayTotalPending.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <button
                  onClick={() => onOpenNewAppointment && onOpenNewAppointment({ date: selectedDate })}
                  className="px-4 py-2 rounded-xl bg-brand-wine hover:bg-brand-wineHover text-white text-xs font-semibold shadow-studio transition-all flex items-center gap-1.5 active:scale-95 min-h-[40px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book for This Day</span>
                </button>
              </div>
            </div>

            {dayAppointments.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <h4 className="font-display font-semibold text-base text-text-ink">
                  No Appointments Scheduled on This Date
                </h4>
                <p className="text-xs text-text-muted max-w-sm mx-auto">
                  The studio schedule is completely open on {formattedSelectedDate}. You can schedule a client appointment or block this time.
                </p>
                <button
                  onClick={() => onOpenNewAppointment && onOpenNewAppointment({ date: selectedDate })}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wineHover shadow-studio min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
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
                      className="p-4 sm:p-5 rounded-2xl border border-border-subtle hover:border-border-strong bg-studio-surface transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Time & Client Details */}
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-studio-canvas border border-border-subtle flex flex-col items-center justify-center text-center shrink-0">
                          <span className="font-bold text-xs text-text-ink">{apt.time}</span>
                          <span className="text-[10px] text-text-muted">{apt.duration}m</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              onClick={() => client && onOpenClientProfile && onOpenClientProfile(client)}
                              className="font-display font-semibold text-base text-text-ink hover:text-brand-wine cursor-pointer transition-colors"
                            >
                              {apt.clientName}
                            </h4>
                            {client?.vip && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                VIP
                              </span>
                            )}
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.status === 'Completed'
                                  ? 'bg-status-emeraldBg text-status-emerald'
                                  : apt.status === 'In Progress'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-brand-wineLight text-brand-wine border border-brand-wine/20'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-text-secondary">
                            {apt.serviceName}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="font-mono">{apt.clientPhone}</span>
                            {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-brand-wine font-medium">
                                  +{apt.addonServiceNames.length} add-on{apt.addonServiceNames.length === 1 ? '' : 's'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Advance & Pending Payment Badges + Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-border-subtle">
                        {/* Financial Advance & Pending Breakdown */}
                        <div className="text-left md:text-right space-y-0.5">
                          <span className="font-display font-bold text-lg text-text-ink block">
                            {currency}{Number(apt.price).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {advanceAmt > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <Check className="w-3 h-3" />
                                <span>{currency}{advanceAmt.toLocaleString('en-IN')} Advance</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-studio-canvas text-text-muted text-[10px] font-medium border border-border-subtle">
                                No Advance
                              </span>
                            )}

                            {balanceDue > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                                <span>{currency}{balanceDue.toLocaleString('en-IN')} Due</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-bold">
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
                              className="p-2.5 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink hover:text-brand-wine transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
                              title="Call Client"
                              aria-label="Call Client"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => onRemindAppointment && onRemindAppointment(apt)}
                            title="Ping phone reminder via ntfy"
                            aria-label="Send reminder"
                            className="p-2.5 rounded-xl bg-brand-wineLight hover:bg-studio-subtle text-brand-wine border border-brand-wine/20 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                          >
                            <Bell className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onOpenNewInvoice && onOpenNewInvoice(apt)}
                            title="Generate Invoice (applies advance credit automatically)"
                            aria-label="Create invoice"
                            className="p-2.5 rounded-xl bg-studio-surface hover:bg-studio-canvas text-text-ink border border-border-subtle transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center shadow-xs"
                          >
                            <Receipt className="w-4 h-4 text-brand-wine" />
                          </button>

                          <button
                            onClick={() => onEditAppointment && onEditAppointment(apt)}
                            className="p-2.5 rounded-xl hover:bg-studio-canvas text-text-muted hover:text-text-ink transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
                            title="Edit Appointment Details / Advance Payment"
                            aria-label="Edit appointment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteAppointment && onDeleteAppointment(apt.id)}
                            className="p-2.5 rounded-xl hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
                            title="Cancel / Delete Appointment"
                            aria-label="Delete appointment"
                          >
                            <Trash2 className="w-4 h-4" />
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
        <div className="space-y-6">
          {/* Day Navigation & Daily Summary Banner */}
          <div className="bg-studio-surface rounded-3xl p-5 sm:p-6 border border-border-subtle shadow-studio space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink transition-colors active:scale-95 border border-border-subtle min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Previous Day"
                  aria-label="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div>
                  <h3 className="font-display font-semibold text-xl sm:text-2xl text-text-ink">
                    {formattedSelectedDate}
                  </h3>
                  <span className="text-xs text-text-muted block">
                    {selectedDate === todayStr ? "Today's Live Schedule" : 'Scheduled Studio Day'}
                  </span>
                </div>

                <button
                  onClick={handleNextDay}
                  className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink transition-colors active:scale-95 border border-border-subtle min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="Next Day"
                  aria-label="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleJumpToday}
                  className="ml-2 px-3 py-1.5 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink text-xs font-semibold transition-colors border border-border-subtle active:scale-95"
                >
                  Today
                </button>
              </div>

              {/* Day Financial Metrics */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="p-2.5 px-3.5 rounded-2xl bg-studio-canvas border border-border-subtle">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider block">Total Billed</span>
                  <span className="font-display font-bold text-base text-text-ink">{currency}{dayTotalRevenue.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-2.5 px-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Advance Paid</span>
                  <span className="font-display font-bold text-base text-emerald-800">{currency}{dayTotalAdvance.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-2.5 px-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Pending Due</span>
                  <span className="font-display font-bold text-base text-amber-800">{currency}{dayTotalPending.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Operating Hours Banner */}
            <div className="bg-studio-canvas/80 p-3 rounded-2xl border border-border-subtle flex items-center justify-between text-xs text-text-secondary">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-brand-wine" />
                <span>Operating Hours: <strong>12:00 PM – 7:00 PM IST</strong></span>
              </span>
              <span className="text-text-muted hidden sm:inline">Click any open slot below to quickly book</span>
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
                      <span className="font-mono text-xs font-bold text-text-secondary group-hover:text-brand-wine transition-colors">
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
                                className="p-4 rounded-2xl border border-border-subtle bg-gradient-to-r from-brand-wineLight/30 via-studio-surface to-studio-surface shadow-xs hover:shadow-studio transition-all space-y-3"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-wine text-white shadow-xs">
                                        {apt.time} ({apt.duration} min)
                                      </span>
                                      <h4
                                        onClick={() => client && onOpenClientProfile && onOpenClientProfile(client)}
                                        className="font-display font-semibold text-base text-text-ink hover:text-brand-wine cursor-pointer"
                                      >
                                        {apt.clientName}
                                      </h4>
                                      {client?.vip && (
                                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                          VIP
                                        </span>
                                      )}
                                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-studio-canvas text-text-secondary border border-border-subtle">
                                        {apt.status}
                                      </span>
                                    </div>
                                    <p className="text-xs font-semibold text-text-secondary">
                                      {apt.serviceName}
                                    </p>
                                  </div>

                                  {/* Financial tags in timeline */}
                                  <div className="text-left sm:text-right space-y-0.5">
                                    <span className="font-display font-bold text-base text-text-ink block">
                                      {currency}{Number(apt.price).toLocaleString('en-IN')}
                                    </span>
                                    <div className="flex items-center sm:justify-end gap-1.5 flex-wrap">
                                      {advanceAmt > 0 && (
                                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                          ₹{advanceAmt} Advance
                                        </span>
                                      )}
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${balanceDue > 0 ? 'text-amber-800 bg-amber-50 border border-amber-200' : 'text-emerald-800 bg-emerald-50'}`}>
                                        {balanceDue > 0 ? `₹${balanceDue} Due` : 'Fully Paid'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {apt.notes && (
                                  <p className="text-xs text-text-muted italic bg-studio-canvas/60 p-2.5 rounded-xl border border-border-subtle">
                                    "{apt.notes}"
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-xs">
                                  <div className="flex items-center gap-2 text-xs text-text-muted">
                                    <Phone className="w-3.5 h-3.5 text-brand-wine" />
                                    <span className="font-mono">{apt.clientPhone}</span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => onRemindAppointment && onRemindAppointment(apt)}
                                      className="px-3 py-1.5 rounded-xl bg-brand-wineLight text-brand-wine border border-brand-wine/20 text-xs font-semibold flex items-center gap-1 hover:bg-studio-subtle transition-colors min-h-[36px]"
                                    >
                                      <Bell className="w-3.5 h-3.5" />
                                      <span>Alert</span>
                                    </button>
                                    <button
                                      onClick={() => onOpenNewInvoice && onOpenNewInvoice(apt)}
                                      className="px-3 py-1.5 rounded-xl bg-studio-surface text-text-ink border border-border-subtle text-xs font-semibold flex items-center gap-1 hover:bg-studio-canvas transition-colors shadow-xs min-h-[36px]"
                                    >
                                      <Receipt className="w-3.5 h-3.5 text-brand-wine" />
                                      <span>Bill</span>
                                    </button>
                                    <button
                                      onClick={() => onEditAppointment && onEditAppointment(apt)}
                                      className="p-2 rounded-xl hover:bg-studio-canvas text-text-muted hover:text-text-ink border border-border-subtle min-h-[36px] min-w-[36px] flex items-center justify-center"
                                      title="Edit Appointment"
                                      aria-label="Edit appointment"
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
                          onClick={() => onOpenNewAppointment && onOpenNewAppointment({ date: selectedDate, time: hour })}
                          className="h-12 rounded-2xl border border-dashed border-border-subtle hover:border-brand-wine bg-studio-canvas/30 hover:bg-brand-wineLight/30 px-4 flex items-center justify-between text-xs text-text-muted hover:text-brand-wine cursor-pointer transition-all group/slot"
                        >
                          <span className="text-xs font-medium">Slot Available ({hour})</span>
                          <span className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover/slot:opacity-100 transition-opacity text-brand-wine">
                            <Plus className="w-3.5 h-3.5" />
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
        <div className="space-y-4">
          {/* Filter Tabs & Search */}
          <div className="bg-studio-surface rounded-2xl p-4 border border-border-subtle shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search appointments by client name, service, or notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-studio-canvas border border-border-subtle focus:bg-white focus:border-brand-wine outline-none text-base sm:text-xs"
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap min-h-[38px] ${
                    filterTab === tab.id
                      ? 'bg-brand-wine text-white shadow-studio font-bold'
                      : 'bg-studio-canvas text-text-secondary hover:bg-studio-subtle border border-border-subtle'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          {filtered.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-12 border border-border-subtle text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <p className="font-display font-semibold text-lg text-text-ink">
                No Appointments Found
              </p>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                No bookings match the selected criteria. Create a new booking to populate your calendar.
              </p>
              <button
                onClick={() => onOpenNewAppointment && onOpenNewAppointment()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wineHover shadow-studio min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
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
                    className={`bg-studio-surface rounded-3xl p-5 border transition-all shadow-xs hover:shadow-studio ${
                      isToday
                        ? 'border-brand-wine/40 bg-gradient-to-r from-brand-wineLight/30 to-studio-surface'
                        : 'border-border-subtle'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Date/Time Badge + Service Info */}
                      <div className="flex items-start gap-4">
                        {/* Date/Time Column */}
                        <div className="w-16 h-16 rounded-2xl bg-studio-canvas border border-border-subtle flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-[10px] font-bold text-brand-wine uppercase tracking-wider">
                            {(() => {
                              try {
                                const d = new Date((apt.date || todayStr) + 'T12:00:00');
                                return isNaN(d.getTime())
                                  ? apt.date || 'Today'
                                  : new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(d);
                              } catch {
                                return apt.date || 'Today';
                              }
                            })()}
                          </span>
                          <span className="font-bold text-xs text-text-ink mt-0.5">{apt.time}</span>
                          <span className="text-[9px] text-text-muted">{apt.duration} min</span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3
                              onClick={() => client && onOpenClientProfile && onOpenClientProfile(client)}
                              className="font-display font-semibold text-lg text-text-ink hover:text-brand-wine cursor-pointer transition-colors"
                            >
                              {apt.clientName}
                            </h3>
                            {client?.vip && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                VIP
                              </span>
                            )}
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-wine text-white shadow-xs">
                                Today
                              </span>
                            )}
                            <select
                              value={apt.status}
                              onChange={(e) => onUpdateStatus && onUpdateStatus(apt.id, e.target.value)}
                              className="px-3 py-1 rounded-full text-xs font-bold border border-border-subtle bg-studio-canvas text-text-ink cursor-pointer outline-none hover:border-brand-wine focus:ring-1 focus:ring-brand-wine"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="No Show">No Show</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                            <span className="font-semibold text-text-ink">
                              {apt.serviceName}
                            </span>
                            <span>•</span>
                            <span className="text-text-muted font-mono">{apt.clientPhone}</span>
                          </div>

                          {/* Add-ons Chips */}
                          {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {apt.addonServiceNames.map((addon, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-studio-canvas border border-border-subtle text-[10px] text-text-secondary font-medium"
                                >
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}

                          {apt.notes && (
                            <p className="text-xs text-text-muted italic">
                              "{apt.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Advance Payment & Pending Financial Breakdown + Actions */}
                      <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-border-subtle">
                        <div className="text-left lg:text-right space-y-1">
                          <span className="font-display font-bold text-xl text-text-ink block">
                            {currency}{Number(apt.price).toLocaleString('en-IN')}
                          </span>

                          <div className="flex items-center lg:justify-end gap-1.5 flex-wrap">
                            {advanceAmt > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                <Check className="w-3 h-3" />
                                <span>{currency}{advanceAmt.toLocaleString('en-IN')} Advance</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-studio-canvas text-text-muted text-[10px] font-medium border border-border-subtle">
                                No Advance
                              </span>
                            )}

                            {balanceDue > 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                                <span>{currency}{balanceDue.toLocaleString('en-IN')} Due</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                                Fully Paid
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Send Phone Alert Now */}
                          <button
                            onClick={() => onRemindAppointment && onRemindAppointment(apt)}
                            title="Send immediate reminder to Sirii's phone via ntfy"
                            className="px-3.5 py-2 rounded-xl bg-brand-wineLight hover:bg-studio-subtle text-brand-wine border border-brand-wine/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[40px]"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Phone Alert</span>
                          </button>

                          {/* Create Invoice */}
                          <button
                            onClick={() => onOpenNewInvoice && onOpenNewInvoice(apt)}
                            title="Generate Invoice (applies advance payment as deduction)"
                            className="px-3.5 py-2 rounded-xl bg-studio-surface hover:bg-studio-canvas text-text-ink border border-border-subtle text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[40px]"
                          >
                            <Receipt className="w-3.5 h-3.5 text-brand-wine" />
                            <span className="hidden sm:inline">Invoice</span>
                          </button>

                          {/* Edit / Update Advance */}
                          <button
                            onClick={() => onEditAppointment && onEditAppointment(apt)}
                            className="p-2.5 rounded-xl hover:bg-studio-canvas text-text-muted hover:text-text-ink transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
                            title="Edit Booking or Update Advance Payment"
                            aria-label="Edit booking"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteAppointment && onDeleteAppointment(apt.id)}
                            className="p-2.5 rounded-xl hover:bg-rose-50 text-text-muted hover:text-rose-600 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center border border-border-subtle"
                            title="Cancel Booking"
                            aria-label="Delete booking"
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
      )}
    </div>
  );
}
