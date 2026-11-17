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
        type === 'noPrices' ? 'Copied Catalogue Link (Without Prices)' : 'Copied Full Price Catalogue Link',
        'Ready to paste in WhatsApp, Instagram DM, or client consultation.',
        'success'
      );
    }
    setTimeout(() => setCopiedType(null), 3000);
  };

  const getWhatsAppShareUrl = (includePrices) => {
    const studioName = settings?.studioName || 'Nails by Sirii';
    const text = includePrices
      ? `*${studioName} — Bespoke Nail Architecture & Menu (Dehradun)*\n\nExplore our Japanese builder gel (BIAB), precision Gel-X extensions, and bespoke nail art catalogue:\n${withPricesUrl}\n\nTransparent pricing and honest time estimates.`
      : `*${studioName} — Bespoke Nail Architecture & Lookbook (Dehradun)*\n\nExplore our signature nail sets, curated lookbook, and hand-painted art designs:\n${noPricesUrl}\n\nBrowse our portfolio and let us know which set you'd love to reserve!`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-studio-ink/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-studio-float border-t sm:border border-studio-border space-y-5 sm:space-y-6 relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto sm:hidden" />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-studio-subtle hover:bg-studio-wineLight flex items-center justify-center text-studio-secondary hover:text-studio-wine transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <StudioLogo logoUrl={settings?.studioLogoUrl} size="md" className="justify-center mb-1" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-studio-wine block">
              Client Portfolio Sharing
            </span>
            <h2 className="font-display italic font-bold text-2xl text-studio-ink">
              Share Studio Catalogue
            </h2>
            <p className="text-xs text-studio-secondary max-w-sm mx-auto mt-0.5">
              Send your bespoke portfolio and service menu directly to clients on WhatsApp. Choose between transparent pricing or portfolio preview mode.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-studio-subtle p-1 border border-studio-border text-xs">
          <button
            onClick={() => setActiveTab('noPrices')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'noPrices'
                ? 'bg-studio-surface text-studio-wine shadow-studio'
                : 'text-studio-secondary hover:text-studio-ink'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Without Prices</span>
          </button>
          <button
            onClick={() => setActiveTab('withPrices')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'withPrices'
                ? 'bg-studio-surface text-studio-wine shadow-studio'
                : 'text-studio-secondary hover:text-studio-ink'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>With Prices</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-studio-surface text-studio-wine shadow-studio'
                : 'text-studio-secondary hover:text-studio-ink'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Tab Content 1: WITHOUT Prices */}
        {activeTab === 'noPrices' && (
          <div className="space-y-4 animate-in fade-in text-xs font-sans">
            <div className="p-4 rounded-2xl bg-studio-wineLight/60 border border-studio-border space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-studio-wine" />
                <h3 className="font-semibold text-xs text-studio-ink">
                  Portfolio Mode (Prices Hidden)
                </h3>
              </div>
              <p className="text-[11px] text-studio-secondary leading-relaxed">
                Clients can browse all treatments, customizer shapes, and curated lookbook sets with prices shown as <em>"Price on Request"</em>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-studio-secondary">
                Shareable Portfolio Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={noPricesUrl}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 text-xs text-studio-secondary font-mono truncate"
                />
                <button
                  onClick={() => copyToClipboard(noPricesUrl, 'noPrices')}
                  className="px-4 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-studio"
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
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-studio"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <a
                href={noPricesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-studio-border hover:bg-studio-subtle text-studio-secondary font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab Content 2: WITH Prices */}
        {activeTab === 'withPrices' && (
          <div className="space-y-4 animate-in fade-in text-xs font-sans">
            <div className="p-4 rounded-2xl bg-studio-subtle border border-studio-border space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <h3 className="font-semibold text-xs text-studio-ink">
                  Transparent Pricing Menu
                </h3>
              </div>
              <p className="text-[11px] text-studio-secondary leading-relaxed">
                Displays exact transparent pricing and honest session durations for every service and art add-on.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-studio-secondary">
                Shareable Pricing Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={withPricesUrl}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 text-xs text-studio-secondary font-mono truncate"
                />
                <button
                  onClick={() => copyToClipboard(withPricesUrl, 'withPrices')}
                  className="px-4 py-2.5 rounded-xl bg-studio-ink hover:bg-black text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-studio"
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
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-studio"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <a
                href={withPricesUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl border border-studio-border hover:bg-studio-subtle text-studio-secondary font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Preview</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab Content 3: QR Code */}
        {activeTab === 'qr' && (
          <div className="space-y-4 text-center animate-in fade-in py-1 text-xs font-sans">
            <div className="p-4 bg-white rounded-2xl border border-studio-border inline-block shadow-studio">
              <QRCodeSVG
                value={noPricesUrl}
                size={160}
                level="M"
                includeMargin
                fgColor="#1C1917"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-studio-ink">
                Scan to View Digital Studio Portfolio
              </p>
              <p className="text-[10px] text-studio-muted mt-0.5">
                Display on your studio counter or post to Instagram highlights.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(noPricesUrl, 'noPrices')}
              className="px-4 py-2 rounded-xl bg-studio-subtle border border-studio-border text-studio-ink font-semibold text-xs hover:bg-studio-wineLight transition-all inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Portfolio URL</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
