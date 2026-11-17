import React, { useState, useEffect } from 'react';
import { X, Send, Copy, Check, MessageSquare, Phone, Sparkles } from 'lucide-react';

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
    const aptTime = appointment ? appointment.time : 'your scheduled time';
    const aptService = appointment ? appointment.serviceName : 'your cute nail set';

    let text = '';
    if (template === 'confirmation') {
      text = `Hey ${cName}! Your nail appointment with Sirii is confirmed for ${aptDate} at ${aptTime}!\n\nService: ${aptService}\nStudio: ${address}\n\nPlease reach on time babe! If you need old gel removed, please let Sirii know beforehand. Can't wait to do your nails!`;
    } else if (template === 'reminder') {
      text = `Hey ${cName}! Just a sweet reminder about your nail appointment with Sirii tomorrow at ${aptTime}!\n\nIf you have any cute nail inspo or Pinterest photos, keep them ready! See you soon babe`;
    } else if (template === 'aftercare') {
      text = `Hey ${cName}! Thank you so much for getting your nails done with Sirii today! Loved having you!\n\nHere are a few quick tips to keep them looking fresh & lasting 3-4 weeks:\n1. Apply cuticle oil or coconut oil daily\n2. Treat your nails like jewels, not tools (don't pop cans with them!)\n3. Wear gloves when washing dishes\n\nShow off your cute nails and tag us on Instagram!`;
    } else if (template === 'birthday') {
      text = `Happy Birthday ${cName}! Sending you lots of love from Nails by Sirii! To celebrate, you get a free cute nail art upgrade on your next set with Sirii anytime this month! Book your birthday slot soon`;
    } else {
      text = `Hey ${cName}! `;
    }

    setMessageText(text);
  }, [template, client, appointment, isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-float border-t sm:border border-atelier-champagneBorder relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full text-atelier-muted hover:text-atelier-noir hover:bg-atelier-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-atelier-rose100 text-atelier-rose600 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Client Messaging</span>
          </div>
          <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
            Message {client.name}
          </h3>
          <p className="text-xs text-atelier-muted mt-0.5">
            Send polished, pre-formatted confirmations, 24-hr reminders, or aftercare protocols.
          </p>
        </div>

        {/* Template Selector Chips */}
        <div className="space-y-2 mb-4 text-xs">
          <span className="font-semibold text-atelier-charcoal block">Select Template</span>
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
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  template === t.id
                    ? 'bg-atelier-rose500 text-white shadow-sm'
                    : 'bg-atelier-cream/60 text-atelier-charcoal border border-atelier-champagneBorder hover:bg-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Editor */}
        <div className="space-y-2 mb-5 text-xs">
          <label className="font-semibold text-atelier-charcoal block">
            Message Preview (Editable)
          </label>
          <textarea
            rows={6}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-atelier-champagneBorder bg-atelier-cream/40 focus:bg-white focus:border-atelier-rose400 outline-none leading-relaxed text-base sm:text-xs font-medium"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send on WhatsApp</span>
            </button>

            <button
              onClick={handleSms}
              className="py-2.5 px-4 rounded-xl bg-atelier-noir hover:bg-atelier-charcoal text-white font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Send via iMessage / SMS</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl border border-atelier-champagneBorder bg-white hover:bg-atelier-cream text-atelier-charcoal font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Message Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

