import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Droplets,
  Calendar,
  Printer,
  Copy,
  Check,
  X,
  Heart,
  MessageSquare,
  Clock,
  Flame,
  Hand
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
  const infillDateStr = infillDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const sName = (serviceName || '').toLowerCase();
  const isExtensions = sName.includes('gel-x') || sName.includes('extension');
  const isBIAB = sName.includes('biab') || sName.includes('builder');

  const aftercareTextPlain = `CUTE NAIL AFTERCARE GUIDE 💕
Nails by Sirii • Garhi Cantt, Dehradun
Client: ${clientName}
Session: ${serviceName} (${sessionDate})
Recommended Refill Date: ${infillDateStr} (Around 3 Weeks)

1. BE GENTLE FOR FIRST 24-48 HOURS ⏰
Avoid very hot steaming baths or saunas for the first 48 hours while your gel cures completely.

2. OIL YOUR CUTICLES DAILY 🌸
Apply cuticle oil or coconut oil twice a day to keep your cuticles soft, healthy, and hydrated!

3. JEWELS, NOT TOOLS 💅
Don't use your nails to open drink cans or scrape things. Use finger pads instead!

4. WEAR GLOVES FOR DISHES 🧤
Protect your glossy shine by wearing gloves when doing dishes or handling harsh cleaning liquids.

5. NEVER PEEL OFF GEL 💕
Peeling gel can harm your natural nails. If a nail lifts or chips, message Sirii for a quick fix or gentle removal!

Studio Inquiries & Quick Nail Fixes:
Phone: ${settings?.phone || '+91 73026 23493'}
Instagram: ${settings?.instagram || '@nails.by.sirii'}
${settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun 248003'}`;

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-atelier-champagneBorder shadow-xl relative max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:max-h-full print:w-full">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden no-print" />
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 rounded-full bg-atelier-cream flex items-center justify-center text-atelier-muted hover:text-atelier-noir transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Action Header (Hidden on Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-atelier-champagneBorder/60 print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-atelier-rose500" />
            <span className="text-xs font-bold text-atelier-noir uppercase tracking-wider">
              Cute Nail Aftercare Card 💕
            </span>
          </div>

          <div className="flex items-center gap-2 pr-8">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-atelier-cream/80 hover:bg-atelier-rose50 text-atelier-charcoal text-xs font-semibold border border-atelier-champagneBorder flex items-center gap-1.5 transition-all"
              title="Copy formatted text to share via WhatsApp or SMS"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold shadow-soft flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Card</span>
            </button>
          </div>
        </div>

        {/* Printable Stationery Card Content */}
        <div className="space-y-6 bg-gradient-to-b from-atelier-cream/40 via-white to-atelier-blush/30 p-6 rounded-2xl border border-atelier-champagneBorder/80">
          {/* Card Top Branding */}
          <div className="text-center space-y-1">
            <span className="text-[10px] tracking-widest uppercase text-atelier-rose600 font-bold block">
              Cute & Aesthetic Nail Studio in Dehradun 💕
            </span>
            <h3 className="font-serif italic font-bold text-2xl text-atelier-noir tracking-tight">
              Nails by Sirii
            </h3>
            <p className="text-[11px] text-atelier-muted">
              {settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantonment, Garhi Cantt, Dehradun 248003'}
            </p>
          </div>

          {/* Client & Service Badge */}
          <div className="p-3.5 rounded-xl bg-white border border-atelier-champagneBorder/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-atelier-muted uppercase tracking-wider block">Prepared Exclusively For</span>
              <span className="font-serif italic font-bold text-base text-atelier-noir">{clientName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-atelier-muted uppercase tracking-wider block">Service Rendered</span>
              <span className="font-semibold text-atelier-rose600 text-xs">{serviceName}</span>
            </div>
          </div>

          {/* 5 Core Principles of Nail Longevity */}
          <div className="space-y-3.5 text-xs text-atelier-charcoal">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-atelier-champagneBorder/60">
              <div className="w-7 h-7 rounded-lg bg-atelier-rose50 text-atelier-rose500 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-atelier-noir text-xs">1. Be Gentle for the First 24-48 Hours ⏰</h4>
                <p className="text-[11px] text-atelier-muted leading-relaxed">
                  Avoid super hot steaming baths, saunas, or pools for the first 48 hours while your gel settles and bonds completely.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-atelier-champagneBorder/60">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-atelier-noir text-xs">2. Oil Your Cuticles Daily 🌸</h4>
                <p className="text-[11px] text-atelier-muted leading-relaxed">
                  Massage cuticle oil or coconut oil around your nails twice daily. Hydrated nails stay flexible and won't lift or break!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-atelier-champagneBorder/60">
              <div className="w-7 h-7 rounded-lg bg-atelier-champagne text-atelier-gold flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-atelier-noir text-xs">3. Nails Are Jewels, Not Tools 💅</h4>
                <p className="text-[11px] text-atelier-muted leading-relaxed">
                  Never use your nail tips to open soda cans, peel stickers, or scrape things. Use finger pads instead!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-atelier-champagneBorder/60">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-atelier-noir text-xs">4. Protect Your Glossy Shine 🧤</h4>
                <p className="text-[11px] text-atelier-muted leading-relaxed">
                  Wear rubber gloves when washing dishes or using cleaning liquids so your top coat stays ultra shiny and chip-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-atelier-champagneBorder/60">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-atelier-noir text-xs">5. Never Peel or Pick Off Gel 💕</h4>
                <p className="text-[11px] text-atelier-muted leading-relaxed">
                  Peeling gel pulls off layers of your real nail! If an edge lifts or catches hair, text Sirii for a quick fix or gentle removal.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Infill Date Footer */}
          <div className="p-4 rounded-xl bg-atelier-rose50 border border-atelier-rose200/80 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-atelier-rose600 block">
              Keep Your Nails Healthy & Strong 💕
            </span>
            <p className="text-xs font-semibold text-atelier-noir">
              Recommended Refill / Touch-up: <span className="font-bold text-atelier-rose600">{infillDateStr}</span> (Around 3 Weeks)
            </p>
            <p className="text-[10px] text-atelier-muted">
              Getting a refill around 3-4 weeks keeps your natural nails safe, balanced, and looking brand new!
            </p>
          </div>

          <div className="text-center pt-2 text-[10px] text-atelier-muted font-serif italic">
            Handcrafted with love at Nails by Sirii, Dehradun 💕
          </div>
        </div>
      </div>
    </div>
  );
}

