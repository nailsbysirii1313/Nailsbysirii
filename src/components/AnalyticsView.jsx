import React, { useState } from 'react';
import { api } from '../api';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Download,
  FileSpreadsheet,
  Award,
  ArrowUpRight,
  PieChart,
  CheckCircle2,
  Wallet,
  Clock,
  Loader2
} from 'lucide-react';

export default function AnalyticsView({
  clients = [],
  appointments = [],
  invoices = [],
  services = [],
  settings = {}
}) {
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [downloadingBackup, setDownloadingBackup] = useState(false);

  const handleDownloadCsv = async () => {
    try {
      setDownloadingCsv(true);
      await api.downloadInvoicesCsv();
    } catch (err) {
      window.open(api.getInvoicesCsvUrl(), '_blank');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handleDownloadBackup = async () => {
    try {
      setDownloadingBackup(true);
      await api.downloadBackup();
    } catch (err) {
      window.open(api.getBackupExportUrl(), '_blank');
    } finally {
      setDownloadingBackup(false);
    }
  };

  const currency = settings?.currency || '₹';

  // 1. Total Revenue metrics
  const paidInvoices = invoices.filter((i) => i.status === 'Paid');
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const pendingRevenue = invoices
    .filter((i) => i.status !== 'Paid')
    .reduce((sum, i) => sum + (Number(i.balanceDue !== undefined ? i.balanceDue : i.total) || 0), 0);

  // 2. Average Ticket Size (AOV)
  const avgTicket = paidInvoices.length > 0 ? Math.round(totalRevenue / paidInvoices.length) : 0;

  // 3. Client Retention & Rebooking Rate
  const repeatClients = clients.filter((c) => (c.totalVisits || 0) > 1);
  const retentionRate = clients.length > 0 ? Math.round((repeatClients.length / clients.length) * 100) : 0;

  // 4. Revenue by Category
  const categoryMap = {};
  invoices.forEach((inv) => {
    (inv.items || []).forEach((item) => {
      // Find matching service
      const match = services.find((s) => s.name === item.description);
      const cat = match ? match.category : 'Bespoke Nail Art / Custom';
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(item.amount) || 0);
    });
  });

  const totalCatRevenue = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;

  // 5. VIP Spender Leaderboard
  const sortedClients = [...clients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));

  // 6. Recent Months Performance Run-rate
  const monthlyRunRate = totalRevenue > 0 ? Math.round((totalRevenue / 3) * 1.2) : 0;

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-subtle text-brand-wine text-xs font-semibold mb-2 border border-border-subtle">
            <TrendingUp className="w-3.5 h-3.5 text-brand-wine" />
            <span>Business Intelligence & Performance</span>
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl text-text-ink tracking-tight">
            Studio Financials & Growth Analytics
          </h2>
          <p className="text-xs text-text-muted mt-1 max-w-xl">
            Track average client ticket sizes, recurring appointment retention, treatment margins, and export financial records.
          </p>
        </div>

        {/* Quick CSV Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={downloadingCsv}
            className="px-4 py-2.5 rounded-xl bg-studio-surface border border-border-subtle hover:border-brand-wine text-text-secondary hover:text-text-ink text-xs font-semibold shadow-xs transition-all flex items-center gap-2 min-h-[44px] cursor-pointer disabled:opacity-60"
          >
            {downloadingCsv ? <Loader2 className="w-4 h-4 animate-spin text-emerald-700" /> : <FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
            <span>Export CSV for Taxes</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBackup}
            disabled={downloadingBackup}
            className="px-4 py-2.5 rounded-xl bg-text-ink hover:bg-neutral-800 text-white text-xs font-semibold shadow-studio transition-all flex items-center gap-2 min-h-[44px] cursor-pointer disabled:opacity-60"
          >
            {downloadingBackup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Backup Studio Data</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Collected Studio Revenue
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-text-muted font-bold">{currency}</span>
            <span className="font-display font-bold text-3xl text-text-ink">
              {totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{paidInvoices.length} paid invoices settled</span>
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Average Ticket Size (AOV)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-text-muted font-bold">{currency}</span>
            <span className="font-display font-bold text-3xl text-brand-wine">
              {Number(avgTicket).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-brand-wine font-medium">
            Per appointment session
          </p>
        </div>

        {/* Client Retention */}
        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Client Rebooking Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-3xl text-text-ink">
              {retentionRate}%
            </span>
          </div>
          <p className="text-xs text-text-muted font-medium">
            {repeatClients.length} of {clients.length} clients are repeat visitors
          </p>
        </div>

        {/* Projected Monthly Run-rate */}
        <div className="bg-studio-surface rounded-3xl p-5 border border-border-subtle shadow-xs space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
            Projected Monthly Run-Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-text-muted font-bold">{currency}</span>
            <span className="font-display font-bold text-3xl text-emerald-800">
              {monthlyRunRate.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-amber-700 font-medium">
            +{currency}{pendingRevenue.toLocaleString('en-IN')} pending balances
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown (Left) & Top Spenders Leaderboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service Category */}
        <div className="bg-studio-surface rounded-3xl p-6 sm:p-7 border border-border-subtle shadow-xs space-y-5">
          <div>
            <h3 className="font-display font-semibold text-lg text-text-ink">
              Revenue by Service Category
            </h3>
            <p className="text-xs text-text-muted">
              Discover which treatments generate the highest revenue for Nails by Sirii.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.keys(categoryMap).length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No category breakdown available yet. Complete client invoices to see treatment revenue.
              </div>
            ) : (
              Object.entries(categoryMap).map(([category, amount]) => {
                const pct = Math.round((amount / totalCatRevenue) * 100);

                return (
                  <div key={category} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-text-secondary">{category}</span>
                      <span className="text-text-ink font-display font-bold">
                        {currency}{Number(amount).toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-studio-canvas h-2.5 rounded-full overflow-hidden border border-border-subtle/50">
                      <div
                        className="bg-brand-wine h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(5, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 rounded-2xl bg-studio-canvas border border-border-subtle text-xs text-text-secondary leading-relaxed">
            <p className="font-semibold text-text-ink mb-0.5">Studio Performance Insight:</p>
            <p className="text-text-muted text-xs">
              Natural Nail Architecture (BIAB) and 3D Hand-Painted Nail Art tier add-ons provide the highest margins, boosting the average ticket price by up to 45%.
            </p>
          </div>
        </div>

        {/* Top VIP Clients Spender Leaderboard */}
        <div className="bg-studio-surface rounded-3xl p-6 sm:p-7 border border-border-subtle shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg text-text-ink">
                Top Client Spenders & Loyalty
              </h3>
              <p className="text-xs text-text-muted">
                Your highest-value studio clients and their preferred aesthetics.
              </p>
            </div>
            <Award className="w-5 h-5 text-accent-gold" />
          </div>

          <div className="space-y-3 pt-1">
            {sortedClients.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No client records yet. When clients book appointments or make purchases, your top clients will appear here.
              </div>
            ) : (
              sortedClients.slice(0, 5).map((client, index) => (
                <div
                  key={client.id}
                  className="p-3.5 rounded-2xl bg-studio-canvas border border-border-subtle flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-studio-surface border border-border-subtle text-brand-wine font-bold flex items-center justify-center text-xs shrink-0 font-display">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-semibold text-sm text-text-ink">
                          {client.name}
                        </span>
                        {client.vip && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-text-muted block">
                        {client.preferredShape || 'Almond'} • {client.totalVisits || 1} sessions
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-bold text-brand-wine text-base block">
                      {currency}{(client.totalSpent || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-text-muted block">Lifetime Spend</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
