import React, { useState } from 'react';
import StudioLogo from './StudioLogo';
import {
  Sparkles,
  Bell,
  Smartphone,
  Globe,
  Search,
  LayoutDashboard,
  Share2,
  Lock
} from 'lucide-react';

export default function Header({
  settings,
  currentTab,
  setTab,
  onOpenNewAppointment,
  onOpenNewClient,
  onTestAlert,
  onOpenQrModal,
  onOpenCommandPalette,
  onOpenShareCatalogue,
  onLockStudio
}) {
  const [testingAlert, setTestingAlert] = useState(false);

  const handleTest = async () => {
    setTestingAlert(true);
    await onTestAlert();
    setTestingAlert(false);
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-rose-100/70 px-4 py-2.5 pt-[calc(0.75rem+env(safe-area-inset-top))] transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Atelier Brand & Monogram */}
        <div
          onClick={() => setTab('dashboard')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0"
        >
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif italic font-bold text-sm sm:text-base md:text-lg text-stone-900 tracking-tight group-hover:text-rose-600 transition-colors truncate">
                {settings?.studioName || 'Nails by Sirii'}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] text-stone-400 font-medium truncate">
              {todayFormatted} • Studio Hub
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenCommandPalette}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-rose-300 text-stone-600 hover:text-rose-600 flex items-center justify-center transition-all active:scale-95"
            title="Search studio records (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
          </button>

          {/* Share Catalogue with/without prices (hidden on mobile, available in hub sheet & actions) */}
          <button
            onClick={onOpenShareCatalogue}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs transition-all active:scale-95"
            title="Share catalogue without prices"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Share Catalogue</span>
          </button>

          {/* Phone Alerts / NTFY Status */}
          <button
            onClick={onOpenQrModal}
            className="hidden xs:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-rose-300 text-stone-600 hover:text-rose-600 items-center justify-center relative transition-all active:scale-95"
            title="Mobile Phone Alerts Status"
          >
            <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          {/* Instant Test Alert */}
          <button
            onClick={handleTest}
            disabled={testingAlert}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
            title="Send Test Phone Notification"
          >
            <Bell className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${testingAlert ? 'animate-bounce' : ''}`} />
          </button>

          {/* Switch to Client Website */}
          <button
            onClick={() => setTab('clientWebsite')}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs active:scale-95"
            title="View public client website"
          >
            <Globe className="w-3.5 h-3.5 text-rose-300 shrink-0" />
            <span className="hidden sm:inline text-[11px] sm:text-xs whitespace-nowrap">Client Site</span>
          </button>

          {/* Lock Studio Hub */}
          <button
            onClick={onLockStudio}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-100 hover:bg-rose-50 border border-stone-300 hover:border-rose-200 text-stone-700 hover:text-rose-600 flex items-center justify-center transition-all active:scale-95"
            title="Lock Studio Hub & Log Out"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
