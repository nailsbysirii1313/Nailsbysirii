import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Users,
  CreditCard,
  DollarSign,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  Receipt,
  Plus,
  Package,
  ShieldCheck,
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';

export default function DashboardView({
  overview,
  appointments,
  clients,
  invoices,
  settings,
  inventory = [],
  checklist = [],
  repairs = [],
  onToggleChecklistItem,
  onRemindAppointment,
  onOpenNewAppointment,
  onOpenNewClient,
  onOpenNewInvoice,
  onOpenInvoiceDetail,
  onOpenClientProfile,
  onUpdateAppointmentStatus,
  onTestAlert,
  onOpenQrModal,
  setTab
}) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const pendingAppointments = appointments.filter((a) => a.status === 'Confirmed');

  const currency = settings?.currency || '₹';

  const totalPaid = invoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + (Number(inv.total) || 0), 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Partial')
    .reduce((sum, inv) => sum + (Number(inv.balanceDue !== undefined ? inv.balanceDue : inv.total) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Urgent Emergency Broken Nail Squeeze-in Banner */}
      {repairs.filter((r) => r.status === 'Pending Squeeze-in').length > 0 && (
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-atelier-rose600 text-white rounded-3xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-100 block">
                Urgent Squeeze-In Repair Request
              </span>
              <h4 className="font-serif italic font-bold text-lg text-white">
                {repairs.filter((r) => r.status === 'Pending Squeeze-in').length} Emergency Client Request Awaiting Squeeze-In Slot
              </h4>
              <p className="text-xs text-rose-100">
                Latest from {repairs[0]?.clientName} ({repairs[0]?.finger} • {repairs[0]?.hand})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('appointments')}
              className="px-4 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>Open Repairs Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Studio Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-atelier-rose100/80 via-white to-atelier-blush border border-atelier-champagneBorder p-6 sm:p-8 shadow-soft">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-atelier-rose200 text-atelier-rose600 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Hub Dashboard</span>
            </div>
            <h2 className="font-serif italic font-bold text-2xl sm:text-3xl text-atelier-noir tracking-tight">
              Welcome to Nails by Sirii
            </h2>
            <p className="text-xs sm:text-sm text-atelier-muted leading-relaxed">
              You have <span className="font-semibold text-atelier-noir">{todayAppointments.length} client{todayAppointments.length === 1 ? '' : 's'}</span> on the books for today. Your automated phone notification system is active on <span className="font-mono text-atelier-rose600 font-semibold">{settings?.ntfyTopic || 'nails-by-sirii-alerts'}</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenQrModal}
              className="px-4 py-2.5 rounded-2xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-noir text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-atelier-rose500" />
              <span>Phone Alerts Setup</span>
            </button>
            <button
              onClick={onOpenNewAppointment}
              className="px-4 py-2.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-atelier-rose200/30 blur-2xl pointer-events-none" />
      </div>

      {/* 4 Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Today's Bookings */}
        <div
          onClick={() => setTab('appointments')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Today's Schedule
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-atelier-rose100 text-atelier-rose600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-atelier-noir">
              {todayAppointments.length}
            </span>
            <span className="text-[10px] sm:text-xs text-atelier-muted">sessions</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-atelier-rose600 font-medium mt-1.5 sm:mt-2 flex items-center gap-1">
            <span>{pendingAppointments.length} upcoming</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 2: Clients */}
        <div
          onClick={() => setTab('clients')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Clients
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-atelier-champagne text-atelier-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-atelier-noir">
              {clients.length}
            </span>
            <span className="text-[10px] sm:text-xs text-atelier-muted">registered</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-atelier-muted font-medium mt-1.5 sm:mt-2 flex items-center gap-1">
            <span>{clients.filter((c) => c.vip).length} VIP clientele</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 3: Total Revenue */}
        <div
          onClick={() => setTab('invoices')}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Revenue
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-0.5 sm:gap-1">
            <span className="text-[11px] sm:text-xs text-atelier-muted font-semibold">{currency}</span>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-atelier-noir">
              {totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-600 font-medium mt-1.5 sm:mt-2 flex items-center gap-1">
            <span>{currency}{pendingRevenue.toLocaleString('en-IN')} due</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>

        {/* Card 4: Phone Alerts System */}
        <div
          onClick={onOpenQrModal}
          className="cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm hover:shadow-soft transition-all group"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-semibold text-atelier-muted uppercase tracking-wider">
              Phone NTFY
            </span>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-bold text-atelier-noir">Active</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-atelier-rose600 font-medium mt-1.5 sm:mt-2 flex items-center gap-1">
            <span>Tap to test ping</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Invoices Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
                Today's Studio Schedule
              </h3>
              <p className="text-xs text-atelier-muted">
                {todayAppointments.length} appointment{todayAppointments.length === 1 ? '' : 's'} scheduled for today
              </p>
            </div>
            <button
              onClick={() => setTab('appointments')}
              className="text-xs font-semibold text-atelier-rose600 hover:text-atelier-rose500 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-atelier-champagneBorder text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="font-serif italic font-semibold text-base text-atelier-noir">
                No Appointments Booked Today
              </p>
              <p className="text-xs text-atelier-muted max-w-xs mx-auto">
                Ready for walk-ins or you can schedule an upcoming client session.
              </p>
              <button
                onClick={onOpenNewAppointment}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold hover:bg-atelier-rose600 shadow-soft"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt) => {
                const client = clients.find((c) => c.id === apt.clientId);

                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder hover:border-atelier-rose300 shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Time & Client Details */}
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-atelier-rose50 border border-atelier-rose200/60 flex flex-col items-center justify-center text-center shrink-0">
                          <Clock className="w-3.5 h-3.5 text-atelier-rose500 mb-0.5" />
                          <span className="font-bold text-xs text-atelier-noir">{apt.time}</span>
                          <span className="text-[9px] text-atelier-muted">{apt.duration}m</span>
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
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                VIP
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                apt.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : apt.status === 'In Progress'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-atelier-rose50 text-atelier-rose600 border border-atelier-rose200'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-atelier-charcoal">
                            {apt.serviceName}
                          </p>

                          {apt.addonServiceNames && apt.addonServiceNames.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {apt.addonServiceNames.map((addon, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-atelier-cream text-[10px] font-medium text-atelier-muted rounded-md border border-atelier-champagneBorder/60"
                                >
                                  + {addon}
                                </span>
                              ))}
                            </div>
                          )}

                          {apt.notes && (
                            <p className="text-[11px] text-atelier-muted italic pt-1 line-clamp-1">
                              Note: {apt.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-atelier-champagneBorder/40">
                        <div className="text-right">
                          <span className="font-serif font-bold text-base text-atelier-noir block">
                            {currency}{Number(apt.price).toLocaleString('en-IN')}
                          </span>
                          {(Number(apt.depositPaid) > 0 || Number(apt.advancePaid) > 0) ? (
                            <div className="text-[10px] font-medium space-y-0.5">
                              <span className="text-emerald-600 block">
                                {currency}{Number(apt.depositPaid || apt.advancePaid).toLocaleString('en-IN')} advance paid
                              </span>
                              {Math.max(0, (Number(apt.price) || 0) - (Number(apt.depositPaid || apt.advancePaid) || 0)) > 0 ? (
                                <span className="text-amber-600 font-semibold block">
                                  {currency}{Math.max(0, (Number(apt.price) || 0) - (Number(apt.depositPaid || apt.advancePaid) || 0)).toLocaleString('en-IN')} due
                                </span>
                              ) : (
                                <span className="text-emerald-700 font-semibold block">
                                  ✓ Paid in full
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] text-atelier-muted block">
                              No advance paid
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {/* Client Call Quick Action */}
                          {client?.phone && (
                            <a
                              href={`tel:${client.phone}`}
                              title={`Call ${apt.clientName}`}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-all"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Send Phone Reminder Button */}
                          <button
                            onClick={() => onRemindAppointment(apt)}
                            title="Send immediate reminder to Sirii's phone via ntfy"
                            className="p-2 rounded-xl bg-atelier-rose50 hover:bg-atelier-rose100 text-atelier-rose600 border border-atelier-rose200 text-xs font-medium transition-all"
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Invoice Button */}
                          <button
                            onClick={() => onOpenNewInvoice(apt)}
                            title="Generate Invoice for Client"
                            className="p-2 rounded-xl bg-white hover:bg-atelier-cream text-atelier-charcoal border border-atelier-champagneBorder text-xs font-medium transition-all"
                          >
                            <Receipt className="w-3.5 h-3.5 text-atelier-noir" />
                          </button>

                          {/* Status toggle */}
                          {apt.status !== 'Completed' && (
                            <button
                              onClick={() => onUpdateAppointmentStatus(apt.id, 'Completed')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1 active:scale-95"
                            >
                              <CheckCircle2 className="w-3 h-3" />
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

        {/* Right 1 Col: Quick Actions & Invoices */}
        <div className="space-y-4">
          <div>
            <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
              Recent Billing
            </h3>
            <p className="text-xs text-atelier-muted">Client invoices and payment receipts</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-atelier-champagneBorder/60">
              <span className="text-xs font-semibold text-atelier-charcoal">Latest Invoices</span>
              <button
                onClick={() => setTab('invoices')}
                className="text-xs font-semibold text-atelier-rose600 hover:text-atelier-rose500"
              >
                All Invoices
              </button>
            </div>

            <div className="space-y-3">
              {invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => onOpenInvoiceDetail(inv)}
                  className="p-3 rounded-2xl bg-atelier-cream/50 hover:bg-atelier-rose50/50 border border-atelier-champagneBorder/60 hover:border-atelier-rose200 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-atelier-noir">
                      {inv.clientName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-atelier-muted">
                    <span className="font-mono text-[10px]">{inv.invoiceNumber}</span>
                    <span className="font-serif font-bold text-atelier-noir">
                      {currency}{Number(inv.total).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onOpenNewInvoice(null)}
              className="w-full py-2.5 rounded-xl border border-dashed border-atelier-rose300 text-atelier-rose600 hover:bg-atelier-rose50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Invoice</span>
            </button>
          </div>

          {/* Daily Sanitization & Sterilization Card */}
          <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-atelier-champagneBorder/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-atelier-noir">Daily Sanitization</span>
              </div>
              <button
                onClick={() => setTab('inventory')}
                className="text-[11px] font-semibold text-atelier-rose600 hover:text-atelier-rose500"
              >
                All Protocols
              </button>
            </div>

            <p className="text-[11px] text-atelier-muted">
              OSHA & State Board compliant sterilization tasks for today's salon sessions.
            </p>

            <div className="space-y-2">
              {checklist.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleChecklistItem && onToggleChecklistItem(item.id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-atelier-charcoal'
                      : 'bg-atelier-cream/40 border-atelier-champagneBorder/60 hover:border-atelier-rose300'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-atelier-muted shrink-0" />
                  )}
                  <span className={`text-[11px] font-medium truncate ${item.completed ? 'line-through text-atelier-muted' : 'text-atelier-noir'}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Supply Warning Card (if any low) */}
          {inventory.filter((i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)).length > 0 && (
            <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Restock Alert</span>
                </div>
                <button
                  onClick={() => setTab('inventory')}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 underline"
                >
                  Manage Stock
                </button>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                {inventory.filter((i) => (Number(i.quantity) || 0) <= (Number(i.minThreshold) || 0)).length} supplies have fallen below their minimum restock threshold.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTab('inventory')}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Review Restock List</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Client CRM Tip */}
          <div className="bg-gradient-to-br from-atelier-rose50 to-white rounded-3xl p-5 border border-atelier-rose200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-atelier-rose500" />
              <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider">
                Nails by Sirii Note
              </span>
            </div>
            <p className="text-xs text-atelier-charcoal leading-relaxed">
              Every client's shape preference, allergy warnings, and Instagram handle are saved persistently. Access full profiles in the Clients tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

