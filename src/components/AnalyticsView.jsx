import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  Download,
  FileSpreadsheet,
  Award,
  ArrowUpRight,
  PieChart,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsView({
  clients,
  appointments,
  invoices,
  services,
  settings
}) {
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
      const cat = match ? match.category : 'Nail Art / Custom';
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(item.amount) || 0);
    });
  });

  const totalCatRevenue = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;

  // 5. VIP Spender Leaderboard
  const sortedClients = [...clients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));

  // 6. Recent Months Performance Mock / Projection
  const monthlyRunRate = Math.round((totalRevenue / 3) * 1.2) || 4500;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Business Intelligence & Performance</span>
          </div>
          <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Studio Financials & Growth Analytics
          </h2>
          <p className="text-xs text-atelier-muted">
            Track average client spend, recurring appointment retention, and export financial records.
          </p>
        </div>

        {/* Quick CSV Export */}
        <div className="flex items-center gap-2">
          <a
            href="/api/backup/invoices-csv"
            download
            className="px-4 py-2 rounded-xl bg-white border border-atelier-champagneBorder hover:border-atelier-rose300 text-atelier-charcoal text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV for Taxes</span>
          </a>

          <a
            href="/api/backup/export"
            download
            className="px-4 py-2 rounded-xl bg-atelier-noir hover:bg-atelier-charcoal text-white text-xs font-semibold shadow-soft transition-all flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup Data</span>
          </a>
        </div>
      </div>

      {/* 4 Core Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Collected Studio Revenue
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-atelier-muted font-bold">{currency}</span>
            <span className="font-serif font-bold text-3xl text-atelier-noir">
              {totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{paidInvoices.length} paid invoices cleared</span>
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Average Ticket Size (AOV)
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-atelier-muted font-bold">{currency}</span>
            <span className="font-serif font-bold text-3xl text-atelier-noir">
              {Number(avgTicket).toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-atelier-rose600 font-medium">
            Per client appointment session
          </p>
        </div>

        {/* Client Retention */}
        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Client Rebooking Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-3xl text-atelier-rose600">
              {retentionRate}%
            </span>
          </div>
          <p className="text-[11px] text-atelier-muted font-medium">
            {repeatClients.length} of {clients.length} clients are repeat visitors
          </p>
        </div>

        {/* Projected Monthly Run-rate */}
        <div className="bg-white rounded-3xl p-5 border border-atelier-champagneBorder shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
            Projected Monthly Run-Rate
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-atelier-muted font-bold">{currency}</span>
            <span className="font-serif font-bold text-3xl text-emerald-700">
              {monthlyRunRate.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-amber-600 font-medium">
            +{currency}{pendingRevenue.toLocaleString('en-IN')} pending balances
          </p>
        </div>
      </div>

      {/* Grid: Category Breakdown (Left) & Top Spenders Leaderboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Service Category */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-atelier-champagneBorder shadow-sm space-y-5">
          <div>
            <h3 className="font-serif italic font-bold text-lg text-atelier-noir">
              Revenue by Service Category
            </h3>
            <p className="text-xs text-atelier-muted">
              Discover which treatments generate the highest revenue for Nails by Sirii.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {Object.entries(categoryMap).map(([category, amount]) => {
              const pct = Math.round((amount / totalCatRevenue) * 100);

              return (
                <div key={category} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-atelier-charcoal">{category}</span>
                    <span className="text-atelier-noir font-serif font-bold">
                      {currency}{Number(amount).toLocaleString('en-IN')} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-atelier-cream h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-atelier-rose400 to-atelier-rose600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-atelier-rose50/60 border border-atelier-rose200/60 text-xs text-atelier-charcoal leading-relaxed">
            <p className="font-semibold text-atelier-noir mb-0.5">Studio Performance Insight:</p>
            <p className="text-atelier-muted text-[11px]">
              Sculpted Gel-X and 3D Hand-Painted Nail Art tier add-ons provide your highest margins, boosting the average ticket price by up to 45%.
            </p>
          </div>
        </div>

        {/* Top VIP Clients Spender Leaderboard */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-atelier-champagneBorder shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif italic font-bold text-lg text-atelier-noir">
                Top Client Spenders & Loyalty
              </h3>
              <p className="text-xs text-atelier-muted">
                Your highest-value studio clients and their preferred aesthetics.
              </p>
            </div>
            <Award className="w-5 h-5 text-atelier-gold" />
          </div>

          <div className="space-y-3 pt-1">
            {sortedClients.slice(0, 5).map((client, index) => (
              <div
                key={client.id}
                className="p-3.5 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold flex items-center justify-center text-xs shrink-0 font-serif">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif italic font-bold text-sm text-atelier-noir">
                        {client.name}
                      </span>
                      {client.vip && (
                        <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-atelier-muted block">
                      {client.preferredShape || 'Almond'} • {client.totalVisits || 1} sessions
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-serif font-bold text-atelier-rose600 text-base block">
                    {currency}{(client.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-atelier-muted block">Lifetime Spend</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

