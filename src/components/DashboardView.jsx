import React, { useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  CreditCard,
  DollarSign,
  Bell,
  Crown,
  ArrowRight,
  CheckCircle2,
  Phone,
  Receipt,
  Plus,
  Package,
  ShieldCheck,
  AlertTriangle,
  CheckSquare,
  Square,
  ChevronRight,
  CalendarClock,
  Sparkles,
  Heart,
  Flame
} from 'lucide-react';
import {
  getKolkataTodayString,
  formatTime12h,
  formatKolkataDate,
  isAppointmentTimePassed,
  isWithin12HoursAfterAppointment,
  isAppointmentActiveInSchedule,
  getRemainingGraceHours
} from '../utils/dateTime';

export default function DashboardView({
  overview,
  appointments = [],
  clients = [],
  invoices = [],
  settings,
  inventory = [],
  checklist = [],
  repairs = [],
  onToggleChecklistItem,
  onRemindAppointment,
  onOpenNewAppointment,
  onEditAppointment,
  onReschedule,
  onOpenNewClient,
  onOpenNewInvoice,
  onOpenInvoiceDetail,
  onOpenClientProfile,
  onUpdateAppointmentStatus,
  onTestAlert,
  onOpenQrModal,
  setTab
}) {
  const todayStr = getKolkataTodayString();
  // Active schedule: includes today's bookings + completed slots that remain visible for 12 hours with reschedule option
  const activeScheduleAppointments = useMemo(() => {
    return appointments
      .filter((a) => isAppointmentActiveInSchedule(a))
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }, [appointments]);
  const todayAppointments = activeScheduleAppointments;
  const pendingAppointments = appointments.filter((a) => a.status === 'Confirmed');

  const currency = settings?.currency || '₹';

  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Partial')
    .reduce((sum, inv) => sum + (Number(inv.balanceDue !== undefined ? inv.balanceDue : inv.total) || 0), 0);

  const pendingRepairs = repairs.filter((r) => r.status === 'Pending Squeeze-in');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16 max-w-7xl">
      {/* 1. Urgent Emergency Broken Nail Squeeze-in Banner */}
      {pendingRepairs.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-brand-wine flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-brand-wine" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                Urgent Squeeze-In Repair Request ({pendingRepairs.length})
              </span>
              <h4 className="font-display font-semibold text-base sm:text-lg text-text-ink mt-0.5">
                {pendingRepairs[0]?.clientName} • {pendingRepairs[0]?.finger} ({pendingRepairs[0]?.hand})
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Client requires urgent repair slot. Studio gap inspection recommended.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {pendingRepairs[0]?.clientPhone && (
              <a
                href={`tel:${pendingRepairs[0].clientPhone}`}
                className="px-4 py-2 rounded-2xl bg-brand-wine text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 min-h-[44px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
            )}
            <button
              onClick={() => setTab('appointments')}
              className="px-4 py-2 rounded-2xl bg-studio-surface border border-border-subtle text-text-ink hover:bg-studio-canvas text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 min-h-[44px]"
            >
              <span>Repairs Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Studio Greeting & Top Quick Action Bar */}
      <div className="bg-studio-surface rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine text-xs font-semibold">
              <Crown className="w-3.5 h-3.5" />
              <span>Studio Operations Hub</span>
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
              Welcome to Nails by Sirii
            </h2>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              You have <span className="font-semibold text-text-ink">{todayAppointments.length} appointment{todayAppointments.length === 1 ? '' : 's'}</span> scheduled for today ({formatKolkataDate(todayStr, { weekday: 'long', month: 'short', day: 'numeric' })}). Studio operating hours are <span className="font-semibold text-text-ink">12:00 PM - 7:00 PM</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQrModal}
              className="px-4 py-2.5 rounded-2xl bg-studio-canvas border border-border-subtle hover:bg-studio-subtle text-text-ink text-xs font-semibold shadow-xs transition-all flex items-center gap-2 min-h-[44px]"
            >
              <Bell className="w-4 h-4 text-brand-wine" />
              <span>Phone Alerts Setup</span>
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="px-5 py-2.5 rounded-2xl bg-brand-wine hover:bg-brand-wine/90 text-white text-xs sm:text-sm font-semibold shadow-studio transition-all flex items-center gap-2 active:scale-95 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4 Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Today's Bookings */}
        <div
          onClick={() => setTab('appointments')}
          className="cursor-pointer bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle hover:border-brand-wine/40 shadow-xs hover:shadow-studio transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
              Today's Schedule
            </span>
            <div className="w-9 h-9 rounded-2xl bg-studio-canvas border border-border-subtle text-brand-wine flex items-center justify-center group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-semibold text-text-ink">
              {todayAppointments.length}
            </span>
            <span className="text-[11px] text-text-muted">sessions</span>
          </div>
          <p className="text-[10px] sm:text-xs text-brand-wine font-medium mt-2 flex items-center gap-1">
            <span>{pendingAppointments.length} confirmed</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Clients */}
        <div
          onClick={() => setTab('clients')}
          className="cursor-pointer bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle hover:border-brand-wine/40 shadow-xs hover:shadow-studio transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
              Client Registry
            </span>
            <div className="w-9 h-9 rounded-2xl bg-studio-canvas border border-border-subtle text-brand-wine flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-semibold text-text-ink">
              {clients.length}
            </span>
            <span className="text-[11px] text-text-muted">registered</span>
          </div>
          <p className="text-[10px] sm:text-xs text-text-muted font-medium mt-2 flex items-center gap-1">
            <span>{clients.filter((c) => c.vip).length} VIP clientele</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 3: Total Studio Revenue */}
        <div
          onClick={() => setTab('invoices')}
          className="cursor-pointer bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle hover:border-brand-wine/40 shadow-xs hover:shadow-studio transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
              Settled Revenue
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 min-w-0 overflow-hidden">
            <span className="text-xs text-text-muted font-semibold shrink-0">{currency}</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-text-ink truncate">
              {totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-amber-800 font-medium mt-2 flex items-center gap-1">
            <span>{currency}{pendingRevenue.toLocaleString('en-IN')} due</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 4: Phone Push Alerts */}
        <div
          onClick={onOpenQrModal}
          className="cursor-pointer bg-studio-surface rounded-3xl p-4 sm:p-5 border border-border-subtle hover:border-brand-wine/40 shadow-xs hover:shadow-studio transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider">
              Phone NTFY
            </span>
            <div className="w-9 h-9 rounded-2xl bg-studio-canvas border border-border-subtle text-brand-wine flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-text-ink">Live Connected</span>
          </div>
          <p className="text-[10px] sm:text-xs text-brand-wine font-medium mt-2 flex items-center gap-1">
            <span>Tap to test ping</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* 4. Main Grid: Today's Appointments & Billing Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-xl text-text-ink">
                Today's Studio Schedule
              </h3>
              <p className="text-xs text-text-muted">
                {activeScheduleAppointments.length} appointment{activeScheduleAppointments.length === 1 ? '' : 's'} scheduled for today
              </p>
            </div>
            <button
              onClick={() => setTab('appointments')}
              className="text-xs font-semibold text-brand-wine hover:underline flex items-center gap-1"
            >
              <span>View Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeScheduleAppointments.length === 0 ? (
            <div className="bg-studio-surface rounded-3xl p-8 border border-border-subtle text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-studio-canvas text-brand-wine flex items-center justify-center border border-border-subtle">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="font-display font-semibold text-base text-text-ink">
                No Appointments Booked Today
              </p>
              <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                Studio opens at 12:00 PM. Ready for walk-in consultations or you can schedule an upcoming client set.
              </p>
              <button
                onClick={onOpenNewAppointment}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-wine text-white text-xs font-semibold hover:bg-brand-wine/90 shadow-studio min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeScheduleAppointments.map((apt) => {
                const client = clients.find((c) => c.id === apt.clientId);
                const depositNum = Number(apt.depositPaid || apt.advancePaid || 0);
                const priceNum = Number(apt.price || 0);
                const balanceDue = Math.max(0, priceNum - depositNum);

                const isPassed = isAppointmentTimePassed(apt);
                const isDone = apt.status === 'Completed' || isPassed;
                const withinGrace = isWithin12HoursAfterAppointment(apt);
                const remainingGraceHours = getRemainingGraceHours(apt);

                return (
                  <div
                    key={apt.id}
                    className={`bg-studio-surface rounded-3xl p-5 border shadow-xs transition-all space-y-3 ${
                      isDone
                        ? 'border-emerald-200/80 bg-emerald-50/15 hover:border-emerald-300'
                        : 'border-border-subtle hover:border-brand-wine/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Time & Client Details */}
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center text-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                            : 'bg-studio-canvas border-border-subtle text-text-ink'
                        }`}>
                          <Clock className={`w-3.5 h-3.5 mb-0.5 ${isDone ? 'text-emerald-700' : 'text-brand-wine'}`} />
                          <span className="font-bold text-xs">{formatTime12h(apt.time) || apt.time}</span>
                          <span className="text-[10px] text-text-muted font-medium">{apt.duration || 60}m</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4
                              onClick={() => client && onOpenClientProfile(client)}
                              className="font-display font-semibold text-base text-text-ink hover:text-brand-wine cursor-pointer transition-colors"
                            >
                              {apt.clientName}
                            </h4>
                            {client?.vip && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                VIP
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                                isDone
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : apt.status === 'In Progress'
                                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                  : 'bg-studio-canvas text-brand-wine border border-border-subtle'
                              }`}
                            >
                              {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                              <span>{isDone ? 'Done' : apt.status}</span>
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-text-muted">
                            {apt.serviceName}
                          </p>

                          {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {apt.addonServiceNames.map((addon, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-studio-canvas text-[10px] font-medium text-text-muted rounded-md border border-border-subtle"
                                >
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}

                          {apt.notes && (
                            <p className="text-xs text-text-muted italic pt-0.5 line-clamp-1">
                              Note: {apt.notes}
                            </p>
                          )}

                          {isDone && withinGrace && (
                            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium pt-1">
                              <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Marked Done at appointment time • Vanishes in {Math.max(1, Math.ceil(remainingGraceHours))}h • Reschedule available</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Pricing & Actions */}
                      <div className="flex flex-col sm:flex-col items-stretch sm:items-end justify-between sm:justify-center gap-2.5 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                        <div className="flex items-center justify-between sm:block text-right">
                          <span className="text-xs text-text-muted font-medium sm:hidden">Appointment Fee:</span>
                          <div className="text-right">
                            <span className="font-display font-semibold text-base text-text-ink block">
                              {currency}{priceNum.toLocaleString('en-IN')}
                            </span>
                            {depositNum > 0 ? (
                              <div className="text-[11px] font-medium space-y-0.5">
                                <span className="text-emerald-700 block">
                                  {currency}{depositNum.toLocaleString('en-IN')} advance paid
                                </span>
                                {balanceDue > 0 ? (
                                  <span className="text-amber-800 font-semibold block">
                                    {currency}{balanceDue.toLocaleString('en-IN')} due
                                  </span>
                                ) : (
                                  <span className="text-emerald-800 font-semibold flex items-center gap-1 justify-end">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Settled in full</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-text-muted block">
                                No advance logged
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
                          {/* Client Call Quick Action */}
                          {client?.phone && (
                            <a
                              href={`tel:${client.phone}`}
                              title={`Call ${apt.clientName}`}
                              className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink border border-border-subtle text-xs transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Send Phone Reminder Button */}
                          <button
                            onClick={() => onRemindAppointment(apt)}
                            title="Send immediate reminder to Sirii's phone via NTFY"
                            className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-brand-wine border border-border-subtle text-xs transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Invoice Button */}
                          <button
                            onClick={() => onOpenNewInvoice(apt)}
                            title="Generate Invoice for Client"
                            className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink border border-border-subtle text-xs transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Status toggle & Reschedule Action */}
                          {isDone ? (
                            <button
                              onClick={() => (onReschedule ? onReschedule(apt) : onEditAppointment && onEditAppointment(apt))}
                              title={`Reschedule appointment slot (Vanishes from active board in ${Math.max(1, Math.ceil(remainingGraceHours))}h)`}
                              className="px-3 py-1.5 rounded-xl bg-studio-wineLight hover:bg-studio-wine hover:text-white text-studio-wine border border-studio-wine/30 text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1.5 active:scale-95 min-h-[36px]"
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              <span>Reschedule</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-all shadow-xs flex items-center gap-1 active:scale-95 min-h-[36px]"
                              title="Mark appointment as Done"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Done</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Actions, Invoices & Daily Protocols */}
        <div className="space-y-4">
          <div>
            <h3 className="font-display font-semibold text-xl text-text-ink">
              Recent Billing
            </h3>
            <p className="text-xs text-text-muted">Client invoices and payment receipts</p>
          </div>

          <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <span className="text-xs font-semibold text-text-ink">Latest Invoices</span>
              <button
                onClick={() => setTab('invoices')}
                className="text-xs font-semibold text-brand-wine hover:underline"
              >
                All Invoices
              </button>
            </div>

            <div className="space-y-2.5">
              {invoices.length === 0 ? (
                <div className="py-6 text-center text-xs text-text-muted">
                  No invoices created yet
                </div>
              ) : (
                invoices.slice(0, 4).map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => onOpenInvoiceDetail(inv)}
                    className="p-3.5 rounded-2xl bg-studio-canvas/50 hover:bg-studio-canvas border border-border-subtle cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-ink">
                        {inv.clientName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="font-mono text-[10px]">{inv.invoiceNumber}</span>
                      <span className="font-display font-semibold text-text-ink">
                        {currency}{Number(inv.total).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => onOpenNewInvoice(null)}
              className="w-full py-3 rounded-2xl border border-dashed border-border-subtle text-brand-wine hover:bg-studio-canvas text-xs font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Invoice</span>
            </button>
          </div>

          {/* Personal Daily Studio Rituals Card */}
          <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-wine" />
                <span className="text-xs font-bold text-text-ink">Daily Studio Rituals</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-brand-wine text-[10px] font-bold border border-rose-200">
                  {checklist.filter((c) => c.completed).length}/{checklist.length}
                </span>
              </div>
              <button
                onClick={() => setTab('inventory')}
                className="text-xs font-semibold text-brand-wine hover:underline flex items-center gap-1"
              >
                <span>All Checks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Gamified progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-text-muted font-medium flex items-center gap-1">
                  {checklist.length > 0 && checklist.every((c) => c.completed) ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span>100% Atelier Perfection</span>
                    </span>
                  ) : (
                    <span>Studio Readiness</span>
                  )}
                </span>
                <span className="font-bold text-brand-wine">
                  {checklist.length > 0 ? Math.round((checklist.filter((c) => c.completed).length / checklist.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-studio-canvas overflow-hidden border border-border-subtle">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-brand-wine transition-all duration-500 rounded-full"
                  style={{
                    width: `${checklist.length > 0 ? Math.round((checklist.filter((c) => c.completed).length / checklist.length) * 100) : 0}%`
                  }}
                />
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Personal mindful checks to keep your atelier organized and client-ready.
            </p>

            <div className="space-y-2">
              {checklist.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem && onToggleChecklistItem(item.id)}
                  className={`p-3 rounded-2xl border text-xs flex items-center gap-3 cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-50/40 border-emerald-200 text-text-muted'
                      : 'bg-studio-canvas/50 border-border-subtle hover:border-brand-wine/40 text-text-ink'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-text-muted shrink-0" />
                  )}
                  <span className={`text-xs font-medium truncate flex-1 ${item.completed ? 'line-through text-text-muted' : 'text-text-ink'}`}>
                    {item.title}
                  </span>
                  {item.category && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-studio-surface text-text-muted border border-border-subtle shrink-0">
                      {item.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Supply Warning Card (if any low) */}
          {inventory.filter((i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)).length > 0 && (
            <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold uppercase tracking-wider">Restock Alert</span>
                </div>
                <button
                  onClick={() => setTab('inventory')}
                  className="text-xs font-semibold text-amber-900 underline"
                >
                  Manage
                </button>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                {inventory.filter((i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)).length} supplies have fallen below their restock threshold.
              </p>
              <button
                onClick={() => setTab('inventory')}
                className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Review Restock List</span>
              </button>
            </div>
          )}

          {/* Atelier Philosophy Note */}
          <div className="bg-studio-canvas rounded-3xl p-5 border border-border-subtle space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-wine" />
              <span className="text-xs font-bold text-text-ink uppercase tracking-wider">
                Atelier Standard
              </span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Every appointment is reserved exclusively for one client with dedicated sanitization buffers. Natural nail architecture, medical-grade hygiene, and delicate hand-painted artistry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
