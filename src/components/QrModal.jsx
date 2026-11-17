import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, Bell, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-float border-t sm:border border-atelier-champagneBorder relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-atelier-rose100 text-atelier-rose500 flex items-center justify-center mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-serif italic font-bold text-xl text-atelier-noir">
            Connect Alerts to Your Phone
          </h3>
          <p className="text-xs text-atelier-muted mt-1 max-w-xs mx-auto">
            Scan with your iPhone or Android camera to instantly receive upcoming client reminders via Ntify.
          </p>
        </div>

        {/* QR Code Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-atelier-rose50/60 rounded-2xl border border-atelier-rose200/80 mb-6">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-atelier-champagneBorder">
            <QRCodeSVG
              value={subscribeUrl}
              size={180}
              level="H"
              fgColor="#231F20"
              bgColor="#FFFFFF"
            />
          </div>
          <span className="text-[11px] font-mono text-atelier-charcoal mt-3 font-semibold">
            Topic: {topic}
          </span>
        </div>

        {/* 3 Step Setup Guide */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <p className="text-atelier-charcoal leading-relaxed">
              Scan the QR code above with your phone camera, or open the free{' '}
              <span className="font-semibold text-atelier-noir">ntfy</span> app (iOS / Android / Web).
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <p className="text-atelier-charcoal leading-relaxed">
              Tap <span className="font-semibold text-atelier-noir">"Subscribe to topic"</span> and allow notifications. No password or signup required!
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-atelier-rose100 text-atelier-rose600 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <p className="text-atelier-charcoal leading-relaxed">
              Press the test button below to verify your phone buzzes immediately.
            </p>
          </div>
        </div>

        {/* URL Box & Actions */}
        <div className="flex items-center gap-2 p-2 bg-atelier-cream rounded-xl border border-atelier-champagneBorder mb-5">
          <input
            type="text"
            readOnly
            value={subscribeUrl}
            className="bg-transparent text-xs text-atelier-charcoal px-2 font-mono flex-1 outline-none"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-atelier-champagneBorder text-xs font-semibold text-atelier-noir hover:bg-atelier-rose50 hover:text-atelier-rose600 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Test Alert Button */}
        <div className="flex items-center gap-3">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-atelier-champagneBorder text-atelier-charcoal hover:bg-atelier-cream text-xs font-semibold transition-all text-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Browser</span>
          </a>

          <button
            onClick={handleTest}
            disabled={testing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white text-xs font-semibold transition-all shadow-soft active:scale-95 disabled:opacity-50"
          >
            <Bell className={`w-3.5 h-3.5 ${testing ? 'animate-bounce' : ''}`} />
            <span>{testing ? 'Sending...' : 'Send Test Alert to Phone'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

