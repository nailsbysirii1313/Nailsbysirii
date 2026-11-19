import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Bell, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import ModalPortal from './ModalPortal';

export default function QrModal({ isOpen, onClose, settings, onTestAlert }) {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);

  if (!isOpen) return null;

  const topic = settings?.ntfyTopic || 'nails-by-sirii-alerts';
  const server = settings?.ntfyServer || 'https://ntfy.sh';
  const subscribeUrl = `${server.replace(/\/$/, '')}/${topic}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(subscribeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    await onTestAlert();
    setTesting(false);
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
      <div
        className="fixed inset-0 z-[71] flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-studio border-t sm:border border-border-subtle relative max-h-[90vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain"
        >
        <div className="w-12 h-1.5 rounded-full bg-border-subtle mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-studio-canvas text-brand-wine flex items-center justify-center mb-3 border border-border-subtle">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-xl text-text-ink">
            Connect Alerts to Your Phone
          </h3>
          <p className="text-xs text-text-muted mt-1 max-w-xs mx-auto leading-relaxed">
            Scan with your iPhone or Android camera to instantly receive client booking reminders via the free NTFY app.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-studio-canvas/70 rounded-2xl border border-border-subtle mb-6">
          <div className="p-3 bg-white rounded-2xl shadow-xs border border-border-subtle">
            <QRCodeSVG
              value={subscribeUrl}
              size={180}
              level="H"
              fgColor="#1C1917"
              bgColor="#FFFFFF"
            />
          </div>
          <span className="text-xs font-mono text-text-ink mt-3 font-semibold">
            Topic: {topic}
          </span>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              1
            </span>
            <p className="text-text-muted leading-relaxed">
              Scan the QR code above with your phone camera, or open the free{' '}
              <span className="font-semibold text-text-ink">NTFY</span> app (iOS / Android).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              2
            </span>
            <p className="text-text-muted leading-relaxed">
              Tap <span className="font-semibold text-text-ink">"Subscribe to topic"</span> and allow notifications. Zero account or password required.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
              3
            </span>
            <p className="text-text-muted leading-relaxed">
              Press the test button below to verify your phone buzzes immediately.
            </p>
          </div>
        </div>

        {/* URL Box & Actions */}
        <div className="flex items-center gap-2 p-2 bg-studio-canvas/60 rounded-xl border border-border-subtle mb-5">
          <input
            type="text"
            readOnly
            value={subscribeUrl}
            className="bg-transparent text-xs text-text-ink px-2 font-mono flex-1 outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-studio-surface border border-border-subtle text-xs font-semibold text-text-ink hover:bg-studio-subtle transition-colors shadow-xs min-h-[38px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-text-muted" />}
            <span>{copied ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Test Alert Button */}
        <div className="flex items-center gap-3">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-border-subtle text-text-ink hover:bg-studio-canvas text-xs font-semibold transition-all text-center min-h-[44px]"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-wine" />
            <span>Open in Browser</span>
          </a>

          <button
            onClick={handleTest}
            disabled={testing}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl bg-brand-wine hover:bg-brand-wine/90 text-white text-xs font-semibold transition-all shadow-studio active:scale-95 disabled:opacity-50 min-h-[44px]"
          >
            <Bell className={`w-3.5 h-3.5 ${testing ? 'animate-bounce' : ''}`} />
            <span>{testing ? 'Dispatching...' : 'Send Test Alert'}</span>
          </button>
        </div>
      </div>
    </div>
  
</ModalPortal>
  );
}
