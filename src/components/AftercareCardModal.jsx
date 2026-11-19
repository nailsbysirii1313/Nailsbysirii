import React, { useState } from 'react';
import ModalPortal from './ModalPortal';
import {
  Gem,
  ShieldCheck,
  Droplets,
  Calendar,
  Printer,
  Copy,
  Check,
  X,
  Heart,
  Clock
} from 'lucide-react';

export default function AftercareCardModal({
  isOpen,
  onClose,
  client,
  appointment,
  settings,
  onAddToast
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const clientName = client?.name || appointment?.clientName || 'Valued Client';
  const serviceName = appointment?.serviceName || client?.preferredAesthetic || 'Bespoke Gel Service';
  const sessionDate = appointment?.date || new Date().toISOString().split('T')[0];

  // Calculate recommended infill date (21 days / 3 weeks out)
  const infillDateObj = new Date(sessionDate);
  infillDateObj.setDate(infillDateObj.getDate() + 21);
  const infillDateStr = infillDateObj.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const aftercareTextPlain = `NAIL ARCHITECTURE & AFTERCARE GUIDE
Nails by Sirii • Contemporary Nail Atelier • Garhi Cantt, Dehradun
Client: ${clientName}
Session: ${serviceName} (${sessionDate})
Recommended Infill Date: ${infillDateStr} (~3 Weeks)

1. GENTLE CARE IN FIRST 24-48 HOURS
Avoid prolonged submersion in hot water, steam baths, or saunas for 48 hours while the gel matrix fully cures.

2. DAILY CUTICLE HYDRATION
Apply pure cuticle oil or jojoba oil twice daily. Hydrated nails retain flexibility, preventing premature edge lifting.

3. NAILS ARE JEWELS, NOT TOOLS
Never use your nail apex to pry open cans, peel adhesives, or scrape surfaces. Use finger pads instead.

4. WEAR PROTECTIVE GLOVES
Shield your gel architecture and mirror-gloss topcoat by wearing gloves when handling household chemicals or washing dishes.

5. NEVER PEEL OR FORCIBLY REMOVE GEL
Forced peeling strips vital keratin layers from the natural nail plate. If you experience lifting or accidental chips, contact Sirii for a swift repair or professional safe removal.

Studio Inquiries & Urgent Fixes:
Phone: ${settings?.phone || '+91 73026 23493'}
Instagram: ${settings?.instagram || '@nails.by.sirii'}
Address: ${settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun 248003'}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(aftercareTextPlain);
      setCopied(true);
      if (onAddToast) onAddToast('Aftercare Copied', 'Guide text copied to clipboard for WhatsApp or SMS.');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Dedicated full-bleed non-scrolling backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-studio-ink/60 backdrop-blur-md transition-opacity print:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Scrollable floating dialog container */}
      <div className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto pointer-events-none animate-fade-in print:p-0 print:bg-white">
        <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-border-subtle shadow-studio relative max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:max-h-full print:w-full pointer-events-auto">
        <div className="w-12 h-1.5 rounded-full bg-border-subtle mx-auto mb-3 sm:hidden no-print" />
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-studio-canvas flex items-center justify-center text-text-muted hover:text-text-ink transition-colors print:hidden min-h-[36px] min-w-[36px]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Action Header (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle print:hidden">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-brand-wine" />
            <span className="text-xs font-bold text-text-ink uppercase tracking-wider">
              Atelier Aftercare Guide
            </span>
          </div>

          <div className="flex items-center gap-2 pr-8">
            <button
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-studio-canvas hover:bg-studio-subtle text-text-ink text-xs font-semibold border border-border-subtle flex items-center gap-1.5 transition-all min-h-[38px]"
              title="Copy formatted text to share via WhatsApp"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-brand-wine hover:bg-brand-wine/90 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all min-h-[38px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Printable Stationery Card Content */}
        <div className="space-y-6 bg-studio-canvas/50 p-6 rounded-2xl border border-border-subtle">
          {/* Card Top Branding */}
          <div className="text-center space-y-1">
            <span className="text-[10px] tracking-widest uppercase text-brand-wine font-bold block">
              Contemporary Nail Atelier • Dehradun
            </span>
            <h3 className="font-display font-semibold text-2xl text-text-ink tracking-tight">
              Nails by Sirii
            </h3>
            <p className="text-xs text-text-muted">
              {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun 248003'}
            </p>
          </div>

          {/* Client & Service Badge */}
          <div className="p-3.5 rounded-xl bg-studio-surface border border-border-subtle flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Prepared Exclusively For</span>
              <span className="font-display font-semibold text-base text-text-ink">{clientName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Service Rendered</span>
              <span className="font-semibold text-brand-wine text-xs">{serviceName}</span>
            </div>
          </div>

          {/* 5 Core Principles of Nail Longevity */}
          <div className="space-y-3 text-xs text-text-ink">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-studio-surface border border-border-subtle">
              <div className="w-7 h-7 rounded-lg bg-studio-canvas text-brand-wine flex items-center justify-center shrink-0 mt-0.5 border border-border-subtle">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-text-ink text-xs">1. Gentle Care in First 24-48 Hours</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Avoid super hot steam baths, saunas, or extended water immersion while your gel structure settles and bonds completely.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-studio-surface border border-border-subtle">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-text-ink text-xs">2. Oil Cuticles Daily</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Apply cuticle oil or jojoba oil twice daily. Hydrated natural nails retain flexibility, preventing lifting or cracking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-studio-surface border border-border-subtle">
              <div className="w-7 h-7 rounded-lg bg-studio-canvas text-brand-wine flex items-center justify-center shrink-0 mt-0.5 border border-border-subtle">
                <Gem className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-text-ink text-xs">3. Nails Are Jewels, Not Tools</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Never use nail tips to pry open soda cans, peel labels, or scrape hard surfaces. Protect the apex structure.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-studio-surface border border-border-subtle">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-text-ink text-xs">4. Wear Protective Gloves</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Wear rubber gloves during dishwashing and cleaning to shield your glossy topcoat from harsh household detergents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-studio-surface border border-border-subtle">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-brand-wine flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-text-ink text-xs">5. Never Peel or Pick Off Gel</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Forced peeling pulls off natural keratin layers. If an edge lifts or chips, message Sirii for a quick fix or gentle removal.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Infill Date Footer */}
          <div className="p-4 rounded-xl bg-studio-surface border border-border-subtle text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-wine block">
              Natural Nail Health Maintenance
            </span>
            <p className="text-xs font-semibold text-text-ink">
              Recommended Refill / Touch-up: <span className="font-bold text-brand-wine">{infillDateStr}</span> (~3 Weeks)
            </p>
            <p className="text-[11px] text-text-muted">
              Maintaining regular 3-4 week infills preserves nail balance and prevents stress fractures.
            </p>
          </div>

          <div className="text-center pt-2 text-[10px] text-text-muted font-display italic">
            Artisan craft & medical-grade care at Nails by Sirii, Dehradun
          </div>
        </div>
      </div>
    </div>
  
</ModalPortal>
  );
}
