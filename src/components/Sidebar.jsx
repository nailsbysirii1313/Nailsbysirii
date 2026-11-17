import React from 'react';
import StudioLogo from './StudioLogo';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Sparkles,
  BellRing,
  Settings,
  Heart,
  Smartphone,
  Globe,
  Palette,
  TrendingUp,
  Package,
  Gift,
  Share2,
  Lock
} from 'lucide-react';

export default function Sidebar({
  currentTab,
  setTab,
  counts,
  settings,
  onOpenShareCatalogue,
  onLockStudio
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Studio Dashboard',
      icon: LayoutDashboard,
      badge: counts?.todayAppointments ? `${counts.todayAppointments} today` : null
    },
    {
      id: 'clients',
      label: 'Clients & Profiles',
      icon: Users,
      badge: counts?.clients ? `${counts.clients}` : null
    },
    {
      id: 'appointments',
      label: 'Appointments & Schedule',
      icon: Calendar,
      badge: counts?.pendingAppointments ? `${counts.pendingAppointments}` : null
    },
    {
      id: 'invoices',
      label: 'Invoices & Billing',
      icon: CreditCard,
      badge: counts?.unpaidInvoices ? `${counts.unpaidInvoices} due` : null
    },
    {
      id: 'giftcards',
      label: 'Gift Cards & Vouchers',
      icon: Gift,
      badge: 'Vouchers'
    },
    {
      id: 'inventory',
      label: 'Inventory & Supplies',
      icon: Package,
      badge: counts?.lowStockCount ? `${counts.lowStockCount} low` : null
    },
    {
      id: 'customizer',
      label: 'Nail Set Customizer',
      icon: Palette,
      badge: 'Interactive'
    },
    {
      id: 'clientWebsite',
      label: 'Main Client Website',
      icon: Globe,
      badge: 'Public'
    },
    {
      id: 'analytics',
      label: 'Financials & Growth',
      icon: TrendingUp
    },
    {
      id: 'services',
      label: 'Services & Art Menu',
      icon: Sparkles
    },
    {
      id: 'reminders',
      label: 'Phone Reminders & NTFY',
      icon: BellRing,
      highlight: true
    },
    {
      id: 'settings',
      label: 'Studio Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-white/70 backdrop-blur-xl border-r border-atelier-champagneBorder/60 flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Top Branding */}
      <div className="overflow-y-auto no-scrollbar">
        <div className="p-5 border-b border-atelier-champagneBorder/40">
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" showText />
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-atelier-rose50 text-atelier-rose600 shadow-sm border border-atelier-rose200'
                    : 'text-atelier-charcoal hover:bg-atelier-cream/80 hover:text-atelier-noir'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-atelier-rose500' : 'text-atelier-muted'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-atelier-rose500 text-white'
                        : item.badge === 'Public'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-atelier-rose100 text-atelier-rose600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Share Catalogue button inside navigation */}
          {onOpenShareCatalogue && (
            <button
              onClick={onOpenShareCatalogue}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-atelier-charcoal hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-all border border-dashed border-atelier-rose200/80 mt-2"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-atelier-rose500" />
                <span>Share Catalogue</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold">
                No Prices
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Profile / Quick Info & Lock Button */}
      <div className="p-4 border-t border-atelier-champagneBorder/40 space-y-3">
        {/* Studio Owner & Lock Button */}
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-atelier-rose200 text-atelier-rose600 flex items-center justify-center font-serif italic font-bold text-xs shrink-0">
              {settings?.ownerName ? settings.ownerName.charAt(0) : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-atelier-noir truncate">
                {settings?.ownerName || 'Sirii'}
              </p>
              <p className="text-[10px] text-atelier-muted truncate">Owner • Studio Hub</p>
            </div>
          </div>

          {onLockStudio && (
            <button
              onClick={onLockStudio}
              className="p-1.5 rounded-lg bg-atelier-cream hover:bg-atelier-rose100 text-atelier-muted hover:text-atelier-rose600 transition-colors"
              title="Lock Studio Hub (Logout)"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
