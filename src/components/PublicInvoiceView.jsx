import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import {
  Printer,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Send,
  Smartphone,
  ShieldCheck,
  QrCode,
  Heart,
  PhoneCall
} from 'lucide-react';
import StudioLogo from './StudioLogo';

export default function PublicInvoiceView({
  invoice,
  settings,
  onMarkPaid,
  onReturnToStudio
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedTip, setSelectedTip] = useState(invoice?.tip || 0);

  if (!invoice) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="font-serif italic text-lg text-atelier-noir">
          No Invoice Selected
        </p>
        <button
          onClick={onReturnToStudio}
          className="px-4 py-2 rounded-xl bg-atelier-rose500 text-white text-xs font-semibold"
        >
          Return to Studio OS
        </button>
      </div>
    );
  }

  const studioName = settings?.studioName || 'Nails by Sirii';
  const tagline = settings?.tagline || 'Affordable Nail Studio & Academy in Dehradun 💕';
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
  const currentTotal = Number(invoice.subtotal || 0) + Number(selectedTip || 0);
  const balanceDue = isPaid
    ? 0
    : Math.max(0, currentTotal - Number(invoice.depositDeducted || 0) - Number(invoice.giftCardDeducted || 0));

  // Dynamic UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    upiName
  )}&am=${balanceDue}&cu=INR&tn=${encodeURIComponent('Nails by Sirii - Inv ' + invoice.invoiceNumber)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber} - ${studioName}`,
          text: `Your digital receipt from ${studioName} for ${currency}${Number(balanceDue).toLocaleString('en-IN')}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Dismissed share', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    const cleanPhone = (invoice.clientPhone || '').replace(/[^0-9]/g, '');
    const text = `Invoice ${invoice.invoiceNumber} from ${studioName}\nBalance Due: ${currency}${Number(balanceDue).toLocaleString('en-IN')}\nPay via UPI: ${upiId}\nView full bill: ${window.location.href}`;
    const target = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(target, '_blank');
  };

  const handlePayClick = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E898A9', '#C24D68', '#C59B63', '#FAF7F5']
    });
    if (onMarkPaid) {
      onMarkPaid(invoice.id, {
        paymentMethod: 'UPI (Client Settled)',
        tip: selectedTip
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Banner Navigation */}
      <div className="no-print bg-white/90 backdrop-blur-md border border-atelier-champagneBorder rounded-2xl p-3.5 flex items-center justify-between text-xs shadow-sm">
        <button
          onClick={onReturnToStudio}
          className="flex items-center gap-1.5 text-atelier-charcoal hover:text-atelier-rose600 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studio OS</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleWhatsAppShare}
            className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-1 shadow-xs active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-atelier-charcoal font-semibold flex items-center gap-1 shadow-xs active:scale-95"
          >
            {copiedLink ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{copiedLink ? 'Link Copied' : 'Share Bill'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-atelier-charcoal font-semibold flex items-center gap-1 shadow-xs active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Printable Studio Bill / Receipt */}
      <div className="bg-white rounded-3xl border border-atelier-champagneBorder shadow-float p-6 sm:p-12 invoice-printable space-y-8 text-xs text-atelier-charcoal">
        {/* Studio Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-atelier-champagneBorder">
          <div className="space-y-2">
            <StudioLogo logoUrl={settings?.studioLogoUrl} size="lg" showText className="mb-2" />
            <p className="text-xs text-atelier-muted">
              {tagline}
            </p>
            <div className="pt-1 text-[11px] text-atelier-muted space-y-0.5">
              <p>{address}</p>
              <p>
                {phone} • {email}
              </p>
              {settings?.instagram && (
                <p className="text-atelier-rose600 font-semibold">{settings.instagram}</p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
              Official Client Receipt
            </span>
            <p className="font-mono text-base font-bold text-atelier-noir">
              {invoice.invoiceNumber}
            </p>
            <div className="text-[11px] text-atelier-muted pt-1">
              <p>
                Issue Date: <strong className="text-atelier-charcoal">{invoice.date}</strong>
              </p>
              <p>
                Due Date: <strong className="text-atelier-charcoal">{invoice.dueDate}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Client & Status Details */}
        <div className="p-5 rounded-2xl bg-atelier-cream/50 border border-atelier-champagneBorder/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
              Billed To
            </span>
            <p className="font-serif italic font-bold text-lg text-atelier-noir mt-0.5">
              {invoice.clientName}
            </p>
            <p className="text-xs text-atelier-muted font-medium">{invoice.clientPhone}</p>
            {invoice.clientEmail && (
              <p className="text-xs text-atelier-muted">{invoice.clientEmail}</p>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-muted block">
              Payment Status
            </span>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {invoice.status.toUpperCase()}
            </span>
            {isPaid && invoice.paymentMethod && (
              <p className="text-[11px] text-atelier-muted mt-1 font-medium">
                via {invoice.paymentMethod}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-atelier-champagneBorder text-[10px] font-bold uppercase tracking-wider text-atelier-muted">
                <th className="py-2.5">Service / Treatment Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-atelier-champagneBorder/50">
              {(invoice.items || []).map((item, idx) => (
                <tr key={idx} className="text-xs">
                  <td className="py-3 font-medium text-atelier-noir pr-2">
                    {item.description}
                  </td>
                  <td className="py-3 text-center text-atelier-muted">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-atelier-charcoal">
                    {currency}{Number(item.unitPrice).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-right font-serif font-bold text-atelier-noir">
                    {currency}{Number(item.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip Selector (Active when unpaid) */}
        {!isPaid && (
          <div className="no-print p-4 rounded-2xl bg-atelier-blush/60 border border-atelier-rose200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-rose600 block">
              Add Artist Gratuity (Optional)
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[0, 100, 200, 500].map((tipAmt) => (
                <button
                  key={tipAmt}
                  type="button"
                  onClick={() => setSelectedTip(tipAmt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedTip === tipAmt
                      ? 'bg-atelier-rose500 text-white shadow-xs'
                      : 'bg-white border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-rose50'
                  }`}
                >
                  {tipAmt === 0 ? 'No Tip' : `+${currency}${tipAmt}`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="pt-4 border-t border-atelier-champagneBorder flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Dynamic UPI QR Code Card */}
          {!isPaid ? (
            <div className="p-4 rounded-2xl bg-atelier-blush/60 border border-atelier-rose200/80 flex items-center gap-4 max-w-sm">
              <div className="bg-white p-2 rounded-xl shadow-xs border border-rose-100 shrink-0">
                <QRCodeSVG
                  value={upiUri}
                  size={95}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-atelier-rose600">
                  <QrCode className="w-3 h-3" />
                  <span>Instant UPI Scan</span>
                </div>
                <p className="text-[11px] font-semibold text-atelier-charcoal">
                  Scan with GPay / PhonePe / Paytm / BHIM
                </p>
                <p className="text-[10px] font-mono text-atelier-muted break-all">
                  {upiId}
                </p>
                <a
                  href={upiUri}
                  className="no-print inline-flex items-center gap-1 text-[10px] font-bold text-atelier-rose600 hover:text-atelier-rose700 pt-0.5 underline"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Tap to open UPI App on Phone</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3 text-emerald-800">
              <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Payment Settled</p>
                <p className="text-[11px] text-emerald-700">
                  Thank you for visiting Nails by Sirii!
                </p>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-atelier-muted">
              <span>Subtotal:</span>
              <span className="font-semibold text-atelier-charcoal">
                {currency}{Number(invoice.subtotal).toLocaleString('en-IN')}
              </span>
            </div>

            {selectedTip > 0 && (
              <div className="flex justify-between text-atelier-muted">
                <span>Artist Gratuity:</span>
                <span className="font-semibold text-atelier-charcoal">
                  {currency}{Number(selectedTip).toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {invoice.depositDeducted > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Deposit Credited:</span>
                <span>-{currency}{Number(invoice.depositDeducted).toLocaleString('en-IN')}</span>
              </div>
            )}

            {invoice.giftCardDeducted > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Gift Voucher ({invoice.giftCardCode}):</span>
                <span>-{currency}{Number(invoice.giftCardDeducted).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between font-serif font-bold text-base text-atelier-noir pt-2 border-t border-atelier-champagneBorder">
              <span>Total:</span>
              <span>{currency}{Number(currentTotal).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-baseline pt-1 text-atelier-rose600 font-bold">
              <span>Balance Due:</span>
              <span className="text-2xl font-serif">
                {currency}{Number(balanceDue).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods Box & 1-Tap Mobile Intent */}
        <div className="pt-6 border-t border-atelier-champagneBorder space-y-4">
          <div className="p-4 rounded-2xl bg-atelier-blush border border-atelier-rose200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-atelier-rose600 block mb-1">
              Payment Instructions
            </span>
            <p className="text-xs font-medium text-atelier-charcoal leading-relaxed">
              {paymentInstructions}
            </p>
          </div>

          {/* 1-Tap Mobile Intent & Simulated Settled */}
          {!isPaid && (
            <div className="no-print pt-2 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={upiUri}
                className="w-full py-3.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs transition-all shadow-soft active:scale-95 flex items-center justify-center gap-2 text-center"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay {currency}{Number(balanceDue).toLocaleString('en-IN')} with UPI (GPay / PhonePe / Paytm)</span>
              </a>

              <button
                type="button"
                onClick={handlePayClick}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-soft active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Paid</span>
              </button>
            </div>
          )}

          {invoice.notes && (
            <p className="text-center text-xs text-atelier-muted italic pt-2">
              "{invoice.notes}"
            </p>
          )}

          {/* Luxury Aftercare Instructions Card */}
          <div className="pt-4 border-t border-dashed border-stone-200 text-[10px] text-atelier-muted space-y-1">
            <p className="font-semibold text-atelier-charcoal">
              Cute Nail Longevity Tips 💕:
            </p>
            <p>1. Oil daily — apply cuticle oil or coconut oil daily to keep your cuticles soft & hydrated.</p>
            <p>2. Treat your nails like jewels, not tools — avoid opening cans with nail tips.</p>
            <p>3. Next refill — get a refill / touch-up within 3 to 4 weeks to keep your nails fresh and safe.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
