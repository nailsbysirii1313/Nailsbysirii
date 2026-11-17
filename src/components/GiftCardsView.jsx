import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Search,
  Sparkles,
  CreditCard,
  DollarSign,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Heart,
  Calendar,
  Send,
  Trash2,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const VOUCHER_THEMES = {
  'Blush Rose Quartz': {
    name: 'Blush Rose Quartz',
    bg: 'bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600',
    cardBorder: 'border-rose-200/50',
    accent: 'text-rose-600',
    pill: 'bg-rose-100 text-rose-700',
    tag: 'Most Loved'
  },
  'Bridal Velvet Silk': {
    name: 'Bridal Velvet Silk',
    bg: 'bg-gradient-to-br from-stone-800 via-amber-900 to-stone-900',
    cardBorder: 'border-amber-200/40',
    accent: 'text-amber-600',
    pill: 'bg-amber-100 text-amber-800',
    tag: 'Bridal Luxe'
  },
  'Noir Onyx Luxe': {
    name: 'Noir Onyx Luxe',
    bg: 'bg-gradient-to-br from-neutral-900 via-stone-900 to-black',
    cardBorder: 'border-neutral-700',
    accent: 'text-stone-800',
    pill: 'bg-stone-100 text-stone-800',
    tag: 'Studio VIP'
  },
  'Lavender Celestial': {
    name: 'Lavender Celestial',
    bg: 'bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500',
    cardBorder: 'border-purple-200/50',
    accent: 'text-purple-600',
    pill: 'bg-purple-100 text-purple-700',
    tag: 'Seasonal Glow'
  }
};

const AMOUNT_PRESETS = [1000, 2000, 3500, 5000, 7500, 10000];

