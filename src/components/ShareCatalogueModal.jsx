import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Palette,
  QrCode,
  X,
  ExternalLink,
  MessageCircle,
  BookOpen,
  Ribbon,
  Gem
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StudioLogo from './StudioLogo';

export default function ShareCatalogueModal({
  isOpen,
  onClose,
  settings,
  onAddToast
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link'); // 'link' | 'qr'

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const catalogueUrl = `${origin}/#catalogue`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(catalogueUrl);
    setCopied(true);
    if (onAddToast) {
      onAddToast(
        'Catalogue Link Copied',
        'Ready to paste in WhatsApp, Instagram DM, or client consultation.',
        'success'
      );
    }
    setTimeout(() => setCopied(false), 3000);
  };

  const getWhatsAppShareUrl = () => {
    const studioName = settings?.studioName || 'Nails by Sirii';
    const text = `*${studioName} — Bespoke Nail Design Catalogue & Booklet (Dehradun)*\n\nExplore our signature acrylic nail sets, Japanese builder gel (BIAB), Gel-X extensions, and curated design booklet:\n${catalogueUrl}\n\nBrowse design options or bring any photo you found on Pinterest/Instagram for a handcrafted custom set!`;

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
              Client Booklet Sharing
            </span>
            <h2 className="font-display italic font-bold text-2xl text-studio-ink">
              Share Design Catalogue
            </h2>
            <p className="text-xs text-studio-secondary max-w-sm mx-auto mt-0.5">
              Send your curated design booklet directly to clients. Clients can browse acrylic nail options, BIAB, Gel-X, or share their own internet inspo.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-studio-subtle p-1 border border-studio-border text-xs">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'link'
                ? 'bg-studio-surface text-studio-wine shadow-studio'
                : 'text-studio-secondary hover:text-studio-ink'
            }`}
          >
            <Ribbon className="w-3.5 h-3.5" />
            <span>Design Booklet Link</span>
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
            <span>Studio QR Code</span>
          </button>
        </div>

        {/* Tab Content 1: Design Booklet Link */}
        {activeTab === 'link' && (
          <div className="space-y-4 animate-in fade-in text-xs font-sans">
            <div className="p-4 rounded-2xl bg-studio-wineLight/60 border border-studio-border space-y-1.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-studio-wine" />
                <h3 className="font-semibold text-xs text-studio-ink">
                  Inspiration Catalogue & Booklet
                </h3>
              </div>
              <p className="text-[11px] text-studio-secondary leading-relaxed">
                Clients can browse acrylic nail sculpture sets, BIAB, Gel-X extensions, and hand-painted art, customize their shape/length, or request custom designs found online.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-studio-secondary">
                Public Catalogue URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={catalogueUrl}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-studio-border bg-studio-canvas/50 text-xs text-studio-secondary font-mono truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-studio active:scale-95"
                >
                  {copied ? (
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
                href={getWhatsAppShareUrl()}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-studio"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </a>
              <a
                href={catalogueUrl}
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

        {/* Tab Content 2: QR Code */}
        {activeTab === 'qr' && (
          <div className="space-y-4 text-center animate-in fade-in py-1 text-xs font-sans">
            <div className="p-4 bg-white rounded-2xl border border-studio-border inline-block shadow-studio">
              <QRCodeSVG
                value={catalogueUrl}
                size={160}
                level="M"
                includeMargin
                fgColor="#1C1917"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-studio-ink">
                Scan to View Design Catalogue Booklet
              </p>
              <p className="text-[10px] text-studio-muted mt-0.5">
                Display on your studio counter in Garhi Cantt or post to Instagram stories.
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-studio-subtle border border-studio-border text-studio-ink font-semibold text-xs hover:bg-studio-wineLight transition-all inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Catalogue URL</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
