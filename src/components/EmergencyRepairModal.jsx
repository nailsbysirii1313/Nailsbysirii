import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
  Heart
} from 'lucide-react';

const FINGERS = ['Thumb', 'Index Finger', 'Middle Finger', 'Ring Finger', 'Pinky'];
const HANDS = ['Right Hand', 'Left Hand', 'Both Hands'];
const REPAIR_TYPES = [
  'Gel-X Extension Replacement 💅',
  'Builder Gel (BIAB) Chip Fix ✨',
  'Cracked Real Nail Repair 🩹',
  'Fell-Off Charm or Bow Fix 🎀',
  'Lifting Edge Catching Hair 🌸'
];

const URGENCIES = [
  'Today ASAP (Urgent) 💕',
  'Tomorrow Morning',
  'In Next 2 Days',
  'Next Available Quick Slot'
];

export default function EmergencyRepairModal({
  isOpen,
  onClose,
  onSubmitRepair,
  settings,
  onAddToast
}) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    hand: 'Right Hand',
    finger: 'Index Finger',
    serviceType: 'Gel-X Extension Replacement 💅',
    issue: '',
    urgency: 'Today ASAP (Urgent) 💕'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientPhone.trim()) {
      if (onAddToast) onAddToast('Required Fields', 'Please tell us your name and phone number 💕', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRepair(formData);
      setIsSuccess(true);
      if (onAddToast) {
        onAddToast('Fix Request Sent 💕', "Sirii has received your message on her phone!", 'success');
      }
    } catch (err) {
      if (onAddToast) onAddToast('Submission Failed', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-atelier-noir/40 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-atelier-champagneBorder shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto mb-3 sm:hidden" />
        <button
          onClick={handleClose}
          className="absolute right-4 sm:right-5 top-4 sm:top-5 w-8 h-8 rounded-full bg-atelier-cream flex items-center justify-center text-atelier-muted hover:text-atelier-noir transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>Quick Nail Fix Desk 💕</span>
              </div>
              <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
                Broke or Chipped a Nail? Don't Worry Babe! 💕
              </h3>
              <p className="text-xs text-atelier-muted leading-relaxed">
                Accidents happen! Send a quick message to Sirii and she will squeeze you in for a quick 15-20 min fix.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya, Priya..."
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Which Hand? *
                  </label>
                  <select
                    value={formData.hand}
                    onChange={(e) => setFormData({ ...formData, hand: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir bg-white text-base sm:text-xs"
                  >
                    {HANDS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-atelier-charcoal mb-1">
                    Which Finger? *
                  </label>
                  <select
                    value={formData.finger}
                    onChange={(e) => setFormData({ ...formData, finger: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir bg-white text-base sm:text-xs"
                  >
                    {FINGERS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  What Needs Fixing? *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir bg-white text-base sm:text-xs"
                >
                  {REPAIR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  How Urgently Do You Need It? *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {URGENCIES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: u })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        formData.urgency === u
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                          : 'bg-atelier-cream/50 border-atelier-champagneBorder text-atelier-charcoal hover:border-atelier-rose200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-atelier-charcoal mb-1">
                  What Happened? (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Corner chipped while travelling, have a party tomorrow night!"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-atelier-champagneBorder focus:outline-none focus:border-atelier-rose400 text-atelier-noir resize-none text-base sm:text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-soft transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Quick Fix Request to Sirii 💕'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block">
                Request Sent to Sirii! 💕
              </span>
              <h3 className="font-serif italic font-bold text-2xl text-atelier-noir">
                Hang Tight Babe, We'll Fix It! 💕
              </h3>
              <p className="text-xs text-atelier-muted max-w-sm mx-auto leading-relaxed">
                Sirii has received your request on her phone! She will check her schedule and message you on WhatsApp at <span className="font-semibold text-atelier-noir">{formData.clientPhone}</span> shortly with a quick slot.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-atelier-cream/60 border border-atelier-champagneBorder/80 max-w-xs mx-auto text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-atelier-muted">Finger:</span>
                <span className="font-semibold text-atelier-noir">{formData.hand} • {formData.finger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-atelier-muted">Service:</span>
                <span className="font-semibold text-atelier-rose600 truncate max-w-[150px]">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-atelier-muted">Urgency:</span>
                <span className="font-bold text-rose-700">{formData.urgency}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-2xl bg-atelier-rose500 hover:bg-atelier-rose600 text-white font-semibold text-xs shadow-soft transition-all"
            >
              Got It, Thanks! 💕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

