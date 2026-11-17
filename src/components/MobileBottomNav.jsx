import React from 'react';
import {
  Sparkles,
  Calendar,
  Users,
  LayoutGrid,
  Plus,
  CreditCard,
  AlertTriangle
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
    'inventory',
    'giftcards',
    'customizer',
    'clientWebsite',
    'publicBooking',
    'analytics',
    'reminders',
    'services',
    'settings'
  ].includes(currentTab);

  const hasUrgentAttention = (counts?.pendingRepairs || 0) > 0 || (counts?.lowStockCount || 0) > 0;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-rose-100/80 shadow-[0_-10px_30px_rgba(217,110,133,0.12)] px-2 pt-1 pb-[calc(0.6rem+env(safe-area-inset-bottom))] transition-all">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Tab 1: Today / Dashboard */}
        <button
          onClick={() => setTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'dashboard'
              ? 'text-rose-600 font-bold'
              : 'text-stone-400 hover:text-stone-600 font-medium'
          }`}
        >
          <div className="relative">
            <Sparkles
              className={`w-5 h-5 transition-transform ${
                currentTab === 'dashboard' ? 'scale-110 text-rose-500 fill-rose-100' : ''
              }`}
            />
            {currentTab === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Today</span>
        </button>

        {/* Tab 2: Schedule / Appointments */}
        <button
          onClick={() => setTab('appointments')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'appointments'
              ? 'text-rose-600 font-bold'
              : 'text-stone-400 hover:text-stone-600 font-medium'
          }`}
        >
          <div className="relative">
            <Calendar
              className={`w-5 h-5 transition-transform ${
                currentTab === 'appointments' ? 'scale-110 text-rose-500' : ''
              }`}
            />
            {counts?.todayAppointments > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold shadow-xs">
                {counts.todayAppointments}
              </span>
            )}
            {currentTab === 'appointments' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Schedule</span>
        </button>

        {/* Center Quick Action Floating Button */}
        <div className="relative -translate-y-4 px-1">
          <button
            onClick={onOpenQuickAction}
            aria-label="Quick Studio Action"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white shadow-lg shadow-rose-300/80 flex items-center justify-center border-4 border-white active:scale-90 transition-all hover:scale-105"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Clients */}
        <button
          onClick={() => setTab('clients')}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 ${
            currentTab === 'clients'
              ? 'text-rose-600 font-bold'
              : 'text-stone-400 hover:text-stone-600 font-medium'
          }`}
        >
          <div className="relative">
            <Users
              className={`w-5 h-5 transition-transform ${
                currentTab === 'clients' ? 'scale-110 text-rose-500' : ''
              }`}
            />
            {currentTab === 'clients' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Clients</span>
        </button>

        {/* Tab 4: Studio Hub & Billing */}
        <button
          onClick={onOpenHubSheet}
          className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-2xl transition-all active:scale-95 ${
            isHubActive
              ? 'text-rose-600 font-bold'
              : 'text-stone-400 hover:text-stone-600 font-medium'
          }`}
        >
          <div className="relative">
            <LayoutGrid
              className={`w-5 h-5 transition-transform ${
                isHubActive ? 'scale-110 text-rose-500' : ''
              }`}
            />
            {hasUrgentAttention && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white animate-pulse" />
            )}
            {isHubActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-500" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Studio Hub</span>
        </button>
      </div>
    </nav>
  );
}