export default function GiftCardsView({
  giftCards = [],
  onSaveGiftCard,
  onRedeemGiftCard,
  onDeleteGiftCard,
  onAddToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Quick Redemption State
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null);

  // Form State for new voucher
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    senderName: '',
    senderEmail: '',
    initialAmount: 2000,
    theme: 'Blush Rose Quartz',
    personalMessage: 'Enjoy a cute & pampering gel manicure at Nails by Sirii!',
    validityMonths: 12
  });

  // Calculate stats
  const totalCards = giftCards.length;
  const activeCards = giftCards.filter(c => c.status === 'Active');
  const totalGiftedValue = giftCards.reduce((acc, c) => acc + (Number(c.initialAmount) || 0), 0);
  const totalOutstanding = activeCards.reduce((acc, c) => acc + (Number(c.currentBalance) || 0), 0);
  const totalRedeemedValue = totalGiftedValue - totalOutstanding;

  // Filter cards
  const filteredCards = giftCards.filter(card => {
    const matchesSearch =
      card.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.senderName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && card.status === 'Active' && card.currentBalance > 0;
    if (statusFilter === 'Redeemed') return matchesSearch && (card.status === 'Redeemed' || card.currentBalance <= 0);
    return matchesSearch;
  });

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    if (onAddToast) onAddToast(`Voucher code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreateVoucher = async (e) => {
    e.preventDefault();
    if (!formData.recipientName.trim()) {
      if (onAddToast) onAddToast('Please specify the recipient name', 'error');
      return;
    }
    if (!formData.initialAmount || Number(formData.initialAmount) <= 0) {
      if (onAddToast) onAddToast('Please specify a valid voucher amount', 'error');
      return;
    }

    try {
      await onSaveGiftCard(formData);
      setShowIssueModal(false);
      setFormData({
        recipientName: '',
        recipientEmail: '',
        recipientPhone: '',
        senderName: '',
        senderEmail: '',
        initialAmount: 2000,
        theme: 'Blush Rose Quartz',
        personalMessage: 'Enjoy a cute & pampering gel manicure at Nails by Sirii!',
        validityMonths: 12
      });
      if (onAddToast) onAddToast('Gift voucher issued and alert sent to phone!', 'success');
    } catch (err) {
      if (onAddToast) onAddToast(err.message || 'Failed to issue gift voucher', 'error');
    }
  };

  const handleQuickRedeem = async (e) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      if (onAddToast) onAddToast('Enter a gift voucher code to redeem', 'error');
      return;
    }
    const amt = parseFloat(redeemAmount);
    if (!amt || amt <= 0) {
      if (onAddToast) onAddToast('Enter a valid redemption amount', 'error');
      return;
    }

    setRedeemLoading(true);
    setRedeemResult(null);
    try {
      const res = await onRedeemGiftCard(redeemCode.trim(), amt);
      setRedeemResult({
        success: true,
        deducted: res.deducted,
        remainingBalance: res.remainingBalance,
        code: redeemCode.trim().toUpperCase()
      });
      setRedeemCode('');
      setRedeemAmount('');
      if (onAddToast) {
        onAddToast(`Deducted ₹${Number(res.deducted).toLocaleString('en-IN')}. Remaining balance: ₹${Number(res.remainingBalance).toLocaleString('en-IN')}`, 'success');
      }
    } catch (err) {
      setRedeemResult({
        success: false,
        error: err.message || 'Redemption failed'
      });
      if (onAddToast) onAddToast(err.message || 'Failed to redeem voucher', 'error');
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-100 rounded-3xl p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              Gift Cards
            </span>
            <span className="text-xs text-rose-400 font-medium">Nails by Sirii</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
            Gift Cards & Studio Vouchers
          </h1>
          <p className="text-stone-500 text-sm max-w-xl">
            Issue cute digital gift vouchers, manage live balances, and verify instant in-studio redemptions with phone alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIssueModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl text-sm font-medium shadow-md shadow-rose-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Issue Gift Certificate
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Vouchers</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-800">{activeCards.length}</div>
          <div className="text-xs text-stone-400">of {totalCards} total generated</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Outstanding Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-800">
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-amber-600 font-medium">Available client credit</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Lifetime Gifted</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-800">
            ₹{totalGiftedValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-medium">Prepaid studio revenue</div>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-medium uppercase tracking-wider">Redeemed to Date</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-stone-800">
            ₹{totalRedeemedValue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-400">
            {totalGiftedValue > 0 ? Math.round((totalRedeemedValue / totalGiftedValue) * 100) : 0}% utilization
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Redemption Box & Voucher Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Redemption Station */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-stone-800">In-Studio Checkout</h3>
                  <p className="text-xs text-stone-400">Deduct gift certificate balance</p>
                </div>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

            <form onSubmit={handleQuickRedeem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                  Voucher Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. GIFT-SIRII-7789"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                  Amount to Deduct (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="e.g. 85.00"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={redeemLoading}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {redeemLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-300" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-rose-300" />
                )}
                Apply Deduction
              </button>
            </form>

            {redeemResult && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-1.5 transition-all ${
                  redeemResult.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {redeemResult.success ? (
                  <>
                    <div className="font-semibold flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Redemption Successful
                    </div>
                    <div>Applied: <span className="font-bold">₹{Number(redeemResult.deducted).toLocaleString('en-IN')}</span> to {redeemResult.code}</div>
                    <div>Remaining Voucher Balance: <span className="font-bold">₹{Number(redeemResult.remainingBalance).toLocaleString('en-IN')}</span></div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold flex items-center gap-1.5 text-rose-700">
                      <AlertCircle className="w-4 h-4" />
                      Redemption Failed
                    </div>
                    <div>{redeemResult.error}</div>
                  </>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
              <div>Vouchers are automatically tracked across invoices.</div>
              <div>Sirii receives an instant alert on newly generated certificates.</div>
            </div>
          </div>
        </div>

        {/* Voucher Directory & Live Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-stone-200/80 rounded-2xl p-3 shadow-sm">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search recipient or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {['All', 'Active', 'Redeemed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    statusFilter === tab
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-stone-500 hover:bg-stone-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredCards.length === 0 ? (
            <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-stone-800 text-lg">No Gift Vouchers Found</h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No gift certificates match your search query.'
                  : 'Start by issuing your first boutique gift certificate for Nails by Sirii.'}
              </p>
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-xl transition-all shadow-sm"
              >
                Create Certificate
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map((card) => {
                const theme = VOUCHER_THEMES[card.theme] || VOUCHER_THEMES['Blush Rose Quartz'];
                const isCopied = copiedCode === card.code;
                const isDepleted = card.currentBalance <= 0;

                return (
                  <div
                    key={card.id}
                    className="relative bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* Visual Card Face Preview */}
                    <div className={`p-5 text-white ${theme.bg} relative overflow-hidden`}>
                      {/* Subdued background decorative accent */}
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                      
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <span className="text-[10px] tracking-widest uppercase font-serif text-white/80">
                          {theme.tag} - Nails by Sirii
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-medium tracking-wide">
                          ₹{Number(card.currentBalance).toLocaleString('en-IN')} left
                        </span>
                      </div>

                      <div className="space-y-0.5 mb-4 relative z-10">
                        <div className="text-[11px] text-white/70">For</div>
                        <div className="text-xl font-serif font-bold tracking-tight text-white">
                          {card.recipientName}
                        </div>
                        {card.personalMessage && (
                          <p className="text-xs text-white/85 italic line-clamp-1 mt-1">
                            "{card.personalMessage}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/20 relative z-10">
                        <div>
                          <div className="text-[10px] text-white/70">From: {card.senderName || 'Atelier'}</div>
                          <div className="text-xs font-mono font-bold tracking-widest text-white/95 mt-0.5">
                            {card.code}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-white/70">Original Value</div>
                          <div className="text-base font-serif font-bold text-white">₹{Number(card.initialAmount).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions & Details Footer */}
                    <div className="p-4 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                            isDepleted
                              ? 'bg-stone-200 text-stone-600'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {isDepleted ? 'Fully Redeemed' : 'Active'}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          Issued {new Date(card.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyCode(card.code)}
                          title="Copy Voucher Code"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-all"
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setSelectedVoucherForPrint(card)}
                          title="Print Luxury Voucher"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-all"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete voucher ${card.code}?`)) {
                              onDeleteGiftCard(card.id);
                            }
                          }}
                          title="Delete Voucher"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Issue Gift Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border-t sm:border border-stone-200 max-h-[92vh] overflow-y-auto space-y-4">
            <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900">Issue Gift Certificate</h3>
                  <p className="text-xs text-stone-400">Generate a branded voucher code & alert</p>
                </div>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="space-y-4">
              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Genevieve Laurent"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. genevieve@atelier.com"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Sender Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Juliette or Nails by Sirii"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Sender Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. juliette@email.com"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Voucher Value (₹)
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {AMOUNT_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData({ ...formData, initialAmount: preset })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        Number(formData.initialAmount) === preset
                          ? 'bg-rose-500 text-white font-bold shadow-sm'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      ₹{preset.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={formData.initialAmount}
                    onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                    className="w-full pl-7 pr-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Theme Picker */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  Stationery Theme
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(VOUCHER_THEMES).map((themeName) => {
                    const t = VOUCHER_THEMES[themeName];
                    const isSelected = formData.theme === themeName;
                    return (
                      <button
                        key={themeName}
                        type="button"
                        onClick={() => setFormData({ ...formData, theme: themeName })}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/40'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-stone-800">{themeName}</div>
                          <div className="text-[10px] text-stone-400">{t.tag}</div>
                        </div>
                        <div className={`w-4 h-4 rounded-full ${t.bg}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Message */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                  Personal Message
                </label>
                <textarea
                  rows={2}
                  placeholder="Note for the recipient..."
                  value={formData.personalMessage}
                  onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-xs font-medium shadow-md shadow-rose-200 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Certificate & Send Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Luxury Certificate Modal */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-t sm:border border-stone-200 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto sm:hidden" />
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Print Preview - Studio Gift Card
              </span>
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* The Certificate Canvas */}
            <div
              id="printable-voucher-card"
              className={`p-8 rounded-3xl text-white shadow-xl relative overflow-hidden border-2 border-white/20 ${
                (VOUCHER_THEMES[selectedVoucherForPrint.theme] || VOUCHER_THEMES['Blush Rose Quartz']).bg
              }`}
            >
              <div className="text-center space-y-1 mb-6">
                <div className="text-[11px] uppercase tracking-widest text-white/80 font-serif">
                  Nail Studio Gift Voucher
                </div>
                <h2 className="text-2xl font-serif font-bold tracking-tight text-white">
                  Nails by Sirii
                </h2>
                <div className="text-[11px] text-white/70">Garhi Cantt - Dehradun</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center space-y-2 mb-6">
                <div className="text-[11px] text-white/80 uppercase tracking-wider">Entitles the bearer to</div>
                <div className="text-3xl font-serif font-bold text-white">
                  ₹{Number(selectedVoucherForPrint.initialAmount).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-white/90">
                  Towards any cute gel manicure, builder gel set, or nail art session.
                </div>
              </div>

              <div className="space-y-1 text-center mb-6">
                <div className="text-[11px] text-white/70">Prepared for</div>
                <div className="text-lg font-serif font-bold text-white">
                  {selectedVoucherForPrint.recipientName}
                </div>
                {selectedVoucherForPrint.personalMessage && (
                  <p className="text-xs text-white/90 italic max-w-xs mx-auto">
                    "{selectedVoucherForPrint.personalMessage}"
                  </p>
                )}
                {selectedVoucherForPrint.senderName && (
                  <div className="text-[11px] text-white/75 pt-1">
                    With warmth, {selectedVoucherForPrint.senderName}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/20 text-[10px] text-white/75 font-mono">
                <div>CODE: {selectedVoucherForPrint.code}</div>
                <div>EXPIRES: 12 MONTHS</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Gift Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

