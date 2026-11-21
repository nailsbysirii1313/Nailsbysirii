import React, { useState } from 'react';
import StudioLogo from './StudioLogo';
import {
  Bell,
  Smartphone,
  Globe,
  Search,
  Share2,
  Lock,
  Heart
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

  const tabTitles = {
    dashboard: 'Studio Dashboard',
    clients: 'Clients & Profiles',
    appointments: 'Appointments & Schedule',
    invoices: 'Invoices & Billing',
    pressons: 'Press-On Nails & Orders',
    giftcards: 'Gift Cards & Vouchers',
    inventory: 'Inventory & Supplies',
    analytics: 'Financials & Growth',
    services: 'Services & Art Menu',
    catalogueManager: 'Design Catalogue Lookbook',
    reminders: 'Phone Reminders & NTFY',
    settings: 'Studio Settings'
  };

  return (
    <header className="sticky top-0 z-30 bg-studio-surface/95 backdrop-blur-xl border-b border-border-subtle px-4 py-2.5 pt-[calc(0.6rem+env(safe-area-inset-top))] transition-all">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Mobile Brand & Monogram (shown on mobile where Sidebar is hidden) */}
        <div
          onClick={() => setTab('dashboard')}
          className="flex md:hidden items-center gap-2 cursor-pointer group min-w-0 flex-1 max-w-[200px]"
        >
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-display font-semibold text-sm text-text-ink tracking-tight group-hover:text-brand-wine transition-colors truncate">
                {settings?.studioName || 'Nails by Sirii'}
              </h1>
              <Heart className="w-3.5 h-3.5 text-brand-wine fill-brand-wine shrink-0" />
            </div>
            <p className="text-[10px] text-text-muted font-medium truncate">
              {todayFormatted} • Studio Hub
            </p>
          </div>
        </div>

        {/* Left: Desktop Active Breadcrumb / Section Header (Sidebar already has the logo) */}
        <div className="hidden md:flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-text-muted">Studio Hub</span>
            <span className="text-border-strong">/</span>
            <span className="text-text-ink font-bold text-sm tracking-tight">
              {tabTitles[currentTab] || 'Studio Dashboard'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-studio-canvas border border-border-subtle text-[11px] font-medium text-text-muted">
            <Heart className="w-2.5 h-2.5 text-brand-wine fill-brand-wine shrink-0" />
            <span>{todayFormatted}</span>
          </span>
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

          {/* Instant Test Alert (visible on sm+ to prevent mobile header crowding) */}
          <button
            onClick={handleTest}
            disabled={testingAlert}
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-studio-canvas hover:bg-studio-subtle border border-border-subtle text-brand-wine items-center justify-center transition-all active:scale-95 disabled:opacity-50 min-h-[36px]"
            title="Send Test Phone Notification"
          >
            <Bell className={`w-4 h-4 ${testingAlert ? 'animate-bounce' : ''}`} />
          </button>

          {/* Switch to Client Website */}
          <button
            onClick={() => setTab('clientWebsite')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-studio-ink hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs active:scale-95 min-h-[36px] sm:min-h-[40px] border border-studio-ink"
            title="View public client website"
            aria-label="View Client Website"
          >
            <Globe className="w-3.5 h-3.5 text-pink-300 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap text-white hidden xs:inline">Client Site</span>
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
