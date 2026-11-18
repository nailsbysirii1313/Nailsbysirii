import React, { useState, useEffect } from 'react';
import { X, Send, Copy, Check, MessageSquare, Phone } from 'lucide-react';
import { formatTime12h } from '../utils/dateTime';
import ModalPortal from './ModalPortal';

export default function QuickMessageModal({
  isOpen,
  onClose,
  client,
  appointment = null,
  settings
}) {
  const [template, setTemplate] = useState('reminder');
  const [messageText, setMessageText] = useState('');
  const [copied, setCopied] = useState(false);

  const studioName = settings?.studioName || 'Nails by Sirii';
  const address = settings?.address || 'Shop No. 7, Laxmi Navraj Plaza, Garhi Cantt, Dehradun 248003';

  useEffect(() => {
    if (!client) return;

    const cName = client.name;
    const aptDate = appointment ? appointment.date : 'your upcoming date';
    const rawTime = appointment ? appointment.time : 'your scheduled time';
    const aptTime = appointment ? (formatTime12h(appointment.time) || appointment.time) : rawTime;
    const aptService = appointment ? appointment.serviceName : 'your bespoke nail treatment';

    let text = '';
    if (template === 'confirmation') {
      text = `Hello ${cName}! Your appointment at Nails by Sirii is confirmed for ${aptDate} at ${aptTime}.\n\nTreatment: ${aptService}\nStudio: ${address}\n\nEach session is reserved exclusively for you with sterile preparation. If you require previous gel removal or have design references, please let Sirii know beforehand. We look forward to welcoming you!`;
    } else if (template === 'reminder') {
      text = `Hello ${cName}! Friendly reminder regarding your appointment tomorrow at ${aptTime} at Nails by Sirii.\n\nIf you have reference art or moodboard ideas, feel free to share them in advance. Looking forward to your session!`;
    } else if (template === 'aftercare') {
      text = `Hello ${cName}! Thank you for visiting Nails by Sirii today. To preserve your manicure architecture and ensure 3–4 weeks of wear:\n\n1. Apply cuticle oil daily to nourish the nail matrix\n2. Avoid using nails as tools to open cans or containers\n3. Wear gloves during household cleaning\n4. Never peel or force off gel coatings\n\nTag us on Instagram @nails.by.sirii if you share your fresh set!`;
    } else if (template === 'birthday') {
      text = `Happy Birthday ${cName}! Warmest wishes from Nails by Sirii! To celebrate your special month, enjoy a complimentary nail art upgrade on your next visit anytime this month. Let us know when you'd like to book your birthday session!`;
    } else {
      text = `Hello ${cName}! `;
    }

    setMessageText(text);
  }, [template, client, appointment, isOpen, address]);

  if (!isOpen || !client) return null;

  const cleanPhone = (client.phone || '').replace(/[^0-9]/g, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  const handleSms = () => {
    const url = `sms:${cleanPhone}?body=${encodeURIComponent(messageText)}`;
    window.location.href = url;
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
        <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-studio border-t sm:border border-border-subtle relative max-h-[92vh] overflow-y-auto pointer-events-auto">
        <div className="w-12 h-1.5 rounded-full bg-border-subtle mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-text-muted hover:text-text-ink hover:bg-studio-canvas transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-canvas border border-border-subtle text-brand-wine text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Client Messaging</span>
          </div>
          <h3 className="font-display font-semibold text-2xl text-text-ink">
            Message {client.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            Send polished, pre-formatted confirmations, reminders, or aftercare protocols.
          </p>
        </div>

        {/* Template Selector Chips */}
        <div className="space-y-2 mb-4 text-xs">
          <span className="font-semibold text-text-ink block">Select Template</span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'reminder', label: '24-Hour Reminder' },
              { id: 'confirmation', label: 'Confirmation' },
              { id: 'aftercare', label: 'Aftercare Guide' },
              { id: 'birthday', label: 'Birthday Perk' },
              { id: 'custom', label: 'Custom' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] ${
                  template === t.id
                    ? 'bg-brand-wine text-white shadow-xs'
                    : 'bg-studio-canvas text-text-ink border border-border-subtle hover:bg-studio-subtle'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-2 mb-5 text-xs">
          <label className="font-semibold text-text-ink block">
            Message Preview (Editable)
          </label>
          <textarea
            rows={6}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-border-subtle bg-studio-canvas/50 focus:bg-white focus:border-brand-wine outline-none leading-relaxed text-base sm:text-xs font-medium text-text-ink"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2.5 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>Send on WhatsApp</span>
            </button>

            <button
              onClick={handleSms}
              className="py-3 px-4 rounded-2xl bg-text-ink hover:bg-stone-800 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>Send via SMS</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl border border-border-subtle bg-studio-surface hover:bg-studio-canvas text-text-ink font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-text-muted" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Message Text'}</span>
          </button>
        </div>
      </div>
    </div>
  
</ModalPortal>
  );
}
