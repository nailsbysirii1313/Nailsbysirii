import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  LayoutGrid,
  Plus
} from 'lucide-react';

export default function MobileBottomNav({
  currentTab,
  setTab,
  counts = {},
  onOpenQuickAction,
  onOpenHubSheet
}) {
  const isHubActive = [
    'invoices',
    'pressons',
    'giftcards',
    'inventory',
    'analytics',
    'services',
    'catalogueManager',
    'reminders',
    'settings'
  ].includes(currentTab);

  const hasUrgentAttention =
    (counts?.pendingRepairs || 0) > 0 ||
    (counts?.lowStockCount || 0) > 0 ||
    (counts?.unpaidInvoices || 0) > 0 ||
    (counts?.pendingOrders || 0) > 0;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-studio-surface/95 backdrop-blur-2xl border-t border-border-subtle shadow-xs px-2 pt-1 pb-[calc(0.6rem+env(safe-area-inset-bottom))] transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Tab 1: Today / Dashboard */}
        <button
          onClick={() => setTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 min-h-[44px] ${
            currentTab === 'dashboard'
              ? 'text-brand-wine font-bold'
              : 'text-text-muted hover:text-text-ink font-medium'
          }`}
        >
          <div className="relative">
            <LayoutDashboard
              className={`w-5 h-5 transition-transform ${
                currentTab === 'dashboard' ? 'scale-110 text-brand-wine' : ''
              }`}
            />
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-wine" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Today</span>
        </button>

        {/* Tab 2: Schedule / Appointments */}
        <button
          onClick={() => setTab('appointments')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 min-h-[44px] ${
            currentTab === 'appointments'
              ? 'text-brand-wine font-bold'
              : 'text-text-muted hover:text-text-ink font-medium'
          }`}
        >
          <div className="relative">
            <Calendar
              className={`w-5 h-5 transition-transform ${
                currentTab === 'appointments' ? 'scale-110 text-brand-wine' : ''
              }`}
            />
            {counts?.todayAppointments > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-brand-wine text-white text-[9px] font-bold shadow-xs">
                {counts.todayAppointments}
              </span>
            )}
            {currentTab === 'appointments' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-wine" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Schedule</span>
        </button>

        {/* Center Quick Action Floating Button */}
        <div className="relative -translate-y-4 px-1">
          <button
            onClick={onOpenQuickAction}
            aria-label="Quick Studio Action"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-brand-wine hover:bg-brand-wine/90 text-white shadow-studio flex items-center justify-center border-4 border-studio-surface active:scale-90 transition-all hover:scale-105 min-h-[44px] min-w-[44px]"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Clients */}
        <button
          onClick={() => setTab('clients')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 min-h-[44px] ${
            currentTab === 'clients'
              ? 'text-brand-wine font-bold'
              : 'text-text-muted hover:text-text-ink font-medium'
          }`}
        >
          <div className="relative">
            <Users
              className={`w-5 h-5 transition-transform ${
                currentTab === 'clients' ? 'scale-110 text-brand-wine' : ''
              }`}
            />
            {currentTab === 'clients' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-wine" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Clients</span>
        </button>

        {/* Tab 4: Studio Hub & Billing */}
        <button
          onClick={onOpenHubSheet}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 min-h-[44px] ${
            isHubActive
              ? 'text-brand-wine font-bold'
              : 'text-text-muted hover:text-text-ink font-medium'
          }`}
        >
          <div className="relative">
            <LayoutGrid
              className={`w-5 h-5 transition-transform ${
                isHubActive ? 'scale-110 text-brand-wine' : ''
              }`}
            />
            {hasUrgentAttention && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-studio-surface animate-pulse" />
            )}
            {isHubActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-brand-wine" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Studio Hub</span>
        </button>
      </div>
    </nav>
  );
}
