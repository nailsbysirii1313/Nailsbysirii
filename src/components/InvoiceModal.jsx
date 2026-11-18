import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Printer,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Smartphone,
  Send,
  QrCode,
  ExternalLink,
  ShieldCheck,
  FileText,
  CreditCard
} from 'lucide-react';
import StudioLogo from './StudioLogo';

export default function InvoiceModal({
  invoice,
  settings,
  isOpen,
  onClose,
  onMarkPaid,
  onUpdateStatus,
  onOpenPublicInvoice
}) {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethodSelect, setPaymentMethodSelect] = useState('UPI (Google Pay)');
  const [utrNumber, setUtrNumber] = useState('');
  const [showQrExpanded, setShowQrExpanded] = useState(false);

  if (!isOpen || !invoice) return null;

  const studioName = settings?.studioName || 'Nails by Sirii';
  const tagline = settings?.tagline || 'Bespoke Nail Architecture & Japanese Gel Studio';
  const phone = settings?.phone || '+91 73026 23493';
  const email = settings?.email || 'hello@nailsbysirii.com';
  const address = settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun 248003';
  const currency = settings?.currency || '₹';
  const upiId = settings?.upiId || 'nailsbysirii@okaxis';
  const upiName = settings?.upiName || studioName;
  const paymentInstructions =
    settings?.paymentInstructions ||
    `UPI: 7302623493 / ${upiId} (GPay, PhonePe, Paytm) • Cash accepted at studio`;

  const isPaid = invoice.status === 'Paid';
  const balanceDue = isPaid ? 0 : (invoice.balanceDue !== undefined ? invoice.balanceDue : invoice.total);

  // Dynamic UPI URI for real-time mobile scanning and deep-linking
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName
  )}&am=${balanceDue}&cu=INR&tn=${encodeURIComponent('Nails by Sirii - Inv ' + invoice.invoiceNumber)}`;

  // Public client invoice link
  const clientInvoiceUrl = `${window.location.origin}/#invoice-${invoice.id}`;

  // Format Text Receipt for WhatsApp / SMS / Messaging
  const generateReceiptText = () => {
    const itemsList = (invoice.items || [])
      .map(
        (item) =>
          `- ${item.description} (x${item.quantity}) : ${currency}${Number(item.amount).toLocaleString('en-IN')}`
      )
      .join('\n');

    return `*${studioName.toUpperCase()}*
Bespoke Nail Architecture & Japanese Gel Studio • Dehradun
-----------------------------------
Official Studio Bill: ${invoice.invoiceNumber}
Client: ${invoice.clientName}
Date: ${invoice.date}

SERVICES & TREATMENTS:
${itemsList}

Subtotal: ${currency}${Number(invoice.subtotal).toLocaleString('en-IN')}${
      invoice.tip > 0 ? `\nArtist Gratuity: ${currency}${Number(invoice.tip).toLocaleString('en-IN')}` : ''
    }${
      invoice.depositDeducted > 0
        ? `\nDeposit Credited: -${currency}${Number(invoice.depositDeducted).toLocaleString('en-IN')}`
        : ''
    }${
      invoice.giftCardDeducted > 0
        ? `\nGift Voucher (${invoice.giftCardCode}): -${currency}${Number(invoice.giftCardDeducted).toLocaleString('en-IN')}`
        : ''
    }
Total Bill: ${currency}${Number(invoice.total).toLocaleString('en-IN')}
Balance Due: ${currency}${Number(balanceDue).toLocaleString('en-IN')}
Payment Status: ${invoice.status.toUpperCase()}

PAYMENT DETAILS:
${paymentInstructions}

Digital Bill Link:
${clientInvoiceUrl}

${invoice.notes ? `Note: "${invoice.notes}"\n\n` : ''}Thank you for visiting Nails by Sirii! Keep your natural nail architecture nourished daily with botanical cuticle oil.`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateReceiptText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(clientInvoiceUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber} - ${studioName}`,
          text: `Here is your official receipt from ${studioName} for ${currency}${Number(
            invoice.total
          ).toLocaleString('en-IN')}.`,
          url: clientInvoiceUrl
        });
      } catch (err) {
        console.log('Share dismissed or failed', err);
      }
    } else {
      handleCopyText();
    }
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(generateReceiptText());
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(targetUrl, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmPaid = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7D2838', '#C29358', '#FAF6F0', '#15803D']
    });
    if (onMarkPaid) {
      onMarkPaid(invoice.id, {
        paymentMethod: paymentMethodSelect,
        utr: utrNumber.trim() || undefined
      });
    }
    setShowPayModal(false);
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Scrollable floating dialog container */}
      <div className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto pointer-events-none animate-fade-in">
        <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-2xl w-full shadow-studio-float border-t sm:border border-border-subtle relative max-h-[96vh] flex flex-col font-sans my-auto pointer-events-auto">
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1.5 rounded-full bg-border-subtle mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Action Bar (Top) */}
        <div className="no-print p-4 bg-studio-canvas border-b border-border-subtle flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPaid
                  ? 'bg-status-emeraldBg text-status-emerald'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {invoice.status}
            </span>
            <span className="font-mono text-xs font-semibold text-text-secondary">
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Native Mobile Share / WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[38px]"
              title="Send bill on WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Native Web Share */}
            <button
              onClick={handleWebShare}
              className="px-3.5 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-secondary hover:bg-studio-canvas hover:text-text-ink flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[38px]"
              title="Share via device sheet"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Copy Receipt Text */}
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-secondary hover:bg-studio-subtle hover:text-brand-wine flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[38px]"
              title="Copy receipt text formatted for messaging"
            >
              {copiedText ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedText ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Print / Save PDF */}
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-secondary hover:bg-studio-canvas hover:text-text-ink flex items-center gap-1.5 transition-all shadow-xs active:scale-95 min-h-[38px]"
              title="Print studio invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Mark as Paid Action */}
            {!isPaid && (
              <button
                onClick={() => setShowPayModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-studio active:scale-95 min-h-[38px]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Paid</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-studio-subtle text-text-muted hover:text-text-ink transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Studio Invoice */}
        <div className="p-6 sm:p-10 invoice-printable bg-studio-surface space-y-7 text-xs text-text-secondary overflow-y-auto">
          {/* Header Branding with Studio Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-border-subtle">
            <div className="space-y-2">
              <StudioLogo logoUrl={settings?.studioLogoUrl} size="lg" showText className="mb-2" />
              <p className="text-xs text-text-muted tracking-wide">{tagline}</p>
              <div className="text-xs text-text-muted space-y-0.5 pt-1">
                <p>{address}</p>
                <p>
                  {phone} • {email}
                </p>
                {settings?.instagram && (
                  <p className="text-brand-wine font-semibold">{settings.instagram}</p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-wine block">
                Official Studio Tax Invoice
              </span>
              <p className="font-mono text-base font-bold text-text-ink">
                {invoice.invoiceNumber}
              </p>
              <div className="text-xs text-text-muted pt-1">
                <p>
                  Date: <span className="font-semibold text-text-secondary">{invoice.date}</span>
                </p>
                <p>
                  Due Date: <span className="font-semibold text-text-secondary">{invoice.dueDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Client Billed To & Status Bar */}
          <div className="p-4 rounded-2xl bg-studio-canvas border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Billed To Client:
              </span>
              <p className="font-display font-semibold text-lg text-text-ink mt-0.5">
                {invoice.clientName}
              </p>
              <p className="text-xs text-text-muted font-mono">{invoice.clientPhone}</p>
              {invoice.clientEmail && (
                <p className="text-xs text-text-muted">{invoice.clientEmail}</p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Payment Status
              </span>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                  isPaid
                    ? 'bg-status-emeraldBg text-status-emerald'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {invoice.status.toUpperCase()}
              </span>
              {invoice.paymentMethod && invoice.paymentMethod !== 'Pending' && (
                <p className="text-xs text-text-muted mt-1 font-medium">
                  Settled via {invoice.paymentMethod}
                  {invoice.utr && (
                    <span className="block font-mono text-[10px] text-text-ink">
                      UTR: {invoice.utr}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[340px]">
              <thead>
                <tr className="border-b border-border-subtle text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  <th className="py-2.5">Service / Treatment Description</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/60">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-3 font-medium text-text-ink pr-2">
                      {item.description}
                    </td>
                    <td className="py-3 text-center text-text-muted font-medium">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right text-text-secondary font-mono">
                      {currency}{Number(item.unitPrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right font-display font-bold text-text-ink">
                      {currency}{Number(item.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-start gap-6">
            {/* Dynamic UPI Payment QR Code Card */}
            {!isPaid ? (
              <div className="p-4 rounded-2xl bg-studio-canvas border border-border-subtle flex items-center gap-4 max-w-sm">
                <div className="bg-white p-2.5 rounded-xl shadow-xs border border-border-subtle shrink-0">
                  <QRCodeSVG
                    value={upiUri}
                    size={90}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-brand-wine">
                    <QrCode className="w-3 h-3" />
                    <span>Instant UPI Scan</span>
                  </div>
                  <p className="text-xs font-semibold text-text-ink">
                    Scan with GPay / PhonePe / Paytm
                  </p>
                  <p className="text-[10px] font-mono text-text-muted break-all">
                    {upiId}
                  </p>
                  <a
                    href={upiUri}
                    className="no-print inline-flex items-center gap-1 text-[11px] font-bold text-brand-wine hover:text-brand-wineHover pt-0.5 underline"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Pay {currency}{Number(balanceDue).toLocaleString('en-IN')} on this Phone</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800">
                <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold">Payment Settled</p>
                  <p className="text-xs text-emerald-700">
                    Thank you! Your transaction is fully verified and cleared.
                  </p>
                </div>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-text-muted">
                <span>Subtotal:</span>
                <span className="font-semibold text-text-secondary">
                  {currency}{Number(invoice.subtotal).toLocaleString('en-IN')}
                </span>
              </div>

              {invoice.tip > 0 && (
                <div className="flex justify-between text-text-muted">
                  <span>Artist Gratuity:</span>
                  <span className="font-semibold text-text-secondary">
                    {currency}{Number(invoice.tip).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {invoice.depositDeducted > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Deposit Credited:</span>
                  <span>-{currency}{Number(invoice.depositDeducted).toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.giftCardDeducted > 0 && (
                <div className="flex justify-between text-brand-wine font-medium">
                  <span>Gift Voucher ({invoice.giftCardCode}):</span>
                  <span>-{currency}{Number(invoice.giftCardDeducted).toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between font-display font-bold text-base text-text-ink pt-2 border-t border-border-subtle">
                <span>Total Invoice:</span>
                <span>{currency}{Number(invoice.total).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-baseline pt-1 text-brand-wine font-bold">
                <span>Balance Due:</span>
                <span className="text-2xl font-display">
                  {currency}{Number(balanceDue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions & Aftercare Footer */}
          <div className="pt-6 border-t border-border-subtle space-y-3">
            <div className="p-3.5 rounded-2xl bg-studio-canvas border border-border-subtle">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-wine block mb-1">
                Accepted Payment Methods
              </span>
              <p className="text-xs font-medium text-text-secondary leading-relaxed">
                {paymentInstructions}
              </p>
            </div>

            {invoice.notes && (
              <p className="text-center text-xs text-text-muted italic">
                "{invoice.notes}"
              </p>
            )}

            <div className="text-center pt-2 border-t border-dashed border-border-subtle text-xs text-text-muted space-y-0.5">
              <p className="font-semibold text-text-secondary">
                Bespoke Gel Aftercare: Apply cuticle oil twice daily. Wear gloves for household chores.
              </p>
              <p>For repairs or touch-ups, contact Sirii at {phone} or {email}.</p>
            </div>
          </div>
        </div>

        {/* Payment Confirmation Drawer/Modal */}
        {showPayModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-studio-ink/70 backdrop-blur-md">
            <div className="bg-studio-surface rounded-3xl p-6 max-w-sm w-full border border-border-subtle shadow-studio space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-display font-semibold text-base text-text-ink">
                    Record Payment
                  </h3>
                </div>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="p-1 rounded-full text-text-muted hover:text-text-ink min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-studio-canvas border border-border-subtle space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                  Amount Received
                </span>
                <p className="font-display font-bold text-2xl text-emerald-800">
                  {currency}{Number(balanceDue).toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-text-secondary">Client: {invoice.clientName}</p>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  Payment Mode *
                </label>
                <select
                  value={paymentMethodSelect}
                  onChange={(e) => setPaymentMethodSelect(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-surface outline-none text-base sm:text-xs font-semibold"
                >
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="UPI (Paytm)">UPI (Paytm)</option>
                  <option value="UPI (BHIM)">UPI (BHIM)</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                  <option value="Cash">Cash in Hand</option>
                  <option value="Net Banking / IMPS">Net Banking / IMPS</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-text-secondary mb-1">
                  UPI UTR / Reference No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/331209481920"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border-subtle bg-studio-surface outline-none text-base sm:text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-border-subtle text-text-secondary hover:bg-studio-canvas font-semibold min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-studio min-h-[40px]"
                >
                  Confirm Paid
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  
</ModalPortal>
  );
}
