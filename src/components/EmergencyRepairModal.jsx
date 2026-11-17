import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
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
  'Gel-X Extension Replacement',
  'Builder Gel (BIAB) Chip Fix',
  'Cracked Natural Nail Repair',
  'Fell-Off Charm or Crystal Fix',
  'Lifting Edge Catching Hair'
];

const URGENCIES = [
  'Today ASAP (Urgent)',
  'Tomorrow Morning',
  'Next 2 Days',
  'Next Available Slot'
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
    serviceType: 'Builder Gel (BIAB) Chip Fix',
    issue: '',
    urgency: 'Today ASAP (Urgent)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.clientPhone.trim()) {
      if (onAddToast) onAddToast('Required Fields', 'Please provide your name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitRepair(formData);
      setIsSuccess(true);
      if (onAddToast) {
        onAddToast('Repair Request Dispatched', "Sirii has received your urgent request on her phone.", 'success');
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-studio-ink/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-studio-surface rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-8 border-t sm:border border-studio-border shadow-studio-float relative max-h-[92vh] overflow-y-auto">
        <div className="w-10 h-1.5 rounded-full bg-studio-borderStrong mx-auto mb-3 sm:hidden" />
        <button
          onClick={handleClose}
          className="absolute right-4 sm:right-5 top-4 sm:top-5 w-8 h-8 rounded-full bg-studio-subtle flex items-center justify-center text-studio-muted hover:text-studio-ink transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-studio-wineLight border border-studio-wine/20 text-studio-wine text-[10px] font-bold">
                <HeartHandshake className="w-3 h-3 text-studio-wine" />
                <span>Urgent Repair Care</span>
              </div>
              <h3 className="font-display italic font-bold text-2xl text-studio-ink">
                Quick Nail Repair Request
              </h3>
              <p className="text-xs text-studio-secondary leading-relaxed">
                Accidents happen. Send a direct squeeze-in request to Sirii's phone and we will accommodate a quick 15–20 minute repair slot today or tomorrow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-canvas/40 text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-canvas/40 text-base sm:text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Which Hand? *
                  </label>
                  <select
                    value={formData.hand}
                    onChange={(e) => setFormData({ ...formData, hand: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-surface text-base sm:text-xs"
                  >
                    {HANDS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-studio-secondary mb-1">
                    Which Finger? *
                  </label>
                  <select
                    value={formData.finger}
                    onChange={(e) => setFormData({ ...formData, finger: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-surface text-base sm:text-xs"
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
                <label className="block font-semibold text-studio-secondary mb-1">
                  Repair Type *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-surface text-base sm:text-xs"
                >
                  {REPAIR_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-studio-secondary mb-1">
                  Urgency Level *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {URGENCIES.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setFormData({ ...formData, urgency: u })}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                        formData.urgency === u
                          ? 'bg-studio-wineLight border-studio-wine text-studio-wine shadow-xs'
                          : 'bg-studio-canvas/50 border-studio-border text-studio-secondary hover:border-studio-borderStrong'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-studio-secondary mb-1">
                  Details / What Happened (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Free-edge chipped, or need quick fix before tomorrow evening's event"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-studio-border focus:outline-none focus:border-studio-wine text-studio-ink bg-studio-canvas/40 resize-none text-base sm:text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Alert...' : 'Dispatch Squeeze-in Request'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-studio">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 block">
                Dispatched to Phone
              </span>
              <h3 className="font-display italic font-bold text-2xl text-studio-ink">
                Request Received by Sirii
              </h3>
              <p className="text-xs text-studio-secondary max-w-sm mx-auto leading-relaxed">
                Sirii has received your urgent repair alert on her studio device. She will inspect today's schedule and reach out on WhatsApp at <span className="font-semibold text-studio-ink">{formData.clientPhone}</span> with a quick squeeze-in slot.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-studio-canvas border border-studio-border max-w-xs mx-auto text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-studio-muted">Target:</span>
                <span className="font-semibold text-studio-ink">{formData.hand} • {formData.finger}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-studio-muted">Type:</span>
                <span className="font-semibold text-studio-wine truncate max-w-[150px]">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-studio-muted">Urgency:</span>
                <span className="font-bold text-amber-800">{formData.urgency}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-studio-wine hover:bg-studio-wineHover text-white font-semibold text-xs shadow-studio transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
