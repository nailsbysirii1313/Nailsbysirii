import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  EyeOff,
  Eye,
  Sparkles,
  QrCode,
  X,
  ExternalLink,
  MessageCircle,
  Smartphone
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StudioLogo from './StudioLogo';

export default function ShareCatalogueModal({
  isOpen,
  onClose,
  settings,
  onAddToast
}) {
  const [copiedType, setCopiedType] = useState(null);
  const [activeTab, setActiveTab] = useState('noPrices'); // 'noPrices' | 'withPrices' | 'qr'

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const noPricesUrl = `${origin}/?hidePrices=true#catalogue`;
  const withPricesUrl = `${origin}/?hidePrices=false#catalogue`;

  const copyToClipboard = (url, type) => {
    navigator.clipboard.writeText(url);
    setCopiedType(type);
    if (onAddToast) {
      onAddToast(
        type === 'noPrices' ? 'Copied Catalogue (No Prices) Link!' : 'Copied Full Price Catalogue Link!',
        'Ready to paste in WhatsApp, Instagram DM, or client chat.',
        'success'
      );
    }
    setTimeout(() => setCopiedType(null), 3000);
  };

  const getWhatsAppShareUrl = (includePrices) => {
    const studioName = settings?.studioName || 'Nails by Sirii';
    const text = includePrices
      ? `✨ *${studioName} — Cute Nail Services & Pricing Menu (Dehradun 💕)*\n\nHey babe! Explore our natural builder gel (BIAB), Gel-X extensions, and cute nail art menu:\n${withPricesUrl}\n\nCan't wait to give you your dream nails!`
      : `✨ *${studioName} — Cute Nail Menu & Designs (Dehradun 💕)*\n\nHey babe! Explore our signature builder gel nails, extensions, and cute hand-painted designs:\n${noPricesUrl}\n\nCheck out the designs and let me know which one you'd love to get done!`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border-t sm:border border-atelier-rose200/80 space-y-5 sm:space-y-6 relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto sm:hidden" />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-atelier-cream/80 hover:bg-atelier-rose50 flex items-center justify-center text-atelier-charcoal hover:text-atelier-rose600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" className="justify-center mb-1" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-atelier-rose600 block">
              Share With Clients 💕
            </span>
            <h2 className="font-serif italic font-bold text-2xl text-atelier-noir">
              Share Nail Menu 💕
            </h2>
            <p className="text-xs text-atelier-muted max-w-sm mx-auto mt-0.5">
              Send your nail menu and cute designs directly to clients on WhatsApp. You can choose to show or hide prices!
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-atelier-cream/80 p-1 border border-atelier-champagneBorder/60 text-xs">
          <button
            onClick={() => setActiveTab('noPrices')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'noPrices'
                ? 'bg-white text-atelier-rose600 shadow-sm'
                : 'text-atelier-charcoal hover:text-atelier-noir'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Without Prices</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold">
              Cute 💕
            </span>
          </button>
          <button
            onClick={() => setActiveTab('withPrices')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'withPrices'
                ? 'bg-white text-atelier-rose600 shadow-sm'
                : 'text-atelier-charcoal hover:text-atelier-noir'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>With Prices</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-white text-atelier-rose600 shadow-sm'
                : 'text-atelier-charcoal hover:text-atelier-noir'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Tab Content 1: WITHOUT Prices */}
        {activeTab === 'noPrices' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-atelier-blush to-atelier-cream border border-atelier-rose200/70 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-atelier-rose500" />
                <h3 className="font-semibold text-xs text-atelier-noir">
                  Nail Menu Without Prices (Browse Designs)
                </h3>
              </div>
              <p className="text-[11px] text-atelier-muted leading-relaxed">
                Clients can see all your services, cute nail art ideas, and photos, with prices shown as <em>"Price on Request 💕"</em>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-atelier-charcoal">
                Shareable Link (No Prices)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={noPricesUrl}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/50 text-xs text-atelier-charcoal font-mono truncate"
                />
                <button
                  onClick={() => copyToClipboard(noPricesUrl, 'noPrices')}
                  className="px-4 py-2.5 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  {copiedType === 'noPrices' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={getWhatsAppShareUrl(false)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <a
                href={noPricesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab Content 2: WITH Prices */}
        {activeTab === 'withPrices' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-atelier-cream border border-atelier-champagneBorder space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="font-semibold text-xs text-atelier-noir">
                  Nail Menu With Prices
                </h3>
              </div>
              <p className="text-[11px] text-atelier-muted leading-relaxed">
                Shows exact prices for all your nail services, extensions, and cute nail art add-ons.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-atelier-charcoal">
                Shareable Link (With Prices)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={withPricesUrl}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-atelier-champagneBorder bg-atelier-cream/50 text-xs text-atelier-charcoal font-mono truncate"
                />
                <button
                  onClick={() => copyToClipboard(withPricesUrl, 'withPrices')}
                  className="px-4 py-2.5 rounded-xl bg-atelier-noir hover:bg-black text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  {copiedType === 'withPrices' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={getWhatsAppShareUrl(true)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <a
                href={withPricesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-atelier-champagneBorder hover:bg-atelier-cream text-atelier-charcoal font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab Content 3: QR Code */}
        {activeTab === 'qr' && (
          <div className="space-y-4 text-center animate-in fade-in py-1">
            <div className="p-4 bg-white rounded-2xl border border-atelier-champagneBorder inline-block shadow-sm">
              <QRCodeSVG
                value={noPricesUrl}
                size={160}
                level="M"
                includeMargin
                fgColor="#231F20"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-atelier-noir">
                Scan to View Cute Nail Menu (No Prices)
              </p>
              <p className="text-[10px] text-atelier-muted mt-0.5">
                Print for your studio desk or share on your Instagram story!
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(noPricesUrl, 'noPrices')}
              className="px-4 py-2 rounded-xl bg-atelier-cream border border-atelier-champagneBorder text-atelier-charcoal font-semibold text-xs hover:bg-atelier-rose50 transition-all inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Catalogue Link</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
