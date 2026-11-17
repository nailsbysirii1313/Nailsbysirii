import React from 'react';
import {
  X,
  CreditCard,
  Package,
  ShieldCheck,
  Gift,
  Palette,
  Globe,
  TrendingUp,
  BellRing,
  Sparkles,
  Settings,
  FileSpreadsheet,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function MobileStudioHubSheet({
  isOpen,
  onClose,
  setTab,
  counts = {},
  onOpenQrModal
}) {
  if (!isOpen) return null;

  const navigateTo = (tabId) => {
    setTab(tabId);
    onClose();
  };

  const sections = [
    {
      title: 'Studio Operations',
      items: [
        {
          id: 'invoices',
          label: 'Invoices & Client Billing',
          desc: 'Create receipts, collect balances & share links',
          icon: CreditCard,
          color: 'text-rose-600 bg-rose-50',
          badge: counts?.unpaidInvoices ? `${counts.unpaidInvoices} due` : null
        },
        {
          id: 'inventory',
          label: 'Inventory & Supplies',
          desc: 'BIAB gels, Gel-X tips, crystals & restock alerts',
          icon: Package,
          color: 'text-amber-600 bg-amber-50',
          badge: counts?.lowStockCount ? `${counts.lowStockCount} low` : null,
          badgeColor: 'bg-amber-100 text-amber-700'
        },
        {
          id: 'giftcards',
          label: 'Gift Cards & Vouchers',
          desc: 'Digital gift vouchers & studio balance redemption',
          icon: Gift,
          color: 'text-purple-600 bg-purple-50'
        },
        {
          id: 'services',
          label: 'Services & Art Menu',
          desc: 'Configure nail sets, BIAB overlays, tiers & pricing',
          icon: Sparkles,
          color: 'text-pink-600 bg-pink-50'
        }
      ]
    },
    {
      title: 'Client Experience & Consultations',
      items: [
        {
          id: 'clientWebsite',
          label: 'Main Client Website',
          desc: 'Client-facing booking website, lookbook & catalogue',
          icon: Globe,
          color: 'text-blue-600 bg-blue-50',
          badge: 'Public'
        },
        {
          id: 'customizer',
          label: 'Nail Set 3D Customizer',
          desc: 'Interactive shape, length & finish visual consultation',
          icon: Palette,
          color: 'text-fuchsia-600 bg-fuchsia-50'
        }
      ]
    },
    {
      title: 'Intelligence & Settings',
      items: [
        {
          id: 'analytics',
          label: 'Financials & Growth Analytics',
          desc: 'AOV, retention rates, projected run-rate & VIP leaderboard',
          icon: TrendingUp,
          color: 'text-emerald-600 bg-emerald-50'
        },
        {
          id: 'reminders',
          label: 'Phone Alerts & NTFY System',
          desc: 'Push notifications log, topic setup & device sync',
          icon: BellRing,
          color: 'text-rose-600 bg-rose-50'
        },
        {
          id: 'settings',
          label: 'Studio Settings',
          desc: 'Studio address, deposit policy & studio preferences',
          icon: Settings,
          color: 'text-stone-600 bg-stone-100'
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-t-3xl max-w-lg w-full p-5 pb-8 shadow-2xl border-t border-rose-100 max-h-[88vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-250">
        {/* Drag Handle */}
        <div className="w-12 h-1.5 rounded-full bg-stone-200 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
              Studio Operating System
            </span>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Studio Hub & Modules
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-1">
                {section.title}
              </div>
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className="w-full p-3 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-rose-50/50 text-left flex items-center justify-between gap-3 transition-all active:scale-[0.98] group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900 text-xs">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
                                  item.badgeColor || 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Accounting CSV Backup Button */}
          <div className="pt-2">
            <a
              href="/api/backup/invoices-csv"
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-stone-400" />
              <span>Export Accounting CSV Spreadsheet</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

