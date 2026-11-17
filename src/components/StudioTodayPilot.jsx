import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  MessageCircle,
  Plus,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Lock,
  Bell,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { formatKolkataDate, getKolkataTodayString, formatTime12h } from '../utils/dateTime';

/**
 * StudioTodayPilot
 * Mobile-First (390px default) Pilot Screen for Nails by Sirii Studio Hub.
 * Tailored for Sirii running the studio primarily from her mobile phone:
 * - High-density agenda prioritization without excessive greetings
 * - High-contrast readable record cards with tap-to-call & WhatsApp
 * - Clear deposit / balance due tracking
 * - 44px+ touch targets for single-hand use
 * - Rapid status updates and quick actions
 */
export default function StudioTodayPilot({
  appointments = [],
  clients = [],
  invoices = [],
  repairs = [],
  checklist = [],
  settings,
  onOpenNewAppointment,
  onOpenNewInvoice,
  onOpenClientProfile,
  onUpdateStatus,
  onTestAlert,
  onLockStudio,
  onSwitchTab
}) {
  const todayStr = getKolkataTodayString();
  const todayApts = appointments.filter((a) => a.date === todayStr);

  const pendingRepairs = repairs.filter((r) => r.status === 'Pending Squeeze-in');

  // Daily sanitization status
  const totalChecklist = checklist.length;
  const completedChecklist = checklist.filter((c) => c.completed).length;

  // Unpaid invoices
  const unpaidInvoices = invoices.filter((i) => i.status !== 'Paid');
  const totalBalanceDue = todayApts.reduce((sum, a) => {
    const deposit = Number(a.depositPaid || a.advancePaid || 0);
    const price = Number(a.price || 0);
    return sum + Math.max(0, price - deposit);
  }, 0);

  return (
    <div className="min-h-screen bg-studio-canvas text-studio-ink font-sans pb-24 pt-[calc(0.5rem+env(safe-area-inset-top))]">
      {/* 1. COMPACT TOP STATUS BAR */}
      <div className="px-4 py-3 bg-studio-surface border-b border-studio-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-studio-muted block">
              {formatKolkataDate(todayStr, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="flex items-center gap-2">
              <h1 className="font-display italic font-bold text-lg text-studio-ink">
                Studio Hub • Today
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-studio-emeraldLight text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>12–7 PM</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTestAlert}
              className="w-10 h-10 rounded-full bg-studio-canvas border border-studio-border text-studio-secondary hover:text-studio-wine flex items-center justify-center active:scale-95"
              title="Test Phone Push Notification"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onLockStudio}
              className="px-3 py-1.5 rounded-full bg-studio-subtle border border-studio-border text-studio-secondary hover:text-studio-ink text-xs font-semibold flex items-center gap-1.5 active:scale-95"
              title="Lock Console and Return to Client Site"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 py-4 max-w-2xl mx-auto space-y-4">
        {/* 2. URGENT EMERGENCY REPAIR BANNER */}
        {pendingRepairs.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-3.5 flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wide">
                  Emergency Nail Repair Squeeze-in ({pendingRepairs.length})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-red-900 font-semibold mt-0.5 truncate">
                {pendingRepairs[0].clientName} • {pendingRepairs[0].finger} ({pendingRepairs[0].hand})
              </p>
              <div className="flex items-center gap-2 mt-2">
                <a
                  href={`tel:${pendingRepairs[0].clientPhone}`}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-semibold flex items-center gap-1 active:scale-95"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Client</span>
                </a>
                <button
                  onClick={() => onSwitchTab('appointments')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-red-200 text-red-800 text-[11px] font-semibold active:scale-95"
                >
                  View Queue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. ESSENTIAL METRICS STRIP (Compact & Legible) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-studio-surface border border-studio-border text-center">
            <span className="text-[10px] text-studio-muted uppercase font-bold tracking-wider block">
              Today's Slots
            </span>
            <span className="font-display font-bold text-xl text-studio-ink block mt-0.5">
              {todayApts.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-studio-surface border border-studio-border text-center">
            <span className="text-[10px] text-studio-muted uppercase font-bold tracking-wider block">
              Confirmed
            </span>
            <span className="font-display font-bold text-xl text-emerald-700 block mt-0.5">
              {todayApts.filter((a) => a.status === 'Confirmed' || a.status === 'Completed').length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-studio-surface border border-studio-border text-center">
            <span className="text-[10px] text-studio-muted uppercase font-bold tracking-wider block">
              Due Today
            </span>
            <span className="font-display font-bold text-lg text-studio-wine block mt-0.5">
              ₹{totalBalanceDue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 4. RAPID 1-TAP ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onOpenNewAppointment}
            className="p-3 rounded-2xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-studio active:scale-95 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
          <button
            onClick={onOpenNewInvoice}
            className="p-3 rounded-2xl bg-studio-surface hover:bg-studio-subtle border border-studio-border text-studio-ink font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
          >
            <Receipt className="w-4 h-4 text-studio-wine" />
            <span>Create Invoice</span>
          </button>
        </div>

        {/* 5. TODAY'S AGENDA (PRIMARY FOCUS) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display italic font-bold text-base text-studio-ink">
                Today's Schedule
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-studio-subtle text-studio-secondary font-bold">
                {todayApts.length}
              </span>
            </div>
            <button
              onClick={() => onSwitchTab('appointments')}
              className="text-xs font-semibold text-studio-wine hover:underline inline-flex items-center gap-0.5"
            >
              <span>Full Calendar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayApts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-studio-surface border border-studio-border text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-studio-subtle text-studio-muted flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display italic font-bold text-base text-studio-ink">
                  No appointments booked for today
                </h3>
                <p className="text-xs text-studio-muted max-w-xs mx-auto">
                  Studio opens at 12:00 PM. Tap below to log a walk-in client or schedule an appointment.
                </p>
              </div>
              <button
                onClick={onOpenNewAppointment}
                className="px-4 py-2 rounded-xl bg-studio-wine text-white text-xs font-semibold active:scale-95"
              >
                + Schedule Client
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayApts.map((apt) => {
                const depositNum = Number(apt.depositPaid || apt.advancePaid || 0);
                const priceNum = Number(apt.price || 0);
                const pendingNum = Math.max(0, priceNum - depositNum);

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-studio-surface border border-studio-border shadow-xs hover:border-studio-borderStrong transition-all space-y-3"
                  >
                    {/* Time & Status Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-studio-ink px-2.5 py-1 rounded-lg bg-studio-subtle">
                          {formatTime12h(apt.time) || apt.time}
                        </span>
                        <span className="text-[11px] text-studio-muted font-medium">
                          ~{apt.duration || 60}m
                        </span>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={apt.status || 'Confirmed'}
                        onChange={(e) => onUpdateStatus(apt.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : apt.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : apt.status === 'Cancelled'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Client & Service Info */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display italic font-bold text-base text-studio-ink">
                          {apt.clientName}
                        </span>
                        <div className="text-right">
                          <span className="font-display font-bold text-sm text-studio-ink">
                            ₹{priceNum.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-studio-secondary font-medium">
                        {apt.serviceName}
                      </div>

                      {apt.customSet && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-studio-subtle text-[10px] text-studio-wine font-semibold">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {apt.customSet.shape} • {apt.customSet.length} • {apt.customSet.finish}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Financial Deposit Breakdown */}
                    <div className="pt-2 border-t border-studio-border/70 flex items-center justify-between text-xs">
                      <div className="text-[11px]">
                        {depositNum > 0 ? (
                          <span className="text-emerald-700 font-semibold">
                            Deposit Paid: ₹{depositNum.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-studio-muted">No advance deposit</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-studio-muted mr-1">To Collect:</span>
                        <span className="font-bold text-studio-wine">
                          ₹{pendingNum.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Contact & WhatsApp Action Row */}
                    <div className="pt-2 border-t border-studio-border/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {apt.clientPhone && (
                          <>
                            <a
                              href={`tel:${apt.clientPhone}`}
                              className="px-2.5 py-1 rounded-lg bg-studio-canvas border border-studio-border text-studio-secondary hover:text-studio-ink text-[11px] font-semibold flex items-center gap-1 active:scale-95"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/${apt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hi ${apt.clientName}! This is Sirii from Nails by Sirii confirming your appointment today at ${formatTime12h(
                                  apt.time
                                )}. See you at the studio!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 active:scale-95"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </>
                        )}
                      </div>

                      <button
                        onClick={onOpenNewInvoice}
                        className="px-2.5 py-1 rounded-lg bg-studio-subtle hover:bg-studio-wine hover:text-white text-studio-secondary text-[11px] font-semibold transition-all active:scale-95 flex items-center gap-1"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. DAILY PROTOCOL & SANITIZATION PROGRESS */}
        <div className="p-4 rounded-2xl bg-studio-surface border border-studio-border space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-xs text-studio-ink">
                Daily Sanitation Protocols
              </span>
            </div>
            <span className="text-[11px] font-bold text-studio-secondary">
              {completedChecklist}/{totalChecklist} Signed
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-studio-subtle rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-studio-muted pt-0.5">
            <span>OSHA & State Board Sterilization Standards</span>
            <button
              onClick={() => onSwitchTab('inventory')}
              className="text-studio-wine font-semibold hover:underline"
            >
              Review Items →
            </button>
          </div>
        </div>
      </main>

      {/* 7. BOTTOM NAVIGATION BAR FOR STUDIO HUB (Mobile Primary Target) */}
      <nav className="fixed bottom-0 inset-x-0 bg-studio-surface border-t border-studio-border z-40 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 h-14">
          <button
            onClick={() => onSwitchTab('dashboard')}
            className="flex flex-col items-center justify-center text-studio-wine font-semibold text-[11px] gap-1"
          >
            <Clock className="w-5 h-5" />
            <span>Today</span>
          </button>

          <button
            onClick={() => onSwitchTab('appointments')}
            className="flex flex-col items-center justify-center text-studio-muted hover:text-studio-ink font-medium text-[11px] gap-1"
          >
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => onSwitchTab('clients')}
            className="flex flex-col items-center justify-center text-studio-muted hover:text-studio-ink font-medium text-[11px] gap-1"
          >
            <User className="w-5 h-5" />
            <span>Clients</span>
          </button>

          <button
            onClick={() => onSwitchTab('invoices')}
            className="flex flex-col items-center justify-center text-studio-muted hover:text-studio-ink font-medium text-[11px] gap-1"
          >
            <Receipt className="w-5 h-5" />
            <span>Billing</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
