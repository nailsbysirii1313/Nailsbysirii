import React from 'react';
import StudioLogo from './StudioLogo';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  BellRing,
  Settings,
  Palette,
  TrendingUp,
  Package,
  Gift,
  Share2,
  Lock,
  ShoppingBag,
  Ribbon,
  Gem
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
      id: 'pressons',
      label: 'Press-On Nails & Orders',
      icon: ShoppingBag,
      badge: counts?.pressOnOrders ? `${counts.pressOnOrders} new` : 'Boutique'
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
      id: 'analytics',
      label: 'Financials & Growth',
      icon: TrendingUp
    },
    {
      id: 'services',
      label: 'Services & Art Menu',
      icon: Palette
    },
    {
      id: 'reminders',
      label: 'Phone Reminders & NTFY',
      icon: BellRing
    },
    {
      id: 'settings',
      label: 'Studio Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="hidden md:flex w-64 bg-studio-surface border-r border-border-subtle flex-col justify-between h-screen sticky top-0 shrink-0 z-20">
      {/* Top Branding & Navigation */}
      <div className="overflow-y-auto no-scrollbar">
        <div className="p-5 border-b border-border-subtle">
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" showText />
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all min-h-[42px] ${isActive
                  ? 'bg-studio-canvas text-brand-wine shadow-xs border border-border-subtle'
                  : 'text-text-muted hover:bg-studio-canvas/50 hover:text-text-ink'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-wine' : 'text-text-muted'
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive
                      ? 'bg-brand-wine text-white'
                      : item.badge === 'Public'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-studio-subtle text-brand-wine border border-border-subtle'
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Share Catalogue button */}
          {onOpenShareCatalogue && (
            <button
              onClick={onOpenShareCatalogue}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-text-muted hover:text-brand-wine hover:bg-studio-canvas transition-all border border-dashed border-border-subtle mt-2 min-h-[42px]"
            >
              <div className="flex items-center gap-3">
                <Ribbon className="w-4 h-4 text-brand-wine" />
                <span>Share Catalogue</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-studio-canvas text-brand-wine font-medium border border-border-subtle">
                Booklet
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Profile / Quick Info & Lock Button */}
      <div className="p-4 border-t border-border-subtle">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-brand-wine text-white flex items-center justify-center font-display font-semibold text-xs shrink-0">
              {settings?.ownerName ? settings.ownerName.charAt(0) : 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-text-ink truncate">
                {settings?.ownerName || 'Sirii'}
              </p>
              <p className="text-[10px] text-text-muted truncate">Owner • Studio Hub</p>
            </div>
          </div>

          {onLockStudio && (
            <button
              onClick={onLockStudio}
              className="p-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-muted hover:text-brand-wine transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              title="Lock Studio Hub (Log Out)"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
