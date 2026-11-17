import React, { useState } from 'react';
import StudioLogo from './StudioLogo';
import {
  Sparkles,
  Bell,
  Smartphone,
  Globe,
  Search,
  Share2,
  Lock
} from 'lucide-react';
import { formatKolkataDate, getKolkataTodayString } from '../utils/dateTime';

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

  const todayStr = getKolkataTodayString();
  const todayFormatted = formatKolkataDate(todayStr, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-studio-surface/95 backdrop-blur-xl border-b border-border-subtle px-4 py-2.5 pt-[calc(0.6rem+env(safe-area-inset-top))] transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Atelier Brand & Monogram */}
        <div
          onClick={() => setTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
        >
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-semibold text-sm sm:text-base md:text-lg text-text-ink tracking-tight group-hover:text-brand-wine transition-colors truncate">
                {settings?.studioName || 'Nails by Sirii'}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-wine animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-text-muted font-medium truncate">
              {todayFormatted} • Studio Hub
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenCommandPalette}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-studio-canvas border border-border-subtle hover:border-brand-wine/40 text-text-muted hover:text-brand-wine flex items-center justify-center transition-all active:scale-95 min-h-[36px]"
            title="Search studio records (Cmd+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Share Catalogue with/without prices */}
          {onOpenShareCatalogue && (
            <button
              onClick={onOpenShareCatalogue}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-studio-canvas hover:bg-studio-subtle border border-border-subtle text-text-ink font-semibold text-xs transition-all active:scale-95 min-h-[40px]"
              title="Share catalogue without prices"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-wine" />
              <span>Share Catalogue</span>
            </button>
          )}

          {/* Phone Alerts / NTFY Status */}
          <button
            onClick={onOpenQrModal}
            className="hidden xs:flex w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-studio-canvas border border-border-subtle hover:border-brand-wine/40 text-text-muted hover:text-brand-wine items-center justify-center relative transition-all active:scale-95 min-h-[36px]"
            title="Mobile Phone Alerts Status"
          >
            <Smartphone className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </button>

          {/* Instant Test Alert */}
          <button
            onClick={handleTest}
            disabled={testingAlert}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-studio-canvas hover:bg-studio-subtle border border-border-subtle text-brand-wine flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 min-h-[36px]"
            title="Send Test Phone Notification"
          >
            <Bell className={`w-4 h-4 ${testingAlert ? 'animate-bounce' : ''}`} />
          </button>

          {/* Switch to Client Website */}
          <button
            onClick={() => setTab('clientWebsite')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-text-ink hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 min-h-[40px]"
            title="View public client website"
          >
            <Globe className="w-3.5 h-3.5 text-brand-wine shrink-0" />
            <span className="hidden sm:inline text-xs whitespace-nowrap">Client Site</span>
          </button>

          {/* Lock Studio Hub */}
          {onLockStudio && (
            <button
              onClick={onLockStudio}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-studio-canvas hover:bg-studio-subtle border border-border-subtle text-text-muted hover:text-brand-wine flex items-center justify-center transition-all active:scale-95 min-h-[36px]"
              title="Lock Studio Hub & Log Out"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
